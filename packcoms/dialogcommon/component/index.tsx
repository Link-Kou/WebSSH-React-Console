import * as React from 'react';
import ReactDOM from 'react-dom';
import {Button, Modal, Progress} from 'rsuite';
import {WindowsModal} from 'windowscommon';
import {LoaderIcons} from 'panlecommon';
import BigNumber from 'bignumber.js';


const {Line} = Progress;

interface IDialog {
    title: any
}

interface IDialogLoad extends IDialog {
    callback(e: { close(): void }): void
}

interface IDialogSelect extends IDialog {
    boby: any

    callback(data: boolean): void
}

interface IDialogSelectLoad extends IDialog {
    boby: any

    callback(props: { success: boolean, close: (CloseCallback?: () => void) => void }): void
}

export default class Dialog {

    /**
     * 对话框-加载框
     * @constructor
     */
    public static Load(props: IDialogLoad) {
        const node: HTMLDivElement = document.createElement('div');

        class DialogLoadModal extends React.Component<IDialogLoad> {
            public state = {
                show: true
            }

            public _setClose = () => {
                this.setState({
                    show: false
                })
            }

            public render() {
                const {show} = this.state
                const {title, callback} = this.props
                if (callback) {
                    callback({
                        close: this._setClose
                    })
                }
                return (
                    <Modal show={show} size={'xs'} backdrop={'static'} onHide={() => {
                        this.setState({
                            show: false
                        })
                    }}>
                        <Modal.Header closeButton={false}/>
                        <Modal.Body>
                            <div style={{textAlign: 'center', marginBottom: 15}}>{title}</div>
                            <LoaderIcons/>
                        </Modal.Body>
                        <Modal.Footer/>
                    </Modal>
                )
            }
        }

        ReactDOM.render(<DialogLoadModal {...props}/>, node)
    }

    /**
     * 对话框-选择框
     * @constructor
     */
    public static Select(props: IDialogSelect) {
        const node: HTMLDivElement = document.createElement('div');

        class DialogSelectModal extends React.Component<IDialogSelect> {
            public state = {
                show: true
            }

            public _setClose() {
                this.setState({
                    show: false
                })
            }

            public _setCallBackClose(bool: boolean) {
                const {callback} = this.props
                this.setState({
                    show: false
                }, () => {
                    if (callback) {
                        callback(bool)
                    }
                })
            }

            public render() {
                const {show} = this.state
                const {title, boby} = this.props
                return (
                    <Modal show={show} size={'xs'} backdrop={'static'} onHide={() => {
                        this._setCallBackClose(false)
                    }}>
                        <Modal.Header>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {typeof boby === 'function' ? boby && boby() : boby}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button appearance="primary" onClick={() => {
                                this._setCallBackClose(true)
                            }}>
                                确定
                            </Button>
                            <Button appearance="subtle" onClick={() => {
                                this._setCallBackClose(false)
                            }}>
                                取消
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        }


        ReactDOM.render(<DialogSelectModal {...props}/>, node)
    }


    public static SelectLoad(props: IDialogSelectLoad) {

        const node: HTMLDivElement = document.createElement('div');


        class DialogSelectModal extends React.Component<IDialogSelectLoad> {

            public percentval: any;

            public timeOut: string = String(process.env.REACT_APP_TimeOut)

            public state = {
                title: this.props.title,
                show: true,
                loading: false,
                percent: 0,
                percentIng: String(process.env.REACT_APP_TimeOut)
            }

            public _setClose(CloseCallback?: () => void) {
                if (this.percentval) {
                    clearInterval(this.percentval)
                }
                setTimeout(() => {
                    this.setState({
                        show: false,
                        percent: 100
                    }, () => {
                        setTimeout(() => {
                            CloseCallback?.()
                        }, 500)
                    })
                }, 500)
            }

            public _setBackClose(bool: boolean) {
                this.setState({
                    show: false
                })
            }

            public _setLoading() {
                this.setState({
                    loading: true,
                    title: '正在请求服务器'
                }, () => {

                    this.percentval = setInterval(() => {
                        const {percentIng} = this.state
                        const timeOut = new BigNumber(this.timeOut)
                        const percent = new BigNumber(percentIng).minus(100)
                        const bf: any = percent.div(timeOut).dp(2, BigNumber.ROUND_DOWN).multipliedBy(100)
                        const percenting = new BigNumber(100).minus(bf).toNumber();
                        if (percenting > 99) {
                            clearInterval(this.percentval)
                            this.setState({
                                loading: false
                            })
                        } else {
                            this.setState((state: any) => {
                                return ({
                                    percent: percenting,
                                    percentIng: percent.toNumber()
                                })
                            })
                        }
                    }, 100)
                    this.props?.callback({
                        success: true,
                        close: this._setClose.bind(this)
                    })
                })
            }


            public bodys() {
                const {loading, percent} = this.state
                const {boby} = this.props
                if (loading) {
                    return (
                        <Line percent={percent}
                              status='active'/>
                    )
                }
                return typeof boby === 'function' ? boby && boby() : boby
            }

            public render() {
                const {show, loading, title} = this.state
                return (
                    <Modal show={show} size={'xs'} backdrop={'static'} onHide={() => {
                        this._setBackClose(false)
                    }}>
                        <Modal.Header closeButton={!loading}>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.bodys()}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button appearance="primary" loading={loading} onClick={() => {
                                this._setLoading()
                            }}>
                                确定
                            </Button>
                            <Button appearance="subtle" disabled={loading} onClick={() => {
                                this._setBackClose(false)
                            }}>
                                取消
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )
            }
        }


        ReactDOM.render(<DialogSelectModal {...props}/>, node)
    }

    /**
     * 浮动窗口
     */
    public static FloatWindows(props: { path: any, routes: Array<{ path: string, screen: any }>, title?: string }) {
        const {path, title, routes} = props
        const node: HTMLDivElement = document.createElement('div');
        //无标签创建
        routes.every((k, i, a) => {
            if (path === k.path) {
                const Screen: any = k.screen;
                ReactDOM.render(<WindowsModal title={title}>
                    <Screen/>
                </WindowsModal>, node)
                return false;
            }
            return true;
        })
    }
}




