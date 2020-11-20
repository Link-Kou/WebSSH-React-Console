export default class menuUtis {
    /**
     * 最小菜单栏目,解决滚动浮动问题
     */
    public static setMenusDropdownPosition() {
        const querySelector: any = document.querySelector('.rs-dropdown.rs-dropdown-open > ul');
        if (querySelector) {
            const parentElement: any = querySelector?.parentElement;
            const top = parentElement?.getBoundingClientRect()?.top;
            const height = querySelector?.getBoundingClientRect()?.height;
            const style = querySelector?.style;
            if (style && top && height) {
                if (top + height > window.innerHeight) {
                    style.top = `calc(${top}px - ${height}px + 50px)`
                } else {
                    style.top = `${top}px`
                }
                style.position = 'fixed'
            }
        }
    }
}
