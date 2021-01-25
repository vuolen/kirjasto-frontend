import React from "react"
import { useState } from "react"
import { BehaviorSubject, Subject } from "rxjs"
import { Form } from "semantic-ui-react"
import useObservable from "./useObservable"

export const useObservableInput = (args: any): [Subject<string>, JSX.Element] => {
    const [value$] = useState(new BehaviorSubject(args.value || ""))
    const value = useObservable(value$)
    const element = <Form.Input onChange={ev => value$.next(ev.target.value)} value={value} {...args} />
    return [value$, element]
}