const router = require('express').Router();

// Imports
const User = require('./user');
const { isAuthenticatedUser, authorizeRoles }  = require('../../middlewares/auth')
/**
 * @swagger
 * definitions:
 *   user:
 *      type: object
 *      properties:
 *          name: 
 *              type: string
 *          email: 
 *              type: string
 *          password: 
 *              type: string
 */

// # REGISTER
/**
 *  @swagger
 *    /api/register:
 *         post:
 *          tags:
 *              - Authentication 
 *          security:
 *              - Bearer: []  
 *          summary: Signup for user
 *          operationId: signup
 *          consumes:
 *              - application/json
 *              - application/xml 
 *          produces:
 *              - application/json
 *              - application/xml
 *          parameters: 
 *              - in: body
 *                name: body
 *                description: signup for users
 *                required: true
 *                schema:
 *                   $ref: '#/definitions/user' 
 *          responses:
 *              200:
 *                description: OK
 */
 router.route('/register').post(User.registerUser);

//# LOGIN
/**
 * @swagger
 *  /api/login:
 *      post:
 *          tags:
 *              - Authentication
 *          security:
 *              - Bearer: []
 *          summary: Login for user after register
 *          parameters:
 *          - in: body
 *            name: user
 *            schema:
 *              type: body
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *          responses:
 *                  200:
 *                    description: OK
 */
 router.route('/login').post(User.loginUser);

// # FORGOT PASSWORD
/**
 * @swagger
 *  /api/password/forgot:
 *      post:
 *          tags:
 *              - Authentication
 *          security:
 *              - Bearer: []
 *          summary: Forgot password
 *          parameters:
 *          - in: body
 *            name: user
 *            schema: 
 *              type: object
 *              properties:
 *                  email: 
 *                      type: string
 *          responses:
 *                 200:
 *                   description: OK
 */
 router.route('/password/forgot').post(User.forgotPassword);

// # RESET PASSWORD
/**
 * @swagger
 *  /api/password/reset/{token}:
 *      put:
 *          security:
 *              - Bearer: []
 *          tags:       
 *              - Authentication
 *          summary: Reset Password
 *          description: Reset Password
 *          operationId: ResetPassword
 *          produces:
 *              - application/xml
 *              - application/json
 *          parameters:
 *              - in: path
 *                name: token
 *                description: token provided by email link thorugh (click the link and copy id form url)
 *                required: true
 *                schema:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *              - in: body
 *                name: body
 *                description: enter your new password
 *                required: on 
 *                schema:
 *                  type: object
 *                  properties:
 *                      password:
 *                          type: string
 *                      confirmPassword:
 *                          type: string
 *          requrestBody:
 *              description: request body
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              password:
 *                                  type: string
 *                              confirmPassword:
 *                                  type: string
 *          responses:
 *              200:
 *                  description: OK
 */
 router.route('/password/reset/:token').put(User.resetPassword)

 // # LOGOUT
 /**
  * @swagger
  *  /api/logout:
  *     get:
  *         tags:
  *             - Authentication
  *         security:
  *             -Bearer: []
  *         summary: Logout User
  *         responses:
  *             200:
  *                 description: OK
  */
  router.route('/logout').get(User.logout);


//# MY PROFILE
/**
 * @swagger
 *  /api/me:
 *      get:
 *          tags:
 *              - User
 *          security:
 *              - Bearer: []
 *          summary: view you profile
 *          responses:
 *              200:
 *                  description: OK
 */   
 router.route('/me').get(isAuthenticatedUser,User.getUserDetails);

// UPDATE MY PROFILE
/**
 * @swagger
 *  /api/me/update:
 *      put:
 *          tags:
 *              - User
 *          security:
 *              - Bearer: []
 *          summary: Update Profile
 *          description:
 *          operationId: update
 *          consumes:
 *              - application/json
 *              - application/xml
 *          produces:
 *              - application/json
 *              - application/xml
 *          parameters:
 *              - in: body
 *                name: body
 *                description: Update Your Profile
 *                required: true
 *                schema: 
 *                  type: object
 *                  properties:
 *                      name: 
 *                          type: string
 *                      email: 
 *                          type: string
 *          responses:
 *              200:
 *                  description: OK
 */
 router.route('/me/update').put(isAuthenticatedUser,User.updateProfile)

//# UPDATE OR CHANGE PASSWORD
/**
 * @swagger
 *  /api/password/update:
 *      put:
 *          tags:
 *              - User
 *          security:
 *              - Bearer: []
 *          summary: Update Password After Login
 *          description:
 *          operationId: update
 *          consumes:
 *              - application/json
 *              - applicaiton/xml
 *          produces:
 *              - application/json
 *              - application/xml
 *          parameters:
 *              - in: body
 *                name: body
 *                description: Update Your Password
 *                required: true
 *                schema:
 *                  type: object
 *                  properties:
 *                      oldPassword:
 *                          type: string
 *                      newPassword:
 *                          type: string
 *                      confirmPassword:
 *                          type: string
 *          responses:
 *              200:
 *                  description: OK
 *  
 */
 router.route('/password/update').put(isAuthenticatedUser,User.updatePassword)

// UPDATE ROLE
/**
 * @swagger
 *  /api/admin/user/{id}:
 *      put: 
 *          security:
 *              - Bearer: []
 *          tags:
 *              - Admin
 *          summary: Update Role
 *          description: Update Role
 *          operationId: Update Role
 *          produces:
 *              - application/json
 *              - application/xml
 *          parameters:
 *              - in: path
 *                name: id
 *                description: Token provided by email link through (Click the link and copy id from url)
 *                required: true
 *                schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *              - in: body 
 *                name: body
 *                description: Enter Your New Password
 *                required: on
 *                schema:       
 *                  type: object
 *                  properties:
 *                      role:
 *                          type: string
 *                      email:  
 *                          type: string
 *                      name:   
 *                          type: string          
 *          requestBody:
 *              description: request body
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                          role:
 *                              type: string
 *                          email:
 *                              type: string
 *                          name:
 *                              type: string
 *          responses:
 *              200:
 *                  description: OK
 */
 router.route('/admin/user/:id').put(isAuthenticatedUser,authorizeRoles("admin"),User.updateUserRole)

// # VIEW SINGLE USER
/**
 * @swagger
 *  /api/admin/user/{id}:
 *      get:
 *          tags:
 *              - Admin
 *          security:
 *              - Bearer: []
 *          summary: view single user
 *          parameters:
 *             - in: path
 *               name: id
 *               description: id
 *               required: true
 *               schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *          responses:
 *              200:
 *                  description: OK  
 */
 router.route('/admin/user/:id').get(isAuthenticatedUser,authorizeRoles("admin"),User.getSingleUser)

// # DELETE SINGLE USER
/**
 * @swagger
 *  /api/admin/user/{id}:
 *      delete:
 *          tags:
 *              - Admin
 *          security:
 *              - Bearer: []
 *          summary: Delete single user
 *          parameters:
 *              - in: path
 *                name: id
 *                description: id
 *                required: true
 *                schema:
 *                  type: object 
 *                  properties:
 *                      id: 
 *                          type: string
 *          responses: 
 *              200:
 *                  description: OK
 */
 router.route('/admin/user/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),User.deleteUser)

// # VIEW ALL USERS
/**
 * @swagger
 *  /api/admin/users:
 *      get:
 *          tags:
 *              - Admin
 *          security:
 *              - Bearer: []
 *          summary: View all users
 *          responses:
 *              200:
 *                  description: OK
 */
 router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles("admin"),User.getAllUsers)

module.exports = router;