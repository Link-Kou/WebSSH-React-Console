import * as React from 'react';
import * as ReactDOM from 'react-dom';

/**
 * 基础css
 */
import './index.css';
import './resource/css/base.scss'
//import 'rsuite/lib/styles/index.less'
import 'rsuite/lib/styles/themes/dark/index.less';
import 'nprogress/nprogress.css'

//基础路由
import RouterBase from './router/routerBase';

import * as serviceWorker from './serviceWorker';


ReactDOM.render(
    <RouterBase/>,
    document.getElementById('root') as HTMLElement
);
serviceWorker.unregister();
