const express = require("express");
const cors = require("cors");
const nodecron = require("node-cron");
const mailsend = require("./runJob.js");
const pool = require('./mysql.js'); 

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { 
    res.json({ msg: 'This is a express api for testing purposes only ', status: 200 }).status(200) 
}) 
app.post('/', (req, res) => {
    res.json({ msg: ' There is nothing that post route' }).status(200) 
})

app.delete('/', (req, res) => {
    res.json({ msg: ' There is nothing that delete route' }).status(200) 
})
app.post("/remainder/setremainder", async (req, res) => {
  try {
    const { remainder, link } = req.body;

    const sql = "INSERT INTO Remainders (Activity, Link) VALUES (?, ?)";
    const values = [remainder, link];

    await pool.query(sql, values);

    res.json({ msg: "Task Saved", status: 200 });

  } catch (err) {
    console.error("MySQL Insert Error:", err);
    res.status(500).json({ error: "Database Insert Error" });
  }
});


app.get("/remainder/getremainder", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM boys");

    res.json(rows);

  } catch (err) {
    console.error("MySQL Select Error:", err);
    res.status(500).json({ error: "Database Fetch Error" });
  }
});


nodecron.schedule(
    "0 19 * * *",
    () => {
        mailsend();
    },
    { timezone: "Asia/Kolkata" }
);

app.listen(5005, () => {
    console.log("Server running at http://localhost:5005");
});
