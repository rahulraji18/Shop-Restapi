const router = require('express').Router();

const { newOrder, 
    getSingleOrder, 
    myOrders, 
    getAllOrders,
    updateOrder,
    deleteOrder
} = require('../../controllers/order/order');
const { isAuthenticatedUser, 
    authorizeRoles 
} = require('../../middlewares/auth');

// # NEW ORDER
/**
 * @swagger
 *  /api/order/new:
 *      post:
 *          tags:
 *              - Order
 *          security:
 *              - Bearer: []      
 *          summary: Add new order
 *          parameters:
 *              - in: body
 *                name: order
 *                schema: 
 *                  type: object
 *                  properties:
 *                      itemPrice:
 *                          type: integer
 *                          format: int64
 *                      taxPrice:
 *                          type: integer
 *                          format: int64
 *                      shippingPrice:
 *                          type: integer
 *                          format: int64
 *                      totalPrice: 
 *                          type: integer
 *                          format: int64
 *                      orderStatus: 
 *                          type: string 
 *                          enum: ["processing","pending","delivered"]   
 *
 *          orderItems:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 product: 
 *                   type: string
 *                 name: 
 *                   type: name                     
 *                 price:
 *                   type: integer
 *                   format: int64   
 *                 image:
 *                   type: string
 *                 quantity:
 *                   type: integer
 *                   format: int64 
 *
 *          shippingInfo:
 *             type: array
 *             items:
 *               type: object
 *               properties:                                          
 *                 address: 
 *                   type: string
 *                 city: 
 *                   type: string                     
 *                 state:
 *                   type: string 
 *                 country:
 *                   type: string
 *                 pincode:
 *                   type: integer
 *                   format: int64     
 *                 phno:
 *                   type: integer
 *                   format: int64  
 *
 *          paymentInfo:
 *             type: array
 *             items:
 *               type: object
 *               properties:   
 *                 id: 
 *                   type: string
 *                 status: 
 *                   type: string  
 *                   enum: ["succeeded","failed"] 
 *          responses: 
 *              200:
 *                  description: OK   
 */
router.route('/order/new').post(isAuthenticatedUser,newOrder);

// # MY ORDERS
/**
 * @swagger
 *  /api/orders/me:
 *      get:
 *          tags:
 *              - Order
 *          security:
 *              - Bearer: []
 *          summary: My orders
 *          responses:
 *              200:
 *                  description: OK 
 */
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);

// # GET ALL ORDERS
/**
 * @swagger
 *  /api/admin/orders:
 *      get:
 *          tags:
 *              - Order
 *          security:
 *              - Bearer: []
 *          sumamry: All orders
 *          responses:
 *              200:
 *                  description: OK 
 */
router.route('/orders/me').get(isAuthenticatedUser,myOrders);

// # GET SINGLE ORDER
/**
 * @swagger
 *  /api/order/{id}:
 *      get:
 *          tags:
 *              - Order
 *          security:
 *              - Bearer: []
 *          summary: View single order
 *          parameters:
 *              - in: path
 *                name: id
 *                description: id of a order             
 *                required: id of a order
 *                schema:
 *                  type: object
 *                  properties:
 *                      id:
 *                          type: string
 *          responses:
 *              200:
 *                  description: OK        
 */       
router.route('/admin/orders').get(isAuthenticatedUser,authorizeRoles("admin"),getAllOrders);

// # DELETE ORDER  
/**
 * @swagger
 * 
 * /api/admin/order/{id}:
 *   delete:
 *     tags: 
 *       - Order
 *     security:
 *       - Bearer: []
 *     summary: delete order
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:    
 *               type: string        
 *     responses:
 *       200:
 *         description: OK  
 */     
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateOrder);

// # UPDATE ORDER STATUS
/**
 * @swagger
 *  /api/admin/order/{id}:
 *   put:
 *     tags: 
 *       - Order
 *     security:
 *       - Bearer: []
 *     summary: update order status
 *     parameters:
 *       - in: path
 *         name: id
 *         description: id
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:    
 *               type: string  
 *       - in: body
 *         name: body
 *         description: enter your new password
 *         required: on
 *         schema:
 *           type: object
 *           properties:   
 *             status:
 *               type: string                
 *     requestBody: 
 *       description: request body  
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:   
 *             status:
 *               type: string  
 *
 *     responses:
 *       200:
 *          description: OK                        
 */
router.route('/admin/order/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder);    

module.exports = router;
