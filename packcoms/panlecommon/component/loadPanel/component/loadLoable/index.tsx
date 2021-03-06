import * as Loadable from 'react-loadable';
import * as NProgress from 'nprogress';
import * as React from 'react';
import {IconButton, Icon} from 'rsuite';
import {LoaderIcons} from '../../index';

export const component = (props: Loadable.LoadingComponentProps, text: string) => {
    return (
        <div style={{
            position: 'relative',
            margin: '0px auto',
            height: 'calc(100vh - 60px)',
            width: '350px'
        }}>
            <div style={{
                position: 'relative',
                textAlign: 'center',
                top: 'calc(50% - 65px)',
                height: '65px'

            }}>
                <LoaderIcons/>
                <p style={{color: '#ababab'}}>
                    {text}
                </p>
                {
                    !props.isLoading ?
                        <IconButton icon={<Icon icon={'refresh'}/>} onClick={props.retry}/> : null
                }
            </div>
        </div>
    )
}

export const LoadLoableProps = (props: Loadable.LoadingComponentProps) => {
    if (props.isLoading) {
        NProgress.start()
        return component(props, '页面加载中...')
    }
    if (props.timedOut) {
        NProgress.done()
        return component(props, '页面加载超时!请进行浏览器刷新....')
    }
    if (props.pastDelay) {
        return component(props, '页面加载异常!请进行浏览器刷新....')
    }
    if (props.error) {
        NProgress.done()
        return component(props, '网络异常!请检查网络后,请进行浏览器刷新...')
    }
    return null
}
