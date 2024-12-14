import HtmlWebpackPlugin from 'html-webpack-plugin';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import DotenvWebpack from 'dotenv-webpack';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'development',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new DotenvWebpack(),
  ],
  devServer: {
    static: {
      directory: join(__dirname, 'dist'),
    },
    historyApiFallback: true,
    hot: true,
    open: true,
    allowedHosts: "all"
  },
};
