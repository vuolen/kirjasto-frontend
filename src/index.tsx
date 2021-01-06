import { withAuthenticationRequired } from "@auth0/auth0-react"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useApi } from "./api"
import AddBook from "./components/AddBook"
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory"
import BookSearch from "./components/BookSearch"
import NavBar from "./components/NavBar"
import PathNotFound from "./components/PathNotFound"

const ProtectedRoute = ({ component, ...args }: any) => (
    <Route component={withAuthenticationRequired(component, )} {...args} />
);

const App = () => {

    const api$ = useApi()

    return (
        <React.Fragment>
            <NavBar />
            <Switch>
                <Route exact path="/" render={() => <BookSearch api$={api$} />} />
                <Route path="/addBook" render={() => React.createElement(withAuthenticationRequired(AddBook), {api$})} /> {/* TODO: Make more elegant */}
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
