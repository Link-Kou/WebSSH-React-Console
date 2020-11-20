import * as React from 'react';
import {Route, Switch} from 'react-router-dom';
import {createHashHistory, History as IHistory} from 'history';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {ConnectedRouter, connectRouter, routerMiddleware} from 'connected-react-router';
import {IntlCompone} from '@intl'
import Main from '../application/main';
import GoldenLayout from '../application/goldenLayout';
import Error404 from 'errorview/404';
import Login from '../application/login';

//创建路由方式
export const Historys: IHistory = createHashHistory({
    //离开页面提示
    getUserConfirmation: function (message: string, callback: (result: boolean) => void) {
        //需要配合Prompt使用
        if (window.confirm(message)) {
            callback(true);
        } else {
            callback(false);
        }
    }
})

//redux结合,单纯予以结合
const store = createStore(
    combineReducers({
        router: connectRouter(Historys)
    }),
    applyMiddleware(thunk, routerMiddleware(Historys))
);

interface IRoute {
    key: string,
    type: 'public' | 'private',
    exact: boolean,
    path: string | undefined,
    screen: any
    routes?: Array<IRoute>

}

const routes: Array<IRoute> = [
    {
        key: 'main',
        type: 'public',
        exact: true,
        /**
         * 子路由
         * {@link /src/router/RootBaseItem}
         */
        path: '/',
        screen: Main
    },
    {
        key: 'main',
        type: 'public',
        exact: true,
        /**
         * 子路由
         * {@link /src/router/RootBaseItem}
         */
        path: '/layout',
        screen: GoldenLayout
    },
    {
        key: 'login',
        type: 'public',
        exact: true,
        /**
         * 子路由
         * {@link /src/router/RootBaseItem}
         */
        path: '/login',
        screen: Login
    },
    {
        key: '404',
        type: 'public',
        exact: true,
        path: undefined,
        screen: Error404
    }
];

/**
 * 基础路由控制
 */
export default class RootBase extends React.Component {


    /**
     * 认证登录
     * @param Component
     * @param rest
     * @constructor
     */
    public PrivateRoute({...rest}) {
        return (
            <Route {...rest} />
        )
    }

    /**
     * 公开路径
     * @param rest
     * @constructor
     */
    public PublicRoute({...rest}) {
        return (
            <Route {...rest}/>
        )
    }


    public render() {
        return (
            <IntlCompone nors={false}>
                <Provider store={store}>
                    <ConnectedRouter history={Historys}>
                        <div style={{height: '100%'}}>
                            <Switch>
                                {
                                    routes.map((route: IRoute, i) => {
                                        return (
                                            route.type === 'private' ?
                                                <this.PrivateRoute
                                                    exact={route.exact}
                                                    key={route.key}
                                                    path={route.path}
                                                    component={route.screen}
                                                /> :
                                                <this.PublicRoute
                                                    exact={route.exact}
                                                    key={route.key}
                                                    path={route.path}
                                                    component={route.screen}
                                                />
                                        )
                                    })
                                }
                            </Switch>
                        </div>
                    </ConnectedRouter>
                </Provider>
            </IntlCompone>
        )
    }
}
