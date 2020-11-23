import GoldenLayout from 'golden-layout';

/**
 * 针对Layout操作封装
 */
export default class LayoutUtils {

    private _layout: GoldenLayout | undefined;

    constructor(layout?: GoldenLayout) {
        this._layout = layout
    }

    /**
     * 添加总Tabs里面，由组件安排
     * @param props
     */
    public addTabs(props: { id: string, title: string, component: string, [x: string]: any }) {
        const {id, title, component} = props
        this._layout?.root?.contentItems?.[0]?.addChild?.({
            ...props,
            id: id,
            title: title,
            type: 'react-component',
            component: component
        });
    }

    /**
     * 添加到指定的Tab
     * @param byId
     * @param props
     */
    public addTab(byId: string, props: { id: string, title: string, component: string, [x: string]: any }) {
        const {id, title, component} = props
        this._layout?.root?.getItemsById(byId)[0].parent.addChild({
            ...props,
            id: id,
            title: title,
            type: 'react-component',
            component: component
        });
    }
}
