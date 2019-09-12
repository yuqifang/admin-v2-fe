/*
* @Author: YuQiFang
* @Date:   2018-01-13 11:26:52
* @Last Modified by:   YuQiFang
* @Last Modified time: 2018-02-07 10:35:01
*/
/* 
    说明：webpack.config.js是自己手动在根目录创建的，名字是固定的
*/
const path              = require('path');
const webpack           = require('webpack');
// html-webpack-plugin打包生成单独的html文件,把对应的脚本和样式插入合适的位置，防止在更新的时候有浏览器缓存
const HtmlWebpackPlugin = require('html-webpack-plugin');
// extract-text-webpack-plugin将样式打包成单独文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';
console.log('分析是什么环境?', WEBPACK_ENV);
module.exports = {
    entry: './src/app.jsx', // 项目的入口文件路劲
    output: {
        path: path.resolve(__dirname, 'dist'), // 打包之后的文件放到什么位置，这句话的意思是：解析一个路劲到根目录的dist文件夹下
        // 打包之后，页面需要的js,css, img等资源从根目录dist目录下开始找，这里配置了publicPath后  devServer: {}中的contentBase: './dist'就可不要了
        publicPath: WEBPACK_ENV === 'dev' ? '/dist/' : '//s.jianliwu.com/admin-v2-fe/dist/', 
        filename: 'js/app.js'
    },
    resolve: {
        alias : {
            page        : path.resolve(__dirname, 'src/page'),
            component   : path.resolve(__dirname, 'src/component'),
            util        : path.resolve(__dirname, 'src/util'),
            service     : path.resolve(__dirname, 'src/service')
        }
    },
    module: {
        rules: [
            // es6和react(jsx)语法的处理
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/, // 排除node_modules这个文件夹，对这里的文件不做处理
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                }
            },
            // 将所有入口引用的*.css，移动到独立分离的css文件，样式将不在内嵌到JS中，而是放到一个单独的css文件当中
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            // sass文件的处理
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']  // 注意：scss依赖于node-sass的，因此需要手动安装node-sass    npm install node-sass --dev
                })
            },
            // 图片的配置
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'  // 指定路径 
                        }
                    }
                ]
            },
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader', // url-loader是依赖于file-loader npm install file-loader url-loader --dev
                        options: {
                            limit: 8192,
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // 处理html文件 
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: './favicon.ico'
        }),
        // 独立css文件
        new ExtractTextPlugin("css/[name].css"),  // [name]是一个变量
        // 提出公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common', // 这个'common'是根据自己的爱好随意起的名字
            filename: 'js/base.js' // 把通用的js打包放到一个指定目录下
        })
    ],
    devServer: {
        port: 8086,
        historyApiFallback: {
            index: '/dist/index.html'
        },
        proxy : {
            '/manage' : {
                target: 'http://admintest.happymmall.com',
                changeOrigin : true
            },
            '/user/logout.do' : {
                target: 'http://admintest.happymmall.com',
                changeOrigin : true
            }
        }
    }
};

// 问题src直接目录下的文件index.html是通过app.jsx是怎么建立起来联系的，  留心老师啥时候建立的这个src直接目录下的index.html???????

// ReactDOM.render(
//     <App />,
//     document.getElementById('app')
// );

// 观察刚开始有哪些文件,各个文件建立的时间节点   怎么创建的？

// new ExtractTextPlugin("css/[name].css"), 中的name是怎么传参的？？