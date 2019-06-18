require('configModule')
require('./index.css')
const lang = require('configDir/lang.json')
const sportBodyViewStr = require('./template/sportBodyViewStr')
const sportEventProxy = require('./events/sportEvents')
const utils = require('publicDir/libs/utils/utils')
const SportConfigView = require('./view/sportConfigView')
const hubStr = require('./template/hubConfigItemStr')
const perpheralStr = require('./template/peripheralsConfigItemStr')
import {
	DashboardView
} from './view/dashboardView'
import {
	startWork
} from 'cp'



const SportBodyModel = Backbone.Model.extend({
	defaults: lang.sport,
	initialize: function () {
		this.on('change:lang', function (model, newValue) {
			sportEventProxy.trigger('changeLang', this.get(newValue))
		})
	}
})
const sportBodyModel = new SportBodyModel({
	'lang': utils.getLang()
})

// View of the hub page and the hub configuration page.
let hubItemView, perpheralItemView
const SportBodyView = Backbone.View.extend({
	model: sportBodyModel,
	events: {
		"click #startWork": "startWork",
		"click #config": "propConfig"
	},
	propConfig: function () {
		let curLang = utils.getLang()
		sportEventProxy.trigger('config', {
			closeBtn: 1,
			area: ['700px', '500px'],
			tab: [{
				title: lang.sport[curLang].btRouterConfig,
				content: hubStr.ul
			}, {
				title: lang.sport[curLang].wristbandConfig,
				content: perpheralStr.ul
			}],
			shade: 0.6 // Mask transparency
				,
			maxmin: true // Allow full screen minimization
				,
			anim: 5 // 0-6 animation form, -1 does not open
				,
			// Callback after successful pop-up.
			success: function () {
				hubItemView = new SportConfigView({
					el: $('.config-tip-hub'),
					attributes: {
						'view': 'hub'
					}
				})
				perpheralItemView = new SportConfigView({
					el: $('.config-tip-peripheral'),
					attributes: {
						'view': 'perpheral'
					}
				})
			},
			// Cancel callback in the upper right corner.
			cancel: function () {
				// Destroy the view of the hub in the hub configuration page.
				hubItemView.remove()
				perpheralItemView.remove()
			}
		})
	},
	startWork: function () {
		startWork()
	},
	initialize: function () {
		this.render()
	},
	changeLang: function (key) {
		const _key = key === 'en' ? 'en' : 'cn'
		this.model.set('lang', _key)
	},
	template: _.template(sportBodyViewStr),
	render: function () {
		this.$el.html(this.template(this.model.get(this.model.get('lang'))));
		return this
	}
})

var sportView = new SportBodyView({
	el: $('#root')
})

new DashboardView({
	el: '#root .show-pannel'
})

export default sportBodyModel
module.exports = sportView


// setTimeout(function () {
// 	sportView.changeLang('en')
// 	$('#config').trigger('click')
// }, 500)
