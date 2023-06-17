// Load dependencies
const fs = require("fs/promises");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");
const { chdir } = require("process");

// start the API server
const app = express();

// middleware that supports JSON
app.use(express.json());

// connect to a DB
const con = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "chicken-api",
    password: "GUQ5uzj.exq1pdq7fxe",
    database: "hen_house",
});

// Routes
app.get("/chicken", (req, res) => {
    chicken = [];
    con.connect((err) => {
        if (err) throw err;
        con.query("SELECT * FROM chickens", function (err, result, fields) {
            if (err) throw err;
            res.status(200).json({
                status: "success",
                length: result?.length,
                result: result,
            });
        });
    });
});

app.post("/chicken", (req, res) => {
    const id = uuid();
    const chicken = req.body;
    // console.log(req);

    if (!chicken) {
        return res.sendStatus(400);
    }

    con.connect((err) => {
        if (err) throw err;
        con.query(
            `INSERT INTO chickens (name,  birthday, weight, steps, isRunning) VALUES ('${chicken.name}', '${chicken.birthday}', ${chicken.weight}, ${chicken.steps}, ${chicken.isRunning})`,
            function (err, result, fields) {
                if (err) throw err;
                console.log(result);
            }
        );
    });
    // con.end();
    res.sendStatus(201);
});

app.put("/chicken/:id", (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, birthday, steps, isRunning, weight } = req.body;
    if (!req.params.id) {
        return res.sendStatus(400);
    }
    con.query(
        "UPDATE chickens SET name = $1, birthday=$2, weight=$3, steps=$4, isRunning=$5 WHERE id=?",
        [id, name, birthday, steps, isRunning, weight],
        function (err, data, fields) {
            if (err) throw err;
            res.status(201).json({
                status: "success",
                message: `User modified with ID: ${id}`,
            });
        }
    );
});

app.patch("/chicken/:id", (req, res, next) => {
    if (!req.params.id) {
        return res.sendStatus(400);
    }
    con.query(
        "UPDATE chickens SET weight=17 WHERE ID=?",
        [req.params.id],
        function (err, data, fields) {
            if (err) throw err;
            res.status(201).json({
                status: "success",
                message: "the chick gained weight!",
            });
        }
    );
});

app.delete("/chicken/:id", (req, res) => {
    if (!req.params.id) {
        return res.sendStatus(400);
    }

    con.query(
        "DELETE FROM chickens WHERE ID=?",
        [req.params.id],
        function (err, results) {
            if (err) throw err;
            res.status(200).json({
                status: "success",
                message: "the chick is deleted!",
            });
        }
    );
});

app.listen(3000, () => console.log("API server is running..."));
