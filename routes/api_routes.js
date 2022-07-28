const notes_router = require('express').Router();
const fs = require('fs');
path = require('path')
const db_path = path.join(__dirname, '../db/db.json');
const uuid = require('uuid').v4
// FUNCTION TO READ DATA FROM DB
function getNotesData(){
    return fs.promises.readFile(db_path, 'utf-8')
        .then(data => JSON.parse(data));
}

// GET ALL NOTES @ localhost:3333/api/notes
notes_router.get('/notes', (request, response) => {
    getNotesData()
        .then(data => {
            response.json(data)
        })
        .catch(err => console.log(err))
});

// CREATE NOTE
notes_router.post('/notes', (req, response) => {
    getNotesData()
        .then(notes_data => {
            console.log(notes_data);
            const new_note = req.body;
            new_note.id = uuid().slice(0,4);
            console.log(req.body)
            notes_data.push(new_note);
            fs.promises.writeFile(db_path, JSON.stringify(notes_data, null, 2))
                .then(() => {
                    console.log('NOTE ADDED SUCCESSFULLY!');
                    response.json(notes_data)
                })
                .catch(err => console.log(err))
        });
});

notes_router.delete('/notes/:id', (request, response) => {
    getNotesData()
        .then(notes_data => {
            const id = request.params.id;
            const obj = notes_data.find(note => note.id === id);
            const index = notes_data.indexOf(obj);
            notes_data.splice(index, 1);
            fs.promises.writeFile(db_path, JSON.stringify(notes_data, null, 2))
                .then(() => {
                    console.log('TODOS UPDATED SUCCESSFULLY');
                    response.json(notes_data);
                })
                .catch(err => console.log(err))
        });
})
// EXPORTS
module.exports = notes_router;