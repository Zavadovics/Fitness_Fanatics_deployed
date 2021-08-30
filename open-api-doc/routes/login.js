import express from 'express';
import { nanoid } from 'nanoid';
const router = express.Router();

const idLength = 24;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         userName:
 *           type: string
 *           description: The userName of the user
 *         lastName:
 *           type: string
 *           description: The lastName of the user
 *         firstName:
 *           type: string
 *           description: The firstName of the user
 *         email:
 *           type: string
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         gender:
 *           type: string
 *           description: The gender of the user
 *         cityOfResidence:
 *           type: string
 *           description: The city of residence of the user
 *         weight:
 *           type: string
 *           description: The weight of the user
 *         birthDate:
 *           type: string
 *           description: The DOB of the user
 *         motivation:
 *           type: string
 *           description: The motivation of the user
 *
 *       example:
 *         _id: 60c77f12835fce44a438d333
 *         userName: Pistike
 *         lastName: Nagy
 *         firstName: Istvan
 *         email: pisti@gmail.com
 *         password: mypassword
 *         gender: ferfi
 *         cityOfResidence: Kiskunhalas
 *         weight: 84
 *         birthDate: 1963.07.12
 *         motivation: Hajra
 */

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: The login managing API
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Logs in a user
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                   description: user email
 *                 password:
 *                   type: string
 *                   description: user password
 *               required:
 *                 - email
 *                 - password
 *             example:
 *               email: maris@gmail.com
 *               password: aaaaaaaaaa
 *     responses:
 *       200:
 *         description: The user has successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 200
 *                 token:
 *                   type: string
 *                   description: user token
 *                 lastName:
 *                   type: string
 *                   description: lastName of user
 *                 firstName:
 *                   type: string
 *                   description: firstName of user
 *                 email:
 *                   type: string
 *                   description: email address of user
 *                 id:
 *                   type: string
 *                   description: id of user
 *               required:
 *                 - status
 *                 - token
 *                 - lastName
 *                 - firstName
 *                 - email
 *                 - id
 *             example:
 *               status: 200
 *               token: jidsf878hd6jf66gjszeMSH_KDUE55FE
 *               lastName: Nagy
 *               firstName: Maria
 *               email: maris@gmail.com
 *               id: 60c77f12835fce44a438d333
 *
 *       400:
 *         description: Validation of the user's login details failed
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
 *       403:
 *         description: The user's email or password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 403
 *                 message:
 *                   type: string
 *                   description: Az általad megadott email cím vagy jelszó helytelen
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 403
 *               message: Az általad megadott email cím vagy jelszó helytelen
 *
 *       404:
 *         description: The user's email address is not yet registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   description: 404
 *                 message:
 *                   type: string
 *                   description: Az általad megadott email cím még nincs regisztrálva
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 404
 *               message: Az általad megadott email cím még nincs regisztrálva
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
 *                   description: Adatbázis probléma
 *               required:
 *                 - status
 *                 - message
 *             example:
 *               status: 500
 *               message: Adatbázis probléma
 */

router.post('/', (req, res) => {
  try {
    const user = {
      _id: nanoid(idLength),
      ...req.body,
    };

    req.app.db.get('users').push(user).write();

    res.send(user);
  } catch (error) {
    return res.status(500).send(error);
  }
});

export default router;
