import * as React from 'react';
import {IntlProvider as RsIntlProvider} from 'rsuite';
import {IntlProvider, useIntl} from 'react-intl';
import CN from '.././config/zh_cn';
import zhCN from 'rsuite/lib/IntlProvider/locales/zh_CN';

interface IIntlProps {
    nors: boolean
}

/**
 *
 * @author lk
 * @date 2020/4/16 15:30
 * @version 1.0
 */
export class IntlCompone extends React.Component<IIntlProps> {

    public render() {
        const {nors} = this.props
        return (
            nors ?
                (<IntlProvider locale="zh" messages={CN}>{this.props.children}</IntlProvider>)
                : (
                    <IntlProvider locale="zh" messages={CN}>
                        <RsIntlProvider locale={zhCN}>
                            {this.props.children}
                        </RsIntlProvider>
                    </IntlProvider>
                )
        )
    }
}

interface IHookFormattedMessageTextProps {
    id?: string
    other?: any
}

/**
 * 多语言 HOOK 组件
 * @param props
 * @constructor
 */
const HookFormattedMessageText = (props: IHookFormattedMessageTextProps) => {
    const {formatMessage: f} = useIntl();
    const {id, other} = props
    return <>{f({id}, other)}</>
}

interface IPropsMsg {
    IsDelBody(value?: string): void

    IsHideBody(value?: string): void
}

export function OPSMsg(name: string, other?: any): React.ReactElement
export function OPSMsg(name?: string, other?: any): IPropsMsg
/**
 *
 * @param name
 * @param other
 * @param nors
 * @constructor
 */
export function OPSMsg(name: any, other: any): any | IPropsMsg {
    if (name) {
        return (
            <IntlCompone nors={true}>
                <HookFormattedMessageText id={name} other={other}/>
            </IntlCompone>
        )
    }
    return {
        IsDelBody: (value: any) => OPSMsg('OPS_isDelBody', {name: <b><i>{value}</i></b>}),
        IsHideBody: (value: any) => OPSMsg('OPS_isHideBody', {name: <b><i>{value}</i></b>})
    }
}
