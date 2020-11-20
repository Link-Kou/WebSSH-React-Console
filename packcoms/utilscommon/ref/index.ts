export class Refs {

    private _current: Array<any> = []

    public get current() {
        const filter = this._current.filter(x => x != null);
        this._current = filter
        return this._current
    }

    public set current(current: any) {
        this._current.push(current);
    }
}

export default class Ref {

    protected ref = () => {
        return (
            {
                current: undefined,
                get() {
                    return this.current
                },
                set(ref: any) {
                    this.current = ref
                }
            }
        )
    }

    public static useRef<T>(): { current: T, [x: string]: any } {
        const ref = new Ref()
        return ref.ref() as any;
    }

    public static UseRefs() {
        return new Refs();
    }
}


