import { Button, ButtonProps, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "../hooks/useAuth0";
import { Loading } from "./Loading";

const NavBar = () => {

    const {isAuthenticated, isLoading, user, loginWithRedirect, logout} = useAuth0();

    if (isLoading) {
        return <Loading />;
    }

    return (
      <Menu mode="horizontal">
        <Menu.Item><Link to="/">Home</Link></Menu.Item>
        <Menu.Item><Link to="/addBook">Add book</Link></Menu.Item>
        
        {isAuthenticated ?
            <LogoutButton /> : <LoginButton />}
      </Menu>)
}


const LoginButton = (props: ButtonProps) => {
    const { loginWithRedirect } = useAuth0();
  
    return (
      <Button {...props} data-cy="login" onClick={() => loginWithRedirect()}>
        Log In
      </Button>
    );
};

const LogoutButton = (props: ButtonProps) => {
    const { logout } = useAuth0();
  
    return (
      <Button {...props} data-cy="logout" onClick={() => logout({ returnTo: window.location.origin })}>
        Log Out
      </Button>
    );
  };

export default NavBar