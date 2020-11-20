import * as React from 'react';
import ReactDOM from 'react-dom';


interface IProps {
    event: any
    width: number
    height: number
}

/**
 * 创建上下文右键菜单
 * @author lk
 * @date 2020/11/17 13:55
 * @version 1.0
 */
export default class LayoutContextMenuRight extends React.Component<IProps> {

    public node: HTMLDivElement | null | undefined = undefined;

    public _input: HTMLInputElement | null | undefined = undefined;

    private _autoClose: boolean = true;

    public state = {
        left: 0,
        top: 0
    }

    /**
     * 获取到位置
     */
    _position = () => {
        const {event, width, height} = this.props
        // clientX/Y 获取到的是触发点相对于浏览器可视区域左上角距离
        const clickX = event.clientX
        const clickY = event.clientY
        // window.innerWidth/innerHeight 获取的是当前浏览器窗口的视口宽度/高度
        const screenW = window.innerWidth
        const screenH = window.innerHeight
        // 获取自定义菜单的宽度/高度
        const rootW = width
        const rootH = height
        // right为true，说明鼠标点击的位置到浏览器的右边界的宽度可以放下菜单。否则，菜单放到左边。
        // bottom为true，说明鼠标点击位置到浏览器的下边界的高度可以放下菜单。否则，菜单放到上边。
        const right = (screenW - clickX) > rootW
        const left = !right
        const bottom = (screenH - clickY) > rootH
        const top = !bottom
        if (right) {
            this.setState({
                left: clickX
            })
        }
        if (left) {
            this.setState({
                left: clickX - rootW
            })
        }
        if (bottom) {
            this.setState({
                top: clickY
            })
        }
        if (top) {
            this.setState({
                top: clickY - rootH
            })
        }
    }

    _create = () => {
        document.getElementById('LayoutContextMenu')?.remove();
        const htmlDivElement = document.createElement('div');
        htmlDivElement.setAttribute('id', 'LayoutContextMenu')
        this.node = document.getElementById('root')?.parentElement?.insertBefore(htmlDivElement, document.getElementById('root'))
    }

    /**
     * 关闭
     */
    _close = () => {
        this.node?.remove();
    }

    _focus = () => {
        this._input?.focus()
        this._input?.select()
    }

    componentDidMount() {
        this._create();
        this._position();
    }

    render() {
        const {left, top} = this.state
        const {width, height} = this.props
        if (this.node) {
            return (
                ReactDOM.createPortal(
                    <div
                        onMouseMove={() => {
                            this._autoClose = false
                        }}
                        onMouseOut={() => {
                            this._autoClose = true
                            this._focus();
                        }}
                        style={{
                            position: 'absolute',
                            left,
                            top,
                            width,
                            height,
                            zIndex: 9,
                            overflow: 'hidden'
                        }}>
                        <input ref={(ref) => this._input = ref}
                               style={{
                                   position: 'absolute',
                                   top: -35
                               }}
                               autoFocus={true}
                               onBlur={() => {
                                   if (this._autoClose) {
                                       this._close()
                                   }
                               }}/>
                        {React.Children.map(this.props.children, (child: any) => {
                            return React.cloneElement(child, {
                                onClose: this._close
                            });
                        })}
                    </div>
                    , this.node)
            )
        }
        return <React.Fragment/>
    }
}
