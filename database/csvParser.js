import csvParser from 'csv-parser';
import fs from 'fs';
import db from './connection.js';

let nextId = 1;
const csvFilePath = './Cereal.csv'
parseCSV(csvFilePath);

async function parseCSV(filePath) {
    // Create cereal table if it doesn't exist
    await db.run(`
        CREATE TABLE IF NOT EXISTS cereal (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE,  -- Ensure name is unique
            mfr TEXT,
            type TEXT,
            calories INTEGER,
            protein INTEGER,
            fat INTEGER,
            sodium INTEGER,
            fiber REAL,
            carbo REAL,
            sugars INTEGER,
            potass INTEGER,
            vitamins INTEGER,
            shelf INTEGER,
            weight REAL,
            cups REAL,
            rating REAL
        )
    `);

    // Read CSV file and insert data into database
    fs.createReadStream(filePath)
        .pipe(csvParser({ separator: ';' }))
        .on('data', async (data) => {
            const {
                name, mfr, type, calories, protein, fat, sodium,
                fiber, carbo, sugars, potass, vitamins, shelf,
                weight, cups, rating
            } = data;

            // Check if cereal with the same name already exists in the database
            const existingCereal = await db.get(`SELECT * FROM cereal WHERE name = ?`, [name]);

            if (existingCereal) {
                console.log(`Skipping existing cereal: ${name}`);
                return;
            }

            // Insert data into SQLite database
            await db.run(`
                INSERT INTO cereal (
                    id, name, mfr, type, calories, protein, fat, sodium,
                    fiber, carbo, sugars, potass, vitamins, shelf,
                    weight, cups, rating
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                nextId++, // Increment ID for each record
                name, mfr, type, parseInt(calories), parseInt(protein), parseInt(fat), parseInt(sodium),
                parseFloat(fiber), parseFloat(carbo), parseInt(sugars), parseInt(potass), parseInt(vitamins),
                parseInt(shelf), parseFloat(weight), parseFloat(cups), parseFloat(rating)
            ]);
        })
        .on('end', () => {
            console.log('CSV file successfully processed and data inserted into SQLite database');
        });
}



