import {IMenuConfig} from 'containercommon/index.type';

export const MenuConfig: Array<IMenuConfig> = [
    {
        key: '应用管理',
        type: {
            type: 'NavItem',
            content: '应用管理',
            ico: 'cube',
            route: '/app/main'
        }
    }
]

/**
 * 默认打开
 */
export const MenuOpenKeysConfig = ['']
