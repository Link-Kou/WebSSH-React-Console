import * as React from 'react';
import './layoutContextMenuBottom.scss'

/**
 * 低部菜单
 * @author lk
 * @date 2020/11/19 09:16
 * @version 1.0
 */
export default class LayoutContextMenuBottom extends React.Component {

    render() {
        return (
            <div id={'layoutContextMenuBottom'}>
                <div>命令终端</div>
                <div className={'right'}>
                    <div><span>1</span>,<span>1</span></div>
                    <div><span>1</span>Rows</div>
                    <div><span>1</span>Cols</div>
                </div>
            </div>
        );
    }
}
