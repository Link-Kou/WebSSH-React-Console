import * as React from 'react';
import {Avatar, Badge, Button, Icon, Popover, Whisper} from 'rsuite';
import HookFullScreen from './compone/hookFullScreen';

export default class NavHeadTool extends React.Component {

    componentDidMount() {

    }

    public render() {
        return (
            <>
                <HookFullScreen/>
                <div className="app-head-tool-column" id={'app-tool-comments'} onClick={() => {
                }}>
                    <Badge content={55} maxCount={99}>
                        <Avatar style={{backgroundColor: '#87d068'}} size={'xs'}>
                            <Icon icon={'comments'}/>
                        </Avatar>
                    </Badge>
                </div>
                <Whisper
                    trigger="active"
                    placement='bottom'
                    speaker={
                        <Popover title="">
                            <Button type="dashed" style={{right: '0px'}} onClick={() => {

                            }}>
                                退出登录
                            </Button>
                            <br/>
                            <Button type="dashed" style={{right: '0px'}} onClick={() => {

                            }}>
                                修改密码
                            </Button>
                        </Popover>
                    }
                >
                    <div className="app-head-tool-column">
                        <Badge content={55} maxCount={99}>
                            <Avatar style={{background: '#edfae1', color: '#4caf50'}} size={'xs'}>RS</Avatar>
                        </Badge>
                    </div>
                </Whisper>
            </>
        )
    }
}
