import * as React from 'react';
import './body.scss'

/**
 * body
 */
export default class Index extends React.Component {

    public state = {}

    public render() {
        return (
            <div id={'app-body-full'} className='app-body'>
                <div className='app-nav-Body'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
