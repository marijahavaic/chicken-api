// Load dependencies
const fs = require("fs/promises");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");
const { chdir } = require("process");
const { resolve } = require("path");
const { connect } = require("http2");

// start the API server
const app = express();

// middleware that supports JSON
app.use(express.json());
app.use(cors());

// connect to a DB
const con = mysql.createConnection({
    host: "127.0.0.1",
    port: "3306",
    user: "chicken-api",
    password: "GUQ5uzj.exq1pdq7fxe",
    database: "hen_house",
});

// Helper function to execute a query with parameters
const query = (sql, params) => {
    return new Promise((resolve, reject) => {
        con.query(sql, params, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

// Routes
// Get all chickens
app.get("/chicken", async (req, res, next) => {
    try {
        const result = await query("SELECT * FROM chickens");
        res.status(200).json({
            status: "success",
            length: result.length,
            result: result,
        });
    } catch (err) {
        next(err);
    }
});

// Get chicken by ID
app.get("/chicken/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!id) {
        return res.sendStatus(400);
    }

    try {
        const existingChicken = await query(
            "SELECT id FROM chickens WHERE id = ?",
            [id]
        );

        if (existingChicken.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Chicken not found",
            });
        }

        const result = await query("SELECT * FROM chickens WHERE id = ?", [id]);
        res.status(200).json({
            status: "success",
            length: result.length,
            result: result,
        });
    } catch (err) {
        next(err);
    }
});

// Add a new chicken
app.post("/chicken", async (req, res, next) => {
    const chicken = req.body;

    if (!chicken) {
        return res.sendStatus(400);
    }

    try {
        await query(
            "INSERT INTO chickens (name,  birthday, weight, steps, isRunning) VALUES (?, ?, ?, ?, ?)",
            [
                chicken.name,
                chicken.birthday,
                chicken.weight,
                chicken.steps,
                chicken.isRunning,
            ]
        );
        res.sendStatus(201);
    } catch (err) {
        next(err);
    }
});

app.put("/chicken/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, birthday, steps, isRunning, weight } = req.body;
    if (!id) {
        return res.sendStatus(400);
    }

    try {
        const existingChicken = await query(
            "SELECT id FROM chickens WHERE id = ?",
            [id]
        );

        if (existingChicken.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Chicken not found",
            });
        }
        await query(
            "UPDATE chickens SET name = ?, birthday=?, weight=?, steps=?, isRunning=? WHERE id=?",
            [name, birthday, steps, isRunning, weight, id]
        );
        res.status(201).json({
            status: "success",
            message: `User modified with ID: ${id}`,
        });
    } catch (err) {
        next(err);
    }
});

app.patch("/chicken/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!id) {
        return res.sendStatus(400);
    }

    const existingChicken = await query(
        "SELECT id FROM chickens WHERE id = ?",
        [id]
    );

    if (existingChicken.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "Chicken not found",
        });
    }

    try {
        await query("UPDATE chickens SET weight=17 WHERE ID=?", [
            req.params.id,
        ]);
        res.status(201).json({
            status: "success",
            message: "the chick gained weight!",
        });
    } catch (err) {
        next(err);
    }
});

// Running
app.patch("/chicken/run/:id", async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (!id) {
        return res.sendStatus(400);
    }

    const existingChicken = await query(
        "SELECT id FROM chickens WHERE id = ?",
        [id]
    );

    if (existingChicken.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "Chicken not found",
        });
    }

    const { steps } = req.body;
    const newSteps = steps + 1;

    try {
        await query("UPDATE chickens SET steps=? WHERE ID=?", [
            newSteps,
            req.params.id,
        ]);
        res.status(201).json({
            status: "success",
            message: "the chick is running!",
        });
    } catch (err) {
        next(err);
    }
});

app.delete("/chicken/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (!id) {
        return res.sendStatus(400);
    }

    const existingChicken = await query(
        "SELECT id FROM chickens WHERE id = ?",
        [id]
    );

    if (existingChicken.length === 0) {
        return res.status(404).json({
            status: "error",
            message: "Chicken not found",
        });
    }

    try {
        await query("DELETE FROM chickens WHERE ID=?", [req.params.id]);
        res.status(200).json({
            status: "success",
            message: "the chick is deleted!",
        });
    } catch (err) {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
});

// Close database connection after query completion
con.connect((err) => {
    if (err) throw err;
    console.log("Connected to the database");
    app.listen(3000, () => console.log("API server is running..."));
});

// Close database connection on process
process.on("exit", () => {
    con.end();
});
