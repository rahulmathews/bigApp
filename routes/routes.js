"use-strict"

const authMiddleware = require("../middlewares/auth")
const user_routes  = require("./user_routes");
const admin_routes = require("./admin_routes");

module.exports = function(app){

    // User routes start //
    
    app.post("/register", user_routes.registerUser) // route to register user

    app.post("/balanced", authMiddleware.authenticateToken, user_routes.performOperation) //route to perform balanced/unbalanced operation

    // User routes end //

    // Admin routes start //

    app.get("/users", authMiddleware.authenticateToken, authMiddleware.authorizeToken, admin_routes.getUsers) // route to list all users 

    app.delete("/users/:userId", authMiddleware.authenticateToken, authMiddleware.authorizeToken, admin_routes.deleteUser) // route to delete user

    // Admin routes end //
}