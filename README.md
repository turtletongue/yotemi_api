## How to run the App

You can use docker-compose to start app easily.

First of all, install [docker-compose](https://docs.docker.com/compose/install/) if you don't have it on your machine. Make sure you follow all prerequisites.

Secondly, you must create .env file in the root folder with content like this:

```dotenv
# API Configuration

NODE_ENV=development
PORT=3030

# Database Configuration

POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=meetlane-db-dev
POSTGRES_PORT=5432
POSTGRES_DB=meetlane

# Most of the time you don't need to change this string. Instead you should change the variables above
DATABASE_CONNECTION=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public

# Redis Configuration

REDIS_CONNECTION=redis://:@meetlane-redis-dev:6379

# JWT Configuration

ACCESS_SECRET=secret_with_length_of_25_characters
ACCESS_EXPIRATION_TIME=1800

REFRESH_SECRET=secret_with_length_of_25_characters
REFRESH_EXPIRATION_TIME=2678400

# TON Configuration

TON_API_URL=https://tonapi.io
TON_API_JWT=eyJhbGci...
TON_ALLOWED_AUTH_DOMAIN=localhost:63342
TON_SIGNATURE_EXPIRES_IN=300

# S3 Configuration

S3_KEY_ID=some_key_id
S3_SECRET_KEY=some_secret_key
S3_BUCKET=your-bucket
S3_READ_URL=https://storage.yandexcloud.net/yotemi-uploads
```

Now, you can execute this command:

```shell
# build containers and run application
docker-compose up
```

If you want to stop containers, just use:

```shell
docker-compose stop
```

If you want to remove containers, use:

```shell
docker-compose down
```

## Project Structure

`/prisma` folder contains database schema. If you want to add a new
table to database, you should modify schema.prisma file.

Learn more about prisma in [documentation](https://www.prisma.io/).

`/src/common` folder contains useful services, modules, functions and decorators.

`/src/features` folder contains domain features.
