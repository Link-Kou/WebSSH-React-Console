import * as React from 'react';
import {Icon} from 'rsuite';
import './index.scss'

export const {default: Ztree} = require('./svg_ztree.svg');
export const {default: ztreeChildAdd} = require('./svg_ztreeChildAdd.svg');
export const {default: ztreePeerAdd} = require('./svg_ztreePeerAdd.svg');
export const {default: menuGroup} = require('./svg_menuGroup.svg');
export const {default: menu} = require('./svg_menu.svg');
export const {default: rename} = require('./svg_rename.svg');

export class SvgIcons {
    public static ztree = Ztree;
}

export class Svg {
    public static ztree = <Icon className='fill-color' icon={Ztree}/>;
    public static ztreeChildAdd = <Icon className='fill-color' icon={ztreeChildAdd}/>;
    public static ztreePeerAdd = <Icon className='fill-color' icon={ztreePeerAdd}/>;
    public static rename = <Icon className='fill-color' icon={rename}/>;
    public static menuGroup = <Icon className='fill-color' icon={menuGroup}/>;
    public static menu = <Icon className='fill-color' icon={menu}/>;
}
