const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',  // Forward requests starting with /api  
        createProxyMiddleware({
            target: 'http://localhost:5000',  // Backend server URL  
            changeOrigin: true,  // Needed for virtual hosted sites  
            pathRewrite: { '^/api': '' }  // Optional: strip /api from the URL  
        })
    );
};  