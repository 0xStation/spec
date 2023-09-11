# Station Live Objects

Live Objects for [Station](https://station.express).

# Developing & Testing Locally

To test live objects locally, first make sure the following requirements are met/installed.

### Requirements

* Node.js >= 16
* Deno >= 1.3 (+recommend the Deno/Denoland VSCode extension)
* Postgres >= 14
* Spec CLI

**Helpful Links**

* [Install Deno](https://deno.com/manual@v1.33.1/getting_started/installation)
* [Install Postgres with Brew](https://www.moncefbelyamani.com/how-to-install-postgresql-on-a-mac-with-homebrew-and-lunchy/)

### Setup

1) Install the Spec CLI:

```bash
$ npm install -g @spec.dev/cli
```

2) Login to your account:

```bash
$ spec login
```

3) Make sure one of your Spec projects has been set as the *current* one (Spec just needs to use one of your project's api keys when subscribing to input events during testing).

```bash
$ spec use project station/internal
```

4) Make sure your local postgres instance is running on localhost:5432

### Great guides

These guides are currently written with the Allo protocol as reference examples, but should still be very helpful:

https://github.com/spec-dev/allo/tree/master/guides

* [CLI Setup](https://github.com/spec-dev/allo/blob/master/guides/CLI-Setup.md)
* [Creating Contract Groups](https://github.com/spec-dev/allo/blob/master/guides/Contract-Groups.md)
* [Writing Live Objects](https://github.com/spec-dev/allo/blob/master/guides/Writing-Live-Objects.md)
* [Testing Live Objects](https://github.com/spec-dev/allo/blob/master/guides/Testing-Live-Objects.md)

### Random Tips

* Since the "block-related properties" of your live object get automatically set for you before your event handlers run, you should be able to reference them in your handlers when needed as `this.blockNumber`, `this.blockHash`, `this.blockTimestamp`, and `this.chainId`, respectively.

* If you ever need to return early from a handler in a "do nothing" case, make sure to `return false` -- this tells our live object runner not to try and "auto-save" the live object class after the handler function finishes.

# Running the Spec Client Locally

1) Make sure your CLI and local Spec client are up to date:

```bash
$ npm i -g @spec.dev/cli @spec.dev/spec
```

2) Make sure Postgres is running

```bash
$ psql
```

4) Link your local folder (this repo) to your Spec project:

```bash
$ spec link project station/internal .
```

5) Make sure your `.spec/connect.toml` is pointed to the local DB you want to run the Spec client against. If you don't have this file yet (since it's gitignored, you can use this as a template):

```toml
# Local database.
[local]
name = 'station' # whatever your local db name is
port = 5432
host = 'localhost'
user = '<your-db-username>' # whatever shows up as your user when you type "psql"
password = '' # can just leave blank
```

6) Make sure you have both `Membership` and `PointsBalance` tables inside your local DB. I assume this is a migration from Prisma.

7) Make sure your `<column> = <property>` data mappings are exactly how you want them inside of the `Live Columns` section of `.spec/project.toml`:

9) Jump into your handlers folder and `npm install`:
```
$ cd .spec/handlers
$ npm install
$ cd ../../
```

9) Back in your root folder, start the Spec client :)

```bash
$ spec start
```

This should kick off the Spec client against your local DB and also locally set up your event handlers (so that you can test these too.
