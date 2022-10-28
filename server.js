const express = require("express");
const app = express();
const PORT = 3003;

app.use(express.json());

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/info", (req, res) => {
    const currentDate = new Date();
    res.send(`<h2>Phonebook has info for ${persons.length} people</h2> <h2>${currentDate}</h2>`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = (persons.find(person => person.id === id));

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => p.id))
      : 0;
    return maxId + 1;
  }

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({
            error: "name is missing"
        });
    };

    if (!body.number) {
        return res.status(400).json({
            error: "number is missing"
        });
    };

    if (persons.some(person => person.name === body.name)) {
        return res.status(400).json({
            error: "dublicate name"
        })
    };
    if (persons.some(person => person.number === body.number)) {
        return res.status(400).json({
            error: "dublicate number"
        })
    }

    let person = {
        id: generateId(),
        name: body.name,
        phone: body.phone
    };

    persons.push(person);
    res.json(person);
});

const requestLogger = (req, res, next) => {
    console.log("Method:", req.method);
    console.log("Path:", req.path);
    console.log("Body:", req.body);
    console.log("---");
    next()
};

const unknownEndpoint =(req, res) => {
    res.status(404).send({error: "unknown endpoint"});
};

app.use(requestLogger);
app.use(unknownEndpoint);


app.listen(PORT);
console.log(`Server running on port ${PORT}`);

