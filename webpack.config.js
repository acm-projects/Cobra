const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    popup: './src/popup.tsx',
    background: './src/background.tsx',
    content: './src/content.ts',
    signin: './src/signin.tsx',
    signup: './src/signup.tsx',
    sidepanel: './src/sidepanel.tsx',
    verify: './src/verify.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/popup.html',
          to: 'popup.html'
        },
        { 
          from: 'src/signin.html', 
          to: 'signin.html' 
        },
        { 
          from: 'src/signup.html', 
          to: 'signup.html' 
        },
        { 
          from: 'src/sidepanel.html', 
          to: 'sidepanel.html' 
        },
        { 
          from: 'src/verify.html', 
          to: 'verify.html' 
        },
        { from: 'images', to: 'images' },
        { from: 'sounds', to: 'sounds' },
        { from: 'styles.css', to: 'styles.css' },
        { from: 'manifest.json', to: 'manifest.json' }
      ],
    }),
  ],
}; 