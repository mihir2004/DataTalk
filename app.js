import env from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

env.config();

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

db.connect();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//List of all students
app.get("/all", async(req,res)=>{
    try {
        const response = await db.query(
            "SELECT name FROM students"
        );
        console.log(response.rows);
        
        res.send(response.rows);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

//List of students in a particular course
app.get("/course",async (req,res)=>{
    const courseName = req.body.course;
    try {
        const response = await db.query(
            "SELECT s.id, s.name, s.year FROM students s JOIN studentcourses sc ON s.id = sc.student_id JOIN courses c ON sc.course_id = c.id WHERE c.name = ($1)",
            [courseName]
        )
        res.send(response.rows)
    } catch (error) {
        console.log(error);
        res.status(500);
    }

});

//list of students according to their year
app.get("/year", async (req,res)=>{
    const year = req.body.year;
    try {
        const response = await db.query(
            "SELECT name, year FROM students WHERE year = ($1)",
            [year]
        )
        res.send(response.rows);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
})

// Marks of a student in all his courses
app.get("/marks", async (req,res)=>{
    const name = req.body.name;
    console.log(name);
    try {
        const response = await db.query(
            "SELECT s.id AS student_id, s.name AS student_name, c.id AS course_id, c.name AS name, sc.marks FROM students s JOIN studentcourses sc ON s.id = sc.student_id JOIN courses c ON sc.course_id = c.id WHERE s.name = ($1)",
            [name]
        );
        console.log(response);
        res.send(response.rows);
    } catch (error) {
        console.log(error);
    }

});

//Avg in particular subject

app.get("/avg", async(req,res)=>{
    const course = req.body.course;
    try {
        const response = await db.query(
            "SELECT c.name AS course_name, s.year, AVG(sc.marks) AS average_marks FROM students s JOIN studentcourses sc ON s.id = sc.student_id JOIN courses c ON sc.course_id = c.id WHERE c.name = ($1) GROUP BY s.year, c.name",
            [course]
        );
        console.log(response);
        res.send(response.rows);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
    
})


app.get("/avgall", async (req,res)=>{
    const name = req.body.name;
    try {
        const response = await db.query(
            "SELECT s.name AS student_name, c.name AS course_name, sc.marks, AVG(sc.marks) OVER (PARTITION BY s.id) AS average_marks FROM students s JOIN studentcourses sc ON s.id = sc.student_id JOIN courses c ON sc.course_id = c.id WHERE s.name = ($1)",
            [name]
        );
        console.log(response);
        res.send(response.rows);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
    
})






app.listen(port,()=>{
    console.log(`Server is live at port: ${port}`);
})
