import * as React from 'react';
import {Avatar, Badge, Dropdown, Icon, IconButton, Popover, Whisper} from 'rsuite';
import './tabs.scss'
import {utilsRef, utilsStorage} from 'utilscommon';
import {ReactSortable} from 'react-sortablejs';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import * as PubSub from 'pubsub-js'

import HookTabFull from './compone/hookTabFull';
import HookTab from './compone/hookTab';
import Listener from '../../../../listener';
import {createHashHistory} from 'history';
import {IRoute} from '../../../../index.type';

interface IState {
    activeKey: string
    collapsed: boolean
    /**
     * 选择的Tab key
     */
    selectItems?: string
    /**
     * 离开当前Tab就关闭当前Tab
     */
    selectClosedItems?: string

    scrollbars?: string
    /**
     * tab
     */
    items: Array<{
        id: string
        path: string
        /**
         * 标题
         */
        name?: string
        /**
         * 搜索条件
         */
        search?: string
        /**
         * 状态信息
         */
        state?: string
        closedHideTab?: boolean
    }>
}

interface IProps {
    routes: Array<IRoute>
}

export const TabsComponent = React.forwardRef<HTMLDivElement, any>((props, ref) => {
    return <div ref={ref} className={'header-tabs-base'}>{props.children}</div>;
});


export default class HeadTabs extends React.Component<IProps, IState> {

    private _OverlayScrollbarsComponent = utilsRef.useRef<any>()

    public _deviceNavMenuSidenav: any

    public _deviceEmitNavTabClosed: any

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            activeKey: '',
            collapsed: false,
            items: [],
            scrollbars: 'use-theme-thin-dark'
        }
    }

    /**
     * 监听路由变化
     * @private
     */
    private _listen = () => {
        const {routes: Routes} = this.props
        const routerHistory = createHashHistory();
        //路由跳转监听
        routerHistory.listen((listener) => {
            const {items, selectClosedItems} = this.state
            const pathname = listener.pathname
            const route = items.find((k, i, a) => k.path === pathname);
            if (route) {
                this.onWheel(`header-tabs-tabitem${route.id}`, route.id, () => {
                    //关闭
                    this._close(selectClosedItems)
                })
            } else {
                //无标签创建
                Routes.every((k, i, a) => {
                    if (pathname === k.path) {
                        const filter = items.filter((ki, ii, ai) => ki.closedHideTab !== true);
                        filter.push({
                            id: k.key,
                            path: pathname,
                            name: k.title,
                            closedHideTab: k.closedHideTab
                        })
                        this.setState({items: filter, selectItems: k.key}, () => {
                            utilsStorage.setItem('tabs', JSON.stringify(filter))
                            this.onWheel(`header-tabs-tabitem${k.key}`, k.key, () => {
                                //关闭
                                this._close(selectClosedItems)
                            })
                        })
                        return false;
                    }
                    return true;
                })
            }
        })
    }

    /**
     * 初始化标签处理
     * @private
     */
    private _initialization = () => {
        const {routes: Routes} = this.props
        const routerHistory = createHashHistory();
        const item = utilsStorage.getItem('tabs');
        const location = routerHistory.location;
        const parse: Array<any> = JSON.parse(item ?? '[]');
        let route = parse.find((k, i, a) => k.path === location.pathname);
        if (!route) {
            const find: any = Routes.find((k, i, a) => k.path === location.pathname);
            if (find) {
                const newroute = {
                    id: find.key,
                    path: find.path,
                    name: find.title,
                    closedHideTab: find.closedHideTab
                }
                parse.push(newroute)
                route = newroute
            }
        }
        this.setState({
            items: parse
        }, () => {
            if (route) {
                this.onWheel(`header-tabs-tabitem${route.id}`, route.id)
            } else {

            }
        })
    }

    /**
     * 关闭标签（适用于非激活标签）
     * @param id
     * @private
     */
    private _close = (id?: string) => {
        const {items} = this.state
        const _items = items.filter((k, i, a) => k.id !== id)
            .filter((k, i, a) => k.closedHideTab !== true)
        this.setState({
            items: _items,
            selectClosedItems: undefined
        }, () => {
            utilsStorage.setItem('tabs', JSON.stringify(_items))
        })
    }

    /**
     * PubSub方式 关闭Tab
     * @param name
     * @param props
     * @private
     */
    private _onClosed(name: string, props: any) {
        const {selectItems} = this.state
        const {callback} = props
        this.setState({
            selectClosedItems: selectItems
        }, () => {
            callback?.()
        })
    }

    componentDidMount(): void {
        this._deviceEmitNavTabClosed = PubSub?.subscribe(Listener.NavTabClosed, this._onClosed.bind(this));
        this._deviceNavMenuSidenav = PubSub?.subscribe(Listener.NavMenuSidenav, this._OnCollapsed.bind(this));
        this._initialization();
        this._listen();
    }

    componentWillMount(): void {
        PubSub?.unsubscribe(this._deviceEmitNavTabClosed);
        PubSub?.unsubscribe(this._deviceEmitNavTabClosed);
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

    /**
     * 滚动条 进行滚动到指定元素
     * @param classname
     * @param id
     * @param callbackWheelEnd
     */
    public onWheel(classname: string, id: string, callbackWheelEnd?: () => void) {
        const osInstance = this._OverlayScrollbarsComponent.current?.osInstance();
        osInstance?.scrollStop().scroll({
            el: document.getElementsByClassName(classname)[0],
            block: 'center'
        }, 500);
        this.setState({
            selectItems: id
        }, () => {
            callbackWheelEnd?.()
        })
    }

    /**
     * 前后选择
     */
    public onNextPrev(type: 'next' | 'prev') {
        const routerHistory = createHashHistory();
        const {selectItems, items} = this.state
        let index: number = -1;
        const tablength: number = items.length
        items?.some((k, i, a) => {
            if (k?.id === selectItems) {
                switch (type) {
                    case 'next':
                        if (i + 1 >= tablength) {
                            index = tablength - 1
                        } else {
                            index = i + 1
                        }
                        break;
                    case 'prev':
                        if (i - 1 <= 0) {
                            index = 0
                        } else {
                            index = i - 1
                        }
                        break
                    default:
                        break
                }
                return true
            }
            return false
        })
        if (index > -1) {
            routerHistory.push(items[index].path)
        }
    }


    public render() {
        const {selectItems, items, scrollbars} = this.state
        return (
            <div className='header-tabs' onContextMenu={(event: any) => {
                event.preventDefault()
                return false
            }}>
                <div className={'header-tabs-box'}>
                    <div style={{display: 'flex'}}>
                        <IconButton appearance="subtle" icon={<Icon icon="th-list"/>} placement="left"
                                    onClick={() => {
                                        Listener.EmitNavMenuSidenav()
                                    }}/>
                        <IconButton appearance="subtle" icon={<Icon icon="arrow-left"/>} placement="left"
                                    onClick={() => {
                                        this.onNextPrev('prev')
                                    }}/>
                    </div>
                    <OverlayScrollbarsComponent style={{width: 'calc(100% - 162px)'}}
                                                ref={this._OverlayScrollbarsComponent}
                                                options={{
                                                    className: scrollbars,
                                                    resize: 'none',
                                                    overflowBehavior: {
                                                        x: 'scroll',
                                                        y: 'hidden'
                                                    },
                                                    scrollbars: {
                                                        autoHide: 'move',
                                                        autoHideDelay: 500
                                                    }
                                                }}>
                        <div style={{width: items.length * 108}}>
                            <ReactSortable
                                tag={TabsComponent}
                                list={items}
                                group={{
                                    name: 'tab'
                                }}
                                animation={350}
                                delay={3}
                                swapThreshold={0.68}
                                invertedSwapThreshold={0.68}
                                emptyInsertThreshold={5}
                                fallbackOnBody={false}
                                invertSwap={false}
                                setData={(dataTransfer: DataTransfer, draggedElement: HTMLElement) => {
                                    const attribute = draggedElement?.getAttribute('d-url') ?? '';
                                    dataTransfer.setData('text/uri-list', `${window.location.protocol}//${window.location.hostname}:${window.location.port}/#${attribute}`)
                                }}
                                setList={((newState, sortable, store) => {
                                    if (sortable && store?.dragging) {
                                        this.setState({
                                            items: newState
                                        })
                                    }
                                })}
                            >
                                {items.map((item, index) => (
                                    <HookTab item={item} selectItems={selectItems}
                                             close={this._close}/>
                                ))}
                            </ReactSortable>
                        </div>
                    </OverlayScrollbarsComponent>
                    <div style={{display: 'flex'}}>
                        <IconButton appearance="subtle" icon={<Icon icon="arrow-right"/>}
                                    placement="right"
                                    onClick={() => {
                                        this.onNextPrev('next')
                                    }}/>
                        <Whisper
                            trigger="active"
                            placement='bottom'
                            speaker={
                                <Popover title="">
                                    <Dropdown.Menu
                                        style={{
                                            width: 200
                                        }}
                                    >
                                        <Dropdown.Item panel={true} style={{padding: 10, width: 160}}>
                                            <IconButton icon={<Icon icon={'android'}/>}
                                                        onClick={() => {
                                                            this.setState({
                                                                scrollbars: 'os-theme-thin-dark'
                                                            })
                                                        }}>Win</IconButton>
                                            <IconButton icon={<Icon icon={'android'}/>}
                                                        onClick={() => {
                                                            this.setState({
                                                                scrollbars: 'use-theme-thin-dark'
                                                            })
                                                        }}>WinRound</IconButton>
                                            <IconButton icon={<Icon icon={'android'}/>}
                                                        onClick={() => {
                                                            this.setState({
                                                                scrollbars: 'os-theme-thin-light'
                                                            })
                                                        }}
                                            >Mac</IconButton>
                                        </Dropdown.Item>
                                        <HookTabFull/>
                                        <Dropdown.Item panel={true} style={{padding: 10, width: 160}}>
                                            <p>Tab as</p>
                                            <strong>foobar</strong>
                                        </Dropdown.Item>
                                        {
                                            items.map((k, i, a) => (
                                                <>
                                                    {i === 0 ? <Dropdown.Item divider={true}/> : undefined}
                                                    <Dropdown.Item>{k.name}</Dropdown.Item>
                                                </>
                                            ))
                                        }
                                        <Dropdown.Item divider={true}/>
                                        <Dropdown.Item>Help</Dropdown.Item>
                                        <Dropdown.Item>Settings</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Popover>
                            }
                        >
                            <div className={'header-tabs-basetool'}>
                                <Badge content={55} maxCount={99}>
                                    <Avatar style={{backgroundColor: '#87d068'}} size={'xs'}>
                                        <Icon icon={'gear-circle'}/>
                                    </Avatar>
                                </Badge>
                            </div>
                        </Whisper>
                    </div>
                </div>
            </div>
        )
    }
}
