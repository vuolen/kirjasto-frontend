import React from "react"
import { useState } from "react"
import { BehaviorSubject, Subject } from "rxjs"
import useObservable from "./useObservable"

export const useObservableInput = (args: any): [Subject<string>, JSX.Element] => {
    const [value$] = useState(new BehaviorSubject(args.value || ""))
    const value = useObservable(value$)
    const element = <input onChange={ev => value$.next(ev.target.value)} value={value} {...args} />
    return [value$, element]
}