# Station Spec - Internal DB

The Spec project running against Station's internal database.

# Spec CLI - Setup

#### 1) Install Spec

```bash
$ npm install -g @spec.dev/cli @spec.dev/spec
```

#### 2) Login to your account

```bash
$ spec login
```

#### 3) Create the `.spec` config folder in your app

*This project is already initialized, so this can be skipped.*
```bash
$ spec init
```

#### 3) Set your current project

```bash
$ spec use project station/internal
```

This tells the CLI which of your Spec projects to reference as the *current* project for certain commands (such as streaming logs). Projects on Spec follow an `<org>/<name>` convention, similar to GitHub repositories, and I went ahead and created the `station/internal` project for you. Each project has a specific set of API keys, and this command automatically pulls those for you.

# Running Spec

Overview of how to run the Spec client in different environments and against different databases (local vs. hosted).

### Requirements

* `docker`
* `npm` (>= 8)
* `node` (>= 16)
* `postgres` (>= 14)
* `psql`

## Local Spec Client -> Local Database

Run the Spec client locally against a local database.

#### 1) If the local database doesn't exist, create it:

```bash
createdb <db_name>
```

#### 2) Update `connect.toml` with info to connect to local database:

```toml
[local]
name = '<db_name>'
port = 5432           # Change if different
user = '<superuser>'  # Usually either your username or postgres
password = ''         # Can most likely leave blank
```

#### 3) Start Spec

From the root of this project:

```bash
$ spec start
```

## Local Spec Client -> Cloud Database

Run the Spec client locally against a hosted cloud database.

```bash
$ spec start --url <DB_URL>
```

# Logs

To view the logs for the locally running Spec client:

```bash
$ spec logs --local
```

To view the logs for your production Spec deployment:

```bash
$ spec logs 
```

# Other Helpful Commands

Get back to the dashboard:

```bash
$ spec open
```