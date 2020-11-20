import * as React from 'react';
import HeadTabs from './component/tabs'
import HeadTool from './component/tool'
import './head.scss'
import {IRoute} from '../../index.type';



interface IProps {
    showTabs?: boolean
    routes?: Array<IRoute>
}

export default class Index extends React.Component<IProps> {

    public state = {
        showTabs: this.props.showTabs
    }

    public render() {
        const {showTabs} = this.state;
        const {routes} = this.props;
        return (
            <div className='app-header'>
                {showTabs ? <HeadTabs routes={routes ?? []}/> : null}
                <HeadTool>
                    {this.props.children}
                </HeadTool>
            </div>
        )
    }
}
