import React from 'react';
import {useFullscreen} from 'ahooks';
import {Dropdown} from 'rsuite';


const HookTabFull = () => {
    const [, {toggleFull}] = useFullscreen(() => document.getElementById('app-body-full'));
    return (
        <Dropdown.Item onSelect={toggleFull}>标签全屏</Dropdown.Item>
    );
};

export default HookTabFull
