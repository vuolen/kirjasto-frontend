import React, { useState } from "react"
import { FormEvent } from "react"
import { BehaviorSubject, merge, Observable, Subject } from "rxjs"
import { concatMap, filter, map, mapTo, startWith, tap, withLatestFrom } from "rxjs/operators"
import { Form, FormInputProps, Message, MessageProps } from "semantic-ui-react"
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic"
import { APIError, isAPIError, AuthenticatedApi } from "../api"
import useObservable from "../hooks/useObservable"
import { withObservableProps } from "../util"
import { Loading } from "./Loading"

const AddBook = ({api$}: {api$: Observable<Pick<AuthenticatedApi, "addBook">>}) => {
    const [submit$] = useState(new Subject<FormEvent>())
    const [title$] = useState(new BehaviorSubject<string>(""))
    const [author$] = useState(new BehaviorSubject<string>(""))
    const api = useObservable(api$, [api$])

    if (api === undefined) {
        return <Loading />
    }

    const {addBook} = api

    const response$ = submit$.pipe(
        tap(ev => ev.preventDefault()),
        withLatestFrom(title$, author$),
        concatMap(([_, title, author]) => 
            addBook({
                title, 
                author: author === "" ? undefined : author
            })
        ),
        tap(() => title$.next("")),
        tap(() => author$.next(""))
    )

    const messageProp$ = merge(
        submit$.pipe(
            mapTo({id: "error", hidden: true})
        ),
        response$.pipe(
            filter((res: any) => isAPIError(res)),
            map((res: APIError) => ({
                id: "error",
                error: true,
                color: "red" as SemanticCOLORS,
                content: res.error
            })),
            startWith({id: "error", hidden: true})
        )
    )

    return <div>
        <h2>Add a new book</h2>
        
        <Form error onSubmit={ev => submit$.next(ev)}>
            <ObservableMessage prop$={messageProp$} />
            <ObservableInput value$={title$} id="title" label="Title:" name="title" />
            <ObservableInput value$={author$} id="author" label="Author:" name="author" />
            <input type="submit" id="submit" value="Add"></input>
        </Form>
    </div>
}

const ObservableInput = ({value$, ...args}: {value$: Subject<string>} & FormInputProps) => {
    const value = useObservable(value$, [value$])
    return <Form.Input onChange={ev => value$.next(ev.target.value)} value={value || ""} {...args} />
}

const ObservableMessage = withObservableProps(Message)


export default AddBook