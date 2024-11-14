## 🛠️ Backend API Documentation

### **Register User**
- **Endpoint**: `POST /register`
- **Description**: Registers a new user by accepting email, username, and password.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "username": "user123",
    "password": "securePass"
  }


Response:
json
Copy code
{
  "message": "User Registered Successfully",
  "token": "<JWT Token>",
  "username": "user123",
  "id": "<User ID>"
}
Validation:
email: Must be a valid email.
username: Must not be empty.
password: Must be at least 6 characters.


Login User
Endpoint: POST /login
Description: Logs in an existing user with email and password.
Request Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "securePass"
}
Response:
{
  "message": "Login Successful",
  "token": "<JWT Token>",
  "username": "user123",
  "id": "<User ID>"
}


Validation:
email: Must be a valid email.
password: Password is required.
Create Car Item
Endpoint: POST /create-item
Description: Allows an authenticated user to create a new car item listing.
Headers:
Authorization: Bearer <JWT Token>
Request Body:
{
  "title": "Tesla Model 3",
  "description": "Electric car by Tesla",
  "tags": ["electric", "sedan"],
  "carType": "sedan",
  "company": "Tesla",
  "dealer": "Tesla Dealer",
  "images": ["image1.jpg", "image2.jpg"],
  "userId": "<User ID>"
}
Response:
json
Copy code
{
  "message": "Car item created successfully",
  "newCar": {
    "_id": "<Car ID>",
    "title": "Tesla Model 3",
    "description": "Electric car by Tesla",
    "tags": ["electric", "sedan"],
    "carType": "sedan",
    "company": "Tesla",
    "dealer": "Tesla Dealer",
    "images": ["image1.jpg", "image2.jpg"],
    "userId": "<User ID>"
  }
}


Middleware: verifyUser - Checks if the user is authenticated using JWT.
Get User's Cars
Endpoint: GET /user-cars
Description: Fetches all car listings created by the authenticated user. Supports search and filtering.

Query Parameters:
userId: The user’s ID whose cars need to be fetched.
search: (Optional) Keyword to search in the car's title, description, or tags.
carType: (Optional) Filter by car type (e.g., sedan, SUV).
company: (Optional) Filter by car manufacturer.
dealer: (Optional) Filter by car dealer.
Response:
[
  {
    "_id": "<Car ID>",
    "title": "Tesla Model 3",
    "description": "Electric car by Tesla",
    "tags": ["electric", "sedan"],
    "carType": "sedan",
    "company": "Tesla",
    "dealer": "Tesla Dealer",
    "images": ["image1.jpg", "image2.jpg"],
    "userId": "<User ID>"
  },
  {
    "_id": "<Car ID>",
    "title": "BMW 5 Series",
    "description": "Luxury car by BMW",
    "tags": ["luxury", "sedan"],
    "carType": "sedan",
    "company": "BMW",
    "dealer": "BMW Dealer",
    "images": ["image3.jpg", "image4.jpg"],
    "userId": "<User ID>"
  }
]
Get Car by ID
Endpoint: GET /cars/:id
Description: Fetches details of a specific car by ID.



Path Parameter:
id: The ID of the car to retrieve.
Response:
json
Copy code
{
  "_id": "<Car ID>",
  "title": "Tesla Model 3",
  "description": "Electric car by Tesla",
  "tags": ["electric", "sedan"],
  "carType": "sedan",
  "company": "Tesla",
  "dealer": "Tesla Dealer",
  "images": ["image1.jpg", "image2.jpg"],
  "userId": "<User ID>"
}


Delete Car Item
Endpoint: DELETE /products/:id
Description: Deletes a specific car item by ID. Only the owner of the car can delete it.
Path Parameter:
id: The ID of the car to delete.
Response:
json
{
  "message": "Car deleted successfully"
}


Update Car Item
Endpoint: PUT /products/:id
Description: Allows an authenticated user to update a car item by ID.
Path Parameter:
id: The ID of the car to update.
Request Body:
json

{
  "title": "Tesla Model X",
  "description": "Updated description for the car",
  "tags": ["electric", "luxury"],
  "carType": "SUV",
  "company": "Tesla",
  "dealer": "Tesla Dealer"
}
Response:
json
Copy code
{
  "message": "Car details updated successfully"
}


🛡️ Authentication
JWT Token: The API uses JWT (JSON Web Tokens) for authentication. After successful registration or login, the user receives a token that must be included in the Authorization header of subsequent requests.
Authorization: Bearer <JWT Token>


📥 Error Handling
If an error occurs, the server will return a JSON object with a message and the relevant error status:
404 Not Found: If the requested resource is not found.
500 Internal Server Error: For server-side issues.
Example Error Response:

json
Copy code
{
  "message": "Car not found"
}
json
Copy code
{
  "message": "Failed to update car details"
}


