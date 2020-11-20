export interface IRole {
    id: string
    /**
     * 角色名称
     */
    name: string
    /**
     * 权限数量
     */
    remarks: string
    /**
     * 是否禁用 0:不禁用 1:禁用
     */
    deleted: boolean
    /**
     * 创建时间
     */
    createtime: string
    updatedtime: string
}


export interface IRoleMenus {
    id: string
    /**
     * 角色id
     */
    roleId: string
    /**
     * 菜单id
     */
    menusId: string
    check: number
    /**
     * 创建时间
     */
    createtime: string
    updatedtime: string
}
