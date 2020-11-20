import * as React from 'react';
import {
    Button,
    ButtonToolbar,
    Container,
    Content,
    ControlLabel,
    FlexboxGrid, Footer,
    Form,
    FormControl,
    FormGroup,
    Header,
    Panel
} from 'rsuite';
import {Historys} from '@router';

/**
 * 登录
 * @author lk
 * @date 2020/11/20 10:23
 * @version 1.0
 */
export default class Login extends React.Component {

    public state = {
        formValue: {
            endpoint: 'ws://127.0.0.1:8080/webssh',
            host: '10.226.120.4',
            port: '22',
            username: 'lk',
            password: '123'
        }
    }

    public _onLogin = () => {
        Historys.push({
            pathname: '/layout',
            search: '',
            state: {
                ...this.state.formValue
            }
        })
    }

    render() {
        const {formValue} = this.state
        return (
            <div className="show-fake-browser login-page">
                <Container>
                    <Header/>
                    <Content>
                        <FlexboxGrid justify="center">
                            <FlexboxGrid.Item colspan={8}>
                                <Panel header={<h3>Login</h3>} bordered={true}>
                                    <Form fluid={true} formValue={formValue}>
                                        <FormGroup>
                                            <ControlLabel>WebSocket IP</ControlLabel>
                                            <FormControl name="endpoint"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>SSH IP</ControlLabel>
                                            <FormControl name="host"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Port</ControlLabel>
                                            <FormControl name="port"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>UserName</ControlLabel>
                                            <FormControl name="username"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ControlLabel>Password</ControlLabel>
                                            <FormControl name="password"/>
                                        </FormGroup>
                                        <FormGroup>
                                            <ButtonToolbar>
                                                <Button appearance="primary" onClick={this._onLogin}>Sign in</Button>
                                            </ButtonToolbar>
                                        </FormGroup>
                                    </Form>
                                </Panel>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Content>
                    <Footer/>
                </Container>
            </div>
        );
    }
}
