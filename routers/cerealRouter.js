import { Router } from "express";
import db from "../database/connection.js";
import { authenticateUser } from "../middleware/authenticate.js";
const router = Router();

// Get all cereal
router.get("/api/cereal", async (req, res) => {
  try {
    const data = await db.all("SELECT * FROM cereal");

    res.send({ data });
  } catch (error) {
    console.error("Error fetching cereal data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Get on ID
router.get("/api/cereal/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const cereal = await db.get("SELECT * FROM cereal WHERE id = ?", [id]);

    if (!cereal) {
      return res.status(404).json({ error: "Cereal not found" });
    }

    res.json({ data: cereal });
  } catch (error) {
    console.error("Error fetching cereal by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get cereal on ???
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

    const data = await db.all(sqlQuery);

    res.send({ data });
  } catch (error) {
    console.error("Error fetching filtered cereal data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

router.use(authenticateUser)
// Add new cereal
router.post('/api/cereal', async (req, res) => {
  try {
    const { name, mfr, type, calories, protein, fat, sodium, fiber, carbo, sugars, potass, vitamins, shelf, weight, cups, rating } = req.body;

    const result = await db.run(`
          INSERT INTO cereal (name, mfr, type, calories, protein, fat, sodium, fiber, carbo, sugars, potass, vitamins, shelf, weight, cups, rating)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
      name, mfr, type, parseInt(calories), parseInt(protein), parseInt(fat), parseInt(sodium),
      parseFloat(fiber), parseFloat(carbo), parseInt(sugars), parseInt(potass), parseInt(vitamins),
      parseInt(shelf), parseFloat(weight), parseFloat(cups), parseFloat(rating)
    ]);

    res.status(201).json({ id: result.lastID });
  } catch (error) {
    console.error('Error adding new cereal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update cereal
router.put('/api/cereal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mfr, type, calories, protein, fat, sodium, fiber, carbo, sugars, potass, vitamins, shelf, weight, cups, rating } = req.body;

    const result = await db.run(`
          UPDATE cereal
          SET name = ?, mfr = ?, type = ?, calories = ?, protein = ?, fat = ?, sodium = ?,
              fiber = ?, carbo = ?, sugars = ?, potass = ?, vitamins = ?, shelf = ?,
              weight = ?, cups = ?, rating = ?
          WHERE id = ?
      `, [
      name, mfr, type, parseInt(calories), parseInt(protein), parseInt(fat), parseInt(sodium),
      parseFloat(fiber), parseFloat(carbo), parseInt(sugars), parseInt(potass), parseInt(vitamins),
      parseInt(shelf), parseFloat(weight), parseFloat(cups), parseFloat(rating),
      id
    ]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cereal not found' });
    }

    res.json({ message: 'Cereal updated successfully' });
  } catch (error) {
    console.error('Error updating cereal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete cereal
router.delete('/api/cereal/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.run(`
          DELETE FROM cereal
          WHERE id = ?
      `, [id]);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Cereal not found' });
    }

    res.json({ message: 'Cereal deleted successfully' });
  } catch (error) {
    console.error('Error deleting cereal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;
