import { Auth0Provider, useAuth0 } from "@auth0/auth0-react"
import React from "react"
import ReactDOM from "react-dom"

const AddBookForm = () => {

    const {
        isAuthenticated,
        error,
        user,
        loginWithRedirect,
      } = useAuth0();

    if (!isAuthenticated && error === undefined) {
        loginWithRedirect()
    }

    return <div>
        {JSON.stringify(user)}
    </div>
}

ReactDOM.render(<Auth0Provider
    domain="kirjasto-e2e.eu.auth0.com"
    clientId="kCcOfUimwS5lOzXWBzZyuG6I11ZqDghb">
        <AddBookForm/>
    </Auth0Provider>, document.getElementById("root"))