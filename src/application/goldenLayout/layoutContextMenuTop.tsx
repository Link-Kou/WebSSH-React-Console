import * as React from 'react';
import './layoutContextMenuTop.scss'

interface IProps {
    onNewTerminal?(): void
}

/**
 * 顶部菜单
 * @author lk
 * @date 2020/11/19 09:16
 * @version 1.0
 */
export default class LayoutContextMenuTop extends React.Component<IProps> {

    render() {
        const {onNewTerminal} = this.props
        return (
            <div id={'layoutContextMenuTop'}>
                <ul className={'menutop-leve-1'}>
                    <li/>
                    <li>
                        文件
                        <ul className={'menutop-leve-2'}>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>新建文件</div>
                                <div className={'keyword'}/>
                            </li>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>新建文件夹</div>
                                <div className={'keyword'}/>
                            </li>
                        </ul>
                    </li>
                    <li>
                        编辑
                        <ul className={'menutop-leve-2'}>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>复制</div>
                                <div className={'keyword'}>Ctrl Shift C</div>
                            </li>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>粘贴</div>
                                <div className={'keyword'}>Ctrl Shift V</div>
                            </li>
                        </ul>
                    </li>
                    <li>
                        视图
                    </li>
                    <li>
                        终端
                        <ul className={'menutop-leve-2'}>
                            <li onClick={() => onNewTerminal?.()}>
                                <div className={'icons'}/>
                                <div className={'title'}>新建终端</div>
                                <div className={'keyword'}>Ctrl Shift N</div>
                            </li>
                        </ul>
                    </li>
                    <li>
                        会话
                        <ul className={'menutop-leve-2'}>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>会话管理</div>
                                <div className={'keyword'}>⇧ ⌘ 8</div>
                            </li>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>会话列表</div>
                                <div className={'keyword'}>⇧ ⌘ 8</div>
                            </li>
                        </ul>
                    </li>
                    <li>
                        帮助
                        <ul className={'menutop-leve-2'}>
                            <li>
                                <div className={'icons'}/>
                                <div className={'title'}>关于</div>
                                <div className={'keyword'}/>
                            </li>
                        </ul>
                    </li>
                </ul>
                <ul className={'menutop-leve-1 right'}>
                    <li>192.168.1.1</li>
                    <li>用户名:LK</li>
                </ul>
            </div>
        );
    }
}
