// const express = require('express')

// const router = express.Router()

// const aboutController = require('./controller')

// /**
// * @swagger
// *   /api/about:
// *      get:
// *          security:
// *              - Bearer: []
// *          tags:
// *              -   About Us
// *          description: get about us 
// *          
// *                                            
// *          responses:
// *              200 :
// *                  description: Fetched about us
// *
// */
// router.get('/', aboutController.getAboutUs)

// /**
// * @swagger
// *   /api/about:
// *      put:
// *          security:
// *              - Bearer: []
// *          tags:
// *              -   About Us
// *          description: update about us 
// *          parameters:
// *              -   in: body
// *                  name : request body
// *                  description: All fields are required.
// *                  type: object
// *                  schema:
// *                      properties: 
// *                          content:
// *                              type: string
// *                              required : true
// *                              example: 'about us'
// *                                            
// *          responses:
// *              200 :
// *                  description:About us updated
// *
// */
// router.put('/', aboutController.updateAboutUs)

// module.exports = router