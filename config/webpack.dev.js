const path = require('path');
const glob = require('glob');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');

const website = {
  publicPath: 'http://localhost:8888/'
}

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.js',
    main2: './src/main2.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: website.publicPath
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader'
          }]
        })
      },
      {
        test: /\.(png|jpg|jpeg|git)/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 500,
            outputPath: 'images/'
          }
        }]
      },
      {
        test: /\.(htm|html)$/i,
        use: [
          'html-withimg-loader'
        ]
      },
      {
        test: /\.less$/,
        use: extractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          },{
            loader: 'less-loader'
          }],
          fallback: 'style-loader'
        })
      },
      {
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          use: [{
            loader: 'css-loader'
          }, {
            loader: 'sass-loader'
          }],
          fallback: 'style-loader'
        })
      }
    ]
  },

  plugins: [
    new uglify(),
    new htmlPlugin({
        minify:{ //是对html文件进行压缩
            removeAttributeQuotes:true  //removeAttrubuteQuotes是去掉掉属性的双引号。
        },
        hash:true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
        template:'./src/index.html' //是要打包的html模版路径和文件名称。
       
    }),
    new extractTextPlugin('css/index.css'),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, '../src/*.html'))
    })
  ],
  
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    host: 'localhost',
    compress: true,
    port: 8888
  }
};