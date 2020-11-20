import * as React from 'react';
import './layoutContextMenuRightCompone.scss'

interface IProps {
    /**
     * 关闭菜单
     */
    onClose?(): void

    /**
     * 清理
     */
    onClear?(): void

    /**
     * 复制
     */
    onCopy?(): void

    /**
     * 粘贴
     */
    onPaste?(): void

    /**
     * 查找
     */
    onFind?(): void
}

/**
 * 创建上下文菜单
 * @author lk
 * @date 2020/11/17 13:55
 * @version 1.0
 */
export default class LayoutContextMenuRightCompone extends React.Component<IProps> {

    componentDidMount() {

    }

    render() {
        const {onClose, onCopy, onPaste, onFind, onClear} = this.props
        return (
            <div className={'layoutContextMenuRightCompone'}>
                <ul>
                    <li onClick={() => {
                        onCopy?.()
                        onClose?.()
                    }}>复制
                    </li>
                    <li onClick={() => {
                        onPaste?.()
                        onClose?.()
                    }}>粘贴
                    </li>
                    <li onClick={() => {
                        onClear?.()
                        onClose?.()
                    }}>清屏
                    </li>
                    <li onClick={() => {
                        onFind?.()
                        onClose?.()
                    }}>查找
                    </li>
                </ul>
            </div>
        )
    }
}
