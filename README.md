# CallByMeaning [![Build Status](https://travis-ci.com/iamnapo/CallByMeaning.svg?token=dPuvXqxKaaMT7sVBkN1H&branch=master)](https://travis-ci.com/iamnapo/CallByMeaning)

## Intro

Code for the server-side of the CallByMeaning Project. You don't need this package to use the project. You can do so by using [cbm-api](https://github.com/iamnapo/cbm-api).

For a bit more information on what you can do, check the [docs](./docs/).

## Run locally

```bash
git clone https://github.com/iamnapo/CallByMeaning.git
cd CallByMeaning
npm install
DB_HOST=mongodb://user:pass@host:port/callbymeaning npm start
```

> Default port is 3000 but you can change that by specifying a PORT env variable.
>
> If mongo is local, you only need to specify the name of the database by using the DB env variable, instead of the DB_HOST.

## Unit Tests

Run tests via the command `npm test`

---

## License

[AGPL-3.0 license](https://opensource.org/licenses/AGPL-3.0).