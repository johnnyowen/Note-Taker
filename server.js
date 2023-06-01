const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/db.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
  );
  
app.get('/api/notes', (req, res) => 
fs.readFile('./db/db.json', (err, data) => {
  if (err) throw err;
  let allNotes = JSON.parse(data);
  res.json(allNotes)
})
);

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  db.push(newNote)
  fs.writeFileSync('./db/db.json', JSON.stringify(db))
  res.json(db)
}
);

app.delete('/api/notes/:id', (req, res) => {
  const newDb = db.filter((note) => note.id !== req.params.id)
  fs.writeFileSync('./db/db.json', JSON.stringify(newDb))
  res.json(newDb)
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`)
});