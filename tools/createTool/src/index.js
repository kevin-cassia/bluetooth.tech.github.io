/**
 * create by guangyan 
 * 2018-4-29
 */
import jqui from './lib/jquery-ui-1.12.1.custom/jquery-ui.min.css';
import css from './css/index.css';
import jsPconfig from './js/jsPlumb.config.js';
import modleConfig from './js/modle.config.js';
import editors from './js/editor.js';
import editorStr from './js/editorStr.js';
import { debugHighlight, defaultDebugInfo, nodeDebugInfo } from './js/showDebugInfo.js';
import paletteInit from './js/palette.config.js'

import {
  createModle,
  getModles,
  removeModle,
  getModle
} from './js/modle.js';

// 左侧列表初始化
paletteInit()

// 连线工具实例初始化
const firstInstance = jsPlumb.getInstance({});


firstInstance.bind("click", function (conn, originalEvent) {
  console.log('connector --> click', $(this), '\n conn:', conn);
  /*
    TODO
    firstInstance.deleteConnection(conn);
  */
});

/*
  连接事件
*/
firstInstance.bind('connection', function (connInfo, originalEvent) {
  let sourceId = connInfo.sourceId;
  let targetId = connInfo.targetId;
  let sourceType = $(`#${sourceId}`).attr('name');
  let targetType = $(`#${targetId}`).attr('name');
  let downstreams = modleConfig[sourceType].downstream;
  let downstreamId = modleConfig[targetType].id;

  console.log('info,info', connInfo);
  // console.log(
  //   'sourceType:', sourceType,
  //   '\n sourceId:', sourceId,
  //   '\n targetType:', targetType,
  //   '\n targetId:', targetId,
  //   '\n downstreams', downstreams,
  //   '\n downstreamId', downstreamId);

  if (sourceId == targetId) {
    firstInstance.deleteConnection(connInfo.connection);
    alert("不能连接自己！");
  }
  if (!downstreams.includes(downstreamId)) {
    firstInstance.deleteConnection(connInfo.connection);
    alert('这两个模块不能连接！');
    return;
  }
  let n = 0;
  firstInstance.getAllConnections().forEach(function (item, idx, arr) {
    if (item.sourceId === sourceId && item.targetId === targetId) {
      n++;
    }
  });
  if (n > 1) {
    firstInstance.deleteConnection(connInfo.connection);
    alert('请不要重复连接');
    return;
  }
  let sourceModle = getModle(sourceId);
  let targetModle = getModle(targetId);

  targetModle.flow.inputType = sourceModle.flow.outputType;
  // console.log('-----------------------', sourceModle, targetModle, sourceModle.outputType);
  !sourceModle.flow.todoList[0].nextIds.success.includes(Number(targetId)) && sourceModle.flow.todoList[0].nextIds.success.push(Number(targetId));

});

/*
  删除事件
*/
firstInstance.bind("connectionDetached", function (conn, originalEvent) {
  if (conn.sourceId === conn.targetId) {  //自己连接自己时会自动取消连接
    return;
    console.log('童心未泯的广言，看我龟派气功');
  }
  alert("删除连接从" + conn.sourceId + "到" + conn.targetId + "！");
});

// 左侧list item开启关闭动画
$('.palette-container-header').on('click', function () {
  $(this).next().toggle('blind', 300);
  $(this).find('i').toggleClass("expanded", 300);
  return false;
  // console.log($(this).find('i'));
});

// 模块拖动
$('.ui-draggable').draggable({
  helper: "clone",
  scope: "plant",
  scroll: true,
  zIndex: 1
});

// **放入事件 TODO  结构优化
$('.ui-droppable').droppable({
  accept: '.ui-draggable',
  scope: "plant",
  drop: function (event, ui) {
    const _newModle = createModle($('#innerCanvas'), ui);
    const endpoints = jsPmodleInit(_newModle);
    const modle = getModle(_newModle.attr('id'));
    modle.endpoints = endpoints;
    nodeDebugInfo({ id: _newModle.attr('id'), type: _newModle.attr('name') });
    // 下面注释是测试所用  无意义
    // debugHighlight(firstInstance, { id: _newModle.attr('id'), state: "start", data: {} });
    // setTimeout(debugHighlight, 3000, firstInstance, { id: _newModle.attr('id'), state: "end", data: {} });
    // console.log(modle);
  }
});
// 给拖拽的元素增加端点
function jsPmodleInit(m) {
  // console.log('jsPmodleInit', m);
  const modleType = m.attr('name');
  jsPconfig.input.Scope = modleType;
  jsPconfig.output.Scope = modleType;
  let tempEndpoint;
  switch (modleConfig[m.attr('name')].point) {
    case '00': {
      const endpoint = firstInstance.addEndpoint(m, {
        anchors: "LeftMiddle"
      }, jsPconfig.input);
      tempEndpoint = [endpoint];
    }
      break;
    case '01': {
      const endpoint = firstInstance.addEndpoint(m, {
        anchors: "RightMiddle"
      }, jsPconfig.output);
      tempEndpoint = [endpoint];
    }
      break;
    case 'FF': {
      const endpoint1 = firstInstance.addEndpoint(m, {
        anchors: "LeftMiddle"
      }, jsPconfig.input);
      const endpoint2 = firstInstance.addEndpoint(m, {
        anchors: "RightMiddle"
      }, jsPconfig.output);
      tempEndpoint = [endpoint1, endpoint2];
    }
      break;
  }
  firstInstance.draggable(m);
  return tempEndpoint;
  // m.draggable({
  //   containment: "parent",
  //   drag: function(event, ui) {
  //     firstInstance.repaintEverything();
  //   },
  //   stop: function() {
  //     firstInstance.repaintEverything();
  //   }
  // });
}

// // 连接线的点击事件
// $('body').on('click', '.jtk-connector', function(a) {
//   console.log(a);
//   alert('TODO');
//   // firstInstance.remove($(this));
//   // $(this).remove();
// });
/*
  取消editor
*/
$(".shade").on('click', function () {
  $("#editor-stack").hide();
  $(".shade").hide();
  return false;
});
$.fn.isChildAndSelfOf = function (b) {
  return (this.closest(b).length > 0);
};
/*
  新元素双击事件
*/
$('body').on('dblclick', '.newModle', function () {
  // firstInstance.animate($(this), {left: 10, top: 20, opacity: 0.4}, { duration: 350, easing: 'easeOutBack' });//
  //TODO
  $("#editor-stack").show();
  $(".shade").show();
  editors.selected = $(this);
  const modleType = $(this).attr('name');
  const modleId = $(this).attr('id');
  const _modle = getModle(modleId)
  let str = editors[modleType].show(_modle); // 传入之前保存的信息
  $('#dialog-form').empty().append(str);
  $('#editor_title').html(`编辑${modleType}节点`);
  $('#node-input-name').val(_modle.name);
  let that = $(this);
});



/*
    dialog 删除事件 
*/
$('#node-dialog-delete').on('click', function () {
  $("#editor-stack").hide();
  $(".shade").hide();
  removeModle(editors.selected);
  firstInstance.remove(editors.selected);
  let allConnections = firstInstance.getAllConnections();
  return false;
});
/*
  dialog 取消事件
*/
$('#node-dialog-cancel').on('click', function () {
  $("#editor-stack").hide();
  $(".shade").hide();
});
/*
  dialog 保存事件
*/
$('#node-dialog-ok').on('click', function () {
  let mId = editors.selected.attr('id');
  let mType = editors.selected.attr('name');
  let mName = $('#node-input-name').val();
  // console.log('dailog - save', mId, mType, mName, editors[mType]);
  if (mName !== '') {
    editors.selected.find('.palette_label').html(mName);
  }
  const _modle = getModle(mId);
  _modle.name = mName;
  _modle.editorContent.content = editors[mType].html2Obj($('#dialog-form'));
  editors[mType].final(_modle);
  $("#editor-stack").hide();
  $(".shade").hide();
});
/*
  editor item remove
*/
$('body').on('click', '.red-ui-editableList-item-remove', function () {
  $(this).parent().remove();
});
/*
  editor item add
*/
$('body').on('click', '.red-ui-editableList-addButton', function () {
  let m = editors.selected;
  let type = m.attr('name');
  let list = $(this).parent().find('ol').find('li');
  $(this).parent().find('ol').append(editorStr[type].itemStr(list.length));
});
/*
scan write CONNECT  & | 切换
*/
$('body').on('click', '.red-ui-editableList-button-logic', function () {
  $(this).html() === '&amp;' ? $(this).html('|') : $(this).html('&amp;');
});
/*
  function 模块选择outputType
*/
$('body').on('change', '.ace_editor_text_output select', function () {
  $('.red-ui-editor-fn-outputType').html($(this).val());
  console.log($('.red-ui-editor-fn-outputType'))
  console.log($(this).val());
});
/*
  function return content
*/
$('body').on('keyup', '.ace_editor_text_input input', function () {
  $('.red-ui-editor-fn-content').html($(this).val());
});
// 把url参数转换成json
function urlSearch2obj(str) {
  if (str == undefined) return
  str = str.substr(1)
  var arr = str.split("&"),
    obj = {},
    newArr = []
  arr.map(function (value, index, arr) {
    newArr = value.split("=")
    if (newArr[0] != undefined) {
      obj[newArr[0]] = newArr[1]
    }
  })
  return obj
}
// => 点击test 按钮 让BI run 起来，然后发送句法树，建立sse用于debug
$('#test').on('click', function () {
  const tree = saveTree();
  const id = urlSearch2obj(window.location.search).id;
  const body = { id, enable: 1 }
  const host = window.location.host;
  console.log('程序正在初始化');
  _alert({msg:'程序正在初始化',css:{color: '#555'}})
  $('#window-shade').show();

  startBi(body)
    .then(data => debugInfoSSE(host))
    .then(data => sendTree(host, tree))
    .then(data => console.log('程序初始化成功')).then(data => {
      _alert({msg:'程序初始化成功',css:{color: '#5cb85c'}})
      $('#window-shade').hide()
    })
    .catch(e => {
      console.error('程序初始化失败', e)
      $('#window-shade').hide();
      _alert({msg:'程序初始化失败',css:{color: '#c9302c'}})
    })
})

// 让BI run起来
function startBi(body) {
  return $.ajax({
    type: 'put',
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(body),
    url: `/bi/${body.id}`,
    timeout: 10000
  })
}
// 将语法树发送至BI
function sendTree(host, tree) {
  return $.ajax({
    type: 'post',
    headers: { "Content-Type": "application/json" },
    data: JSON.stringify(tree),
    url: `http://${host}:8081/bi/api`,
    timeout: 10000
  })

}
function debugInfoSSE(host) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      const es = new EventSource(`http://${host}:8081/bi/debuginfo`);
      es.onmessage = function (event) {
        console.log('debugInfo sse', typeof event, typeof event.data, event.data);
        debugHighlight(firstInstance, JSON.parse(event.data));
      }
      es.onerror = function (err) {
        console.error('debuginfo sse err: ', err);
      }
      return resolve();
    }, 3000);
  });
}
/*
  下载文件的
 */
function download(text, fileName, type) {
  const a = document.getElementById("a");
  const file = new Blob([text], { type: type });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.dispatchEvent(new MouseEvent('click', { 'bubbles': false, 'cancelable': true }));
}

/*
  最后点击save生成的代码
*/
$('#save').on('click', function () {
  const name = prompt('请输入要保存的名字：', 'tree');
  console.log(name, typeof name);
  if (!name) {
    return _alert({msg:'取消保存',css:{color:'#c9302c'}});
  }
  const text = JSON.stringify(saveTree(), null, 2);
  const fileName = `${name}.json`;
  download(text, fileName, 'text/plain');
  // console.log('save,save,save',text);
  _alert({msg:'保存成功',css:{color:'#5cb85c'}});
});
// function show_prompt(){  
//   var value = prompt('输入你的名字：', '默认名字');  
//   if(value == null){  
//       alert('你取消了输入！');  
//   }else if(value == ''){  
//       alert('姓名输入为空，请重新输入！');  
//       show_prompt();  
//   }else{  
//       alert('你好，'+value);  
//   }  
// }  

function saveTree() {
  let _modles = getModles();
  let result = {
    'startId': []
  };
  for (let item in _modles) {
    result[item] = {
      "toolFile": _modles[item].flow.toolFile,
      "inputType": _modles[item].flow.inputType,
      "outputType": _modles[item].flow.outputType,
      "todoList": _modles[item].flow.todoList
    };
    if (!_modles[item].flow.inputType || _modles[item].flow.inputType === 'auto') {
      result.startId.push(Number(_modles[item].id));
    }
  }
  return result;
  // console.log('save-save-save', JSON.stringify(result, null, 2));
}

// TODO  删除的逻辑，需要增加 workspack-header tabs item
// $('body').on('keydown', '#innerCanvas',function (e) {
//    const selectedModle = $('.newModle-selected');
//    const isWorkspaceFocus = !!$('.workspace-focussed');

//   if (isWorkspaceFocus && selectedModle.length && e.keyCode === 8 ) {
//     console.log('DELETE Selected modle', selectedModle);
//     firstInstance.remove(selectedModle);
//     // removeModle(editors.selected);

//   }
// });

// 右侧 sidebar tab标签
$('.red-ui-tab').on('click', function () {
  if ($(this).hasClass('active')) { return }
  console.log(" don't has active", $(this).attr('id'));
  $('.red-ui-tab').removeClass('active');
  $(this).addClass('active');
  $(this).attr('id') === 'red-ui-tab-debug'
  if ($(this).attr('id') === 'red-ui-tab-debug') {
    $('#sidebar-info-active').hide();
    $('#sidebar-debug-active').show();
  } else {
    $('#sidebar-debug-active').hide();
    $('#sidebar-info-active').show();

  }
});
// $('.red-ui-tab').on('click', function() {
//   if(!$(this).hasClass('active')){
//     console.log(" don't has active",$('.red-ui-tab'));
//     $('.red-ui-tab').removeClass('active');
//     $(this).addClass('active');
//   }
// });

window.onbeforeunload = function () {
  const modles = getModles();
  if (Object.keys(modles).length) {
    return "尚未保存！";
  }

}

// 标签全部关闭
$('#palette-collapse-all').on('click', function () {
  const selectedEffect = 'blind';
  $("#palette").find('.palette-container-content').hide(200);
  $('#palette .palette-container-header').find('i').removeClass("expanded", 200);
  return false;
});
// 标签全部展开
$('#palette-expand-all').on('click', function () {
  const selectedEffect = 'blind';
  $("#palette .palette-container-content").show(200);
  $('#palette .palette-container-header').find('i').addClass("expanded", 200);
  return false;
});

// => newModle 高亮
$('#chart').on('click', function (e) {
  $('.newModle').removeClass('newModle-selected');
  const modle = e.target.closest('.newModle');
  if (modle) {
    $(modle).addClass('newModle-selected');
    nodeDebugInfo({ id: $(modle).attr('id'), type: $(modle).attr('name') });
  } else {
    defaultDebugInfo();
  }
});
// setTimeout(_alert, 3000, {msg:'hello world',css:{color: '#5cb85c'}})
// setTimeout(_alert, 3000, {msg:'hello world',css:{color: '#c9302c'}})

function _alert(content) {
  $('#_alert').html(content.msg)
  content.css && $('#_alert').css(content.css)

  $('#_alert').show(500);
  setTimeout(function () {
    $('#_alert').hide(500);
  }, 1750);
}