import { Input, Table } from "antd"
import { pipe } from "fp-ts/lib/function"
import React, { useState } from "react"
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs"
import { concatMap, filter, map, startWith, tap } from "rxjs/operators"
import { Api, Book } from "../api"
import { GetBooksResponse } from "kirjasto-shared"
import { ObservableTable } from "./ObservableComponents"
import * as O from "fp-ts-rxjs/lib/Observable"
import * as E from "fp-ts/lib/Either"
import { ColumnsType, ColumnType } from "antd/lib/table"


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
    interface Row {
        key: number
        title: string
        author: string
    }

    const filteredBooks = combineLatest([book$, filter$]).pipe(
        map(([books, latestFilter]) => 
            books
                .filter(
                    book => book.title.includes(latestFilter) || (book.author && book.author.name.includes(latestFilter))
                ).map(
                    book => ({key: book.id, title: book.title, author: book.author ? book.author.name : ""}) as Row
                )
        ),
    )

    const columns: ColumnsType<Row> = [
        {title: "Title", dataIndex: "title", key: "title"},
        {title: "Author", dataIndex: "author", key: "author"}
    ]

    return (
        <ObservableTable pagination={false} columns={columns as ColumnsType<object>} dataSource$={filteredBooks} data-cy="books">
        </ObservableTable>
    )
}

export default BookSearch