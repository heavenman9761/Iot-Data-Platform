module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  // publicPath: '/material-vue/',
  devServer: { 
    proxy: { 
      '/api': { 
        target: 'http://localhost:6007/api',
        changeOrigin: true, 
        pathRewrite: { 
          '^/api': ''
        } 
      } 
    } 
  },
  outputDir: '../backend/public',
}
