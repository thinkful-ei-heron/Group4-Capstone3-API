# DearBeer

#### Created by: Andrea Bender, Maria Danielson, Jonny Deates, Evan Vogts

# About
Server is used for back end of app and connects to client. 

### [Live Page](https://dearbeer.now.sh/)

## Technoligies Used
Client side: React, Javascript, Zeit, HTML and CSS.

Server side: Express.js, Node.js, PostgreSQL and Heroku. 

[Client](https://github.com/thinkful-ei-heron/Group4-Capstone-3.git) |
[Server](https://github.com/thinkful-ei-heron/Group4-Capstone3-API.git)

## URL/ Endpoints: 

## /api/auth/
POST: responds with JWT auth token using secrete when user enters valid user credentials.

PUT: Re-authenticates the user, refreshes token. 

        {
            user_name: String,
            password: String
        }

            res.body
        {
            authToken: String
        }

## /api/journals
GET: Gets and renders journals stored in database

        {
             
            journals: object
        }

POST: Submits a journal as an object and stores it in the database 

DELETE: Allows user to delete a journal by id. 

PATCH :  allows user to edit field in specific journal by id. 



## /api/users
POST: Lets user register for an account and posts data into the database so user can login next time.
        {
        user_name: String,
        password: String
        }

        {
        id: userId,
        user_name: String,
        }
 
