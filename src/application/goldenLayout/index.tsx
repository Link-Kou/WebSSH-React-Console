import * as React from 'react';
import {GoldenLayoutComponent} from './layout';
import XtermPanel, {IWebSocket} from './XtermPanel';
import LayoutContextMenuTop from './layoutContextMenuTop';
import LayoutContextMenuBottom from './layoutContextMenuBottom';
import {utilsGuid, utilsRef} from 'utilscommon';
import {Historys} from '@router';
import {Alert} from 'rsuite';
import {Terminal} from 'xterm';

/**
 *
 * @author lk
 * @date 2020/11/15 20:51
 * @version 1.0
 */
export default class GoldenLayoutIndex extends React.Component {

    private _goldenLayoutComponent = utilsRef.useRef<GoldenLayoutComponent>()

    public webSocket: IWebSocket | undefined;

    public xterm: Terminal | undefined;

    componentWillMount() {
        const {location} = this.props as any
        const {state} = location
        return;
        if (state) {
            this.webSocket = {
                endpoint: state.endpoint,
                onOpen: (webSocket, xterm, ev) => {
                    webSocket.send(JSON.stringify({
                        operate: 'connect',
                        host: state.host,
                        port: state.port,
                        username: state.username,
                        password: state.password
                    }))
                },
                onMessage(webSocket, xterm, ev) {
                    const data = ev.data.toString();
                    xterm.write(data)
                },
                onClose(webSocket, xterm, ev) {
                    xterm.write('远程连接关闭')
                },
                onError(webSocket, xterm, ev) {
                    xterm.write('连接发生错误')
                },
                onBinary(webSocket, xterm, value) {
                    if (webSocket.readyState !== 1) {
                        return;
                    }
                    const buffer = new Uint8Array(value.length);
                    for (let i = 0; i < value.length; ++i) {
                        buffer[i] = value.charCodeAt(i) & 255;
                    }
                    webSocket.send(buffer);
                },
                onData(webSocket, xterm, value) {
                    if (webSocket.readyState !== 1) {
                        return;
                    }
                    webSocket.send(JSON.stringify({'operate': 'command', 'command': value}))
                }
            }
        } else {
            Alert.warning('参数异常')
            Historys.push({
                pathname: '/login',
                search: `id=${utilsGuid.nanoid()}`,
                state: {
                    id: utilsGuid.nanoid()
                }
            })
        }
    }

    componentDidMount() {

    }

    /**
     * 新建终端
     * @param id
     */
    handleNewXterm = (id?: string) => {
        const layoutUtil = this._goldenLayoutComponent?.current?.layoutUtil();
        if (id) {
            //document.getElementById('menu-terminal-id')?.click()
            layoutUtil?.addTab(id, {
                id: utilsGuid.nanoid(),
                title: '新窗口',
                component: 'XtermPanel',
                webSocket: this.webSocket
            })
        } else {
            layoutUtil?.addTabs({
                id: utilsGuid.nanoid(),
                title: '新窗口',
                component: 'XtermPanel',
                webSocket: this.webSocket
            })
        }
    }

    /**
     * 复制
     */
    handleCopey = () => {
        const selection = this.xterm?.getSelection() ?? ''
        navigator.clipboard.writeText(selection);
        Alert.success('复制成功')
    }

    /**
     * 粘贴
     */
    handlePaste = () => {
        //需要权限
        navigator.clipboard.readText().then(clipText => {
            this.xterm?.write(clipText);
        })
    }


    render() {
        return (
            <div>
                <LayoutContextMenuTop onNewTerminal={this.handleNewXterm}
                                      onPaste={this.handlePaste}
                                      onCopy={this.handleCopey}/>
                <GoldenLayoutComponent
                    ref={this._goldenLayoutComponent}
                    onNewXterm={this.handleNewXterm}
                    onFocus={(id, xterm) => {
                        this.xterm = xterm;
                    }}
                    containerStyle={{height: 'calc(100vh - 47px)', width: '100%'}}
                    fill={true}
                    config={{
                        settings: {
                            showPopoutIcon: false,
                            showMaximiseIcon: false,
                            showCloseIcon: false
                        },
                        content: [
                            {
                                type: 'row',
                                content: [
                                    {
                                        id: 'zd1',
                                        title: '终端',
                                        type: 'react-component',
                                        component: 'XtermPanel',
                                        webSocket: this.webSocket
                                    }
                                ]
                            }
                        ]
                    }}
                    registerComponent={[{
                        name: 'XtermPanel',
                        component: XtermPanel
                    }]}
                />
                <LayoutContextMenuBottom/>
            </div>
        )
    }
}
