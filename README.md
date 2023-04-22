## Description

SWAPI API based favorites app (backend) built
using [Nest](https://github.com/nestjs/nest).

## Requirements

- Node _v18.14.1_
    - [Optional] Install [`nvm`](https://github.com/nvm-sh/nvm) to help manage
      node versions.
- [Docker](https://www.docker.com/products/docker-desktop/) to help with the DB
  and redis containers.

## Installation

```bash
$ npm install
```

Copy the `.env.template` file into `.env` and `.env.test` files.

```bash
$ cp .env.template .env
$ cp .env.template .env.test
$ # Append "-test" to `POSTGRES_DBNAME` in `.env.test`.
```

## Docs and notes

Please do go through [docs](./docs) once before you start. :)

## Running the app

```bash
# Spin up the third-party containers
$ docker compose up -d

# Create the test db
$ docker exec -it swapi-favs-postgres sh -c 'psql -U $POSTGRES_USER -c "CREATE DATABASE \"${POSTGRES_DB}-test\""' # or replace ${POSTGRES_DB}-test with your DB name in .env.test

# Migrate the DB
$ npx prisma migrate deploy

# Generate the prisma library
$ npx prisma generate

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## APIs

- [Create users] `curl --location --request POST 'http://localhost:3000/users/'`
- [Get planets] `curl --location 'http://localhost:3000/planets/?search=BHARAAN'
  --header 'user-id: 63717ed2-cfbc-405d-9baf-f2b30c11d360'`
- [Get movies] `curl --location 'http://localhost:3000/movies/?search=few'
  --header 'user-id: 63717ed2-cfbc-405d-9baf-f2b30c11d360'`

> APIs are available via a postman collection (./postman-collection.json)
>
> Use the "create user" API to create a new user.
>
> Change the `user-id` in the GET API headers to the user-id created in the "create user" API.

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## Pending

- Architecture and design flowcharts/diagrams
- Better code documentation.

## License

MIT license.
