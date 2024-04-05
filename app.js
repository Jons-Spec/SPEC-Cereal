import dotenv from "dotenv"
dotenv.config()
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import cerealRouter from './routers/cerealRouter.js'
import userRouter from './routers/userRouter.js'

const app = express();
app.use(cors({ credentials: true, origin: true }))
app.use(express.json())
app.use(helmet())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(cerealRouter)
app.use(userRouter)

app.get("*", (req, res) => {
    res.send(`<h1>404</h1><br><h3>Could not find page</h3>`)
})

const PORT = 8080 || process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`)
})
