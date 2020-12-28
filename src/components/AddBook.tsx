import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useState } from "react"
import { FormEvent } from "react"

const AddBook = () => {

    const {user, getAccessTokenSilently} = useAuth0()

    const [title, setTitle] = useState("")

    const submit = (ev: FormEvent) => {
        setTitle("")
        ev.preventDefault()
    }

    return <div>
        <h2>Add a new book</h2>
        <ErrorMessage />
        <form onSubmit={submit}>
            <label htmlFor="title">Title:</label>
            <input onChange={ev => setTitle(ev.target.value)} type="text" name="title" id="title" value={title}></input>
            <input type="submit" id="submit" value="Add"></input>
        </form>
    </div>
}

const ErrorMessage = () => (
    <div className="error">
    </div>
)

export default AddBook