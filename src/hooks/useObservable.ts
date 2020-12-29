import { useState, useEffect } from "react"
import { Observable } from "rxjs"

const useObservable = <T> (observable: Observable<T>, deps?: any[]) => {
    const [value, setValue] = useState<T>()
    
    useEffect(() => {
        const sub = observable.subscribe(setValue)
        console.log("USEEFFECT")
        return () => sub.unsubscribe()
    }, deps)

    return [value]
}

export default useObservable