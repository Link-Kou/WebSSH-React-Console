import * as React from 'react';

import './index.scss'
import {Historys} from '@router';
import {utilsGuid} from 'utilscommon';

export default class Main extends React.Component {

    public render() {
        setTimeout(() => {
            Historys.push({
                pathname: '/login',
                search: `id=${utilsGuid.nanoid()}`,
                state: {
                    id: utilsGuid.nanoid()
                }
            })
        }, 2500)
        return (
            <div style={{height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{fontSize: 34, marginTop: 47}}>
                        <p style={{float: 'left', marginLeft: -28}}>欢迎使用</p>
                    </div>
                </div>
            </div>
        )
    }
}

