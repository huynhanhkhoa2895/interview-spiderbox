# Welcome to Shorten URL Project 👋

> The test for interview

### ✨ [Demo](http://localhost:3000)

## Docker Information

```sh
- OS: Debian
- MySql: 8.*
```

## Docker When First Run

```sh
docker build -t laravel-react .
docker volume create --name=db
docker volume create --name=app
```

## Docker Usage

```sh
docker-compose up
```

## Backend Information

```sh
PHP version: 8.0
Laravel : 8.*
Mysql: 8.*
```

## Backend Install

```sh
composer install
php artisan migrate
```

## Backend Usage

```sh
Web already run laravel from vhost apache
```

## How to I Shorten url?

```sh
First: I string splicing consist of random number, timestamp and url then I hash all with MD5 
Second: I choose random 6 characters from this hash
Third: Check URL have existed in database yet. If it is exist I will turn back to first step and If not I will use this hash as code for shorten URL
```

## Frontend Information

```sh
Node version: 14.*
React : 17.0.*
```

## Frontend Install

```sh
yarn install
```
## Frontend Usage

```sh
yarn start
```

## Run tests

```sh
yarn test
```

## Author

👤 **khoa**

* Github: [@huynhanhkhoa2895](https://github.com/huynhanhkhoa2895)

## Show your support

Give a ⭐️ if this project helped you!


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
