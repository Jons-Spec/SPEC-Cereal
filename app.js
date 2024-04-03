import express from 'express';
import cors from 'cors';
import cerealRouter from './routers/cerealRouter.js'

const app = express();
app.use(express.json())
app.use(cors())

app.use(cerealRouter)


app.get("*", (req, res) => {
    res.send(`<h1>404</h1><br><h3>Could not find page</h3>`)
})

const PORT = 8080 || process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on: ${PORT}`)
})
