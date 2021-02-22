# kirjasto-frontend

The frontend for the [kirjasto](https://github.com/vuolen/kirjasto) library management system.

# Documentation
This project uses
- [Preact](https://preactjs.com/) for the UI (used identically to React)
- [Ant Design](https://ant.design/) for common UI components and styling
- [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) for observables
- [Auth0](https://auth0.com/) for authentication and authorization with the backend

## Local development
See the [main repo](https://github.com/vuolen/kirjasto) for a local development environment.

## Running production with docker

- `docker build --target prod -t kirjasto-frontend .`
- `docker run --rm -it -e BACKEND_URL=BACKENDURL --name kirjasto-frontend --network=host kirjasto-frontend`
