const path =  require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: 'development',
    entry:"./src/index.js",
    output: {
        path: path.join(__dirname,'/public'),
        filename: 'bundle.[fullhash].js',
        publicPath: '/'
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html',
        })
    ],
    module : {
        rules: [
            {
                test: /\.(jsx|js|ts)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
    }
}