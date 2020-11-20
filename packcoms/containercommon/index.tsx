import * as React from 'react';

import NavMenu from './component/navMenu'
import NavHead from './component/navHead'
import NavBody from './component/navBody'
import NavLogo from './component/navLogo'
import NavHeadTool from './component/navHeadTool';
import './index.scss'
import {IMenuConfig, IRoute} from './index.type';

interface IProps {
    routerComponent: React.ComponentType
    routes?: Array<IRoute>
    MenuOpenKeysConfig?: Array<string>
    historys?: any
    MenuConfig: Array<IMenuConfig>
    collapsed?: boolean
}

export default class BaseView extends React.Component<IProps> {

    public state = {
        splitPane: false,
        collapsed: true,
        size: 350
    }

    public render() {
        const {routes, routerComponent: RouterComponent, MenuOpenKeysConfig, MenuConfig, historys, collapsed} = this.props
        return (
            <div className='app-base'>
                <div className='app-left'>
                    <NavLogo collapsed={collapsed}/>
                    <NavMenu collapsed={collapsed} historys={historys} MenuConfig={MenuConfig}
                             MenuOpenKeysConfig={MenuOpenKeysConfig}/>
                </div>
                <div className='app-right'>
                    <NavHead showTabs={true} routes={routes}>
                        <NavHeadTool/>
                    </NavHead>
                    <NavBody>
                        <RouterComponent/>
                    </NavBody>
                </div>
            </div>
        )
    }
}

