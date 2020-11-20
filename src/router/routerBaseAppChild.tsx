import * as React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'
import Loadable from 'react-loadable';
import QueueAnim from 'rc-queue-anim';
import {RouterPaths} from './routerBaseAppPath';
import {RouterLoadableDelay, RouterLoadableConfigBase} from './routerLoadableDelay';
import Error404 from 'errorview/404';

export interface IRoute {
    key: string,
    exact: boolean
    title?: string
    closedHideTab?: boolean
    path: string | undefined,
    screen: any
    routes?: Array<IRoute>
}

export const routes: Array<IRoute> = [
    {
        key: 'Main',
        exact: false,
        title: '首页',
        path: RouterPaths.Main,
        screen: Loadable({
            loader: () => RouterLoadableDelay(import('../application/main')),
            ...RouterLoadableConfigBase
        })
    },
    {
        key: 'GoldenLayout',
        exact: false,
        title: '布局',
        path: RouterPaths.Layout,
        screen: Loadable({
            loader: () => RouterLoadableDelay(import('../application/goldenLayout')),
            ...RouterLoadableConfigBase
        })
    },
    {
        key: '404',
        title: '404',
        exact: false,
        path: undefined,
        screen: Error404
    }
];

export default class RootBaseItem extends React.Component {

    getChildren = (props: any) => {
        const {location}: { location: { pathname: string, [x: string]: any } } = {...props};
        const iRoutes = routes.find(x => x.path === location.pathname);
        if (iRoutes) {
            return (
                <QueueAnim
                    style={{height: '100%'}}
                    type={['left', 'right']}
                    ease={['easeInOutQuad', 'easeInBack']}>
                    <Route
                        exact={iRoutes?.exact}
                        key={iRoutes?.key}
                        path={iRoutes?.path}
                        component={iRoutes?.screen}
                    />
                </QueueAnim>
            )
        }
        //重定向
        return <Redirect to={'/'}/>
    }


    public render() {
        return (
            <Switch>
                <Route
                    render={this.getChildren}
                />
            </Switch>
        )
    }
}

