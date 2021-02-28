import "preact/debug"
import { useAuth0 } from "./hooks/useAuth0"
import React from "preact/compat"
import ReactDOM from "preact/compat"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { useApi } from "./api"
import AddBook from "./components/AddBook"
import Auth0ProviderWithHistory from "./components/Auth0ProviderWithHistory"
import BookSearch from "./components/BookSearch"
import { Loading } from "./components/Loading"
import NavBar from "./components/NavBar"
import PathNotFound from "./components/PathNotFound"
import 'antd/dist/antd.compact.css';
import { Layout } from "antd"

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
        <Layout style={{height: "100%", padding: "10px"}}>
            <NavBar />
            <Layout.Content>
                <Switch>
                    <Route exact path="/" render={() => <BookSearch api$={api$} />} />
                    <ProtectedRoute path="/addBook" component={AddBook} />
                    <Route path="*" status={404} component={PathNotFound} />
                </Switch>
            </Layout.Content>
        </Layout>
    )
}

ReactDOM.render(
    <BrowserRouter>
        <Auth0ProviderWithHistory>
            <App />
        </Auth0ProviderWithHistory>
    </BrowserRouter>, 
    document.getElementById("root")!
)
