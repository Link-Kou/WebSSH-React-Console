import React, {CSSProperties} from 'react';
import ReactDOM from 'react-dom';
import GoldenLayout, {
    ComponentConfig,
    Dimensions,
    ItemConfig,
    Labels,
    ReactComponentConfig,
    Settings
} from 'golden-layout';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-dark-theme.css';
import $ from 'jquery';
import LayoutUtils from './layoutUtils';

interface IState {
    renderPanels?: any
}

export type ItemConfigType = ItemConfig | ComponentConfig | ReactComponentConfig | {};

interface IProps {
    /**
     * 容器属性
     */
    containerAttrs?: any
    /**
     * 填充满
     */
    fill?: boolean
    /**
     * 容器样式
     */
    containerStyle?: CSSProperties
    /**
     * 参数化配置
     * @see http://golden-layout.com/docs/Config.html
     */
    config: {
        settings?: Settings;
        dimensions?: Dimensions;
        labels?: Labels;
        content?: ItemConfigType[];
    }
    /**
     * 注册容器
     */
    registerComponent: Array<{
        name: string,
        component: any
    }>

    /**
     * 关闭
     * 返回非boolean走系统默认提示
     */
    onTabClose?(name: string): boolean

    /**
     * 事件
     */
    onStackCreated?(stack: any): void

    register?: (layout: GoldenLayout) => void
}

/**
 * docker面板
 */
export class GoldenLayoutComponent extends React.Component<IProps, IState> {

    public containerRef = React.createRef();

    public goldenLayoutInstance: GoldenLayout | undefined;

    public onListenResizeMap = new Map();

    public layoutUtil = (): LayoutUtils => {
        return new LayoutUtils(this.goldenLayoutInstance)
    };

    public state = {
        renderPanels: []
    }

    componentRender(reactComponentHandler: any) {
        this.setState(state => {
            const newRenderPanels = new Set(state.renderPanels);
            newRenderPanels.add(reactComponentHandler);
            return {renderPanels: newRenderPanels};
        });
    }

    componentDestroy(reactComponentHandler: any) {
        this.setState(state => {
            const newRenderPanels = new Set(state.renderPanels);
            newRenderPanels.delete(reactComponentHandler);
            return {renderPanels: newRenderPanels};
        });
    }

    _onResize = () => {
        const {fill} = this.props
        if (fill && this.containerRef) {
            if (this.containerRef?.current) {
                const {clientWidth, clientHeight} = this.containerRef?.current as any;
                this.goldenLayoutInstance?.updateSize(clientWidth, clientHeight)
            }
        }
    }

    _oninitialization = () => {
        const {registerComponent, onStackCreated, register, onTabClose} = this.props
        this.goldenLayoutInstance = new GoldenLayout(
            //@ts-ignore
            this.props.config || {},
            this.containerRef.current as any
        );
        (this.goldenLayoutInstance as any).reactContainer = this;
        //注册组件
        registerComponent?.forEach((k, i, a) => {
            this.goldenLayoutInstance?.registerComponent(k.name, k.component);
        })
        //创建事件
        this.goldenLayoutInstance.on('stackCreated', (stack: any) => {
            onStackCreated?.(stack)
        })
        //大小变化事件
        this.goldenLayoutInstance.on('componentCreated', (component: any) => {
            const _component: any = component
            _component.container.on('resize', () => {
                const _onListenResizeMap = this.onListenResizeMap.get(_component?.config?.id);
                _onListenResizeMap?.(_component?.element?.outerWidth())
            })
        });
        //tab事件
        this.goldenLayoutInstance.on('tabCreated', (tab: any) => {
            tab?.closeElement
                ?.off('click')
                ?.click(() => {
                    const tabClose = onTabClose?.(tab.titleElement.html()) ?? undefined;
                    if (typeof tabClose === 'boolean') {
                        if (tabClose) {
                            tab.contentItem.remove();
                        }
                    } else if (window.confirm('是否关闭此Tab')) {
                        tab.contentItem.remove();
                    }
                });
        });
        register?.(this.goldenLayoutInstance);
        this.goldenLayoutInstance.init();
        const {clientWidth, clientHeight} = this.containerRef.current as any;
        this.goldenLayoutInstance?.updateSize(clientWidth, clientHeight)
    }

    componentDidMount() {
        window.addEventListener('resize', this._onResize);
        this._oninitialization()
    }


    componentWillMount() {
        window.removeEventListener('resize', this._onResize);
        this.goldenLayoutInstance?.destroy()
    }

    render() {
        const {containerStyle, containerAttrs} = this.props
        const panels: Array<any> = Array.from(this.state.renderPanels || []);
        return (
            <div id={'goldenLayoutComponent'} ref={this.containerRef} style={containerStyle} {...containerAttrs}>
                {panels.map((panel, index) => {
                    return ReactDOM.createPortal(
                        React.cloneElement(panel._getReactComponent(), {
                            /**
                             * 监听大小变化
                             * @param id
                             * @param fc
                             */
                            onListenResize: (id: string, fc: (width: number) => void) => {
                                this.onListenResizeMap.set(id, fc);
                            }
                        }),
                        panel._container.getElement()[0]
                    );
                })}
            </div>
        );
    }
}

//region 实现类,控件官方与React结合写法
const ReactComponentHandler = GoldenLayout['__lm'].utils.ReactComponentHandler;

class ReactComponentHandlerPatched extends ReactComponentHandler {
    // @ts-ignore
    public __container: any = this._container
    // @ts-ignore
    public __reactClass: any = this._reactClass

    _render() {
        const reactContainer = this.__container?.layoutManager?.reactContainer; //Instance of GoldenLayoutComponent class
        if (reactContainer && reactContainer.componentRender) {
            reactContainer.componentRender(this);
        }
    }

    _destroy() {
        this.__container.off('open', this._render, this);
        this.__reactClass.off('destroy', this._destroy, this);
    }

    _getReactComponent() {
        const defaultProps = {
            glEventHub: this.__container.layoutManager.eventHub,
            glContainer: this.__container
        };
        const props = $.extend(defaultProps, this.__container._config.props);
        return React.createElement(this.__reactClass, props);
    }
}

GoldenLayout['__lm'].utils.ReactComponentHandler = ReactComponentHandlerPatched;
//endregion
