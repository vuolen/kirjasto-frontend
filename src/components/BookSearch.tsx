import React, { useState } from "react"
import { BehaviorSubject, combineLatest, Observable } from "rxjs"
import { filter, map, tap } from "rxjs/operators"
import { Api, GetBooksResponse, isAPIError } from "../api"
import useObservable from "../hooks/useObservable"
import { Loading } from "./Loading"

const BookSearch = ({api$}: {api$: Observable<Api>}) => {    

    const [filter$] = useState(new BehaviorSubject(""))
    const titleFilter = useObservable(filter$, [filter$])
    const api = useObservable(api$, [api$])

    if (titleFilter === undefined || api === undefined) {
        return <Loading />
    }

    const {getBooks} = api

    const book$ = getBooks().pipe(
        filter((res): res is GetBooksResponse => !isAPIError(res))
    )

    return <div>
        <h1>Kirjasto</h1>
        <label htmlFor="search-bar">Search:</label>
        <input onChange={ev => filter$.next(ev.target.value)} type="text" id="search-bar" value={titleFilter}></input>
        <BookList book$={book$} filter$={filter$} />
    </div>
}

const BookList = ({book$, filter$}: {book$: Observable<GetBooksResponse>, filter$: Observable<string>}) => {
    const filteredBooks = useObservable(
        combineLatest([book$, filter$]).pipe(
            map(([books, latestFilter]) => books.filter(
                book => book.title.includes(latestFilter)
            ).map(
                book => <BookItem key={book.id} book={book} />
            ))
        ),
        [book$, filter$]
    )

    if (filteredBooks === undefined) {
        return <Loading />
    }

    return (
        <ul>
            {filteredBooks && filteredBooks.length > 0 ? filteredBooks : "No books found"}
        </ul>
    )
}

const BookItem = ({book}: {book: {title: string, author?: string}}) => (
    <li>
        {book.author === undefined ? "" : book.author + ":"} {book.title}
    </li>
)

export default BookSearch