import { fireEvent, getByLabelText, prettyDOM, render, RenderResult, waitFor, waitForElementToBeRemoved } from "@testing-library/preact"
import React from "react"
import { of } from "rxjs"
import BookSearch from "../src/components/BookSearch"
import "./matchMedia.js"

const search = async (res: RenderResult, searchString: string) => {
    const search = await res.findByPlaceholderText(/Search/i)
    fireEvent.input(search, {target: {value: searchString}})
    fireEvent.keyDown(search, { key: 'Enter', keyCode: 13 })
}

it("BookSearch shows the titles of the books the api returns", () => {
    const books = [{id: 1, title: "Test Book"}, {id: 2, title: "Second Book"}]
    const {findByText} = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    expect(findByText(/Test Book/)).toBeTruthy()
    expect(findByText(/Second Book/)).toBeTruthy()
})

it("BookSearch doesnt show a book filtered by title", async () => {
    const books = [{id: 1, title: "Test Book"}, {id: 2, title: "Second Book"}]
    const res = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    search(res, "Sec")


    await waitFor(() => expect(res.queryByText(books[0].title)).toBeFalsy())
})


it("BookSearch shows a book searched by author", async () => {
    const books = [{id: 1, title: "Test Book", author: {id: 1, name: "Test Author"}}]
    const res = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    search(res, "Sec")

    await waitFor(() => expect(res.queryByText(books[0].title)).toBeTruthy())
})

it("BookSearch doesnt show a book filtered by author", async () => {
    const books = [{id: 1, title: "Test Book", author: {id: 1, name: "Test Author"}}]
    const res = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    search(res, "Sec")


    await waitFor(() => expect(res.queryByText(books[0].title)).toBeFalsy())
})