import * as React from 'react';
import ReactDOM from 'react-dom';
import {Icon, Dropdown} from 'rsuite';
import {useClickAway} from 'ahooks';
import {createHashHistory} from 'history';

interface IProps {
    item: any

    selectItems: any

    close?(id: string): void
}

/**
 *
 * @author lk
 * @date 2020/7/28 15:57
 * @version 1.0
 */
export const HookTab = (props: IProps) => {
    const RouterHistory = createHashHistory();
    const Menu: any = React.useRef()
    const {item, selectItems, close} = props
    const [XY, setXY] = React.useState({x: 0, y: 0})
    const [show, setShow] = React.useState(false)

    useClickAway(() => {
        setShow(false)
    }, Menu);

    const _onContextMenu = (e: any) => {
        //e.preventDefault();
        if (e.button === 2) {
            setXY({
                x: e.clientX,
                y: e.clientY
            })
            setShow(true)
        }
    }

    const _Menu = () => {
        const node = document.getElementById('root')?.parentElement;
        if (node && show) {
            return (
                ReactDOM.createPortal(
                    <div style={{height: '100%', width: '100%', position: 'absolute', left: 0, top: 0, zIndex: 9999}}>
                        <div ref={Menu} className={'app-menu-panel'}
                             style={{position: 'fixed', top: XY.y, left: XY.x, zIndex: 9999}}>
                            <Dropdown.Menu>
                                <Dropdown.Item onSelect={() => {
                                    setShow(false)
                                    /*Dialog.FloatWindows({
                                        path: item.path,
                                        title: item.name
                                    })*/
                                }}>浮动窗口</Dropdown.Item>
                            </Dropdown.Menu>
                        </div>
                    </div>
                    , node
                )
            )
        }
        return undefined
    }

    return (
        <>
            {_Menu()}
            <div
                className={`header-tabs-tabitem header-tabs-tabitem${item.id} ${selectItems === item.id ? 'header-tabs-tabitem-select' : ''}`}
                role="button"
                d-url={item.path}
            >
                <div
                    className={`header-tabs-tabitem-content header-tabs-tabitem-content${item.id}`}
                    onMouseDown={_onContextMenu}
                    onClick={() => {
                        RouterHistory.push(item.path)
                    }}>{item.name}</div>
                <Icon className={'app-close'} icon={'warning'}
                      onClick={() => close?.(item.id)}/>
            </div>
        </>
    )
}
export default HookTab
