const dotenv = require('dotenv');
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

const port = process.env.PORT;
// const pool = new Pool ({
//     user: 'josephcarrillo',
//     host: 'localhost',
//     database: 'todo_database',
//     password: '',
//     port: 5432
// });

const pool = new Pool ({
  connectionString: process.env.DATABASE_URL
});


  // get all
app.get("/todos", async (req, res) => {
    try{
         const result = await pool.query("SELECT * FROM todos");
         res.json(result.rows);
    } catch (err){
        console.error(err);
        res.status(500).send('Error fetching Todos from todo_database!')
    }
});

// get one
app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).send(' not found!'); 
        } else {
            res.json(result.rows[0]);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching Todos from todo_database');
    }
  });

// post 
app.post('/todos', async (req, res) => {
  const { todo, location } = req.body;
  try {
    const result = await pool.query('INSERT INTO todos (todo, location) VALUES ($1, $2) RETURNING *', [todo, location]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error inserting Todos into todo_database' });
  }
});

// update
app.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { todo, location } = req.body;

  try {
    const result = await pool.query('UPDATE todos SET todo = $1, location = $2 WHERE id = $3 RETURNING *', [todo, location, id]);

    if (result.rowCount === 0) {
      res.status(404).send('Todo not found!');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating Todo in todo_database!');
  }
});

// delete
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING *', [id]);
      if (result.rowCount === 0) {
        res.status(404).send('Todo not found');
      } else {
        res.json(result.rows[0]);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting Todos from todo_database');
    }
  });

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});
  
