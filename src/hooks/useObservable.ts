import { useState, useEffect } from "react"
import { Observable } from "rxjs"

const useObservable = <T> (observable: Observable<T>, deps?: any[]) => {
    const [value, setValue] = useState<T>()

    if (deps === undefined) {
        deps = []
    }
    
    useEffect(() => {
        const sub = observable.subscribe(setValue)
        return () => sub.unsubscribe()
    }, [...deps])

    return value
}

export default useObservable