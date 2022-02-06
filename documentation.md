# Movieku

## Overview Routes :

> ## /users :
>
> - `POST, /users/login`
> - `POST, /users/register`
>
> ## /movies
>
> - `GET, /movies`
> - `POST, /movies`
> - `GET, /movies/:movieId`
> - `PUT, /movies/:movieId`
> - `DELETE, /movies/:movieId`

## `POST, /users/login`

Login into an already registered account.

### request.body:

```json
{
  "username": "string",
  "email": "string"
}
```

### If success: code 200

```json
{
  "email": "email@email.com",
  "token": "Generated JWT Token"
}
```

### If fail to validate : code 401

```json
{
  "Error": "Wrong Email or Password"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `POST, /users/register`

Register new account into the database with admin as its role

### request.body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

### If success: code 201

```json
{
  "id": "1",
  "username": "example_name",
  "email": "example@mail.com",
  "role": "admin",
  "phoneNumber": "123412341234",
  "address": "example address"
}
```

### If fail to validate : code 400

```json
{
  "Error": "Email is Required"
}
OR
{
  "Error": "Email Cannot be Null"
}
OR
{
  "Error": "Must be in Email Format"
}
OR
{
  "Error": "Email Must be Unique"
}
OR
{
  "Error": "Password is Required"
}
OR
{
  "Error": "Password Cannot be Null"
}
OR
{
  "Error": "Password Length At Least 5 Letters"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `POST, /movies`

Create a new database entry on a table named "Movies"

### request.body:

```json
{
  "title": "string",
  "synopsis": "text",
  "trailerUrl": "string",
  "imgUrl": "string",
  "rating": "float",
  "genreId": "integer",
  "AuthorId": "integer"
}
```

### If success: code 201

```json
{
    "id": 2,
    "title": "title",
    "synopsis": "synopsis",
    "trailerUrl": "exampleurl.com",
    "imgUrl": "exampleurl.com",
    "rating": 3,
    "genreId": 1,
    "authorId": 1,
    "updatedAt": "2022-02-02T15:17:36.892Z",
    "createdAt": "2022-02-02T15:17:36.892Z"
}
```

### If fail to validate : code 400

```json
{
  "Error": "Title Cannot be Null"
}
OR
{
  "Error": "Title is Required"
}
OR
{
  "Error": "Synopsis is Required"
}
OR
{
  "Error": "Synopsis Cannot be Null"
}
OR
{
  "Error": "Rating Can't be Less than 1"
}
OR
{
  "Error": "Rating Cannot be Null"
}
OR
{
  "Error": "Rating is Required"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `GET, /movies`

List all movies currently stored in database from table named "Movies"

### If success: code 200

```json
[
  {
    "id": 1,
    "title": "No Country for Old Men",
    "synopsis": "A hunter's life takes a drastic turn when he discovers two million dollars while strolling through the aftermath of a drug deal. He is then pursued by a psychopathic killer who wants the money.",
    "trailerUrl": "https://www.youtube.com/watch?v=38A__WT3-o0",
    "imgUrl": "https://upload.wikimedia.org/wikipedia/id/8/8b/No_Country_for_Old_Men_poster.jpg",
    "rating": 8,
    "genreId": 2,
    "authorId": 2,
    "createdAt": "2022-02-01T13:33:38.474Z",
    "updatedAt": "2022-02-02T13:55:48.517Z"
  },
  ...,
]
```

### If failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `GET, /movies/:movieId`

Find one instance of movie that has the same id as ':movieId' from table named "Movies"

### request.params:

```json
{
  "movieId": "integer"
}
```

### If success: code 200

```json
{
  "id": 1,
  "title": "No Country for Old Men",
  "synopsis": "A hunter's life takes a drastic turn when he discovers two million dollars while strolling through the aftermath of a drug deal. He is then pursued by a psychopathic killer who wants the money.",
  "trailerUrl": "https://www.youtube.com/watch?v=38A__WT3-o0",
  "imgUrl": "https://upload.wikimedia.org/wikipedia/id/8/8b/No_Country_for_Old_Men_poster.jpg",
  "rating": 8,
  "genreId": 2,
  "authorId": 2,
  "createdAt": "2022-02-01T13:33:38.474Z",
  "updatedAt": "2022-02-02T13:55:48.517Z"
}
```

### If failed to find movie : code 404

```json
{
  "Error": "Error Movie not Found" 
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `PUT, /movies/:movieId`

Edit one entry of table "Movies" that has the same id as ':movieId'

### request.params:

```json
{
  "movieId": "integer"
}
```
### request.user:
```json
{
  "authorId": "integer"
}
```
### request.body:

```json
{
  "title": "string",
  "synopsis": "text",
  "trailerUrl": "string",
  "imgUrl": "string",
  "rating": "float",
  "genreId": "integer",
}
```

### If success: code 200

```json
{
    "id": 2,
    "title": "title",
    "synopsis": "synopsis",
    "trailerUrl": "exampleurl.com",
    "imgUrl": "exampleurl.com",
    "rating": 3,
    "genreId": 1,
    "authorId": 1,
    "updatedAt": "2022-02-02T15:17:36.892Z",
    "createdAt": "2022-02-02T15:17:36.892Z"
}
```

### If failed to find movie : code 404

```json
{
  "Error": "Error Movie not Found" 
}
```

### If fail to validate : code 400

```json
{
  "Error": "Title Cannot be Null"
}
OR
{
  "Error": "Title is Required"
}
OR
{
  "Error": "Synopsis is Required"
}
OR
{
  "Error": "Synopsis Cannot be Null"
}
OR
{
  "Error": "Rating Can't be Less than 1"
}
OR
{
  "Error": "Rating Cannot be Null"
}
OR
{
  "Error": "Rating is Required"
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```

## `DELETE, /movies/:movieId`

Delete an entry of movie from table named "Movies"

### request.params:

```json
{
  "movieId": "integer"
}
```

### If success: code 200

```json
{
    "id": 2,
    "title": "title",
    "synopsis": "synopsis",
    "trailerUrl": "exampleurl.com",
    "imgUrl": "exampleurl.com",
    "rating": 3,
    "genreId": 1,
    "authorId": 1,
    "updatedAt": "2022-02-02T15:17:36.892Z",
    "createdAt": "2022-02-02T15:17:36.892Z"
}
```

### If failed to find movie : code 404

```json
{
  "Error": "Error Movie not Found" 
}
```

### If anything else failed : code 500

```json
{
  "Error": "Internal Server Error"
}
```
