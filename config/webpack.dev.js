const path = require('path');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');

https://www.jianshu.com/p/6712e4e4b8fe
module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    main2: './src/main2.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|git)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 500
          }
        }]
      }
    ]
  },

  plugins: [
    new uglify(),
    new htmlPlugin({
        minify:{ //是对html文件进行压缩
            removeAttributeQuotes:true  //removeAttrubuteQuotes是却掉属性的双引号。
        },
        hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
        template:'./src/index.html' //是要打包的html模版路径和文件名称。
       
    })
  ],
  
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: 8888
  }
};