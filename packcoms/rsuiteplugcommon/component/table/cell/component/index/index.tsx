import * as React from 'react';
import {Checkbox, Icon, IconButton, Table} from 'rsuite';
import {useDebounceFn} from 'ahooks';
import {utilsNumber, utilsObject} from 'utilscommon';
import {TextSpan} from 'textcommon';

const {Cell} = Table;

interface IProps {
    dataKey?: string | undefined

    rowIndex?: number

    rowHeight?: number

    [x: string]: any
}


interface IControllerAlashnCell extends IProps {
    deg?: number
}

/**
 * 斜线分隔表格
 * @constructor
 */
export function ControllerAlashCell(props: IControllerAlashnCell) {
    const {rowData, dataKey, deg} = props;
    const degNum = (v: number = 50) => {
        return v
    }
    const suDiv = () => {
        if (dataKey) {
            const rowDatum: string = rowData[dataKey];
            const strings: Array<string> = rowDatum.split('/');
            if (Array.isArray(strings) && strings.length === 2) {
                return (
                    <Cell {...props}
                          style={{background: `linear-gradient(${degNum(deg)}deg, transparent 49.5%, #dedede 50%, transparent 50%, transparent 50%`}}>
                        <div>
                            <sub style={{bottom: '-2rem', fontSize: 14}}>
                                {strings[0]}
                            </sub>
                            <sup style={{top: '-2rem', fontSize: 14}}>
                                {strings[1]}
                            </sup>
                        </div>
                    </Cell>
                )
            }
            return (<Cell {...props}>{rowDatum}</Cell>);
        }
        return <Cell {...props}/>
    }

    return suDiv();
}


interface IControllerIndexCell extends IProps {
    onSelectChange?: (rowIndex: number, rowData: any) => boolean | void
    select?: boolean
    disPlayNumber?: boolean
}

/**
 * 编号列
 * @param props
 * @constructor
 */
export function ControllerIndexCell(props: IControllerIndexCell) {
    const {rowIndex, onSelectChange, disPlayNumber, rowData, dataKey, select: defaultSelect} = props;
    const [select, setSelect] = React.useState(defaultSelect ?? false);

    const {run} = useDebounceFn(() => {
        onSelectChange?.(rowIndex ?? -1, rowData)
    }, {wait: 200});


    const rownumber = utilsNumber.isNumber(rowIndex) ? rowIndex + 1 : undefined
    return (
        <Cell {...props}>
            <Checkbox
                style={{marginLeft: 0}}
                inline={true}
                checked={select}
                onChange={(value, c) => {
                    if (rowData && dataKey) {
                        rowData[dataKey] = c
                        setSelect(c)
                        run()
                    }
                }}
            >
                {disPlayNumber ? rownumber ?? '' : ''}
            </Checkbox>
        </Cell>
    )
}


interface IControllerExpandedIndexCell extends IProps {
    onExpanded?(rowData: any, dataKey: any): void
}

/**
 * 编号与展开列
 * @param props
 * @constructor
 */
export function ControllerExpandedIndexCell(props: IControllerExpandedIndexCell) {
    const {rowIndex, expandedRowKeys, rowData, dataKey, rowKey, onExpanded, rowHeight} = props;
    const rownumber = utilsNumber.isNumber(rowIndex) ? rowIndex + 1 : undefined
    return (
        <Cell {...props} style={{height: rowHeight ?? props.height}}>
            <IconButton
                size="xs"
                appearance="subtle"
                onClick={() => {
                    onExpanded?.(rowData, dataKey);
                }}
                icon={
                    <Icon
                        icon={
                            expandedRowKeys?.some((key: any) => key === rowKey)
                                ? 'minus-square-o'
                                : 'plus-square-o'
                        }
                    />
                }
            />
            <Checkbox
                style={{marginLeft: 0}}
                inline={true}>
                {rownumber}
            </Checkbox>
        </Cell>
    )
}


interface IControllerTextSpanCell extends IProps {

}

/**
 * 常规 文本列表
 * @param props
 * @constructor
 */
export function ControllerTextSpanCell(props: IControllerTextSpanCell) {
    const {dataKey} = props;
    return (
        <Cell {...props}>
            {(rowData: any) => (
                <TextSpan>
                    {utilsObject.get(rowData, dataKey)}
                </TextSpan>
            )}
        </Cell>
    )
}
