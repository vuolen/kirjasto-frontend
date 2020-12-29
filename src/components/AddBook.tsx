import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useState } from "react"
import { FormEvent } from "react"
import { BehaviorSubject, Observable, Subject } from "rxjs"
import { ajax } from "rxjs/ajax"
import { concatMap, filter, map, tap } from "rxjs/operators"
import { addBook, APIError, isAPIError } from "../api"
import useObservable from "../hooks/useObservable"


const AddBook = () => {

    const [submit$] = useState(new Subject<FormEvent>())

    const response$ = submit$.pipe(
        tap(ev => ev.preventDefault()),
        concatMap(() => addBook({title})),
        tap(() => setTitle(""))
    )

    const error$ = response$.pipe(
        filter((res: any) => isAPIError(res)),
        map((res: APIError) => res.error)
    )

    const [title, setTitle] = useState("")

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
    const [error] = useObservable(error$.pipe(

    ), [error$])

    return (
        <div id="error">
            {error}
        </div>
    )
}

export default AddBook