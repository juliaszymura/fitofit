# Fitofit

Backend for Fitofit app that allows to track distance you go by foot.

To start app:

```
npm start
```

To start app in development mode:

```
docker-compose up
```

Tests are configured to run against a postgres database running in a container. To run tests:

```
docker-compose up

npm run test
```

## API

### Get all exercises

Retrieve all exercises. Each entry represents:

```json
{
  "date": "date when exercise was submitted",
  "distance": "calculated distance in km"
}
```

**Request:**

```
GET /api/exercises
```

**Response:**

```json
Content-Type: application/json

[
  {
    "date": "2020-01-27T19:03:17.942Z",
    "distance": 2.92
  },
  {
    "date": "2020-10-27T10:21:21.942Z",
    "distance": 14.75
  },
  {
    "date": "2021-01-27T20:09:14.942Z",
    "distance": 3.14
  }
]
```

### Submit exercise

Submit a new exercise. Response contains date when exercise was submitted and calculated distance in km.

Request body schema: application/json

Request body should contain `start` and `end` fields with addresses.
Format: "Plac Europejski 2, Warszawa, Polska"

**Request:**

```json
POST /api/exercises
Content-Type: application/json

{
  "start": "Wawel 5, Kraków, Polska",
  "end": "Waszyngtona 1, Kraków, Polska"
}
```

**Response:**

```json
Content-Type: application/json

{
  "date": "2021-01-29T15:10:30.768Z",
  "distance": 2.92
}
```

### Get grouped exercises from current month

Retrieve current month exercises grouped by day. Each entry represents a pair:

```json
{
  "date": "sum of all exercises from this date in km"
}
```

**Request:**

```
GET /api/exercises/grouped/current-month
```

**Response:**

```json
Content-Type: application/json

{
  "2021-01-27": 5.51,
  "2021-01-28": 47.06,
  "2021-01-29": 5.84
}
```

## Sending requests manually

I used Visual Studio Code plugin [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) to send requests. Supported requests can be found in requests folder.
