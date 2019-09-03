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
            // react(jsx)语法的处理
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react']
                    }
                }
            },
            // css文件的处理
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
                    use: ['css-loader', 'sass-loader']
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
                            name: 'resource/[name].[ext]'
                        }
                    }
                ]
            },
            // 字体图标的配置
            {
                test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                use: [
                    {
                        loader: 'url-loader',
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
        new ExtractTextPlugin("css/[name].css"),
        // 提出公共模块
        new webpack.optimize.CommonsChunkPlugin({
            name : 'common',
            filename: 'js/base.js'
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