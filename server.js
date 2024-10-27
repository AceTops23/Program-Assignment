// Required Modules
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express App and Database
const app = express();
const db = new sqlite3.Database('./surveys.db');

// Middleware Configuration
app.use(express.json());  // Native JSON parser for POST requests
app.use(express.static('public'));  // Serve static files from 'public' directory

// Database Setup: Create table if it does not exist
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS survey_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        answers TEXT
    )`);
});

// Route to Handle Survey Submission
app.post('/submit-survey', (req, res) => {
    const answers = JSON.stringify(req.body);

    // Optional: Log received answers for debugging
    // console.log("Answers received: ", answers);

    // Insert survey response into the database
    db.run('INSERT INTO survey_responses (answers) VALUES (?)', [answers], function (err) {
        if (err) {
            console.error("Error saving survey response: ", err);
            return res.status(500).send('Error saving survey.');
        }
        res.status(200).send('Survey saved.');
    });
});

// Start the Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
