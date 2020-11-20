import * as React from 'react';
import './logo.scss'
import Listener from '../../listener';

interface IProps {
    collapsed?: boolean
}

export default class NavLogo extends React.Component<IProps> {

    public _deviceEventEmitter: any

    public state = {
        collapsed: this.props.collapsed ?? false
    }

    public componentDidMount(): void {
        this._deviceEventEmitter = PubSub.subscribe(Listener.NavMenuSidenav, this._OnCollapsed.bind(this));
    }

    public componentWillMount(): void {
        PubSub.unsubscribe(this._deviceEventEmitter);
    }

    /**
     * 打开关闭
     * @private
     */
    public _OnCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }

    public render() {
        const {collapsed} = this.state
        return (
            <div className="app-head-user-info">
                {collapsed ? <img src={'https://via.placeholder.com/56x57.png/1A3753/808080?text=LOGO'} alt={''}/> :
                    <img src={'https://via.placeholder.com/256x57.png/1A3753/808080?text=LOGO'} alt={''}/>}
            </div>
        )
    }

}
