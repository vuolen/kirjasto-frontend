import { useState } from "react";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, concatMap, map } from "rxjs/operators";
import { useAuth0 } from "./hooks/useAuth0";
import { GetBooksResponse } from "./shared/api/GetBooks";
import * as O from 'fp-ts-rxjs/lib/Observable'
import * as E from 'fp-ts/lib/Either'
import { flow, pipe } from "fp-ts/lib/function";
import { APIResponse } from "./shared/api/APIResponse";
import { APIError } from "./shared/api/APIError";
import { failure } from 'io-ts/PathReporter'

import Either = E.Either

export interface Api {
    getBooks: () => Observable<Either<string, GetBooksResponse>>
    getAuthors: () => Observable<APIError | GetAuthorsResponse>
}

export interface AuthenticatedApi extends Api {
    addBook: (params: AddBookRequest) => Observable<APIError | AddBookResponse>
}

export type Book = {id: number, title: string, author?: {id: number, name: string}}
const getBooks: Api["getBooks"] = () => 
    pipe(
        ajax.getJSON<any>("api/books"),
        O.map(
            res => pipe(
                res,
                GetBooksResponse.decode,
                E.mapLeft(
                    errors => {
                        if (APIError.is(res)) {
                            return res.error
                        }
                        console.log(new Error(JSON.stringify(failure(errors))))
                        return "Something went wrong. Please try again or inform an administrator."
                    }
                )
            )
        ),
    )

type AddBookRequest = {title: string, author?: number | {name: string}}
export type AddBookResponse = {id: number, title: string, author?: {id: number, title: string}}
const addBook = (token: string) => (params: AddBookRequest): Observable<APIError | AddBookResponse> => 
    ajax.post(
        "/api/books/",
        params,
        {"Content-Type": "application/json",
         "Authorization": "Bearer " + token}
    ).pipe(
        map(
            response => response.response as APIError | AddBookResponse
        ),
        catchError(
            err => {
                console.log("Error in api call addBook, " + err)
                return of({error: err.response.error || "Failed to add book"})
            }
        )
    )

export type GetAuthorsResponse = {id: number, name: string}[]
const getAuthors = () => 
    ajax.getJSON<APIError | GetAuthorsResponse>("api/authors")

export function useApi(): {api$: Observable<Api | AuthenticatedApi>, isAuthenticated: boolean, isLoading: boolean} {
    const { getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();

    const [baseApi$] = useState(new BehaviorSubject<Api>({
        getBooks,
        getAuthors
    }))

    const e2eToken = window.localStorage.getItem("access_token")

    if (!isAuthenticated && e2eToken === null) {
        return {api$: baseApi$, isAuthenticated, isLoading}
    }

    const authenticatedApi$ = baseApi$.pipe(
        concatMap(baseApi => {

            return (e2eToken !== null ? of(e2eToken) : from(getAccessTokenSilently({
                scope: 'add:book'
            }))).pipe(
                map(token => ({
                    addBook: addBook(token)
                })),
                map(authenticatedApi => ({...baseApi, ...authenticatedApi}))
            )
        }
    ))

    return {
        api$: authenticatedApi$, 
        isAuthenticated,
        isLoading
    }
}