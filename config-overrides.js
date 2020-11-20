const {override, useBabelRc, addLessLoader, addWebpackAlias, addWebpackModuleRule} = require('customize-cra');
const markdownRenderer = require('react-markdown-reader').renderer;
const path = require('path');

module.exports = override(
    useBabelRc(),
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                //'@icon-font-path': './fonts',
                '@input-color-disabled': '#404040',
                '@table-head-font-color': '#5c5c5c',
                '@base-color': '#2962A5',
                /*菜单背景色*/
                '@sidenav-inverse-bg': '#113756',
                '@sidenav-inverse-active-bg': '#0f4c7d',
                '@sidenav-inverse-hover-bg': '#0f4c7d'
                /*'@btn-disabled-opacity': 0.8*/
            }
        }
    }),
    addWebpackModuleRule({
        test: /\.md$/,
        use: [{
            loader: 'html-loader'
        }, {
            loader: 'markdown-loader',
            options: {
                renderer: markdownRenderer(['javascript', 'bash', 'xml', 'css', 'markdown', 'less'])
            }
        }]
    }),
    addWebpackModuleRule({
        test: /\.svg$/,
        include: [path.resolve(__dirname, './src/resource/svg'), path.resolve(__dirname, './packcoms/panlecommon')],
        /* exclude: path.resolve(__dirname, './src/component/imageManager'),*/
        use: [
            {
                loader: 'svg-sprite-loader',
                options: {
                    symbolId: 'icon-[name]-[hash]'
                }
            },
            'svg-transform-loader',
            'svgo-loader'
        ]
    }),
    addWebpackModuleRule({
        test: /\.(ts|tsx)$/,
        include: [path.resolve(__dirname, './packages'), path.resolve(__dirname, './packcoms')],
        use: [
            {
                loader: 'ts-loader',
                options: {
                    // disable type checker - we will use it in fork plugin
                    transpileOnly: true,
                    compilerOptions: {
                        sourceMap: true,
                        inlineSources: true
                    },
                    configFile: 'tsconfig.json'
                }
            }
        ]
    }),
    addWebpackAlias({
        '@config': 'src/config',
        '@router': 'src/router',
        '@resource': 'src/resource',
        '@listener': 'src/listener',
        '@fetch': 'src/fetch',
        '@intl': 'src/intl'
    })
);
