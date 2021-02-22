import { useState, useEffect } from "react"
import { Observable } from "rxjs"

/*
    Subscribes to an observable and stores the latest value in state.
    Remember to pass the observable as a dependency in order for the 
    hook to resubscribe automatically as the observable changes.
*/
const useObservable = <T> (observable: Observable<T>, deps?: any[]) => {
    const [value, setValue] = useState<T>()

    useEffect(() => {
        const sub = observable.subscribe(setValue)
        return () => sub.unsubscribe()
    }, deps)

    return value
}

export default useObservable