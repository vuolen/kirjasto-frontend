import { fireEvent, getByText, render } from "@testing-library/react"
import React from "react"
import { of } from "rxjs"
import AddBook from "../src/components/AddBook"

it("AddBook clears the title input after submitting", () => {
    const mockApi = of({
        addBook: () => of({id: 1, title: "Test Book"})
    })

    const {getByLabelText, getByText} = render(
        <AddBook api$={mockApi}></AddBook>
    )

    const titleInput = getByLabelText(/Title/i) as HTMLInputElement
    fireEvent.change(titleInput, {target: {value: "Test Book"}})
    expect(titleInput.value).toEqual("Test Book")
    fireEvent.click(getByText(/^Add$/i))
    expect(titleInput.value).toEqual("")
})

it("Given the API returns an error, when the user adds a book, AddBook shows that error", () => {
    const mockApi = of({
        addBook: () => of({error: "API Error"})
    })

    const {getByLabelText, getByText} = render(
        <AddBook api$={mockApi}></AddBook>
    )

    const titleInput = getByLabelText(/Title/i) as HTMLInputElement
    fireEvent.change(titleInput, {target: {value: "Test Book"}})
    fireEvent.click(getByText(/^Add$/i))
    expect(getByText("API Error")).toBeTruthy()
})