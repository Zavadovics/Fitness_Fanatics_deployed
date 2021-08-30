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
 *     Photo:
 *       type: object
 *       required:
 *         - user_id
 *         - user_email
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
 *         avatar:
 *           type: string
 *           description: The Cloudinary URL of the training plan
 *         cloudinary_id:
 *           type: string
 *           description: The Cloudinary ID of the training plan
 *
 *       example:
 *         _id: 60c77f12835fce44a438d876
 *         user_id: 60fc016e026bee97315ba543
 *         user_email: kukucs@gmail.com
 *         avatar: https://res.cloudinary.com/dywtied0r/image/upload/v1627889086/tii7t48rtw1qeytnpah3.jpeg
 *         cloudinary_id: tii7t48rtw1qeytnp135
 */

/**
 * @swagger
 * tags:
 *   name: Photos
 *   description: API dealing with photos
 */

/**
 * @swagger
 * /photo/{id}:
 *   get:
 *     summary: Returns the user's profile photo if it exists
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user's profile photo if it exists
 *         content:
 *           application/json:
 *             schema:
 *                 $ref: '#/components/schemas/Photo'
 *       404:
 *         description: Something went wrong
 *     security:
 *     - bearerAuth: []
 */

router.get('/:id', (req, res) => {
  const photo = req.app.db
    .get('photos')
    .find({ user_id: req.params.id })
    .value();

  if (!photo) {
    res.sendStatus(404);
  }

  res.send(photo);
});

/**
 * @swagger
 * /photo/{id}:
 *   put:
 *     summary: Uploads or updates the user's photo
 *     tags: [Photos]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *       - in: formData
 *         name: upfile
 *         type: file
 *         required: true
 *         description: The image to upload
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Photo'
 *     responses:
 *       200:
 *         description: New photo has been uploaded or old one updated
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
 *                   description: Fotó sikeresen feltöltve or Fotó sikeresen módosítva
 *                 image:
 *                   type: object
 *                   description: The url of the newly-uploaded or updated photo
 *               required:
 *                 - status
 *                 - message
 *                 - image
 *             example:
 *               status: 200
 *               message: Fotó sikeresen feltöltve or Fotó sikeresen módosítva
 *               image: url of the photo
 *
 *       400:
 *         description: Validation of the photo's details failed
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
 *                   description: Fotó feltöltés sikertelen
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Fotó feltöltés sikertelen
 *     security:
 *     - bearerAuth: []
 */

router.put('/:id', (req, res) => {
  try {
    req.app.db
      .get('photos')
      .find({ user_id: req.params.id })
      .assign(req.body, req.file)
      .write();

    res.send(req.app.db.get('photos').find({ user_id: req.params.id }));
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /photo/{id}:
 *   delete:
 *     summary: Deletes the user's photo
 *     tags: [Photos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The photo's id
 *
 *     responses:
 *       200:
 *         description: The photos has been deleted
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
 *                   description: Fotó sikeresen törölve
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 200
 *               message: Fotó sikeresen törölve
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
 *                   description: Fotó törlése sikertelen
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Fotó törlése sikertelen
 *     security:
 *     - bearerAuth: []
 */

router.delete('/:id', (req, res) => {
  req.app.db.get('photos').remove({ _id: req.params.id }).write();

  res.sendStatus(200);
});

export default router;
