

#如何在Webpack打包的项目中使用Web Worker

因为项目中涉及到大量的计算,传统的JavaScript中计算的话会阻塞浏览器.使用Web Worker势在必得!
主要使用教程非常简单，共分为三个部分:

-------------------

## 安装

项目工程目录下安装loader,目地是让Webpack识别worker文件
```
npm install -D worker-loader
```

## 配置webpack文件
向webpack配置文件中添加loader的配置
```javascript
rules: [
      {
        test: /\.worker\.js$/, //以.worker.js结尾的文件将被worker-loader加载
        use: { loader: 'worker-loader' }
      }
    ]
  },
```
##编写Worker文件以及加载
test.worker.js文件如下
```
// 监听消息
onmessage = function(evt){
  // 工作线程收到主线程的消息
};
let msg = '工作线程向主线程发送消息'
postMessage(msg);
```
app.js文件如下
```javascript
import Worker from './test.worker.js';

// 创建 worker 实例
var worker = new Worker(); // 传入 worker 脚本文件的路径即可
worker.postMessage({ a: 1 });
worker.onmessage = function (event) {
	console.log(event.data)
};

worker.addEventListener("message", function (event) {});
```

