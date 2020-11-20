import * as React from 'react';
import {Input} from 'rsuite';
import {FormControlBaseProps} from 'rsuite/lib/@types/common';
import {useControllableValue} from 'ahooks';

interface IPropsInputTextArea extends FormControlBaseProps<any> {
    /**
     * 限制行
     */
    rows?: number
    /**
     * 最大长度
     */
    maxLenght?: number

    onChange?: (v: any) => void
}

const style: React.CSSProperties = {
    position: 'absolute',
    right: 6,
    bottom: 0,
    color: '#c6c6c6'
}


/**
 * 自定义多行文本字数控制
 * @author lk
 * @date 2020/4/20 15:55
 * @version 1.0
 */
const index = (props: IPropsInputTextArea | any): any => {
    const {maxLenght, rows} = props
    /**
     * value
     * onChange
     */
    const [state, setState] = useControllableValue<any>(props, {
        trigger: 'onChange'
    });

    const _onChange = (e: any) => {
        if (rows && maxLenght) {
            if (e.split('\n').length <= rows) {
                if (e.length <= maxLenght) {
                    setState(e)
                }
            }
        }
        if (rows) {
            if (e.split('\n').length <= rows) {
                setState(e)
            }
        }
        if (maxLenght) {
            if (e.length <= maxLenght) {
                setState(e)
            }
        }

    }

    return <>
        <Input {...props}
            //value={debouncedValue}
               style={{minHeight: 'auto', whiteSpace: 'nowrap'}}
               cols="44"
               componentClass="textarea"
               onChange={_onChange}/>
        <span style={style}>{state?.length ?? 0}/{maxLenght}</span>
    </>
}

export default index
