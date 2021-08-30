# FITNESS FANATICS - Sport Alkalmazás

## _Dokumentáció_

## Alkalmazás bemutatása

-     Az alkalmazás különféle sport tevékenységek nyomon követésében nyújt segítséget.

## Főbb funkciók:

- Regisztráció: Vezetéknév, keresztnév, e-mail és jelszó megadásával.
- Bejelentkezés: E-mail cím és jelszó megadásával.
- Jelszó csere: E-mail cím megadása, jelszócsere e-mail kérése céljából, majd az e-mailben lévő linkre kattintva a jelszó cseréje. A linkben küdött token csak 15 percig érvényes.
- Bejelentkezés utáni főoldal: Az összes tevékenység időrendbeli listázása. A listán szereplő tevékenységeket módosítani vagy törölni lehet.
- Új tevékenység hozzáadása: Itt lehet új tevékenységet hozzáadni az adatbázishoz.
- Saját profil: Megjeleníti az adatbázisban szereplő adatainkat. A "módosítás" gombra kattintva átirányít a profil szerkesztése oldalra ahol további adatokkal bővíthetjük profilunkat.
- Saját profil szerkesztése: Az űrlapba betölti azokat az adatokat amiket korábban már megadtunk. Új adatokat adhatunk hozzá az adatbázishoz.
- Saját fotó: Itt új fotót adhatunk hozzá a "photos" kollekcióhoz, lecserélhetjük a régi fotónkat, vagy törölhetjük is.
- Edzéstervek: Az adatbázisban található edzéstervek lekérése és új terv hozzáadása.
- A "városok" nevű adatbázis kollekció a profil szerkesztése oldalon található tartózkodási hely nevű select/dropdown által érhető el. Ez a kollekció Magyarország összes városát tartalmazza amik a legördülő menüben jelennek meg.

## Oldalak

| Oldalak                  | Szerepük                                                                       |
| ------------------------ | ------------------------------------------------------------------------------ |
| /                        | Főoldal (ide érkezik a felhasználó a regisztráció és/vagy bejelentkezés előtt) |
| /register                | Új felhasználó regisztrációja                                                  |
| /login                   | Felhasználó bejelentkezése                                                     |
| /password                | Elfelejtett jelszó - jelszócsere e-mail kérése                                 |
| /password-reset/id/token | Elfelejtett jelszó - Új jelszó megadása                                        |
| /activities              | Bejelentkezés utáni főoldal (összes tevékenység időrendbeli listázása)         |
| /activities/new          | Új tevékenység hozzáadása                                                      |
| /activities/edit/id      | Tevékenység módosítása                                                         |
| /profile                 | Saját profil megjelenítése                                                     |
| /profile/edit/id         | Saját profil szerkesztése                                                      |
| /profile/photo/edit/id   | Saját profil fotó hozzáadása, cseréje, törlése                                 |
| /training-plans          | Edzés tervek adatbázisból való lekérése, új terv hozzáadása                    |

## API végpontok

| API végpontok                       | Szerepük                                                              |
| ----------------------------------- | --------------------------------------------------------------------- |
| POST/api/login                      | Felhasználó bejelentkezése                                            |
| POST/api/user                       | Új felhasználó regisztrációja                                         |
| GET/api/user/{id}                   | Saját profil adatok lekérése id alapján                               |
| PUT/api/user/{id}                   | Saját profil módosítása id alapján                                    |
| POST/api/password                   | Jelszócsere e-mail kérése                                             |
| PUT/api/password-reset/{id}/{token} | Jelszó frissítése az adatbázisban                                     |
| GET/api/cities                      | Összes város lekérése a profil módosításon található legördülő menübe |
| GET/api/activities/{id}             | Saját tevékenységek lekérése és megjelenítése                         |
| PUT/api/activities/{id}             | Tevékenység módosítása id alapján                                     |
| POST/api/activities                 | Új edzés hozzáadása az adatbázishoz                                   |
| DELETE/api/activities/{id}          | Tevékenység törlése id alapján                                        |
| GET/api/photo/{id}                  | Saját fotó lekérése és megjelenítése                                  |
| PUT/api/photo/{id}                  | Saját fotó feltöltése és módosítása id alapján                        |
| DELETE/api/photo/{id}               | Saját fotó törlése                                                    |
| GET/api/plan                        | Az összes adatbázisban szereplő edzésterv lekérése                    |
| POST/api/plan                       | Új edzésterv hozzáadása az adatbázishoz                               |

## Adatbázis gyűjtemények

| Nevük      | Tartalmuk            |
| ---------- | -------------------- |
| users      | felhasználók         |
| activities | tevékenységek        |
| cities     | Magyarország városai |
| photos     | felhasználók fotói   |
| plans      | edzés tervek         |

## Technikai követelmények

**Backend**

- Node.js
- Express.js
- MongoDB
- JSON Web Token
- Docker

**Frontend**

- React

**API dokumentáció**

- OpenAPI/Swagger

## Alkalmazás installálása

1. Alkalmazás által használt kulcsok:

- [Cloudinary](https://cloudinary.com)
- [Mongo DB](https://www.mongodb.com)
- [NodeMailer](https://nodemailer.com)

2. Az `.env.example` alapján `.env` fájlban megadni a környezeti változókat.
3. `docker-compose build`
4. `docker-compose --env-file ./.env.dev up`
5. Fitness Fanatics frontend: http://localhost:3000/
6. Fitness Fanatics backend: http://localhost:5000/
7. Swagger Open API documentáció http://localhost:4000/api-docs/#/
