import * as React from 'react';
import {Terminal} from 'xterm';
import {FitAddon} from 'xterm-addon-fit'
import {Unicode11Addon} from 'xterm-addon-unicode11';
import {SearchAddon} from 'xterm-addon-search';
import LayoutContextMenuRight from './layoutContextMenuRight';
import ReactDOM from 'react-dom';
import LayoutContextMenuRightCompone from './layoutContextMenuRightCompone';
//import ansiEscapes from 'ansi-escapes';
import 'xterm/css/xterm.css'
import {WindowsModal} from 'windowscommon';
import XtermPanelFindCompone from './XtermPanelFindCompone';

interface IProps {

    /**
     * 监听Tab大小变化
     * @param id
     * @param fc
     */
    onListenResize?(id: string, fc: (width: number) => void): void

    /**
     * 光标位置
     * @param props
     */
    onCursorMove?(props: { x: number, y: number, width: number, height: number, col: number, row: number }): void

    /**
     * 获取焦点
     * @param id
     * @param xterm
     */
    onFocus?(id: string, xterm: Terminal): void

    /**
     * 新建终端
     * @param id
     */
    onNewXterm?(id: string): void

    [x: string]: any
}

export interface IWebSocket {
    endpoint: string

    onOpen(webSocket: WebSocket, xterm: Terminal, ev: Event): void

    onMessage(webSocket: WebSocket, xterm: Terminal, ev: MessageEvent): void

    onClose(webSocket: WebSocket, xterm: Terminal, ev: CloseEvent): void

    onError(webSocket: WebSocket, xterm: Terminal, ev: Event): void

    onBinary(webSocket: WebSocket, xterm: Terminal, value: String): void

    onData(webSocket: WebSocket, xterm: Terminal, value: String): void
}

/**
 * 控制台
 * @author lk
 * @date 2020/11/15 20:51
 * @version 1.0
 */
export default class XtermPanel extends React.Component<IProps, any> {

    private xterm: Terminal | undefined;
    private fitAddon: FitAddon | undefined;
    private searchAddon: SearchAddon | undefined;

    private container: HTMLDivElement | null | undefined;

    public state = {
        width: '100%',
        webSocket: undefined
    };

    /* setValue = (e: any) => {
         this.setState({value: e.target.value});
     };

     setContainerTitle = () => {
         this.props.glContainer.setTitle(this.state.value);
     };*/

    private _debounce: any = undefined
    _onResize = () => {
        if (this._debounce) {
            clearTimeout(this._debounce);
        }
        this._debounce = setTimeout(() => {
            this.fitAddon?.fit();
            const proposeDimensions: any = this.fitAddon?.proposeDimensions();
            this.xterm?.resize(proposeDimensions.cols, proposeDimensions.rows);
        }, 500)
    }

    /**
     *
     */
    componentDidMount() {
        const {onListenResize, onCursorMove, onFocus, glContainer} = this.props
        if (this.container) {
            const id = glContainer?._config?.id ?? '';
            if (typeof id !== 'string') {
                return;
            }
            const container = this.container
            this.xterm = new Terminal({
                fontFamily: 'Menlo, "DejaVu Sans Mono", Consolas, "Lucida Console", monospace',
                fontSize: 15,
                cursorBlink: true,
                //编辑禁用
                //disableStdin: false,
                convertEol: false,
                theme: {
                    background: '#1c1c1c'
                }
            });
            this.fitAddon = new FitAddon();
            this.searchAddon = new SearchAddon();
            this.xterm.loadAddon(this.fitAddon);
            this.xterm.loadAddon(new Unicode11Addon());
            this.xterm.loadAddon(this.searchAddon);
            this.xterm.unicode.activeVersion = '11';
            this.xterm.open(container);
            //焦点事件
            this.xterm?.textarea?.addEventListener('focus', () => {
                onFocus?.(glContainer?._config?.id, this.xterm as Terminal);
            })
            //获取到光标位置
            this.xterm.onCursorMove(() => {
                const xterm: any = this.xterm;
                const cursorFrame = {
                    x: xterm.buffer.active.cursorX * xterm._core._renderService.dimensions.actualCellWidth,
                    y: xterm.buffer.active.cursorY * xterm._core._renderService.dimensions.actualCellHeight,
                    width: (this.xterm as any)._core._renderService.dimensions.actualCellWidth,
                    height: (this.xterm as any)._core._renderService.dimensions.actualCellHeight,
                    col: xterm.buffer.active.cursorX,
                    row: xterm.buffer.active.cursorY
                };
                onCursorMove?.(cursorFrame)
            })
            //组合按钮
            this.xterm.attachCustomKeyEventHandler((e) => {
                // Ctrl + Shift + C
                if (e.ctrlKey && e.shiftKey && (e.keyCode === 67)) {
                    this.handleCopey(true)
                    return false;
                }
                // Ctrl + Shift + V
                if (e.ctrlKey && e.shiftKey && (e.keyCode === 86)) {
                    this.handlePaste()
                    return false;
                }
                // Ctrl + Shift + N
                if (e.ctrlKey && e.shiftKey && (e.keyCode === 78)) {
                    this.handleNewXterm()
                    return false;
                }
                return false;
            });
            this.xterm.write('\n\x1b[G');
            this.xterm.writeln('┌──────────────────────────┐');
            this.xterm.writeln('│  ┌─────────┐             │');
            this.xterm.writeln('│  │ \x1B[34mWebSHH\x1B[0m  │ \x1B[33m2020-11-20\x1B[0m  │');
            this.xterm.writeln('│  └─────────┘             │');
            this.xterm.writeln('└──────────────────────────┘');
            this.xterm.writeln('\n\x1b[G');
            /*if (this.xterm && 1 > 2) {
                //控制光标 https://www.npmjs.com/package/ansi-escapes
                this.xterm.write(ansiEscapes.cursorUp(1) + ansiEscapes.cursorForward(10));
            }*/
            /*this.xterm.onKey((domevent, d) => {
                const ev = domevent.domEvent
                //const key = domevent.key
                const printable = (
                    !ev!!.altKey && !ev!!.ctrlKey && !ev!!.metaKey
                );
                //向左
                if (ev.keyCode === 37) {
                    //this.xterm?.write('\x1b[D')
                    //this.xterm?.write('\x1b[1D')
                }
                //删除
                if (ev.keyCode === 8) {
                    //this.xterm?.write('\b \b');
                }
                //向上
                if (ev.keyCode === 38) {
                    //this.xterm?.write('xxx');
                    return;
                }
                //向下
                if (ev.keyCode === 40) {
                    //清空当前行
                    //this.xterm?.write('\x1b[2K\r');
                    //this.xterm?.write('Hello from \x1B[33mxterm.js\x1B[0m $ ');
                    return;
                }
                if (ev.code === 'Enter') {
                    this.xterm?.writeln('');
                }
                if (!printable) {
                    //this.xterm?.write(key);
                }
            })*/
            this.fitAddon?.fit?.();
            onListenResize?.(id, (width) => {
                this.setState({
                    width
                }, () => {
                    this._onResize()
                })
            })
            this.WebSocketInitialization();
        }
    }

    componentWillMount() {
        this.xterm?.dispose();
    }

    /**
     * WebSocket 对接
     */
    WebSocketInitialization = () => {
        const {glContainer} = this.props
        const {webSocket}: { webSocket: IWebSocket } = glContainer?._config
        if (webSocket) {
            const websocket = new WebSocket(webSocket.endpoint);
            const xterm = this.xterm;
            if (xterm && websocket) {
                websocket.onopen = (e) => {
                    webSocket.onOpen(websocket, xterm, e);
                }
                websocket.onmessage = (e) => {
                    webSocket.onMessage(websocket, xterm, e)
                }
                websocket.onclose = (e) => {
                    webSocket.onClose(websocket, xterm, e)
                }
                websocket.onerror = (e) => {
                    webSocket.onError(websocket, xterm, e)
                }
                xterm.onBinary((e) => {
                    webSocket.onBinary(websocket, xterm, e)
                })
                xterm.onData((e) => {
                    webSocket.onData(websocket, xterm, e)
                })
            }
        }
    }

    /**
     * 右键菜单事件
     * @param e
     */
    handleContextMenu = (e: any) => {
        e.preventDefault();
        const node: HTMLDivElement = document.createElement('div');
        ReactDOM.render(
            <LayoutContextMenuRight event={e} height={158} width={158}>
                <LayoutContextMenuRightCompone
                    onCopy={this.handleCopey}
                    onPaste={this.handlePaste}
                    onFind={this.handleFind}
                    onClear={this.handleClear}/>
            </LayoutContextMenuRight>, node)
    }

    /**
     * 新建终端
     */
    handleNewXterm = () => {
        const {onNewXterm, glContainer} = this.props
        onNewXterm?.(glContainer?._config?.id)
    }

    /**
     * 复制事件
     */
    handleCopey = (exec?: boolean) => {
        if (exec) {
            document.execCommand('copy');
        } else {
            const selection = this.xterm?.getSelection() ?? ''
            navigator.clipboard.writeText(selection);
        }
    }

    /**
     * 粘贴事件
     */
    handlePaste = () => {
        //需要权限
        navigator.clipboard.readText().then(clipText => {
            this.xterm?.write(clipText);
        })
    }

    /**
     * 清理屏
     */
    handleClear = () => {
        this.xterm?.clear();
    }

    /**
     * 查询
     */
    handleFind = () => {
        const {glContainer} = this.props
        const {_config} = glContainer
        const node: HTMLDivElement = document.createElement('div');
        ReactDOM.render(
            <WindowsModal title={`查找 - ${_config.title}`} hideMinMax={true}
                          showCentered={true}
                          minWidth={490} minHeight={190}
                          maxWidth={800} maxHeight={200}
                          defaultWidth={490} defaultHeight={190}>
                <XtermPanelFindCompone onNext={(e) => {
                    this.searchAddon?.findNext(e);
                }} onPrev={(e) => {
                    this.searchAddon?.findPrevious(e);
                }}/>
            </WindowsModal>, node)

    }

    render() {
        const {width} = this.state
        return (
            <div id={'xtermpanle'} onContextMenu={this.handleContextMenu} style={{height: '100vh', width: width}}
                 ref={ref => (this.container = ref)}/>
        );
    }
}
