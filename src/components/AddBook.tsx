import React, { useState } from "react"
import { FormEvent } from "react"
import { BehaviorSubject, merge, Observable, Subject } from "rxjs"
import { concatMap, filter, map, mapTo, startWith, tap, withLatestFrom } from "rxjs/operators"
import { Button, Form, FormInputProps, Message, MessageProps } from "semantic-ui-react"
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic"
import { APIError, isAPIError, AuthenticatedApi } from "../api"
import useObservable from "../hooks/useObservable"
import { withObservableProps } from "../util"
import { Loading } from "./Loading"
import { ObservableFormInput, ObservableMessage } from "./ObservableComponents"

const AddBook = ({api$}: {api$: Observable<Pick<AuthenticatedApi, "addBook">>}) => {
    const [title$] = useState(new BehaviorSubject<string>(""))
    const [author$] = useState(new BehaviorSubject<string>(""))
    const api = useObservable(api$, [api$])
    if (api === undefined) {
        return <Loading />
    }

    const submit$ = new Subject<FormEvent>()

    const {addBook} = api

    const response$ = submit$.pipe(
        tap(ev => ev.preventDefault()),
        withLatestFrom(title$, author$),
        concatMap(([_, title, author]) => 
            addBook({
                title, 
                author: author === "" ? undefined : {name: author}
            })
        ),
        tap(() => title$.next("")),
        tap(() => author$.next(""))
    )

    const messageProp$ = merge(
        submit$.pipe(
            mapTo({hidden: true})
        ),
        response$.pipe(
            filter((res): res is APIError => isAPIError(res)),
            map(res => ({
                content: res.error,
                hidden: false
            }))
        )
    )

    return <div>
        <h2>Add a new book</h2>
        <Form error onSubmit={ev => submit$.next(ev)}>
            <ObservableMessage error hidden color="red" data-cy="message" prop$={messageProp$}/>
            <ObservableFormInput onChange={title$} value$={title$} id="title" label="Title:" name="title">
                <input data-cy="title"></input>
            </ObservableFormInput>
            <ObservableFormInput onChange={author$} value$={author$} id="author" label="Author:" name="author">
                <input data-cy="author"></input>
            </ObservableFormInput>
            <Form.Button data-cy="submit" type='submit'>Add</Form.Button>
        </Form>
    </div>
}



export default AddBook