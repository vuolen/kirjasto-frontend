import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Observable, of, ReplaySubject, Subject, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import AddBook from "./components/AddBook";

export type APIError = {error: string}

export function isAPIError(response: any): response is APIError {
    return response.error !== undefined
}

export interface Api {
    getBooks: () => Observable<APIError | GetBooksResponse>
    addBook: (params: AddBookRequest) => Observable<APIError | AddBookResponse>
}

export type GetBooksResponse = {id: number, title: string}[]
const getBooks = () => {
    console.log("getbooks")
    return ajax.getJSON<APIError | GetBooksResponse>("api/books")
}

type AddBookRequest = {title: string}
type AddBookResponse = {id: number, title: string}
const addBook = (token: string) => (params: {title: string}): Observable<APIError | {id: number, title: string}> => {
    return ajax.post(
        "/api/books/",
        params,
        {"Content-Type": "application/json",
         "authorization": token}
    ).pipe(
        map(
            response => response.response
        ),
        catchError(
            err => {
                console.log("Error in api call addBook, " + err)
                return of({error: err.response.error || "Failed to add book"})
            }
        )
    )
}

export function useApi() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    const [api$] = useState(new ReplaySubject<Api>(1))

    useEffect(() => {
        (async () => {
            
            let token

            if (isAuthenticated) {
                token = await getAccessTokenSilently({
                    scope: 'add:books'
                })
            } else {
                token = "not authenticated" // TODO: do this more gracefully
            }

            api$.next(
                {
                    getBooks: getBooks,
                    addBook: addBook(token)
                }
            )
        })()
    }, [getAccessTokenSilently])

    return api$
}