# kirjasto-frontend

# Running production with docker

- `docker build --target prod -t kirjasto-frontend .`
- `docker run --rm -it -e BACKEND_URL=BACKENDURL --name kirjasto-frontend --network=host kirjasto-frontend`
