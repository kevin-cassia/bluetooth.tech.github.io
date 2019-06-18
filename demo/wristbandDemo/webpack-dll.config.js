const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const dirVars = require('./webpack-config/base/dir-vars.config.js'); // Configuration table that shares the same path with the business code.

module.exports = {
  output: {
    path: dirVars.dllDir,
    filename: '[name].js',
    library: '[name]' // All the contents of the current Dll will be stored in a global variable of the variable name specified by this parameter.
    // Note that it is consistent with the name parameter of DllPlugin.
  },
  entry: {
    /*
      Specifies the js module to be packaged or 
      css/less/picture/font file and other resources.
    */
    dll: [
      'jquery',
      'backbone/backbone-min.js'
    ]
  },
  plugins: [
    new webpack.DllPlugin({
      path: 'manifest.json', // The index of each module in this Dll file, used for reading DllReferencePlugin.
      name: '[name]',  // All the contents of the current Dll will be stored in a global variable of the variable name specified by this parameter, pay attention to the same as the output.library parameter.
      context: dirVars.staticRootDir // Specify a path as the context, which needs to be consistent with the context parameter of DllReferencePlugin. It is recommended to set it as the project root directory.
    }),
    /* Like the business code, this is still compatible. */
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$': 'jquery',
      Backbone:'Backbone',
      _:'underscore'
    }),
    new ExtractTextPlugin('[name].css'), // ExtractTextPlugin is used when packaging css/less.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: require('./webpack-config/vendor/postcss.config.js')
      }
    })
  ],
  module: require('./webpack-config/module.product.config.js'), // The module configuration for the business code.
  resolve: require('./webpack-config/resolve.config.js') // Resolve for the business code.
};
