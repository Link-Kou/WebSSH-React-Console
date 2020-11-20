import * as React from 'react';
import {DOMHelper as _} from 'rsuite';

interface IProps {

    /**
     * 定义容器的高度 默认为！100VH
     * 自定义高度优先级最高，不会执行subHeight
     */
    height?: number

    /**
     * 100vh - subHeight = 实际的高度
     */
    subHeight?: number

    /**
     * 样式
     */
    style?: React.CSSProperties;

    /**
     * 返回控件
     * @constructor
     * @param height
     * @param width
     */
    Body(height: number, width: number): any

    /**
     * 超出样式
     * 默认：hidden
     */
    overflow?: 'auto' | 'clip' | 'hidden' | 'scroll' | 'visible' | string

    /**
     * 延迟渲染
     */
    delay?: number

}

/**
 * 盒子布局
 */
export default class Index extends React.Component<IProps> {


    private _wrapper: HTMLDivElement | null | undefined;

    private windowResizeListener: any;


    public state = {
        height: this.props.height ?? 0,
        width: 0
    }

    public componentDidMount() {
        this.windowResizeListener = _.on(window, 'resize', this.handleResize.bind(this))
        if (this._wrapper) {
            this.setState({
                height: _.getHeight(this._wrapper),
                width: _.getWidth(this._wrapper)
            })
        }
        this._delay()
    }

    /**
     * 延迟渲染
     * @private
     */
    private _delay() {
        const {delay} = this.props
        if (delay) {
            setTimeout(() => {
                this.setState({
                    width: 0,
                    height: 0
                }, () => {
                    this.handleResize()
                })
            }, delay ?? 0)
        }
    }

    /**
     * 解除监听效果
     */
    public componentWillUnmount() {
        this.windowResizeListener?.off?.();
    }

    /**
     * 改变大小
     * @param e
     */
    public handleResize = (e?: any) => {
        const _wrapper = this._wrapper
        if (_wrapper) {
            this.setState({
                height: _.getHeight(_wrapper),
                width: _.getWidth(_wrapper)
            });
        }
    }

    /**
     * 获取到样式 适配
     * @param boxheight
     * @param subHeight
     */
    public getHeightStyle(boxheight: any, subHeight: any) {
        const reactappsubheight: any = String(process.env.REACT_APP_SubHeight)
        if (boxheight) {
            return boxheight
        }
        if (subHeight) {
            return `calc(100vh - ${subHeight}px)`
        }
        if (reactappsubheight) {
            return `calc(100vh - ${reactappsubheight}px)`
        }
        return '100vh'
    }


    public render() {
        const {height, width} = this.state
        const {overflow, subHeight, style, height: boxheight} = this.props
        const overflowstring = typeof overflow === 'undefined' ? 'hidden' : overflow
        return (
            <div
                id={'app-flex-calc-box'}
                ref={ref => {
                    this._wrapper = ref;
                }}
                style={{
                    height: this.getHeightStyle(boxheight, subHeight),
                    overflow: overflowstring,
                    ...style
                }}
            >
                {this.props.Body(height, width)}
            </div>
        )
    }

}
