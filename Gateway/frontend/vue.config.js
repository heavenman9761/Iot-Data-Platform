module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  // publicPath: '/material-vue/',
  devServer: { 
    proxy: { 
      '/api': { 
        target: 'http://localhost:3000/api',
        changeOrigin: true, 
        pathRewrite: { 
          '^/api': ''
        } 
      } 
    } 
  },
  outputDir: '../backend/public',
}
