import * as React from 'react';

import WindowsModalHead from './head';
import './index.scss'
import ReactDOM from 'react-dom';
import {OverlayScrollbarsComponent} from 'overlayscrollbars-react';
import {utilsRef} from 'utilscommon';

interface IProps {
    /**
     * 最小高度
     * default 200
     */
    minHeight?: number
    /**
     * 最小宽度
     * default 100
     */
    minWidth?: number
    /**
     * 最大高度
     * default Number.MAX_VALUE
     */
    maxHeight?: number
    /**
     * 最大宽度
     * default Number.MAX_VALUE
     */
    maxWidth?: number
    /**
     * 默认
     */
    defaultHeight?: number
    /**
     * 默认
     */
    defaultWidth?: number

    /**
     * 关闭
     */
    onClose?(): void

    /**
     * 显示
     */
    show?: boolean

    /**
     * 是否显示在居中
     */
    showCentered?: boolean

    title?: string

    /**
     * 是否显示关闭
     */
    hideClose?: boolean

    /**
     * 是否显示最大小化
     */
    hideMinMax?: boolean
}

/**
 *
 * @author lk
 * @date 2020/7/27 19:37
 * @version 1.0
 */
export default class WindowsModal extends React.Component<IProps> {

    public node = document.getElementById('root')?.parentElement;

    private _appWindowsModal = utilsRef.useRef<any>()

    private _hitRange = 5

    public state = {
        show: false,
        /**
         * 鼠标是否按下不放
         */
        flag: false,
        /**
         * 鼠标进入头部
         */
        flagHead: false,
        startXY: {
            x: 0,
            y: 0
        },
        sizeXY: {
            width: this.props.defaultWidth ?? 800,
            height: this.props.defaultHeight ?? 600,
            cursor: 'auto',
            leftSize: false,
            RightSize: false,
            topSize: false,
            bottomSize: false
        },
        /**
         * 移动中保存坐标
         */
        movingXY: {
            x: 0,
            y: 0,
            endX: 0,
            endY: 0
        },
        /**
         * 移动结束保存坐标
         */
        movingUp: {
            x: 0,
            y: 0
        }
    }

    componentDidMount() {
        window.addEventListener('mousemove', this._onMouseMove.bind(this), false)
        window.addEventListener('mouseup', this._onMouseUp.bind(this), false)
        this._initialPositionCentered();
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this._onMouseMove.bind(this), false)
        window.removeEventListener('mouseup', this._onMouseUp.bind(this), false)
    }

    /**
     * 初始化居中
     */
    private _initialPositionCentered = () => {
        const {defaultWidth, defaultHeight, showCentered} = this.props
        if (showCentered) {
            const clientWidth = document.documentElement.clientWidth;
            const clientHeight = document.documentElement.clientHeight;
            const objWidth = defaultWidth ?? 800;
            const objHeight = defaultHeight ?? 600;
            const x = (clientWidth - objWidth) / 2;
            const y = (clientHeight - objHeight) / 2;
            this.setState({
                movingXY: {
                    x: x,
                    y: y,
                    endX: x,
                    endY: y
                },
                movingUp: {
                    x: x,
                    y: y
                }
            })
        }
    }

    /**
     * 结束移动
     * @param e
     * @private
     */
    private _onMouseUp = (e: any) => {
        const {movingXY, flag} = this.state
        if (flag) {
            this.setState({
                flag: false,
                flagHead: false,
                movingUp: {
                    x: movingXY.endX,
                    y: movingXY.endY
                }
            })
        }
    }

    /**
     * 移动中
     * @param e
     * @private
     */
    private _onMouseMove = (e: any) => {
        this._onMouseMovePosition(e)
        this._onMouseMoveSize(e)
        this._onMouseMoveCursor(e)
    }

    /**
     * 移动位置
     * @param e
     * @private
     */
    private _onMouseMovePosition = (e: any) => {
        const {startXY, movingUp, flag, flagHead} = this.state
        if (flag && flagHead) {
            const midX = e.clientX - startXY.x;
            const midY = e.clientY - startXY.y;
            this.setState({
                movingXY: {
                    x: e.clientX,
                    y: e.clientY,
                    endX: movingUp.x + midX || 0,
                    endY: movingUp.y + midY || 0
                }
            })
        }
    }

    /**
     * 封装四边四角变化计算
     * @param e
     * @param boundingBox
     * @private
     */
    private _revision = (e: any, boundingBox: any) => {
        const {sizeXY} = this.state
        const {cursor, leftSize, RightSize, topSize, bottomSize} = sizeXY
        const {width, height, left, bottom, top} = boundingBox
        const size = {
            width: width,
            height: height,
            x: left,
            y: top
        }
        const types = {
            'right': () => {
                const poWidth = left + width
                const sizeWidth = e.clientX > poWidth ? width + (e.clientX - poWidth) : width - (poWidth - e.clientX)
                size.width = sizeWidth
            },
            'left': () => {
                const poWidth = left
                const sizeWidth = e.clientX > poWidth ? width - (e.clientX - poWidth) : width + (poWidth - e.clientX)
                const endX = e.clientX > poWidth ? left + (e.clientX - poWidth) : left - (poWidth - e.clientX)
                size.width = sizeWidth
                size.x = endX
            },
            'top': () => {
                const poHeight = top
                const sizeHeight = e.clientY > poHeight ? height - (e.clientY - poHeight) : height + (poHeight - e.clientY)
                const endY = e.clientY > poHeight ? poHeight + (e.clientY - poHeight) : poHeight - (poHeight - e.clientY)
                size.height = sizeHeight
                size.y = endY
            },
            'bottom': () => {
                const poHeight = bottom
                const sizeHeight = e.clientY > poHeight ? height + (e.clientY - poHeight) : height - (poHeight - e.clientY)
                size.height = sizeHeight
            }
        }
        if (cursor === 'ew-resize') {
            if (RightSize) {
                types.right()
            }
            if (leftSize) {
                types.left()
            }
        }
        if (cursor === 'ns-resize') {
            if (topSize) {
                types.top()
            }
            if (bottomSize) {
                types.bottom()
            }
        }
        if (cursor === 'nwse-resize') {
            //右下
            if (RightSize && bottomSize) {
                types.right()
                types.bottom()
            }
            //左上
            if (leftSize && topSize) {
                types.left()
                types.top()
            }
        }
        if (cursor === 'nesw-resize') {
            //右上
            if (RightSize && topSize) {
                types.right()
                types.top()
            }
            //左下
            if (leftSize && bottomSize) {
                types.left()
                types.bottom()
            }
        }
        return size;
    }

    /**
     * 控制宽度高度最小
     * @private
     */
    private _minMaxControl = (revision: any): any => {
        const {width, height} = revision
        const {movingXY} = this.state
        const {minWidth, minHeight, maxHeight, maxWidth} = this.props
        const defaultMaxMinValue = (defaultMinWidth: any = 350, defaultMinHeight: any = 350, defaultMaxWidth: any = Number.MAX_VALUE, defaultMaxHeight: any = Number.MAX_VALUE) => {
            if (width < defaultMinWidth) {
                revision.x = movingXY.endX
                revision.width = defaultMinWidth
            } else if (width > defaultMaxWidth) {
                revision.x = movingXY.endX
                revision.width = defaultMaxWidth
            }
            if (height < defaultMinHeight) {
                revision.y = movingXY.endY
                revision.height = defaultMinHeight
            } else if (height > defaultMaxHeight) {
                revision.y = movingXY.endY
                revision.height = defaultMaxHeight
            }
            return revision
        }
        return defaultMaxMinValue(minWidth, minHeight, maxWidth, maxHeight)
    }

    /**
     * 调整窗口大小
     * @param e
     * @private
     */
    private _onMouseMoveSize = (e: any) => {
        const {sizeXY, flag, flagHead, movingXY} = this.state
        if (flag && !flagHead) {
            const boundingBox = this._appWindowsModal.current?.getBoundingClientRect()
            const revision = this._minMaxControl(this._revision(e, boundingBox))
            this.setState({
                sizeXY: {
                    ...sizeXY,
                    width: revision.width,
                    height: revision.height
                },
                movingXY: {
                    ...movingXY,
                    endX: revision.x,
                    endY: revision.y
                }
            })
        }
    }

    /**
     * 根据位置改变鼠标样式
     * @param e
     * @private
     */
    private _onMouseMoveCursor = (e: any) => {
        const {flag, sizeXY} = this.state
        const hitRange = this._hitRange
        const boundingBox = this._appWindowsModal.current?.getBoundingClientRect()
        if (!flag && boundingBox) {
            const cursorX = e.clientX
            const cursorY = e.clientY
            const hitTop = cursorY <= boundingBox.top && cursorY > boundingBox.top - hitRange
            const hitBottom = cursorY >= boundingBox.bottom - hitRange && cursorY < boundingBox.bottom
            const hitLeft = cursorX >= boundingBox.left && cursorX < boundingBox.left + hitRange
            const hitRight = cursorX >= boundingBox.right - hitRange && cursorX < boundingBox.right
            let cursor = 'auto'
            if (hitTop || hitBottom || hitLeft || hitRight) {
                if ((hitRight && hitBottom) || (hitLeft && hitTop)) {
                    cursor = 'nwse-resize'
                } else if ((hitRight && hitTop) || (hitBottom && hitLeft)) {
                    cursor = 'nesw-resize'
                } else if (hitRight || hitLeft) {
                    cursor = 'ew-resize'
                } else if (hitBottom || hitTop) {
                    cursor = 'ns-resize'
                }
                e.stopPropagation()
            }
            this.setState({
                sizeXY: {
                    ...sizeXY,
                    cursor,
                    leftSize: hitLeft,
                    RightSize: hitRight,
                    topSize: hitTop,
                    bottomSize: hitBottom
                }
            }, () => {
                const elementById = document.getElementsByTagName('body')
                if (elementById?.[0]) {
                    elementById[0].style.cursor = cursor
                }
            })
        }
    }

    /**
     * 鼠标在头部按下,准备移动
     * @param e
     * @param callback
     * @private
     */
    private _onMouseDownHead = (e: any, callback: () => void) => {
        this.setState({
            flagHead: e
        }, () => {
            callback?.();
        })
    }

    /**
     * 鼠标按下,准备移动
     * @param e
     * @private
     */
    private _onMouseDown = (e: any) => {
        this.setState({
            flag: true,
            startXY: {
                x: e.clientX,
                y: e.clientY
            }
        })
    }

    /**
     * 最大最小
     * @private
     */
    private _onMinMax = (m: boolean, size: any) => {
        const {sizeXY, movingXY, movingUp} = this.state
        this.setState({
            movingUp: {
                ...movingUp,
                x: size.left,
                y: size.top
            },
            sizeXY: {
                ...sizeXY,
                width: size.width,
                height: size.height
            },
            movingXY: {
                ...movingXY,
                endX: size.left,
                endY: size.top
            }
        })
    }

    public render() {
        const {movingXY, sizeXY} = this.state
        const {show, onClose, title, hideClose, hideMinMax} = this.props
        if (this.node && show) {
            return (
                ReactDOM.createPortal(
                    <div className={'app-windows-modal'}
                         ref={this._appWindowsModal}
                         onMouseDown={this._onMouseDown}
                         style={{
                             width: sizeXY.width,
                             height: sizeXY.height,
                             left: movingXY.endX,
                             top: movingXY.endY
                         }}>
                        <WindowsModalHead onMouseInHead={this._onMouseDownHead}
                                          hideClose={hideClose}
                                          hideMinMax={hideMinMax}
                                          onMinMax={this._onMinMax}
                                          onClose={onClose}
                                          title={title}
                                          size={{
                                              width: sizeXY.width,
                                              height: sizeXY.height,
                                              left: movingXY.endX,
                                              top: movingXY.endY
                                          }}/>
                        <OverlayScrollbarsComponent
                            style={{height: sizeXY.height - 50}}
                            options={{
                                className: 'os-theme-thin-dark',
                                resize: 'none',
                                overflowBehavior: {
                                    x: 'hidden',
                                    y: 'scroll'
                                },
                                scrollbars: {
                                    autoHide: 'move',
                                    autoHideDelay: 500
                                }
                            }}>
                            <div style={{padding: 15}}>
                                {this.props.children}
                            </div>
                        </OverlayScrollbarsComponent>
                    </div>, this.node)
            );
        }
        return <React.Fragment/>
    }
}
