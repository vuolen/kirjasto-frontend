import * as O from 'fp-ts-rxjs/lib/Observable';
import * as E from 'fp-ts/lib/Either';
import { flow, pipe } from "fp-ts/lib/function";
import * as t from "io-ts";
import { failure } from 'io-ts/PathReporter';
import { AddBookRequest, AddBookResponse, APIError, GetAuthorsResponse, GetBooksResponse } from "kirjasto-shared";
import { useState } from "react";
import { BehaviorSubject, from, Observable, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, concatMap, map } from "rxjs/operators";
import { useAuth0 } from "./hooks/useAuth0";

import Either = E.Either

export interface Api {
    getBooks: () => Observable<Either<string, GetBooksResponse>>
    getAuthors: () => Observable<Either<string, GetAuthorsResponse>>
}

export interface AuthenticatedApi extends Api {
    addBook: (params: AddBookRequest) => Observable<Either<string, AddBookResponse>>
}

const decodeAPIResponse = <A, O>(responseType: t.Type<A, O, unknown>) => 
    flow(
        t.union([responseType, APIError]).decode,
        E.mapLeft(
            errors => {
                console.log(new Error(JSON.stringify(failure(errors))))
                return "Something went wrong. Please try again or inform an administrator."
            }
        ),
        E.chainW(
            res => pipe(
                res,
                responseType.decode,
                E.mapLeft(
                    _ => (res as APIError).error
                )
            )
        )
    )

const getBooks: Api["getBooks"] = () => 
    pipe(
        ajax.getJSON("api/books"),
        O.map(
            decodeAPIResponse(GetBooksResponse)
        ),
    )

const addBook = (token: string): AuthenticatedApi["addBook"] => 
    (params) => pipe(
        ajax.post("/api/books/",
                    params,
                    {"Content-Type": "application/json",
                    "Authorization": "Bearer " + token}),
        catchError(err => of(err)),
        O.map(
            res => res.response
        ),
        O.map(
            decodeAPIResponse(AddBookResponse)
        ),
    )

const getAuthors = () => 
    pipe(
        ajax.getJSON("api/authors"),
        O.map(
            decodeAPIResponse(GetAuthorsResponse)
        ),
    )

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