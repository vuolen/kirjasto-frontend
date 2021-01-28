import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { BehaviorSubject, from, Observable, of, ReplaySubject, Subject, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, concatMap, map } from "rxjs/operators";
import AddBook from "./components/AddBook";

export type APIError = {error: string}

export function isAPIError(response: any): response is APIError {
    return response.error !== undefined
}

export interface Api {
    getBooks: () => Observable<APIError | GetBooksResponse>
}

export interface AuthenticatedApi extends Api {
    addBook: (params: AddBookRequest) => Observable<APIError | AddBookResponse>
}

export type Book = {id: number, title: string, author?: {id: number, name: string}}
export type GetBooksResponse = {id: number, title: string, author?: {id: number, name: string}}[]
const getBooks = () => 
    ajax.getJSON<APIError | GetBooksResponse>("api/books")

type AddBookRequest = {title: string, author?: number | {name: string}}
type AddBookResponse = {id: number, title: string, author?: {id: number, title: string}}
const addBook = (token: string) => (params: AddBookRequest): Observable<APIError | AddBookResponse> => 
    ajax.post(
        "/api/books/",
        params,
        {"Content-Type": "application/json",
         "Authorization": "Bearer " + token}
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

export function useApi(): {api$: Observable<Api | AuthenticatedApi>, isAuthenticated: boolean, isLoading: boolean} {
    const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

    const [baseApi$] = useState(new BehaviorSubject<Api>({
        getBooks
    }))

    if (!isAuthenticated) {
        return {api$: baseApi$, isAuthenticated, isLoading}
    }

    const authenticatedApi$ = baseApi$.pipe(
        concatMap(baseApi => 
            from(getAccessTokenSilently({
                scope: 'add:book'
            })).pipe(
                map(token => ({
                    addBook: addBook(token)
                })),
                map(authenticatedApi => ({...baseApi, ...authenticatedApi}))
            )
    ))

    return {api$: authenticatedApi$, isAuthenticated, isLoading}
}