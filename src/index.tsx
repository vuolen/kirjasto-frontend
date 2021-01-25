import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useApi } from "./api"
import AddBook from "./components/AddBook"
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory"
import BookSearch from "./components/BookSearch"
import { Loading } from "./components/Loading"
import NavBar from "./components/NavBar"
import PathNotFound from "./components/PathNotFound"

import 'semantic-ui-css/semantic.min.css'

const App = () => {

    const { loginWithRedirect } = useAuth0()
    const { isAuthenticated, isLoading, api$ } = useApi()

    const ProtectedRoute = ({ component, ...args }: any) => {
        if (isLoading) {
            return <Loading/>
        }
        if (!isAuthenticated) {
            loginWithRedirect()
            return <Loading/>
        }
        return <Route render={() => React.createElement(component, {api$})} {...args} />
    }

    return (
        <React.Fragment>
            <NavBar />
            <Switch>
                <Route exact path="/" render={() => <BookSearch api$={api$} />} />
                <ProtectedRoute path="/addBook" component={AddBook} /> {/* TODO: Make more elegant */}
                <Route path="*" status={404} component={PathNotFound} />
            </Switch>
        </React.Fragment>
    )
}

ReactDOM.render(
    <BrowserRouter>
        <Auth0ProviderWithHistory>
            <App />
        </Auth0ProviderWithHistory>
    </BrowserRouter>, 
    document.getElementById("root")
)
