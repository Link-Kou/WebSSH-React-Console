const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware('/dev',
        {
            target: 'http://localhost:8080',
            //改变源
            changeOrigin: true,
            secure: false,
            /**
             * 重定向
             */
            pathRewrite: {
                '^/dev': ''
            }
        }
    ));
};
