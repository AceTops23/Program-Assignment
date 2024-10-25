const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./surveys.db');

app.use(bodyParser.json());
app.use(express.static('public'));

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS survey_responses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        answers TEXT
    )`);
});

app.post('/submit-survey', (req, res) => {
    const answers = JSON.stringify(req.body);
    
    console.log("Answers received: ", answers);

    db.run('INSERT INTO survey_responses (answers) VALUES (?)', [answers], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving survey.');
        }
        res.status(200).send('Survey saved.');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
