import {Avatar, Icon} from 'rsuite';
import * as React from 'react';
import {useFullscreen} from 'ahooks';

/**
 *
 * @author lk
 * @date 2020/7/27 16:21
 * @version 1.0
 */
const HookFullScreen = () => {
    const [fullScreen, setFullScreen] = React.useState(false);
    const [, {toggleFull}] = useFullscreen(() => document.documentElement, {
        onFull: () => {
            setFullScreen(true)
        },
        onExitFull: () => {
            setFullScreen(false)
        }
    });
    return (
        <div className="app-head-tool-column" onClick={toggleFull}>
            <Avatar style={{backgroundColor: '#fff', color: '#87d068'}} size={'xs'}>
                <Icon icon={fullScreen ? 'compress' : 'expand'}/>
            </Avatar>
        </div>
    )
}

export default HookFullScreen
