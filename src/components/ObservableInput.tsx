import React from "react"
import { Subject } from "rxjs"
import { FormInputProps, Form } from "semantic-ui-react"
import useObservable from "../hooks/useObservable"

export const ObservableInput = ({value$, ...args}: {value$: Subject<string>} & FormInputProps) => {
    const value = useObservable(value$, [value$])

    const {"data-cy": data_cy, ...rest} = args

    return (
        <Form.Input onChange={ev => value$.next(ev.target.value)} value={value || ""} {...rest}>
            <input data-cy={data_cy}></input>
        </Form.Input>
    )
}