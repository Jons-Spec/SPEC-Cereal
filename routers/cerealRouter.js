import { Router } from "express";
import db from "../database/connection.js";
const router = Router();

router.get("/api/cereal", async (req, res) => {
  try {
    // Query the database for all cereal data
    const data = await db.all("SELECT * FROM cereal");

    res.send({ data });
  } catch (error) {
    console.error("Error fetching cereal data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.get("/api/cereal/results", async (req, res) => {
  try {
    const {
      name,
      mfr,
      type,
      calories,
      protein,
      fat,
      sodium,
      fiber,
      carbo,
      sugars,
      potass,
      vitamins,
      shelf,
      weight,
      cups,
      rating,
    } = req.query;

    let sqlQuery = "SELECT * FROM cereal WHERE 1=1";

    if (name) sqlQuery += ` AND name = '${name}'`;
    if (mfr) sqlQuery += ` AND mfr = '${mfr}'`;
    if (type) sqlQuery += ` AND type = '${type}'`;
    if (calories) sqlQuery += ` AND calories >= ${parseInt(calories)}`;
    if (protein) sqlQuery += ` AND protein >= ${parseInt(protein)}`;
    if (fat) sqlQuery += ` AND fat >= ${parseInt(fat)}`;
    if (sodium) sqlQuery += ` AND sodium >= ${parseInt(sodium)}`;
    if (fiber) sqlQuery += ` AND fiber >= ${parseFloat(fiber)}`;
    if (carbo) sqlQuery += ` AND carbo >= ${parseFloat(carbo)}`;
    if (sugars) sqlQuery += ` AND sugars >= ${parseInt(sugars)}`;
    if (potass) sqlQuery += ` AND potass >= ${parseInt(potass)}`;
    if (vitamins) sqlQuery += ` AND vitamins >= ${parseInt(vitamins)}`;
    if (shelf) sqlQuery += ` AND shelf >= ${parseInt(shelf)}`;
    if (weight) sqlQuery += ` AND weight >= ${parseFloat(weight)}`;
    if (cups) sqlQuery += ` AND cups >= ${parseFloat(cups)}`;
    if (rating) sqlQuery += ` AND rating >= ${parseFloat(rating)}`;

    // Query the database with the constructed SQL query
    const data = await db.all(sqlQuery);

    res.send({ data });
  } catch (error) {
    console.error("Error fetching filtered cereal data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default router;
