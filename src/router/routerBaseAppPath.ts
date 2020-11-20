import Listener from '@listener';
import {Historys} from './routerBase';

const BASEPATH = '/app'

export const RouterPaths = {
    /**
     * 主页
     */
    Main: `${BASEPATH}/main`,
    /**
     * 主页
     */
    Layout: `${BASEPATH}/layout`
}

/**
 * 跳转并且关闭Tab
 * RouterTabPush(RouterPath.CardboardList);
 * {@link HeadTabs#_onClosed}
 * @param paths
 * @constructor
 */
export const RouterTabPush = (paths: string) => {
    Listener.EmitNavTabClosed(() => {
        Historys.push(paths)
    });
}
