import { Observable, of, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, map } from "rxjs/operators";
import AddBook from "./components/AddBook";

export type APIError = {error: string}

export function isAPIError(response: any): response is APIError {
    return response.error !== undefined
}

export function addBook(params: {title: string}): Observable<APIError | {id: number, title: string}> {
    return ajax.post(
        "/api/books/",
        params,
        {'Content-Type': 'application/json'}
    ).pipe(
        map(
            response => response.response
        ),
        catchError(
            err => {
                console.log("Error in api call addBook, " + err)
                return of({error: "Failed to add book"})
            }
        )
    )
}