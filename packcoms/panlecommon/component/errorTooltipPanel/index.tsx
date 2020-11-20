import * as React from 'react';
import {ErrorMessage} from 'rsuite';
import {TypeAttributes} from 'rsuite/lib/@types/common';

interface IProps {

    show?: boolean

    errorMessage?: string

    placement?: TypeAttributes.Placement8;
}

/**
 * 错误提示面板
 * @author lk
 * @date 2020/7/30 10:48
 * @version 1.0
 */
export default class index extends React.Component<IProps> {

    public render() {
        const {show, errorMessage, placement} = this.props
        return (
            <div className={'rs-form-control-wrapper'}>
                {this.props.children}
                <ErrorMessage show={show} placement={placement ?? 'bottomStart'}>
                    {errorMessage ?? ''}
                </ErrorMessage>
            </div>
        );
    }
}
