import { fireEvent, getByLabelText, prettyDOM, render, waitForElementToBeRemoved } from "@testing-library/react"
import React from "react"
import { of } from "rxjs"
import BookSearch from "../src/components/BookSearch"

it("BookSearch shows the titles of the books the api returns", () => {
    const books = [{id: 1, title: "Test Book"}, {id: 2, title: "Second Book"}]
    const {queryByText} = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    expect(queryByText(/Test Book/)).toBeTruthy()
    expect(queryByText(/Second Book/)).toBeTruthy()
})

it("BookSearch doesnt show a book filtered by title", () => {
    const books = [{id: 1, title: "Test Book"}, {id: 2, title: "Second Book"}]
    const {getByPlaceholderText, queryByText, getByText} = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    fireEvent.input(getByPlaceholderText(/Search/i), {target: {value: "Sec"}})


    expect(queryByText(books[0].title)).toBeFalsy()
})


it("BookSearch shows a book searched by author", () => {
    const books = [{id: 1, title: "Test Book", author: {id: 1, name: "Test Author"}}]
    const {getByPlaceholderText, queryByText} = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    fireEvent.input(getByPlaceholderText(/Search/i), {target: {value: "Author"}})


    expect(queryByText(books[0].title)).toBeTruthy()
})

it("BookSearch doesnt show a book filtered by author", () => {
    const books = [{id: 1, title: "Test Book", author: {id: 1, name: "Test Author"}}]
    const {getByPlaceholderText, queryByText} = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    fireEvent.input(getByPlaceholderText(/Search/i), {target: {value: "Different Author"}})


    expect(queryByText(books[0].title)).toBeFalsy()
})