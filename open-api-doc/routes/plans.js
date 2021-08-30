import express from 'express';
const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *   schemas:
 *     Plan:
 *       type: object
 *       required:
 *         - user_id
 *         - user_email
 *         - title
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the training plan
 *         user_id:
 *           type: string
 *           description: ID of the user who uploaded the training plan
 *         user_email:
 *           type: string
 *           description: Email address of the user who uploaded the training plan
 *         title:
 *           type: string
 *           description: Title of the training plan given by the user
 *         originalName:
 *           type: string
 *           description: The original name of the file
 *         avatar:
 *           type: string
 *           description: The Cloudinary URL of the training plan
 *         cloudinary_id:
 *           type: string
 *           description: The Cloudinary ID of the training plan
 *
 *       example:
 *         _id: 60c77f12835fce44a438d19b
 *         user_id: 60fc016e026bee97315ba1e4
 *         user_email: haho@gmail.com
 *         title: 42 KM marathon plan
 *         originalName: Running-plan-template_42k.pdf
 *         avatar: https://res.cloudinary.com/dywtied0r/image/upload/v1627889086/tii7t48rtw1qeytnpah3.pdf
 *         cloudinary_id: tii7t48rtw1qeytnpah3
 */

/**
 * @swagger
 * tags:
 *   name: Training plans
 *   description: API that manages training plans
 */

/**
 * @swagger
 * /plan:
 *   get:
 *     summary: Returns the list of all the training plans
 *     tags: [Training plans]
 *     responses:
 *       200:
 *         description: The list of all training plans
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Plan'
 *
 *       400:
 *         description: Something went wrong
 *     security:
 *     - bearerAuth: []
 */

router.get('/', (req, res) => {
  const plans = req.app.db.get('plans');

  res.send(plans);
});

/**
 * @swagger
 * /plan:
 *   post:
 *     summary: Uploads a training plan
 *     tags: [Training plans]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: upfile
 *         type: file
 *         required: true
 *         description: The training plan to upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plan'
 *     responses:
 *       200:
 *         description: New training plan has been uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 200
 *                 message:
 *                   type: string
 *                   description: Sikeres edzésterv feltöltés
 *                 plan:
 *                   type: object
 *                   description: The url of the newly-uploaded training plan
 *               required:
 *                 - status
 *                 - message
 *                 - plan
 *             example:
 *               status: 200
 *               message: Sikeres edzésterv feltöltés
 *               plan: url of the training plan
 *
 *       400:
 *         description: Validation of the training plan's details failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 400
 *                 message:
 *                   type: string
 *                   description: error.details[0].message
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 400
 *               message: error.details[0].message
 *
 *       500:
 *         description: Something went wrong
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 500
 *                 message:
 *                   type: string
 *                   description: Edzésterv feltöltés sikertelen
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Edzésterv feltöltés sikertelen
 *     security:
 *     - bearerAuth: []
 */

router.post('/', (req, res) => {
  try {
    const plan = {
      _id: nanoid(idLength),
      ...req.body,
    };

    req.app.db.get('plans').push(plan).write();

    res.send(plan);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
