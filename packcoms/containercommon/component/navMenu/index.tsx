import * as React from 'react';
import './menu.scss'
import {Menus} from './menu';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import menuUtis from './utils';
import {utilsRef} from 'utilscommon';
import Listener from '../../listener';
import {IMenuConfig} from '../../index.type';
import {History} from 'history';

/**
 * 菜单收缩展开尺寸
 */
const expansionWidth: string = '256px'

const shrinkWidth: string = '56px'

interface IProps {
    MenuOpenKeysConfig?: Array<string>
    MenuConfig: Array<IMenuConfig>
    historys?: History
    collapsed?: boolean
}

/**
 * 菜单栏目
 */
export default class Index extends React.Component<IProps> {

    private _OverlayScrollbarsComponent = utilsRef.useRef<any>()

    public _deviceEventEmitter: any

    public state = {
        collapsed: this.props.collapsed ?? false,
        selectMenuKey: '',
        selectOpenKeys: this.props.MenuOpenKeysConfig,
        Menu: this.props.MenuConfig,
        collapsedOverflow: 'inherit',
        componentUpdate: ''
    }

    public componentDidMount(): void {
        this._deviceEventEmitter = PubSub.subscribe(Listener.NavMenuSidenav, this._OnCollapsed.bind(this));
        this._listen()
    }

    public componentWillMount(): void {
        PubSub.unsubscribe(this._deviceEventEmitter);
    }

    /**
     * 监听路由
     * @private
     */
    private _listen = () => {
        const {historys} = this.props
        const routerHistory = historys;
        const wheel = () => {
            //菜单栏滚动条导航
            const activeElement: any = document.querySelectorAll('.rs-nav-item-active,.rs-dropdown-item-active');
            activeElement?.forEach((k: any, i: any, a: any) => {
                //k?.scrollIntoViewIfNeeded?.(true);
                const osInstance = this._OverlayScrollbarsComponent.current.osInstance();
                osInstance.scrollStop().scroll({
                    el: k,
                    block: 'center'
                }, 500);
            })
        }
        this.setState({
            selectMenuKey: routerHistory?.location?.pathname
        }, () => {
            wheel()
        })
        //路由跳转监听
        routerHistory?.listen((listener) => {
            this.setState({
                selectMenuKey: listener.pathname
            }, () => {
                wheel()
            })
        })
    }


    /**
     * 打开关闭
     * @private
     */
    public _OnCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    public render() {
        const {selectOpenKeys, selectMenuKey, collapsed} = this.state
        const {historys} = this.props
        return (
            <OverlayScrollbarsComponent
                ref={this._OverlayScrollbarsComponent}
                className={'os-host-flexbox app-scrollbars'}
                style={!collapsed ? {width: expansionWidth} : {width: shrinkWidth}}
                onScroll={() => {
                    menuUtis.setMenusDropdownPosition()
                }}
                options={{
                    resize: 'none',
                    overflowBehavior: {
                        x: 'hidden',
                        y: 'scroll'
                    },
                    scrollbars: {
                        visibility: 'hidden'
                    }
                }}>
                <div className='app-sidebar'
                     style={
                         !collapsed ? {
                             width: expansionWidth
                         } : {width: shrinkWidth}
                     }
                >
                    <Menus selectOpenKeys={selectOpenKeys}
                           selectMenuKey={selectMenuKey}
                           historys={historys}
                           collapsed={!this.state.collapsed}
                           item={this.state.Menu}/>
                </div>
            </OverlayScrollbarsComponent>
        )
    }
}
