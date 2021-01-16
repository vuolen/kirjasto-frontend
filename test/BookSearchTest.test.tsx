import { fireEvent, getByLabelText, render } from "@testing-library/react"
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

it("BookSearch doesnt show a filtered book", () => {
    const books = [{id: 1, title: "Test Book"}, {id: 2, title: "Second Book"}]
    const {getByLabelText, queryByText} = render(
        <BookSearch api$={of({getBooks: () => of(books)})}></BookSearch>
    )

    fireEvent.change(getByLabelText(/Search/i), {target: {value: "Sec"}})
    expect(queryByText(books[0].title)).toBeFalsy()
})