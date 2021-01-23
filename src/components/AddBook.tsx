import React, { useState } from "react"
import { FormEvent } from "react"
import { Observable, Subject } from "rxjs"
import { concatMap, filter, map, tap, withLatestFrom } from "rxjs/operators"
import { APIError, isAPIError, AuthenticatedApi } from "../api"
import useObservable from "../hooks/useObservable"
import { useObservableInput } from "../hooks/useObservableInput"
import { Loading } from "./Loading"

const AddBook = ({api$}: {api$: Observable<Pick<AuthenticatedApi, "addBook">>}) => {
    const [submit$] = useState(new Subject<FormEvent>())
    const [title$, titleInput] = useObservableInput({name: "title", id: "title"})
    const [author$, authorInput] = useObservableInput({name: "author", id: "author"})
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
            })),
        tap(() => title$.next("")),
        tap(() => author$.next(""))
    )

    const error$ = response$.pipe(
        filter((res: any) => isAPIError(res)),
        map((res: APIError) => res.error)
    )

    return <div>
        <h2>Add a new book</h2>
        <ErrorMessage error$={error$} />
        <form onSubmit={ev => submit$.next(ev)}>
            <label htmlFor="title">Title:</label>
            {titleInput}
            <label htmlFor="author">Author:</label>
            {authorInput}
            <input type="submit" id="submit" value="Add"></input>
        </form>
    </div>
}

const ErrorMessage = ({error$}: {error$: Observable<string>}) => {
    const error = useObservable(error$, [error$])

    return (
        <div id="error">
            {error}
        </div>
    )
}

export default AddBook