import {IUrlError, Url} from '@fetch/urlconfig'
import {Fetch, PromiseFetch} from '@fetch/fetchtimeout';

export interface IReqAddRole {
    name: string
    remarks?: string
}

export interface IResAddRole extends IUrlError {

}

/**
 * 添加角色
 * @param model
 * @param callback
 * @constructor
 */
export function AddRole(model: IReqAddRole, callback: (e: IResAddRole) => void) {
    PromiseFetch(callback, Fetch(Url.getPermissions('/role/add.do'), model))
}
