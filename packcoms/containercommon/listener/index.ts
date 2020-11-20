import * as PubSub from 'pubsub-js'

export default class Listener {

    /**
     * NavMenuSidenav 缩小张开
     */
    public static NavMenuSidenav: string = 'NavMenuSidenav'

    /**
     * 发送事件
     * @param moldTyp
     * @constructor
     */
    public static EmitNavMenuSidenav() {
        PubSub.publishSync(Listener.NavMenuSidenav, {})
    }

    /**
     * Tab关闭
     * NavTabClosed
     */
    public static NavTabClosed: string = 'NavTabClosed'


    /**
     * 发送事件
     * @param moldTyp
     * @constructor
     */
    public static EmitNavTabClosed(callback: () => void) {
        PubSub.publish(Listener.NavTabClosed, {
            callback
        })
    }
}
