Project based on node runtime environment and express framework.

To run this project you have to have installed and running MongoDb on your computer.
Add .env file to repository with variable:
SECRET_AUTH=my secret key
cmd -> 
npm install
npm start

If database is empty in user collection will be created automatically one administrator with:
username: Admin
password: Admin123

Authentication is based on JWT check in header 'x-access-token'.

Here is five sample request to API:
ANONYMOUS:

Create user(return status and message): 
curl --request POST \
  --url http://localhost:3000/anonymous/register \
  --header 'content-type: application/json' \
  --data '{
	"username": "username",
	"password": "password1"
}'

Login (return token):
curl --request POST \
  --url http://localhost:3000/anonymous/login \
  --header 'content-type: application/json' \
  --data '{
	"username": "username",
	"password": "password1"
}'

AUTHENTICATE:

Show my all tokens (we can have multiple tokens):
curl --request GET \
  --url http://localhost:3000/auth/show-tokens \
  --header 'x-access-token: YOUR ACCESS TOKEN'

Adding role to your account 
curl --request PUT \
  --url http://localhost:3000/auth/add-me-role \
  --header 'content-type: application/json' \
  --header 'x-access-token: YOUR ACCESS TOKEN' \
  --data '{
	"role": "ADMIN"
}'


AUTHENTICATE + AUTHORIZED:

Get all users (admin role required + role to filter i query)
curl --request GET \
  --url 'http://localhost:3000/auth/show-users?role=ADMIN' \
  --header 'x-access-token: YOUR ACCESS TOKEN'

What could i improve? For sure errors and validation
-> Validation should be made for request by f.e. joi package.
-> First time trying to not use res with every error f.e res.status(404).json(getJSONErrorModel('Not user with such username')), all should be delegate to app.js to function handling errors and then returns res and after that save it to db. Right now throwError depends on next() what is terrible solution(need to find solution for handle unhandled ex in promises without next())
-> all functions in controllers depends on req, res sometimes next, i could create CommandObject from req and extract body/query/params, next validate and them pass to handlerfile instead of controller