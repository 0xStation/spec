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
$ spec use project <nsp>/<name>
```

4) Make sure your local postgres instance is running on localhost:5432

### Registering Contracts

Walkthrough: https://www.loom.com/share/9afb941219914926ad1567568405022e?sid=7f48eb70-f313-4ddd-bb31-cd50866151a7

Usage:

```bash
$ spec register contracts 0x123,0x456,0x789 \
    --chain 5 \
    --group station.Membership \
    --abi path/to/abi.json
```

### Testing Live Objects

It's easy to test your Live Objects locally using live data from Spec's event network.

To test a single Live Object:

```bash
$ spec test object Membership
```

To test multiple at the same time:

```bash
$ spec test objects Split,SplitRecipient
```

To test all Live Objects in this folder simultaneously:

```bash
$ spec test objects .
```

The Live Object testing process will:<br>
1) Create a Postgres table for each Live Object in your local database.
2) Subscribe to all inputs (events & contract calls) that your Live Objects depend on.
3) Route new inputs (events & contract calls) into their respective Live Object handler functions.

### Testing On Historical Input Data

Being able to test Live Objects on a range of historical input data is great, especially if those events or contract calls don't occur on-chain very often.

Test a Live Object on the previous 30 days of input events/calls:

```bash
$ spec test object Membership --recent
```

Test a Live Object from a specific day forward:

```bash
$ spec test object Membership --from 5.1.2023
```

Test a Live Object on its entire history of input data.

```bash
$ spec test object Membership --all-time
```