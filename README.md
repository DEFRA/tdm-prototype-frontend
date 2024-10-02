# tdm-prototype-frontend

This is the ALVS Replacement project prototype frontend application.

## Docker Compose

Docker compose is the easiest way to get started with the project. Docker compose will bring up a local environment with:

- Localstack for AWS services (S3, SQS)
- Redis
- MongoDB
- The prototype front end.
- The prototype back end
- A CDP OAuth Stub

It assumes the backend project repo has been cloned to a sibling the frontend project to this one:

- \<root\>
  - tdm-prototype-backend
  - tdm-prototype-frontend

The TDM prototype needs to be paired with a DMP environment (we connect to the data lake and Azure Service Bus). The best DMP environment to connect to is currently SND.

To do this the backend project requires a .env file with secrets, you can get this from one of the devs on
the team and store it in the backend project:

`tdm-prototype-backend/TdmPrototypeBackend.Api/Properties/local.env`

```bash
docker compose up --build -d
```

The services should then be accessible:

- [Frontend](http://tdm-prototype-frontend.localtest.me:7001/)
- [Backend](http://tdm-prototype-backend.localtest.me:7080/)
- [Oauth stub](http://cdp-defra-id-stub.localtest.me:7200/)

The key features of the project are then described on the homepage of the frontend

You then need to:

- Create a user in the Oauth Stub, this will allow you to use the authenticated parts of the UI/API
- Sync data from DMP into the local mongo database
  - [Clearance Requests](http://tdm-prototype-frontend.localtest.me:3000/auth/proxy/sync/clearance-requests/lastmonth)
  - [Notifications](http://tdm-prototype-frontend.localtest.me:3000/auth/proxy/sync/notification/lastmonth)

## Core Delivery Platform

This project is based on the Core Delivery Platform Node.js Frontend Template.

- [Requirements](#requirements)
  - [Node.js](#nodejs)
- [Redis](#redis)
- [Server-side Caching](#server-side-caching)
- [Local Development](#local-development)
  - [Setup](#setup)
  - [Development](#development)
  - [Local JSON API](#local-json-api)
  - [Production](#production)
  - [Npm scripts](#npm-scripts)
  - [Formatting](#formatting)
    - [Windows prettier issue](#windows-prettier-issue)
- [Docker](#docker)
  - [Development Image](#development-image)
  - [Production Image](#production-image)
- [Licence](#licence)
  - [About the licence](#about-the-licence)

## Requirements

### Node.js

Please install [Node.js](http://nodejs.org/) `>= v18` and [npm](https://nodejs.org/) `>= v9`. You will find it
easier to use the Node Version Manager [nvm](https://github.com/creationix/nvm)

To use the correct version of Node.js for this application, via nvm:

```bash
cd tdm-prototype-frontend
nvm use
```

## Server-side Caching

We use Catbox for server-side caching. By default the service will use CatboxRedis when deployed and CatboxMemory for local development.
You can override the default behaviour by setting the `SESSION_CACHE_ENGINE` environment variable to either `redis` or `memory`.

Please note: CatboxMemory (`memory`) is _not_ suitable for production use! The cache will not be shared between each instance of the service and it will not persist between restarts.

## Redis

Redis is an in-memory key-value store. Every instance of a service has access to the same Redis key-value store similar to how services might have a database (or MongoDB). All frontend services are given access to a namespaced prefixed that matches the service name. e.g. `my-service` will have access to everything in Redis that is prefixed with `my-service`.

If your service does not require a session cache to be shared between instances or if you don't require Redis, you can disable setting `SESSION_CACHE_ENGINE=false` or changing the default value in `~/src/config/index.js`.

## Local Development

### Setup

Install application dependencies:

```bash
npm install
```

### Development

To run the application in `development` mode run:

```bash
npm run dev
```

### Local JSON API

Whilst the APIs are being developed this app uses a local JSON mock API. To start this locally run:

```bash
npm run mockApi
```

### Production

To mimic the application running in `production` mode locally run:

```bash
npm start
```

### Npm scripts

All available Npm scripts can be seen in [package.json](./package.json)
To view them in your command line run:

```bash
npm run
```

### Formatting

#### Windows prettier issue

If you are having issues with formatting of line breaks on Windows update your global git config by running:

```bash
git config --global core.autocrlf false
```

## Docker

### Development image

Build:

```bash
docker build --target development --no-cache --tag tdm-prototype-frontend:development .
```

Run:

```bash
docker run -p 3000:3000 tdm-prototype-frontend:development
```

### Production image

Build:

```bash
docker build --no-cache --tag tdm-prototype-frontend .
```

Run:

```bash
docker run -p 3000:3000 tdm-prototype-frontend
```

## Licence

THIS INFORMATION IS LICENSED UNDER THE CONDITIONS OF THE OPEN GOVERNMENT LICENCE found at:

<http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3>

The following attribution statement MUST be cited in your products and applications when using this information.

> Contains public sector information licensed under the Open Government license v3

### About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable
information providers in the public sector to license the use and re-use of their information under a common open
licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
