// Importing necessary dependencies
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Activating dependencies and setting up port
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/db.json');

// Sets up the middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// renders index.html from the public folder for root url
app.use(express.static('public'));

// Get request to render notes page 
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
  
// Reads the db.json file to display the information on the notes page
app.get('/api/notes', (req, res) => 
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    let allNotes = JSON.parse(data);
    res.json(allNotes)
  })
);

// Post request to update the db.json and effectively the notes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    db.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(db))
    res.json(db)
  }
);

// Uses filter and writeFileSync to update the db.json page upon note deletion
app.delete('/api/notes/:id', (req, res) => {
  const newDb = db.filter((note) => note.id !== req.params.id)
  fs.writeFileSync('./db/db.json', JSON.stringify(newDb))
  res.json(newDb)
});

// Wildcard url
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// Tells the app where to listen
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});