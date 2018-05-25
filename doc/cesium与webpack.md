



##介绍

这是一篇关于如何通过Webpack的配置快速将Vue-cli脚手架与Cesium库整合，最终目的是可以使用Vue+Cesium进行组合编写代码，并可以正确打包Cesium的代码。

Cesium.js是一个渲染三维地球的JavaScript库。它可以实现非常丰富的地理空间可视化，比如矢量几何、三维模型、倾斜摄影、粒子效果和模型动画等等。这些对象都可视化在一个带有地形和影像的三维地球上。并且Cesium也是完全开源免费的，他强大的功能只需要一个支持WebGL的浏览器而不需要任何插件就可以运行。

关于Cesium的功能在之前的工作中也是比较熟悉了，但是关于Node方面的知识还是自己从头一点点开始学习整理的，本文主要针对的是对于如何整合Vue+Cesium摸不着头脑的同学们，如果您本身对Node已经非常了解得话可以直接跳过下面教程，直接克隆GitHub上的Demo，附上 <a href="https://github.com/MaJunChaoGit/vue-webpack-cesium" target="_blank">  GitHub地址 。

-------------------

##目录
[TOC]

-------------------

### 环境介绍

| 项目环境    | 版本      |
| ------- | ------- |
| Node.Js | v8.10.0 |
| Npm     | v5.7.1  |
| Vue     | v2.5.2  |
| Webpack | v3.6.0  |
| Cesium  | v1.4.3  |

----------


### 安装环境

- **1.安装Node.Js** 
  关于Node的安装这里就不详细去说了，比较容易。如果是之前没有接触过Node的同学，可以参照下面这篇文章:
  <a href="https://www.cnblogs.com/zhouyu2017/p/6485265.html" target="_blank">  Node.js安装及环境配置之Windows篇
>关于Win10或者Win8安装Node.Js的msi包因为权限问题报错2503的同学可以直接打开终端使用如下命令安装文件:
>`msiexec /package "E:\softwareunion\node-v8.10.0-x64.msi"`

- **2.安装Vue-cli脚手架** 
  首先我们需要全局安装vue-cli
``` node
npm install -g vue-cli
vue -V   //安装成功后可以查看当前vue的版本，注意V是大写的
vue list //通过list命令我们可以看到vue有六种模板，我们使用webpack模板构建
```
>因为Npm如同Maven一样，它们默认访问的是国外资源，所以安装速度过慢的话，可以通过配置阿里的镜像来提升安装速度，命令如下:
>`npm config set registry https://registry.npm.taobao.org`

- **3.创建Webpack模板的项目** 
  我们选用webpack模块进行创建，命令很简单，如下:
  ``` node
  vue init <template-name> <project-name>
  ```
```
这里的`<template-name>`我们改成webpack，而`<project-name>`就是各位的项目名称了，输入以后会进行下载模板，在创建过程中依次填写一些配置信息
![模板配置信息](https://img-blog.csdn.net/20180331134807276?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
在安装成功后cd `<project-name>`进入当前文件夹后，使用
​``` node
npm run dev
```
如果安装不出意外的话，并且8080端口没有被占用，那么浏览器输入`http://localhost:8080`就可以看见已经安装成功了
>虽然我们使用了一个很简单的命令去安装项目架构，但是他的项目目录结构却不简单，使用构建工具创建项目对于初学Node的同学，这是非常不推荐的!
>如果你跟我一样是个Node和Vue初学者，那么我推荐各位阅读并学习完尤大的<a href="https://zhuanlan.zhihu.com/p/23134551?refer=evanyou" target="_blank">Vue 2.0学习路线</a>后再次去使用构建工具是非常有必要的.

- **4.安装Cesium环境** 
  还是在当前文件夹根目录，使用如下命令就可以安装cesium了，在安装完后可以进入node_modules看到cesium的目录结构.
``` node
npm install cesium
```
**到此为止，环境搭建方面就就结束了。下面让我们开始进行配置Webpack来使用Cesium吧!**

----------


###Webpack配置
在配置之前，使用过Cesium的同学都知道它是一个非常复杂的库，很难去直接打包
我们无法通过在main.js中像引入Vue那样直接进行引入Cesium，因为:

- **Cesium是用异步模块定义（AMD）的格式编写源码的**
- **它包括一些事先编译好的基于AMD的第三方库**
- **Cesium中web worker的使用率很高**
- **一些代码使用了多行字符串**
>关于Webpack与Cesium的整合在Cesium官网中有一篇<a href="https://cesiumjs.org/tutorials/cesium-and-webpack/" target="_blank">教程</a>，教程指出了两种使用Cesium的方式，我们是基于源码的基础上来配置的

- **手动复制Cesium编译好的静态文件到static文件夹中**
  `进入node_modules\cesium\Build文件夹中，将编译好的Cesium文件复制到根目录下的static中，并把其中Cesium.js删除`
  完成后效果如下:
  ![文件树](https://img-blog.csdn.net/20180331151805292?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
  这里涉及到几个知识点:
  `1.static文件夹的作用是存放静态文件的，Webpack在打包时会将其打包到生成dist文件夹中`
  `2.CopyWebpackPlugin是Webpack的插件，他的作用就像咱们刚才手动复制文件到另一个文件夹的过程`
``` javascirpt
//在webpack.dev.conf和webpack.prod.conf有如下配置
 new CopyWebpackPlugin([
     {
       from: path.resolve(__dirname， '../static')，
       to: config.dev.assetsSubDirectory，
       ignore: ['.*']
     }
 ])
```
- **设置Webpack的配置项，使其支持Cesium** 
  `1.在build/webpack.base.conf.js下的output中加入sourcePrefix: ' '，让Webpack正确缩进多行字符串。`
``` javascirpt
output: {
    path: config.build.assetsRoot，
    filename: '[name].js'，
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath，
    sourcePrefix: ' '
 }
```
`2.在build/webpack.base.conf.js下的module中加入unknownContextCritical: false，让Webpack打印载入特定库时候的警告。`
`3.在build/webpack.base.conf.js下的module中加入unknownContextRegExp: /^.\/.*$/，为了解决Error: Cannot find module "."该错误`
```
 module: {
    rules: [
     .....
    ]，
    unknownContextRegExp: /^.\/.*$/，
    unknownContextCritical: false
  }
```
**配置到目前这种程度的话，已经可以解决很多Cesium的quirks了，剩下就让我们编写Vue组件来实验自己配置的到底是否成功**
>Webpack的配置不是一时半会能掌握的，我们不能因为Webpack的复杂而放弃或者是Vue-cli脚手架已经帮我们配置好一套方案而不去学习和修改，下面是我这段时间学习过程中，个人觉得还不错的文章，推荐给大家:
><a href="https://www.jianshu.com/p/42e11515c10f" target="_blank">Webpack入门</a>
><a href="https://segmentfault.com/a/1190000008644830" target="_blank">Vue-cli中的Webpack配置</a>

----------


###编写Vue组件
到这里的话，只剩最后一步了，那么让我们首先来整理下思路。

`我们已经将Cesium所需要的静态资源打包并放到正确的位置了，但是Cesium并不知道如何找到他们，我们需要让Cesium知道它的静态资源存放在哪里。那么这里Cesium已经提供了一个API，就是buildModuleUrl函数。当完成这一步完成后我们就可以进行Vue+Cesium的正常开发了`

那么让我们看下代码是如何编写的:

- **新建一个cesiumViewer的组件** 
  在src下新建一个名为cesiumViewer.vue的组件，代码如下:
```
<template>
	//放置Cesium的容器
	<div id="cesiumContainer"></div>
</template>

<script>
//导入Cesium源码中的Viewer组件，注意这里是用的Viewer组件的方式加载，而不是加载整个Cesium
import Viewer from "cesium/Source/Widgets/Viewer/Viewer";
//我们刚才所说的如何让Cesium知道静态资源在哪里的API
import buildModuleUrl from "cesium/Source/Core/buildModuleUrl"
//导入必须的样式表
import "cesium/Source/Widgets/widgets.css";

export default{
	name:"cesiumContainer"，
	mounted:function () {
		//设置静态资源目录
		buildModuleUrl.setBaseUrl('../static/Cesium/')
		//创建viewer实例
		this.viewer = new Viewer('cesiumContainer');
	}，
	data () {
		return {
			'viewer' : {}
		}
	}
}
</script>

<style scoped>

</style>
```
- **在App.vue中注册组件** 
```
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import cesiumViewer from "./components/cesiumViewer.vue"
export default {
  name: 'App'，
  components : {
    'cesiumViewer' : cesiumViewer
  }
}
</script>

<style>
//保证浏览器全屏幕显示，没有多余的白边
html， body， #cesiumContainer {
 width: 100%; 
 height: 100%; 
 margin: 0; 
 padding: 0; 
 overflow: hidden;
}
#app {
  font-family: 'Avenir'， Helvetica， Arial， sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
```
- **修改router/index.js文件** 
```
import Vue from 'vue'
import Router from 'vue-router'
import cesiumViewer from '@/components/cesiumViewer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/'，
      name: 'cesiumViewer'，
      component: cesiumViewer
    }
  ]
})
```

----------


###运行项目以及打包项目
如果之前的工作都完成的话，我们退回到项目的根目录下运行`npm run dev`，整个项目就会正常启动了
![这里写图片描述](https://img-blog.csdn.net/20180331161148261?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
而项目打包只需要运行`npm run build`就可以发现您的项目中多了个dist文件夹，关于dist文件夹生成的策略以及具体优化这里就不多做介绍了

---------
###后续改进Webpack配置
到目前为止，虽然最基本的配置已经完成，但是上述配置有些不妥的地方，并且有些同学可能不需要引入分割Cesium的模块进行开发,那么我们稍微进行一些改进

- **使用CopyWebpackPlugin对静态文件直接打包,而不是手动复制文件** 

`1.首先将static文件夹中之前手动复制的文件删除`
`2.在webpack.base.conf.js、webpack.dev.conf.js、webpack.prod.conf.js配置文件中定义Cesium的源代码路径和web Workers路径`
```
const cesiumSource = '../node_modules/cesium/Source';
const cesiumWorkers = '../../Build/Cesium/Workers';
```
`3.在webpack.base.conf.js配置文件中设置别名`
`4.在webpack.base.conf.js配置文件中配置amd参数`
![webpack配置](https://img-blog.csdn.net/2018033120390215?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
`5.在webpack.dev.conf.js、webpack.prod.conf.js配置文件中引入CopyWebpackPlugin并配置插件功能`
```
const CopyWebpackPlugin = require('copy-webpack-plugin')

new CopyWebpackPlugin([ { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' } ]),
new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Assets'), to: 'Assets' } ]),
new CopyWebpackPlugin([ { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' } ]),
```
 - **Vue组件应该只干一件事情** 
  `1.修改main.js的代码,使其从入口处引入整个Cesium`
  ![这里写图片描述](https://img-blog.csdn.net/20180331204804599?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
  `2.修改App.vue组件`
  ![这里写图片描述](https://img-blog.csdn.net/20180331204928711?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
  `3.修改cesiumViewer组件`
  ![这里写图片描述](https://img-blog.csdn.net/20180331204956332?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
  `4.在webpack.dev.conf.js、webpack.prod.conf.js配置文件增加Cesium的静态路径配置`
  ![这里写图片描述](https://img-blog.csdn.net/2018033120511432?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L20wXzM3OTcyNTU3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)



