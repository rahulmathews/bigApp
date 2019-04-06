# bigApp
Task from bigApp

Available API end points :

POST  http://localhost:portNumber(default : 3000)/register    - register users 

Possible params(body) :
{
	"email" : "email acc",
	"password" : "password",
	"role" : "ADMIN"/ "USER" (default : "USER"),
	"userName" : "name"
}

POST  http://localhost:portNumber(default : 3000)/balanced    - perform balanced/unbalanced operation

Possible params(body) :
{
	"data" : "insert paranthesis" (eg : "[()]")
}

GET  http://localhost:portNumber(default : 3000)/users    - get Users(Only works for admin users)

DELETE  http://localhost:portNumber(default : 3000)/users/userId    - delete User(Only works for admin users)


Folder Structure:

|   index.js
|   package-lock.json
|   package.json
|   README.md
|   tree.txt
|   
+---.vscode
|       launch.json
|       
+---config
|       config.js
|       
+---controller
|       adminController.js
|       userController.js
|       
+---middlewares
|       auth.js
|       
+---model
|       Account.js
|       Balanced.js
|       
+---node_modules
|    
+---routes
        admin_routes.js
        routes.js
        user_routes.js
        
config.js : It consists of port on which the server should run and the name of the mongodb connection

index.js : Our program starts from here. It consists of middlewares to use and imports routes

routes.js : It consists of all the routes(Api end points) provided by this project

admin_routes.js : It is the extension of route function from routes.js for admin routes

user_routes.js : It  is the extensiion of route function from route.js for normal users

controller : This folder consists of the mongodb operations on the collections

admin_controller.js : It consists of all the functions directed from admin_routes.js

user_controller.js : It consists of all the functions directed from user_routes.js

Model : It consists of all the collections and their models required for the project.

