import { withAuthenticationRequired } from "@auth0/auth0-react"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import AddBook from "./components/AddBook"
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory"
import BookSearch from "./components/BookSearch"
import NavBar from "./components/NavBar"
import PathNotFound from "./components/PathNotFound"

const ProtectedRoute = ({ component, ...args }: any) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
);

const App = () => {

    return (
        <BrowserRouter>
            <Auth0ProviderWithHistory>
                <NavBar />
                <Switch>
                    <Route exact path="/" component={BookSearch} />
                    <ProtectedRoute path="/addBook" component={AddBook} />
                    <Route path="*" status={404} component={PathNotFound} />
                </Switch>
            </Auth0ProviderWithHistory>
        </BrowserRouter>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))
