import { Router } from "express"
import db from "../database/connection.js"
import bcrypt from "bcrypt"
import { containsNumbers } from "../services/passwordService.js"
import { authenticateUser } from "../middleware/authenticate.js"

const saltRounds = 12
const router = Router()

//GET - used to see all users in db
router.get("/api/sign-up", async (req, res) => {
    try {
        const data = await db.all("SELECT * FROM users")

        res.send({ data });
    } catch (error) {
        console.error("Error fetching users data:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Login page for whenever
router.get("/api/login", (req, res) => {
    res.send({ message: "You are about to login" })
})

// Logout
router.get("/api/logout", (req, res) => {
    req.session.isLoggedIn = false
    res.sendStatus(200)
})

// Check if login worked
router.get("/api/authorized", (req, res) => {
    if (req.session.isLoggedIn !== true) {
        return res.status(401).send({ message: "You are not logged in stay away" })
    }
    res.status(200).send({ message: "Welcome to the secret page only for logged in members" })
})

//POST - Sign up new user
router.post("/api/sign-up", async (req, res) => {
    const body = req.body

    if (!body.name) return res.status(400).send({ message: "Name not defined" })
    if (!body.email) return res.status(400).send({ message: "Email not defined" })
    if (!body.password) return res.status(400).send({ message: "Password not defined" })
    if (body.password.length < 5 || containsNumbers(body.password) !== true) return res.status(400).send({ message: "Password must be 5 characters and contain 1 number" })

    try {
        const result = await db.get(`SELECT * FROM users WHERE email = ?`, body.email)

        if (result === undefined) {
            const encryptedpassword = await bcrypt.hash(body.password, saltRounds)
            body.password = encryptedpassword

            const updateDB = await db.run(`INSERT INTO users(name, email, password) VALUES (?,?,?) `, [body.name, body.email, body.password])
            console.log(updateDB.changes)
            signUpMail(body.email, body.name)
                .then(result => {
                    res.status(200).send({ Link: result })
                })
                .catch(console.error)
        }
        else {
            if (result.email === body.email) {
                return res.status(403).send({ message: "User already exists" })
            }
        }
    } catch {
        console.error()
    }
})

//POST - Login
router.post("/api/login", async (req, res) => {
    const body = req.body
    if (!body.email) return res.status(400).send({ message: "Email not defined" })
    if (!body.password) return res.status(400).send({ message: "Password not defined" })

    try {
        const result = await db.get(`SELECT * FROM users WHERE email = ?`, body.email)

        if (result === undefined) {
            return res.sendStatus(404).send({ message: "User not found" })
        }
        else {
            const encryptedpassword = result.password
            const loginPassword = body.password
            const passwordComparison = await bcrypt.compare(loginPassword, encryptedpassword)

            if (passwordComparison === true) {
                req.session.isLoggedIn = true
                return res.sendStatus(200).send({ message: "You are logged in" })
            }
            else {
                return res.sendStatus(401).send({ message: "Passwords didn't match" })
            }
        }
    } catch {
        console.error()
    }
})

export default router