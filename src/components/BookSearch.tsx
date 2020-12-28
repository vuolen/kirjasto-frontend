import { useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useState } from "react"
import { BehaviorSubject, combineLatest, defer, forkJoin, from, fromEvent, Observable, of, Subject } from "rxjs"
import { ajax } from "rxjs/ajax"
import { concatMap, filter, last, map, shareReplay, tap, toArray, withLatestFrom } from "rxjs/operators"
import useObservable from "../hooks/useObservable"

const book$ = ajax.getJSON<{title: string, id: number}[]>("api/books").pipe(
    shareReplay(1)
)

const BookSearch = () => {    

    const [filter$] = useState(new BehaviorSubject(""))
    const [filter] = useObservable(filter$, [filter$])

    return <div>
        <h1>Kirjasto</h1>
        <input onChange={ev => filter$.next(ev.target.value)} type="text" id="search-bar" value={filter || ""}></input>
        <BookList book$={book$} filter$={filter$} />
    </div>
}

const BookList = ({book$, filter$}: {book$: Observable<{title: string, id: number}[]>, filter$: Observable<string>}) => {
    const [filteredBooks] = useObservable(
        combineLatest([book$, filter$]).pipe(
            map(([books, latestFilter]) => books.filter(
                book => book.title.includes(latestFilter)
            ).map(
                book => <BookItem key={book.id} book={book} />
            ))
        ),
        [book$, filter$]
    )

    return (
        <ul>
            {filteredBooks && filteredBooks.length > 0 ? filteredBooks : "No books found"}
        </ul>
    )
}

const BookItem = ({book}: {book: {title: string, id: number}}) => (
    <li>
        {book.id}: {book.title}
    </li>
)

export default BookSearch