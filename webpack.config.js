const path = require('path');//ya esta en el modulo de node
const htmlPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizePlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const dotenv = require('dotenv-webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
    entry: './src/index.js',//archivo de entrada
    output: {//archivo de salida
        path: path.resolve(__dirname, 'dist'),//ruta de salida
        filename: '[main].[contenthash].js',//nombre del archivo de salida
        assetModuleFilename: 'assets/images/[hash][ext][query]'
    },
    resolve: {
        extensions: ['.js'],//extensiones que se pueden usar
        alias: {//alias para usar los modulos
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: {
        rules: [//reglas para los archivos
            {
                test: /\.m?js$/,//expresion regular para recibir archivos Mjs o js
                exclude: /(node_modules|bower_components)/,//excluir archivos que se encuentren en estas carpetas
                use: {
                    loader: 'babel-loader',//loader para transpilar los archivos
                }
            },
            {
                test: /\.css|.styl$/,//expresion regular para recibir archivos css
                use: [
                    miniCssExtractPlugin.loader,//loader para extraer los archivos css
                    'css-loader',
                    'stylus-loader'//loader para interpretar los archivos css
                ]
            },
            {
                test: /\.png$/,//expresion regular para recibir archivos png
                type: 'asset/resource',//tipo de archivo
            },
            {
                test: /\.(woff|woff2)$/,//expresion regular para recibir archivos de fuentes
                use: {
                    loader: 'url-loader',//loader para interpretar los archivos de fuentes
                    options: {
                        limit: 100000,//limite de tamaño del archivo
                        mimetype: 'application/font-woff',//tipo de archivo
                        name: '[name].[contenthash].[ext]',//nombre del archivo
                        outputPatch: "./assets/fonts",//ruta de salida
                        publicPatch: "../assets/fonts",//ruta de publicacion
                        esModule: false,//modulo de javascript
                    },
                }
            }
        ]
    },
    plugins: [//plugins para el proyecto
        new htmlPlugin({//plugin para el html
            template: './public/index.html',//archivo de plantilla
            inject: true,//permite la inyeccion de codigo en el html
            filename: './index.html'//nombre del archivo de salida
        }),
        new miniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css'//nombre del archivo de salida]'
        }),//plugin para el css
        new copyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"),//ruta de origen
                    to: "assets/images"//ruta de destino
                }
            ]
        }),
        new dotenv(),//plugin para el archivo de variables de entorno
        new CleanWebpackPlugin()//plugin para limpiar la carpeta de salida
    ],
    optimization: {
        minimize:true,//minimizar el archivo
        minimizer:[
            new CssMinimizePlugin(),//minimizar el archivo css
            new TerserPlugin()//minimizar el archivo js
        ]
    }
}