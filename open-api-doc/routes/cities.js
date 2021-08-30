import express from 'express';
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     City:
 *       type: object
 *       required:
 *         - name
 *         - value
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the city
 *         name:
 *           type: string
 *           description: Name of the city
 *         value:
 *           type: string
 *           description: Value of the city
 *
 *       example:
 *         _id: 60c77f12835fce44a438d19b
 *         name: New York
 *         value: New York
 */

/**
 * @swagger
 * tags:
 *   name: Cities
 *   description: API that manages cities
 */

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Returns the list of all the cities
 *     tags: [Cities]
 *     responses:
 *       200:
 *         description: The list of all cities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/City'
 *       400:
 *         description: Something went wrong
 */

router.get('/', (req, res) => {
  const cities = req.app.db.get('cities');

  res.send(cities);
});

export default router;
