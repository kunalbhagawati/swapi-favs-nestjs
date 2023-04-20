## Description

SWAPI API based favorites app (backend) built
using [Nest](https://github.com/nestjs/nest).

## Requirements
- Node _v18.14.1_
  - [Optional] Install [`nvm`](https://github.com/nvm-sh/nvm) to help manage node versions.
- [Docker](https://www.docker.com/products/docker-desktop/) to help with the DB and redis containers.

## Installation

```bash
$ npm install
```

Copy the `.env.template` file into `.env` and `.env.test` files.

```bash
$ cp .env.template .env
$ cp .env.template .env.test
```

## Running the app

```bash
# Spin up the third-party containers
$ docker compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e
```

## License

MIT license.
