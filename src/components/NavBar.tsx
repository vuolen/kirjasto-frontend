import { useAuth0 } from "../hooks/useAuth0"
import React from "react"
import { Link } from "react-router-dom"
import { Button, ButtonProps, Menu } from "semantic-ui-react";
import { Loading } from "./Loading";

const NavBar = () => {

    const {isAuthenticated, isLoading, user, loginWithRedirect, logout} = useAuth0();

    if (isLoading) {
        return <Loading />;
    }

    return (
      <Menu>
        <Menu.Item as={Link} to="/">Home</Menu.Item>
        <Menu.Item as={Link} to="/addBook">Add book</Menu.Item>
        
        {isAuthenticated ?
            <LogoutButton /> : <LoginButton />}
      </Menu>)
}


const LoginButton = (props: ButtonProps) => {
    const { loginWithRedirect } = useAuth0();
  
    return (
      <Button {...props} id="login" onClick={() => loginWithRedirect()}>
        Log In
      </Button>
    );
};

const LogoutButton = (props: ButtonProps) => {
    const { logout } = useAuth0();
  
    return (
      <Button {...props} floated="right" id="logout" onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </Button>
    );
  };

export default NavBar