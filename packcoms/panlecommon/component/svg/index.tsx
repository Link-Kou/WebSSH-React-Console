import * as React from 'react';
import {Icon} from 'rsuite';

export const {default: redata} = require('./svg_redata.svg');

export class Svg {
    public static redata = <Icon className='fill-color' icon={redata}/>;
    public static RedataCompon = (props: any) => <Icon className='fill-color' {...props} icon={redata}/>;
}


