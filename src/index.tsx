import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { from } from "rxjs";
import { map } from "rxjs/operators";

const BACKEND_HOST = "http://localhost"
const BACKEND_PORT = "8000"
const BACKEND_BASE_URL = BACKEND_HOST + ":" + BACKEND_PORT

const book$ = from(axios.get(BACKEND_BASE_URL + "/books")).pipe(
    map(res => res.data)
)

const App = () => {

    const [books, setBooks] = useState([])

    useEffect(() => {
        book$.subscribe(
            setBooks,
            err => console.log("Couldnt get /books")
        )
    }, [])
    console.log(books)
    return <div>
        {JSON.stringify(books)}
    </div>
}

ReactDOM.render(<App/>, document.getElementById("root"))