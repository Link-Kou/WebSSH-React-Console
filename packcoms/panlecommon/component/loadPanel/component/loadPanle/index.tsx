import * as React from 'react';
import QueueAnim from 'rc-queue-anim';
import {FlexCalcBox, LoaderIcons} from '../../../../index';
import {Svg} from '../../../svg';

interface IProps {

    /**
     * 是否加载中
     * true 显示
     * false 不显示
     */
    loadering?: boolean

    /**
     * 加载Loding
     * @param loadering 是否加载
     * @param value 标题
     * @param value.title 标题
     * @param value.hideLoaderIcons 是否隐藏图标
     * @param value.hide 是否隐藏控件
     */
    onLoader?(loadering: boolean, value: { title: string, hideLoaderIcons: boolean, hide: boolean }): { title: string, hideLoaderIcons: boolean, hide: boolean }

    /**
     * 显示子控件
     */
    onShow?(): void

    subHeight?: number

    height?: number

    /**
     * 是否进行外部渲染
     */
    outrender?: boolean

    /**
     * 是否进行动画关闭
     */
    queueAnim?: boolean

}


interface IPriProps extends IProps {

    title?: string,

    /**
     * 隐藏 Loader 组件
     */
    hideLoaderComponent?: boolean

}

export default class Index extends React.Component<IProps> {


    private _QueueAnim = (queueAnim: boolean = true) => {
        const {onShow} = this.props
        onShow?.()
        if (queueAnim) {
            return (
                <QueueAnim type={['alpha', 'right']}
                           leaveReverse={true}
                           ease={['easeInOutQuad', 'easeInBack']}>
                    <div key='a'>
                        {this.props.children}
                    </div>
                </QueueAnim>
            )
        }
        return this.props.children
    }

    /**
     * 加载Icons
     * @param title
     * @param hideLoaderComponent
     * @private
     */
    private _Loader(title: string, hideLoaderComponent: boolean = false) {
        return (
            <div style={{position: 'relative', textAlign: 'center', top: '50%'}}>
                {hideLoaderComponent ? undefined : <LoaderIcons/>}
                <p style={{marginTop: hideLoaderComponent ? 0 : 30, color: '#d6d6d6'}}>
                    {hideLoaderComponent ? <><Svg.RedataCompon size={'2x'}/><br/></> : undefined}
                    {title}
                </p>
            </div>
        )
    }

    /**
     * FlexCalcBox 外部渲染
     * @param props
     */
    private outrender(props: IPriProps = {loadering: true}) {
        const {loadering, title, subHeight, height, queueAnim, hideLoaderComponent} = props
        //const _subHeight = _.isNumber(subHeight) ? subHeight : 58
        const _title = title ?? '页面初始化中,请稍后....'
        return (
            loadering ?
                <FlexCalcBox height={height} subHeight={subHeight} overflow={'auto'} Body={(e) => (
                    <>
                        {this._Loader(_title, hideLoaderComponent)}
                    </>
                )}/>
                :
                this._QueueAnim(queueAnim)
        )
    }

    /**
     * FlexCalcBox 内部渲染
     * @param props
     */
    private inrender(props: IPriProps = {loadering: true}) {
        const {loadering, title, subHeight, height, queueAnim, hideLoaderComponent} = props
        const _title = title ?? '页面初始化中,请稍后....'
        return (
            <FlexCalcBox height={height} subHeight={subHeight} overflow={'auto'} Body={(e) => (
                loadering ?
                    <>
                        {this._Loader(_title, hideLoaderComponent)}
                    </>
                    :
                    this._QueueAnim(queueAnim)
            )}/>
        )
    }

    private onLoadering(loader: boolean = true, callback: () => any) {
        const {onLoader, outrender} = this.props
        const _loadering = loader
        if (onLoader) {
            const {title, hideLoaderIcons, hide} = onLoader(_loadering, {
                title: '页面初始化中,请稍后....', hideLoaderIcons: false, hide: _loadering
            });
            const newProps = {
                ...this.props,
                loadering: hide,
                title: title,
                hideLoaderComponent: hideLoaderIcons
            }
            return outrender ? this.outrender(newProps) : this.inrender(newProps)
        }
        return callback?.()
    }


    public render() {
        const {loadering, outrender} = this.props
        return this.onLoadering(loadering, () => {
            const newProps = {
                ...this.props,
                loadering: loadering,
                title: '页面初始化中,请稍后....'
            }
            return outrender ? this.outrender(newProps) : this.inrender(newProps)
        });
    }
}
