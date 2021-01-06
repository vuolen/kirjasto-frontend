import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useState } from "react"
import { FormEvent } from "react"
import { BehaviorSubject, Observable, Subject } from "rxjs"
import { ajax } from "rxjs/ajax"
import { concatMap, filter, map, tap } from "rxjs/operators"
import { useApi, APIError, isAPIError, Api } from "../api"
import useObservable from "../hooks/useObservable"
import { Loading } from "./Loading"


const AddBook = ({api$}: {api$: Observable<Api>}) => {

    const [submit$] = useState(new Subject<FormEvent>())
    const api = useObservable(api$)
    const [title, setTitle] = useState("")

    if (api === undefined) {
        return <Loading />
    }

    const {addBook} = api

    const response$ = submit$.pipe(
        tap(ev => ev.preventDefault()),
        concatMap(() => addBook({title})),
        tap(() => setTitle(""))
    )

    const error$ = response$.pipe(
        filter((res: any) => isAPIError(res)),
        map((res: APIError) => res.error)
    )

    const onSubmit = (ev: FormEvent) => {

        setTitle("")
        ev.preventDefault()
    }

    return <div>
        <h2>Add a new book</h2>
        <ErrorMessage error$={error$} />
        <form onSubmit={ev => submit$.next(ev)}>
            <label htmlFor="title">Title:</label>
            <input onChange={ev => setTitle(ev.target.value)} type="text" name="title" id="title" value={title}></input>
            <input type="submit" id="submit" value="Add"></input>
        </form>
    </div>
}

const ErrorMessage = ({error$}: {error$: Observable<string>}) => {
    const error = useObservable(error$)

    return (
        <div id="error">
            {error}
        </div>
    )
}

export default AddBook