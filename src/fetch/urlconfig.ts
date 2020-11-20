/**
 * 统一请求结构类型
 */
export const BaseConfig = {
    version: '123',
    devTokenId: '123456',
    business: 2,
    platform: 3,
    system: 4
}

/**
 * 统一数据结构返回类型
 */
export interface IUrlError {
    /**
     * 错误代码
     */
    code: number
    /**
     * 提示信息
     */
    msg: string
    /**
     * 数据类型
     */
    data: any
    /**
     * 是否成功
     */
    success: boolean
}

/**
 * 统一数据结构请求分页
 */
export interface IPageResData {
    /**
     * 当前页
     */
    page: number,
    /**
     * 每页条数
     */
    itemsPerPage: number,
    /**
     * 数据
     */
    data?: any
}

/**
 * 统一数据结构返回分页
 */
export interface IPageReqData extends IUrlError {
    data: {
        /**
         * 总页数
         */
        total: number
        /**
         * 数据
         */
        list: any
    }
}

/**
 * 项目地址列表
 */
enum UrlType {
    /**
     * 权限
     */
    permissions = '/permissions',
}

/**
 * 根据环境切换Url
 */
export class Url {

    public static getUrl(): string {
        const reactappenv: any = String(process.env.REACT_APP_Env);
        const URL = {
            'Dev': '/dev',
            'Test': '/',
            'Pro': '/'
        }
        return URL[reactappenv]
    }

    /**
     * 权限
     */
    public static getPermissions(url: String): string {
        return this.getUrl() + UrlType.permissions + url
    }
}

