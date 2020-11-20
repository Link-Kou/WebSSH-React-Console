import * as React from 'react';
import {default as WindowsModalUI} from './windowsModal';
import './index.scss'

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

    title?: string

    /**
     * 是否显示在居中
     */
    showCentered?: boolean

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


    public state = {
        show: true
    }

    public _onClose = () => {
        this.setState({
            show: false
        })
    }

    public render() {
        const {show} = this.state
        return (
            <WindowsModalUI {...this.props} show={show} onClose={this._onClose}>
                {this.props.children}
            </WindowsModalUI>
        )
    }
}
