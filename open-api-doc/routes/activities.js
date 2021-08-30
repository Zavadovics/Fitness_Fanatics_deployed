import express from 'express';
import { nanoid } from 'nanoid';
const router = express.Router();

const idLength = 24;

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
 *     Activity:
 *       type: object
 *       required:
 *         - user_id
 *         - email
 *         - activityDate
 *         - activityTime
 *         - duration
 *         - activityType
 *         - distance
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the completed activity
 *         user_id:
 *           type: string
 *           description: The id of the user associated with the activity
 *         email:
 *           type: string
 *           description: The email address of the user associated with the activity
 *         activityDate:
 *           type: string
 *           description: The start date of the activity
 *         activityTime:
 *           type: string
 *           description: The start time of activity
 *         duration:
 *           type: number
 *           description: The duration of the activity
 *         activityType:
 *           type: string
 *           description: The type of the activity
 *         distance:
 *           type: number
 *           description: The distance of the activity
 *         comment:
 *           type: string
 *           description: A comment left for the activity
 *
 *       example:
 *         _id: 60c77f12835fce44a438d19b
 *         user_id: 60f55b2e406f3d3ec1e2a0fa
 *         email: kispista@gmail.com
 *         activityDate: 2021-06-30T00:00:00.000+00:00
 *         activityTime: 13:00
 *         duration: 65
 *         activityType: úszás
 *         distance: 8300
 *         comment: éjszakai furdozes
 */

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: API that manages activities
 */

/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Gets all activities of the logged in user
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The list of all activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *       404:
 *         description: Something went wrong
 *     security:
 *     - bearerAuth: []
 */

router.get('/:id', (req, res) => {
  const activities = req.app.db
    .get('activities')
    .find({ user_id: req.params.id })
    .value();

  if (!activities) {
    res.sendStatus(404);
  }

  res.send(activities);
});

/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Updates the activity by id
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The activity id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Activity'
 *     responses:
 *       200:
 *         description: The activity has been updated
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
 *                   description: Sikeres módosítás. A tevékenység frissítésre került az adatbázisban
 *                 updatedActivity:
 *                   type: object
 *                   description: The details of the newly-updated activity
 *               required:
 *                 - status
 *                 - message
 *                 - updatedActivity
 *             example:
 *               status: 200
 *               message: Sikeres módosítás. A tevékenység frissítésre került az adatbázisban
 *               updatedActivity: details of the updated activity
 *
 *       500:
 *         description: Updating activity failed
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
 *                   description: Sikertelen módosítás. Adatbázis probléma
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Sikertelen módosítás. Adatbázis probléma
 *     security:
 *     - bearerAuth: []
 */

router.put('/:id', (req, res) => {
  try {
    req.app.db
      .get('activities')
      .find({ user_id: req.params.id })
      .assign(req.body)
      .write();

    res.send(req.app.db.get('activities').find({ user_id: req.params.id }));
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Adds a new activity
 *     tags: [Activities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/Activity'
 *     responses:
 *       201:
 *         description: New activity has been saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 201
 *                 message:
 *                   type: string
 *                   description: Sikeres mentés. Az új tevékenységet hozzádtuk az adatbázishoz
 *                 newActivity:
 *                   type: object
 *                   description: The details of the newly-created activity
 *               required:
 *                 - status
 *                 - message
 *                 - newActivity
 *             example:
 *               status: 201
 *               message: Sikeres mentés. Az új tevékenységet hozzádtuk az adatbázishoz
 *               newActivity: details of the activity
 *
 *       400:
 *         description: Validation of the activity's details failed
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
 *                   description: Sikertelen mentés. Adatbázis probléma
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Sikertelen mentés. Adatbázis probléma
 *     security:
 *     - bearerAuth: []
 */

router.post('/', (req, res) => {
  try {
    const activity = {
      _id: nanoid(idLength),
      ...req.body,
    };

    req.app.db.get('activities').push(activity).write();

    res.send(activity);
  } catch (error) {
    return res.status(500).send(error);
  }
});

/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Deletes the activity by id
 *     tags: [Activities]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The activity id
 *
 *     responses:
 *       200:
 *         description: The activity has been deleted
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
 *                   description: Tevékenység sikeresen törölve
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 200
 *               message: Tevékenység sikeresen törölve
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
 *                   description: Tevékenység törlése sikertelen
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Tevékenység törlése sikertelen
 *     security:
 *     - bearerAuth: []
 */

router.delete('/:id', (req, res) => {
  req.app.db.get('activities').remove({ _id: req.params.id }).write();

  res.sendStatus(200);
});

export default router;
