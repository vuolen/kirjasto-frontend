import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }: any) => {

  const history = useHistory();

  const onRedirectCallback = (appState: any) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain="kirjasto-e2e.eu.auth0.com"
      clientId="kCcOfUimwS5lOzXWBzZyuG6I11ZqDghb"
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience="https://kirjasto-backend.herokuapp.com">

      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;