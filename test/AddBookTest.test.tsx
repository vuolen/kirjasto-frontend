import { RenderResult, fireEvent, render, configure, waitFor } from '@testing-library/preact';
import React from "react"
import { Observable, of } from "rxjs"
import AddBook from "../src/components/AddBook"
import "./matchMedia.js"

/**
 * @jest-environment jsdom
 */

configure({testIdAttribute: 'data-cy'})

function inputTitle(res: RenderResult, title: string) {
    const titleInput = res.getByLabelText(/Title/i) as HTMLInputElement
    fireEvent.input(titleInput, {target: {value: title}})
    expect(titleInput.value).toBe(title)
    return titleInput
}

function submitForm(res: RenderResult) {
    fireEvent.click(res.getByText(/^Add$/i))
}

const unimpl = () => { throw new Error("Unimplemented") }

// TODO find out why resetFields doesnt work in RTL
/* it("AddBook clears the form after submitting", async () => {
    const mockApi = {
        addBook: jest.fn(() => of({id: 1, title: "Test Book"})),
        getAuthors: () => of([])
    }

    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )

    const titleInput = inputTitle(result, "Test Book")
    submitForm(result)

    await waitFor(() => expect(titleInput.value).toBe(""))
}) */

it("AddBook has author input", async () => {
    const mockApi: any = {getAuthors: () => of([])}
    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )
    await waitFor(() => expect(result.getByTestId("author")).toBeTruthy())
})

it("AddBook calls the api on submit", async () => {
    const mockApi = {
        addBook: jest.fn(() => of({id: 1, title: "Test Book"})),
        getAuthors: () => of([])
    }

    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )
    const titleInput = inputTitle(result, "Test Book")
    submitForm(result)

    await waitFor(() => expect(mockApi.addBook.mock.calls.length).toBe(1))
})

it("Given the API returns an error, when the user adds a book, AddBook shows that error", async () => {
    const mockApi = of({
        addBook: () => of({error: "API Error"}),
        getAuthors: () => of([])
    })

    const result = render(
        <AddBook api$={mockApi}></AddBook>
    )
    
    const titleInput = inputTitle(result, "Test Book")
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
        getAuthors: jest.fn(() => of([{id: 1, name: "Test Author"}])),
        addBook: unimpl
    }

    const result = render(
        <AddBook api$={of(mockApi)}></AddBook>
    )
    
    const authorInput = await result.findByLabelText(/Author/i) as HTMLInputElement
    fireEvent.input(authorInput, {target: {value: "Tes"}})

    await waitFor(() => expect(result.getByText("Test Author")).toBeTruthy())
})