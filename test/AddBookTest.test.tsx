import { RenderResult } from "@testing-library/react"
import { fireEvent, getByText, render } from "@testing-library/react"
import React from "react"
import { Observable, of } from "rxjs"
import { AuthenticatedApi } from "../src/api"
import AddBook from "../src/components/AddBook"

function inputTitle(res: RenderResult, title: string) {
    const titleInput = res.getByLabelText(/Title/i) as HTMLInputElement
    fireEvent.change(titleInput, {target: {value: title}})
    expect(titleInput.value).toBe(title)
    return titleInput
}

function submitForm(res: RenderResult) {
    fireEvent.click(res.getByText(/^Add$/i))
}

it("AddBook clears the title input after submitting", () => {
    const result = render(
        <AddBook api$={of({addBook: () => of({id: 1, title: "Test Book"})})}></AddBook>
    )
    const titleInput = inputTitle(result, "Test Book")
    submitForm(result)

    expect(titleInput.value).toBe("")
})

it("AddBook calls the api on submit", () => {
    const addBookMock = jest.fn(() => of({id: 1, title: "Test Book"}))

    const result = render(
        <AddBook api$={of({addBook: addBookMock})}></AddBook>
    )
    const titleInput = inputTitle(result, "Test Book")
    submitForm(result)

    expect(addBookMock.mock.calls.length).toBe(1)
})

it("Given the API returns an error, when the user adds a book, AddBook shows that error", () => {
    const mockApi = of({
        addBook: () => of({error: "API Error"})
    })

    const result = render(
        <AddBook api$={mockApi}></AddBook>
    )
    const titleInput = inputTitle(result, "Test Book")
    submitForm(result)

    expect(result.getByText("API Error")).toBeTruthy()
})

it("Given no API has been provided, AddBook shows that it is loading", () => {
    const mockApi = new Observable<Pick<AuthenticatedApi, "addBook">>()

    const {getByText} = render(
        <AddBook api$={mockApi}></AddBook>
    )

    expect(getByText(/Loading/i)).toBeTruthy()
})