import { useAuth0 } from "@auth0/auth0-react"
import React from "react"
import { Link } from "react-router-dom"
import { Loading } from "./Loading";

const NavBar = () => {

    const {isAuthenticated, isLoading, user, loginWithRedirect, logout} = useAuth0();

    if (isLoading) {
        return <Loading />;
    }

    return (<nav>
        <Link to="/">Home</Link>
        <Link to="/addBook">Add book</Link>
        
        {isAuthenticated ?
            <LogoutButton /> : <LoginButton />}
    </nav>)
}


const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
  
    return <button id="login" onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
    const { logout } = useAuth0();
  
    return (
      <button id="logout" onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </button>
    );
  };

export default NavBar