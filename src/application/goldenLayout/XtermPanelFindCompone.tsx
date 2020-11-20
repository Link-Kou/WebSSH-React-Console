import * as React from 'react';
import {Button, ButtonToolbar, Icon, Input, InputGroup} from 'rsuite';

interface IProps {
    onPrev?(word: string): void

    onNext?(word: string): void
}

/**
 * 查询窗口
 * @author lk
 * @date 2020/11/19 16:55
 * @version 1.0
 */
export default class XtermPanelFindCompone extends React.Component<IProps> {


    public state = {
        queryValue: ''
    }

    render() {
        const {onPrev, onNext} = this.props
        const {queryValue} = this.state
        return (
            <div>
                <InputGroup size="md" placeholder="Medium" inside={true}>
                    <Input placeholder={'查询文本'} value={queryValue} onChange={(value) => {
                        this.setState({
                            queryValue: value
                        })
                    }}/>
                    <InputGroup.Button>
                        <Icon icon="search"/>
                    </InputGroup.Button>
                </InputGroup>
                <ButtonToolbar style={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    marginTop: '35px'
                }}>
                    <Button onClick={() => onPrev?.(queryValue)}>向上查询</Button>
                    <Button onClick={() => onNext?.(queryValue)}>向下查询</Button>
                </ButtonToolbar>
            </div>
        );
    }
}
