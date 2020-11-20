export default class Other {

    /**
     * 是否全屏
     */
    private static isFullScreen() {
        const _document: any = document
        return !!(
            _document.fullscreen ||
            _document.mozFullScreen ||
            _document.webkitIsFullScreen ||
            _document.webkitFullScreen ||
            _document.msFullScreen
        );
    }

    public static FullScreen(): boolean {
        const de: any = document;
        if (this.isFullScreen()) {
            if (de.exitFullscreen) {
                de?.exitFullscreen?.();
            } else if (de.mozCancelFullScreen) {
                de?.mozCancelFullScreen();
            } else if (de.webkitCancelFullScreen) {
                de?.webkitCancelFullScreen();
            }
            return false;
        }
        const element: any = de.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
        }
        return true;
    }

}
