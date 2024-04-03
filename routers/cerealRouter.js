import { Router } from "express";
import db from "../database/connection.js"
const router = Router()

router.get('/api/cereal', async (req, res) => {
    try {
        // Query the database for cereal data
        const data = await db.all("SELECT * FROM cereal");

        res.send({ data });
    } catch (error) {
        console.error('Error fetching cereal data:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

export default router