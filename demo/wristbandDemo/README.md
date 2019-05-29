#  Wristband Demo Guide
## Getting Started
- Using nodejs+express to implement web services, the main role of the backend is to send static web pages to the browser, and send instructions to the router (connection, read data, disconnect, etc.). This project supports multiple routers to interact with the bracelet and controls the router using the cloud + local mode.
-  The control logic of the router and each Bluetooth device is written in a modular way.
## Front-end Tools：
- webpack to package front-end resources.
- npm to manage third-party resources.
- babel with es6 syntax.
- Data and view separation using the mvc framework backbone framework.
- Simplify js operations with the jquery library.
- Simplify the router SDK call with your own tool library api.js
##  Back-end Tools:
- 
- 


## Front-end Directory Structure
```
├─build # 编译后生成的所有代码、资源（图片、字体等，虽然只是简单的从源目录迁移过来）
├─node_modules # 利用npm管理的所有包及其依赖
├─vendor # 所有不能用npm管理的第三方库
├─.babelrc # babel的配置文件
├─.eslintrc # ESLint的配置文件
├─index.html # 仅作为重定向使用
├─package.json # npm的配置文件
├─webpack.config.js # webpack的配置文件
├─src # 当前项目的源码
    ├─pages # 各个页面独有的部分，如入口文件、只有该页面使用到的css、模板文件等
    │  ├─alert # 业务模块
    │  │  └─index # 具体页面
    │  ├─index # 业务模块
    │  │  ├─index # 具体页面
    │  │  └─login # 具体页面
    │  │      └─templates # 如果一个页面的HTML比较复杂，可以分成多块再拼在一起
    │  └─user # 业务模块
    │      ├─edit-password # 具体页面
    │      └─modify-info # 具体页面
    └─public-resource # 各个页面使用到的公共资源
        ├─components # 组件，可以是纯HTML，也可以包含js/css/image等
        │  ├─footer # 页尾
        │  ├─header # 页头
        │  ├─side-menu # 侧边栏
        │  └─top-nav # 顶部菜单
        ├─config # 各种配置文件
        ├─iconfont # iconfont的字体文件
        ├─imgs # 公用的图片资源
        ├─layout # UI布局，组织各个组件拼起来，因应需要可以有不同的布局套路
        │  ├─layout # 具体的布局
        │  └─layout-without-nav # 具体的布局
        ├─sass # sass文件，sass或纯css文件
        │  ├─base-dir
        │  ├─components-dir # 如果组件本身不需要js的，要加载组件的css比较困难，可以直接用sass来加载
        │  └─base.sass# 组织所有的sass文件
        ├─libs # 与业务逻辑无关的库都放到这里
        └─logic # 业务逻辑
```
## CLI命令（npm scripts）
| Command | Description |
|---------------- |---------------|
|`npm install` |Install project dependencies based on `package.json` |
|`npm run build` |Build a production environment program based on `webpack.config.js` |
| `npm run dev` | build a development environment program based on `webpack.dev.config.js` |
| `npm run start` | Open webpack-dev-server and automatically open the browser, automatically monitor source changes, and implement LiveReload, **use this for actual development** |


## Usage
- Download all dependencies for this project.
```
npm install
```
- Start the server.
```
npm run start
```