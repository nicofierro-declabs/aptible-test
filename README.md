<p align="center">
  <h1 align="center">Conneqt Portal API</h1>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#built-with">Built With</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation-for-our-environment">Installation for our environment</a></li>
        <li><a href="#installation-for-docker-environment">Installation for Docker environment</a></li>
      </ul>
    </li>
    <li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#run-scripts">Run Scripts</a></li>
            <li><a href="#api-documentation">API documentation</a></li>
      </ul>
    </li>
    <li>
      <a href="#architecture">Architecture</a>
      <ul>
            <li><a href="#run-scripts">Directory structure</a></li>
            <li><a href="#api">API</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#data-access">Data Access</a></li>
            <li><a href="#configuration">Configuration</a></li>
      </ul>
    </li>
    <li><a href="#docker-extra-information">Docker extra information</a></li>
  </ol>
</details>
<br>



<!-- ## About The Project

Description blablabla -->

## Built With

- NodeJs 14
- NPM 7.7
- Typescript
- HTTP Framework: Express 4.17
- ORM: Objection 2.2
- SQL Driver: Knex
- DB Driver: Postgres 13
- MFA: Speakeasy
- Test: Chai
- Run test: Mocha

## Getting Started

For development, you will only need Node.js and a node global package, installed in your environement. We can setup in our environment or use a Docker environment.

### Installation for our environment

1) Clone the repo
```sh
git clone https://github.com/CardieX/conneqt-portal-backend.git
```

2) Install NPM packages
```sh
npm install
```

3) Create an environment file called .env in the root folder. With the following variables.
* PORT: The port where the API runs
* DB_DIALECT: Driver of database, in our case is postgresql
* DB_HOST: Host where the database is running
* DB_PORT: Port where the database is running
* DB_NAME: Database name
* DB_USER: Database user
* DB_PASSWORD: Database user password
* JWT_ENCRYPTION: JWT ecryption key
* JWT_EXPIRATION: JWT token expiration time
* SALT_ROUNDS: Hash cost factor
* REDIRECT_URL: Url received in invitation email to signup flow
* INVITATION_EXPIRATION_DAYS: Invitation expiration days to signup flow
* MAIL_SERVICE: Email service
* MAIL_HOST: Email host
* MAIL_USER: Email user
* MAIL_PASSWORD: Email user password

#### It's and example
```
PORT=5000

DB_DIALECT=postgresql
DB_HOST=localhost
DB_PORT=5432
DB_NAME=conneqt
DB_USER=postgres
DB_PASSWORD=postgres

JWT_ENCRYPTION=DEF1B6D2F260B7DCB7A3E128EA36642C029D6251F12C15775AFED6C86F951445
JWT_EXPIRATION=7d

SALT_ROUNDS=10

REDIRECT_URL=http://localhost:3000/signup
INVITATION_EXPIRATION_DAYS=7

MAIL_SERVICE=gmail
MAIL_HOST=smtp.gmail.com
MAIL_USER=conneqt.test@gmail.com
MAIL_PASSWORD=conneqt1234
```

### Installation for Docker environment

1) Clone the repo
```sh
git clone https://github.com/CardieX/conneqt-portal-backend.git
```

2) Create an environment file called .env in the root folder. With the following variables.
```
PORT=5000

DB_DIALECT=postgresql
DB_HOST=db
DB_PORT=5432
DB_NAME=conneqt
DB_USER=postgres
DB_PASSWORD=postgres

JWT_ENCRYPTION=DEF1B6D2F260B7DCB7A3E128EA36642C029D6251F12C15775AFED6C86F951445
JWT_EXPIRATION=7d

SALT_ROUNDS=10

REDIRECT_URL=http://web:3000/signup
INVITATION_EXPIRATION_DAYS=7

MAIL_SERVICE=gmail
MAIL_HOST=smtp.gmail.com
MAIL_USER=conneqt.test@gmail.com
MAIL_PASSWORD=conneqt1234
```

3) In the same folder of docker-compose.yml file run:
```sh
docker-compose up
```

4) After get the images run seed database on api container
```sh
npm run seed:run
``` 

5) Now we have running:
- API on port 5000
- Web on port 3000
- Database on port 5432

## Usage

### Run scripts
```js
// Run server with development tools
npm run dev

// Transpile TS files and create production build
npm run build

// Run production build
npm run prod

// Seed database
npm run seed:run

// Create seed
npm run seed:make <name_seed>

// Create migration
npm run migrate:make <name_migration>

// Run migrations
npm run migrate:latest

// Rollback last migrations batch
npm run migrate:rollback

```

### API documentation

Postman documentation with endpoints, params, bodys, descriptions and examples.

[POSTMAN documentation](https://documenter.getpostman.com/view/16821614/TzzEoa8W)

## Architecture

### Directory structure

```bash
.
├── docs
├── node_modules
├── src
│   ├── api
│   │   ├── patients
│   │   ├── permissions
│   │   ├── practices
│   │   ├── users
│   │   ├── utils
│   │   └── index.ts
│   ├── config
│   │   ├── db
│   │   └── config.ts
│   ├── data-access
│   │   ├── models
│   │   ├── repositories
│   │   └── types.ts
│   ├── helpers
│   ├── middlewares
│   ├── services
│   │   ├── PatientService.ts
│   │   ├── PermissionService.ts
│   │   ├── PracticeService.ts
│   │   └── UserService.ts
│   ├── utils
│   ├── App.ts
│   └── index.ts
├── .dockerignore
├── .editorconfig
├── .eslintignore
├── .env
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── .nvmrc
├── Dockerfile
├── error.log
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```

### API
The *api* folder contains a folder for each resource of the express api, such as patients, users, practices, etc.

Inside these folders we always have the same structure
```bash
.
└── api
    ├── <resourse>
    │   ├── controller.ts
    │   ├── dtos.ts
    │   ├── mapper.ts
    │   ├── route.ts
    │   └── validator.ts
    ├── utils
    └──index.ts    
```
- *controller.ts*: contains the methods to be executed on each endpoints
- *dtos.ts*: contains the data transfer objects
- *mapper.ts* contains the methods who map dtos into models
- *route.ts* contains the association of routes with methods in controller.ts
- *validator* contains validators methods of dtos received on each endpoints

### Services
The *services* folder contains all of features. This classes are called by controller methods of api folder.

Structure
```bash
.
└── services
    ├── PatientService.ts
    ├── PermissionService.ts
    ├── PracticeService.ts
    └── UserService.ts
```

### Data Access
The *data-access* folder contains the models of data base with *objection.js*. There are also the data base operations divided by entity repositories.

Structure
```bash
.
└── data-access
    ├── models
    │   ├── invitation.model.ts
    │   ├── multi_factor_auth_backup.model.ts
    │   ├── multi_factor_auth.model.ts
    │   ├── patient.model.ts
    │   ├── permission.model.ts
    │   ├── practice.model.ts
    │   ├── system_role.model.ts
    │   └── user.model.ts
    ├── repositories
    │   ├── interfaces
    │   │   ├── IRead.ts
    │   │   └── IWrite.ts
    │   ├── BaseRepository.ts
    │   ├── InvitationRepository.ts
    │   ├── MultiFactorAuthBackupRepository.ts
    │   ├── MultiFactorAuthRepository.ts
    │   ├── PatientRepository
    │   ├── PermissionRepository.ts
    │   ├── PracticeRepository.ts
    │   └── UserRepository
    └── types.ts
```

### Configuration
The *config* folder contains the environment and data base configurations. Inside the *db* folder are the migrations, seeds and knex settings files.

Structre
```bash
.
└── config
    ├── db
    │   ├── migrations
    │   ├── seeds
    │   ├── knex.ts
    │   └── knexfile.ts        
    └── config.ts
```

## Docker containers information

The cointainer is composed of three images 

| Image      | Name | Port |
|------------|------|-----:|
| Posgres:13 | db   | 5432 |
| Node:14    | api  | 5000 |
| Node:14    | web  | 3000 |

### Volumes
- db
    - ./pgdata:/var/lib/postgresql/data
- api
    - ./conneqt-portal-backend:/usr/src/conneqt-portal-backend
    - /usr/src/conneqt-portal-backend/node_modules
- web
    - ./conneqt-portal-front:/usr/src/conneqt-portal-front
    - /usr/src/conneqt-portal-front/node_modules




