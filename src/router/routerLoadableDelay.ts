import * as NProgress from 'nprogress';
import {LoadLoable} from 'panlecommon';

/**
 * 顶部进度条显示
 * @param e
 * @constructor
 */
const ConfigBaseThen = (e: any) => {
    NProgress.done()
    return e
}

export const RouterLoadableConfigBase = {
    loading: LoadLoable,
    delay: 1500,
    timeout: 5000
}

/**
 * 页面惰性加载
 * @param imports 导入页面
 * @param ms 延迟
 * @constructor
 */
export function RouterLoadableDelay(imports: Promise<any>, ms: number = 500) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    }).then(() => imports.then(ConfigBaseThen));
}
