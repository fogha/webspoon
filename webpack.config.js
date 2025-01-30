import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    popup: ['@babel/runtime/regenerator', './src/main.jsx'],
    background: ['@babel/runtime/regenerator', './src/background/index.js'],
    content: ['@babel/runtime/regenerator', './src/content/index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/[name].js',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  tailwindcss,
                  autoprefixer,
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: 'public', 
          globOptions: {
            ignore: ["**/popup.html"]
          }
        },
        {
          from: 'manifest.json'
        }
      ]
    })
  ],
  optimization: {
    minimize: false,
    moduleIds: 'named',
    chunkIds: 'named',
    mangleExports: false,
    splitChunks: {
      chunks: 'all',
      name: 'vendor'
    }
  }
};
