import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { fromEvent } from "rxjs";
import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators'

const BACKEND_HOST = process.env.BACKEND_HOST || "localhost"
const BACKEND_PORT = process.env.BACKEND_PORT || "8000"
const BACKEND_BASE_URL = "http://" + BACKEND_HOST + ":" + BACKEND_PORT

const book$ = ajax.getJSON<{title: string, id: number}[]>(BACKEND_BASE_URL + "/books")

const App = () => {

    const [books, setBooks] = useState([] as {title: string, id: number}[])
    const [titleFilter, setTitleFilter] = useState("")
    const titleFilterRef = React.createRef<HTMLInputElement>()

    useEffect(() => {
        const sub = book$.subscribe(setBooks, err => console.log(err))
        return sub.unsubscribe
    }, [])

    useEffect(() => {
        if (!titleFilterRef.current) return
        const sub = fromEvent(titleFilterRef.current, "input").pipe(
            map(ev => (ev.target as HTMLInputElement).value)
        ).subscribe(setTitleFilter)
        return sub.unsubscribe
    }, [])

    return <div>
        <h1>Kirjasto</h1>
        <input id="search-bar" ref={titleFilterRef} type="text"></input>
        <ul>
            {books
                .filter(book => book.title.includes(titleFilter))
                .map(book => <li key={book.id}>{book.id}: {book.title}</li>)}
        </ul>
    </div>
}

ReactDOM.render(<App/>, document.getElementById("root"))
