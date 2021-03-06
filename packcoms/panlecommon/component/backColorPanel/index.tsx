import * as React from 'react';
import './index.scss'
import classNames from 'classnames';

interface IProps {
    style?: React.CSSProperties;
    tableBordered?: boolean

    panelHeadPadding?: boolean

    panelBodyPadding?: boolean

    delay?: boolean
}

/**
 * 背景颜色面板
 * @author lk
 * @date 2021/01/01 10:28
 * @version 1.0
 */
export default class Index extends React.Component<IProps> {

    public state = {
        show: !this.props.delay
    }

    public render() {
        const delay = this.props.delay;
        if (delay) {
            setTimeout(() => {
                this.setState({
                    show: true
                })
            }, 300)
        }
        const {style, tableBordered, panelHeadPadding, panelBodyPadding} = this.props
        const className = classNames({
            'app-backcolor-panel': true,
            'app-backcolor-panel-table': tableBordered,
            'app-backcolor-panel-head': panelHeadPadding,
            'app-backcolor-panel-body': panelBodyPadding
        });
        return (
            <div className={className} style={style}>
                {this.state.show ? this.props.children : null}
            </div>
        )
    }
}
