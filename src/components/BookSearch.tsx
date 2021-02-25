import { Input } from "antd"
import { pipe } from "fp-ts/lib/function"
import React, { useState } from "react"
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs"
import { concatMap, filter, map, startWith, tap } from "rxjs/operators"
import { Table } from "semantic-ui-react"
import { Api, Book } from "../api"
import { GetBooksResponse } from "../shared/api/GetBooks"
import { ObservableTableBody } from "./ObservableComponents"
import * as O from "fp-ts-rxjs/lib/Observable"
import * as E from "fp-ts/lib/Either"


const BookSearch = ({api$}: {api$: Observable<Pick<Api, "getBooks">>}) => {  
    const book$ = pipe(
        api$,
        O.chain(
            api => api.getBooks()
        ),
        O.filter(E.isRight),
        O.map(
            books => books.right
        )
    )

    const searchInput$ = new BehaviorSubject("")

    return <div>
        <h1>Kirjasto</h1>
        <Input.Search placeholder="Search..." id="title" data-cy="search" onSearch={val => searchInput$.next(val)}></Input.Search>
        <BookTable book$={book$} filter$={searchInput$} />
    </div>
}

const BookTable = ({book$, filter$}: {book$: Observable<GetBooksResponse>, filter$: Observable<string>}) => {
    const filteredBooks = combineLatest([book$, filter$]).pipe(
        map(([books, latestFilter]) => 
            books
                .filter(
                    book => book.title.includes(latestFilter) || (book.author && book.author.name.includes(latestFilter))
                ).map(
                    book => <BookItem key={book.id} book={book} />
                )
        ),
    )

    return (
        <Table celled data-cy="books">
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
            <ObservableTableBody children$={filteredBooks} />
        </Table>
    )
}

const BookItem = ({book}: {book: Book}) => (
    <Table.Row data-cy="book">
        <Table.Cell data-cy="title">{book.title}</Table.Cell>
        <Table.Cell data-cy="author">{book.author ? book.author.name : ""}</Table.Cell>
    </Table.Row>
)

export default BookSearch