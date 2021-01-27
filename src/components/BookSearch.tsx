import React, { useState } from "react"
import { BehaviorSubject, combineLatest, Observable } from "rxjs"
import { filter, map, tap } from "rxjs/operators"
import { List, Table } from "semantic-ui-react"
import { Api, GetBooksResponse, isAPIError } from "../api"
import useObservable from "../hooks/useObservable"
import { Loading } from "./Loading"
import { ObservableInput } from "./ObservableInput"

const BookSearch = ({api$}: {api$: Observable<Api>}) => {    

    const [filter$] = useState(new BehaviorSubject(""))
    const api = useObservable(api$, [api$])

    if (api === undefined) {
        return <Loading />
    }

    const {getBooks} = api

    const book$ = getBooks().pipe(
        filter((res): res is GetBooksResponse => !isAPIError(res))
    )

    return <div>
        <h1>Kirjasto</h1>
        <label htmlFor="search-bar">Search:</label>
        <ObservableInput value$={filter$} id="search-bar" />
        <BookTable book$={book$} filter$={filter$} />
    </div>
}

const BookTable = ({book$, filter$}: {book$: Observable<GetBooksResponse>, filter$: Observable<string>}) => {
    const filteredBooks = useObservable(
        combineLatest([book$, filter$]).pipe(
            map(([books, latestFilter]) => 
                books
                    .filter(
                        book => book.title.includes(latestFilter)
                    ).map(
                        book => <BookItem key={book.id} book={book} />
                    )),
        ),
        [book$, filter$]
    )

    if (filteredBooks === undefined) {
        return <Loading />
    }


    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>
                        Title
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                        Author
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {filteredBooks}
            </Table.Body>
        </Table>
    )
}

const BookItem = ({book}: {book: {title: string, author?: string}}) => (
    <Table.Row data-se="book">
        <Table.Cell data-se="title">{book.title}</Table.Cell>
        <Table.Cell data-se="author">{book.author}</Table.Cell>
    </Table.Row>
)

export default BookSearch