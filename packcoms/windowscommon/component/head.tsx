import * as React from 'react';
import {Icon} from 'rsuite';

interface IProps {
    /**
     * 鼠标在标题处
     * @param e
     * @param callback
     */
    onMouseInHead?(e: any, callback?: () => void): void

    /**
     * 关闭
     */
    onClose?(): void

    /**
     * 最大最小
     * @param m
     * @param size
     */
    onMinMax?(m: boolean, size: any): void

    /**
     * 大小
     */
    size?: any

    title?: any

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
 * @date 2020/7/27 19:45
 * @version 1.0
 */
const WindowsModalHead = (props: IProps) => {
    const {onClose, onMouseInHead, title} = props
    const [minmax, setMinmax] = React.useState(true)
    const [oldsize, setOldsize] = React.useState<any>()


    const _head: any = React.useRef()

    /**
     * 鼠标按下-准备移动
     * @param e
     * @private
     */
    const _onMouseUp = (e: any) => {
        onMouseInHead?.(false)
    }

    /**
     * 鼠标按下-准备移动
     * @param e
     * @private
     */
    const _onMouseDown = (e: any) => {
        onMouseInHead?.(true, () => {
            const elementsByClassName: any = document.getElementsByClassName('app-windows-modal');
            for (let i = 0; i < elementsByClassName.length; i++) {
                elementsByClassName[i].style.zIndex = 999
            }
            const parentNode = (_head.current as any)?.parentNode
            if (parentNode) {
                parentNode.style.zIndex = 1000
            }
        })
    }

    /**
     * 最大/小化
     */
    const _onMinMax = () => {
        const {size, onMinMax} = props
        let maxminSize = oldsize
        if (minmax) {
            maxminSize = {
                width: window.innerWidth - 20,
                height: window.innerHeight - 20,
                left: 10,
                top: 10
            }
        }
        setMinmax(!minmax)
        setOldsize(size)
        onMinMax?.(!minmax, maxminSize)
    }

    /**
     * 渲染头部按钮
     */
    const _returnHeadButtonMinMax = () => {
        const {hideMinMax} = props
        if (hideMinMax) {
            return <React.Fragment/>
        }
        return (
            <Icon icon={minmax ? 'window-maximize' : 'window-restore'} onClick={() => {
                _onMinMax()
            }}/>
        );
    }

    /**
     * 渲染头部按钮
     */
    const _returnHeadButtononClose = () => {
        const {hideClose} = props
        if (hideClose) {
            return <React.Fragment/>
        }
        return (
            <Icon icon={'window-close'}
                  onClick={() => {
                      onClose?.()
                  }}
            />
        );
    }

    return (
        <div ref={_head} className={'app-windows-modal-head'}
             onMouseUp={_onMouseUp}
             onMouseDown={_onMouseDown}>
            <div className={'app-windows-modal-head-icons'}><Icon icon={'windows'}/></div>
            <div className={'app-windows-modal-head-title'}>{title ?? '新建窗口'}</div>
            <div className={'app-windows-modal-head-button'}>
                {_returnHeadButtonMinMax()}
                {_returnHeadButtononClose()}
            </div>
        </div>
    )
}
export default WindowsModalHead
