require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const app = express();
const Person = require("./person");
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static("dist"));
const PORT = process.env.PORT || 3001;

const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/api/persons", (req, res) => {
    Person.find({}).then((persons) => {
        res.json(persons);
    });
});

app.get("/info", (req, res) => {
    let persons = Person.find({}).then((persons) => {
        res.send(
            `<p>Phonebook has info for ${
                persons.length
            } people</p><p>${new Date()}</p>`
        );
    });
});

app.get("/api/persons/:id", (req, res) => {
    const person = Person.findById(req.params.id)
        .then((person) => {
            if (person) {
                res.json(person);
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(404).end();
        });
});

app.delete("/api/persons/:id", (req, res) => {
    Person.findByIdAndDelete(req.params.id).then((result) => {
        res.status(204).end();
    });
});

morgan.token("body", (req, res) => {
    return JSON.stringify(req.body);
});

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :body"
    )
);

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name) {
        return res.status(400).json({
            error: "name missing",
        });
    }

    if (!body.number) {
        return res.status(400).json({
            error: "number missing",
        });
    }

    // if (persons.find((person) => person.name === body.name)) {
    //     return res.status(400).json({
    //         error: "name must be unique",
    //     });
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    });

    person.save().then((savedPerson) => {
        res.json(savedPerson);
    });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
