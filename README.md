# Todolist Backend

## Steps to run this project:

1. Run `yarn` command
2. Setup database settings inside `ormconfig.json` file
3. Run `yarn start` command

## Todolist API Doc

### Common rules

#### Request

`Content-Type` MUST be `application/json`

Clients MUST accept `application/json`.

Without explicit specification, cookies are ignored.

Partial-get is not accepted.

##### Request Authorization

Use [JWT](https://jwt.io/ "JSON Web Tokens").
i.e., send an `Authorization: Bearer <token>` header in the request.

The token is reterived using the `POST /todolist/authenticate` API.

If authorization failed (i.e., the token is invalid), the server will return HTTP 403.

#### Response

Standard status code is 200. (of course)

If the status code is 204, the response is empty. In our API, HTTP 204 is equivalent to HTTP 200 with body `{}` or `[]`

If `Content-Type` is not `application/json`, the response is not valid.

If the status code is not 200, the response is not usable, but, in the form of `{"status":"some description"}`.
In most cases these are server errors.
**Clients MUST NOT try to analyze the status string.**
Just prompt it to users.

#### User constraints

username: string, `/^[a-zA-Z][a-zA-Z0-9-_]{2,15}$/`

password: string

isAdmin: boolean

displayName: string

### Basic todolist functionality

#### POST /todolist/authenticate

Authenticate a user.

The `Authorization` header is not required.

The uploaded body MUST be in the form of `{"user":"<username>","password":"<password in plaintext>"}`.

If the credential is not valid, the server will return HTTP 403.

If a malformed request is uploaded, the response is implementation dependent.

Sample request #1: `POST /todolist/authenticate` body=`{"user":"anonymous","password":"anonymous"}`

Sample response #1: `{"username":"anonymous","displayName":"Anonymous","token":"<base64 encoded token>"}`

Sample request #2: `POST /todolist/authenticate` body=`{"user":"anonymous","password":"wrong password"}`

Sample response #2: (status=403) `{"status":"Invalid credential"}`

#### GET /todolist/items

Enumerate all todolist items.

If the list is empty, `[]` or `{}` will be returned.

Sample request: `GET /todolist/items`

Sample response: `[{"id":1,"title":"This is the content of a item in todolist, and it is super-super-super-super long.","done":true},{"id":33,"title":"Another item","done":false},{"id":99,"title":"<script>alert(\"XSS!\");</script>","done":false}]`

Hint: do not forget HTTP 204

#### POST /todolist/items

Add multiple items.

Note: Servers are not guaranteed to APPEND items. Items may be inserted in the middle of the list.

The property `done` can be omitted. (default: `false`)

Only new items are returned.

Sample request: `POST /todolist/items` body=`[{"title":"A new item"},{"title":"Yet another new item","done":true}]`

Sample response: `[{"id":7,"title":"Yet another new item","done":true},{"id":233,"title":"A new item","done":false}]`

Note: If `[]` is uploaded, nothing will happen on server and `[]` will be returned :)

#### GET /todolist/items/:id

Get the content of a specific item.

If the item is not found, the server will return a HTTP 404.

Sample request #1: `GET /todolist/items/33`

Sample response #1: `{"id":33,"title":"Another item","done":false}`

Sample request #2: `GET /todolist/items/999`

Sample response #2: (status code=404) `{"status":"Item not found"}`

#### PUT /todolist/items/:id

Replace the content of a specific item and return the updated content.

If the item is not found, the server will return a HTTP 404.

If typeof `title` is not string, or typeof `done` is not boolean, the server will return a HTTP 400.

If either `title` or `done` is missing, the server will return a HTTP 400.

Keys other than "title" and "done" are ignored.

Sample request #1: `PUT /todolist/items/33` body=`{"title":"New title","done":true}`

Sample response #1: `{"id":33,"title":"New title","done":true}`

Sample request #2: `PUT /todolist/items/33` body=`{"done":true}`

Sample response #2: (status code=400) `{"status":"Invalid request"}`

#### DELETE /todolist/items/:id

Delete a specific item.

If the item is not found, the server will return a HTTP 404.

If deletion is completed without error, the server may return HTTP 204 or HTTP 200, depending on the implementation of todolist api.

Sample request: `DELETE /todolist/items/33`

Sample response: HTTP 204 No Content

### Administaration API

### GET /users

Enumerate users.

Sample request: `GET /users`

Sample response: `[{"uid":1,"username":"anonymous","isAdmin":false,"displayName":"Anonymous"},{"uid":0,"username":"admin","isAdmin":true,"displayName":"System Admininistrator"}]`

Note: password will not be returned.

### POST /users

Create multiple users.

| Field         | Type                                |
|:-------------:|:------------------------------------|
| `username`    | string                              |
| `password`    | string                              |
| `isAdmin`     | boolean (optional, default=false)   |
| `displayName` | string (optional, default=username) |

Sample request: `POST /users` body=`[{"username":"newuser","password":"qwertyuiop"}]`

Sample response: `[{"uid":2,"username":"newuser","displayName":"newuser","isAdmin":false}]`

### GET /users/:uid

Retrive user properties.

Sample request: `GET /users/1` 

Sample response: `{"uid":1,"username":"anonymous","isAdmin":false,"displayName":"Anonymous"}"`

### DELETE /users/:uid

Delete a user.

Sample request: `DELETE /users/1`

Sample response: HTTP 204 No Content

### PATCH /users/:uid

Modify a user.

| Field         | Type    |
|:-------------:|:--------|
| `username`    | string  |
| `password`    | string  |
| `isAdmin`     | boolean |
| `displayName` | string  |

Sample request #1: `PATCH /users/1` body=`{"displayName":"Not Anonymous"}`

Sample response #1: `{"uid":1,"username":"anonymous","isAdmin":false,"displayName":"Not Anonymous"}"`

Sample request #2: `PATCH /users/1` body=`{"isAdmin":true,"password":"newpassword"}`

Sample response #2: `{"uid":1,"username":"anonymous","isAdmin":true,"displayName":"Anonymous"}"`

Sample request #3: `PATCH /users/1` body=`{}`

Sample response #3: `{"uid":1,"username":"anonymous","isAdmin":false,"displayName":"Anonymous"}"`
