import React from 'react';
import {Popover, Whisper, Dropdown} from 'rsuite';

interface IProps {
    container?: any
    Menu?: Array<any>
    children: any
}

/**
 *
 * @author lk
 * @date 2020/5/23 23:11
 * @version 1.0
 */
const More = (props: IProps) => {

    const {container, Menu} = props

    const _trigger: any = React.useRef()

    const _onSelectMenu = (eventKey: any) => {
        _trigger?.current?.hide();
    }

    return (
        <Whisper
            placement="autoVerticalEnd"
            trigger="click"
            triggerRef={_trigger}
            container={container}
            speaker={<Popover>
                <Dropdown.Menu onSelect={_onSelectMenu}>
                    {
                        Menu?.map((k, i, a) => (
                            <Dropdown.Item eventKey={k}>{k}</Dropdown.Item>
                        ))
                    }
                </Dropdown.Menu>
            </Popover>}
        >
            {props.children}
        </Whisper>
    );
}

export default More
