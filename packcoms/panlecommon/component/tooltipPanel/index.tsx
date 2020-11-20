import * as React from 'react';
import {Tooltip, Whisper} from 'rsuite';

interface IProps {
    /**
     * 标题
     */
    title?: any
}

/**
 *
 * @author lk
 * @date 2020/4/18 23:32
 * @version 1.0
 */
export default class index extends React.PureComponent<IProps> {

    render() {
        const {title} = this.props
        return (
            <Whisper placement="bottomStart" trigger="hover" speaker={
                <Tooltip>
                    <b>{title}</b>
                </Tooltip>
            }>
                {this.props.children}
            </Whisper>
        )
    }
}
