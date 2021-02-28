import { RenderResult, fireEvent, render, configure, waitFor, screen } from '@testing-library/preact';
import React from "react"
import { Observable, of } from "rxjs"
import AddBook from "../src/components/AddBook"
import "./matchMedia.js"
import * as OE from "fp-ts-rxjs/ObservableEither"
import { APIError, Author, Book } from 'kirjasto-shared';
import { AuthenticatedApi } from '../src/api';

/**
 * @jest-environment jsdom
 */

configure({testIdAttribute: 'data-cy'})

const getTitleInputElement = () => screen.getByLabelText(/Title/i) as HTMLInputElement
const getAuthorInputElement = () => screen.getByRole("combobox", {name: /Author/i}) as HTMLInputElement

function inputTitle(title: string) {
    fireEvent.input(getTitleInputElement(), {target: {value: title}})
    expect(getTitleInputElement().value).toBe(title)
}

function inputAuthor(author: string) {
    fireEvent.input(getAuthorInputElement(), {target: {value: author}})
    expect(getAuthorInputElement().value).toBe(author)
}

function submitForm(res: RenderResult) {
    fireEvent.click(res.getByText(/^Add$/i))
}

const unimpl = () => { throw new Error("Unimplemented") }

 it("AddBook clears the form after submitting", async () => {
    const mockApi = {
        addBook: jest.fn(() => OE.right({id: 1, title: "Test Book"} as Book)),
        getAuthors: () => OE.right([])
    }

    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )

    inputTitle("Test Book")
    inputAuthor("Test Author")
    submitForm(result)

    await waitFor(() => expect(getTitleInputElement().value).toBe(""))
    await waitFor(() => expect(getAuthorInputElement().value).toBe(""))
})

it("AddBook calls the api on submit", async () => {
    const mockApi = {
        addBook: jest.fn(() => OE.right({id: 1, title: "Test Book"} as Book)),
        getAuthors: () => OE.right([])
    }

    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )
    
    inputTitle("Test Book")
    submitForm(result)

    await waitFor(() => expect(mockApi.addBook.mock.calls.length).toBe(1))
})

it("Given the addBook returns an error, when the user adds a book, AddBook shows that error", async () => {
    const mockApi = of({
        addBook: (params) => OE.left("API Error"),
        getAuthors: () => OE.right([])
    } as AuthenticatedApi)

    const result = render(
        <AddBook api$={mockApi}></AddBook>
    )
    
    inputTitle("Test Book")
    submitForm(result)

    expect(await result.findByText(/API Error/i)).toBeTruthy()
})

it("Given no API has been provided, AddBook shows that it is loading", async () => {
    const mockApi = new Observable<any>()

    const {getByText} = render(
        <AddBook api$={mockApi}></AddBook>
    )

    await waitFor(() => expect(getByText(/Loading/i)).toBeTruthy())
})

it("When typing, the author field should suggest authors", async () => {
    const mockApi = {
        getAuthors: jest.fn(() => OE.right([{id: 1, name: "Test Author"} as Author])),
        addBook: unimpl
    }

    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )
    
    fireEvent.input(getAuthorInputElement(), {target: {value: "Tes"}})
    await waitFor(() => expect(result.getByText("Test Author")).toBeTruthy())
})
