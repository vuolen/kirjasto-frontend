import React, { createRef } from "react"
import { useState, useEffect } from "react"
import { fromEvent } from "rxjs"
import { map } from "rxjs/operators"

const useInput = (props: any) => {
    const [state, setState] = useState(props.value || "")
    const ref = createRef<HTMLInputElement>()

    useEffect(() => {
        if (ref.current == null) {
            console.error("Ref was null")
            return
        }
        const sub = fromEvent(ref.current, "input").pipe(
            map(ev => (ev.target as HTMLInputElement).value)
        ).subscribe(setState)
        return sub.unsubscribe
    }, [])

    return [<input onChange={ev => setState(ev.target.value)}
                   {...props}
                   value={state}>
            </input>, 
            state]
}

export default useInput