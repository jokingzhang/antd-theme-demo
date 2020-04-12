const path = require('path');
const {
  override,
  fixBabelImports,
  addLessLoader,
  setWebpackPublicPath,
  addWebpackPlugin,
} = require('customize-cra');
const AntDesignThemePlugin = require('antd-theme-webpack-plugin');

const options = {
  antDir: path.join(__dirname, './node_modules/antd'),
  stylesDir: path.join(__dirname, './src'),
  varFile: path.join(__dirname, './src/variables.less'),
  mainLessFile: path.join(__dirname, './src/style.less'),
  themeVariables: ['@primary-color'],
  indexFileName: 'index.html',
  generateOnce: false, // generate color.less on each compilation
};

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    // modifyVars: {
    //   '@primary-color': '#00375B',
    // },
    javascriptEnabled: true,
  }),
  setWebpackPublicPath(process.env.NODE_ENV === 'production' && '/antd-theme-demo'),
  addWebpackPlugin(new AntDesignThemePlugin(options)),
);
