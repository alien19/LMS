const express = require('express');
const Joi = require('joi');
const app = express();

app.use(express.urlencoded({extended: true}));

// where the DB should be called
const courses = [
    {name: 'course1', code: 'CSE 321', id: 1, description: 'a course for ....'},
    {name: 'course2', code: 'CSE 341', id: 2, description: 'a course for ....'},
    {name: 'course3', code: 'ECE 345', id: 3, description: 'a course for ....'}
]

const students = [
    {name: 'student1', code: 'CSE 321', id: 1},
    {name: 'student2', code: 'CSE 341', id: 2},
    {name: 'student3', code: 'ECE 345', id: 3}
];

app.get('/' , (req , res)=>{
    res.send('Welcome to LMS server :)')
 });

app.get('/api/courses', (req, res) =>{
    res.send(courses);
});
app.get('/api/students' , (req, res) => {
    // where the DB to be called    
        res.send(students);
    //  JSON.stringify(['Electrical testing', 'Machine Learning', 'Multimedia'])
});

app.get ('/web/courses/create' , (req, res ) => { 
    ret = res.sendFile ('form_courses.html', {root: __dirname});
});

app.get ('/web/students/create' , (req, res ) => { 
    ret = res.sendFile ('form_students.html', {root: __dirname});
});


app.post('/api/courses' , (req , res) => {
    const {error} = validateCourse(req.body);
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

   const course = {
       name: req.body.name,
       code: req.body.code, 
       id: courses.length+1,
       description: req.description,
   };
   courses.push(course);
   res.send(`${course.name} has been added with code ${course.code} and id ${course.id}`);

});

app.get('/api/courses/:id' , (req , res)=>{
    const course = courses.find(c => c.id == parseInt(req.params.id));
    if(!course) res.status(404).send('The course with the given ID is not available');
    res.send(course)
 });


 app.post('/api/students' , (req , res) => {
     const {error} = validateStudent(req.body);
     if (error) {
         res.status(400).send(error.details[0].message);
         return;
     }
    const student = {
        name: req.body.name, 
        code: req.body.code, 
        id: students.length+1
        };
    students.push(student);
    res.send(`${student.name} has been added with code ${student.code} and id ${student.id}`);
    // return res.redirect('/api/students');

});

app.get('/api/students/:id' , (req , res)=>{
    const student = students.find(s => s.id == parseInt(req.params.id));
    if(!student) res.status(404).send('The student with the given ID is not available');
    res.send(student)
 });

// Dynamically assign a port
const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`));

function validateCourse(course){
    const schema = Joi.object({
        name: Joi.string().min(5).required(),
        code: Joi.string().regex(/\b[A-Za-z ]{3}[0-9]{3}\b/).required(), //[a-zA-Z]{3}\d{3}
        id: Joi.number().integer(),
        description: Joi.string().max(200).allow('')
    });
    return schema.validate(course);
}

function validateStudent(student){
    const schema = Joi.object({
        name: Joi.string().regex(/^[A-Za-z -']*$/),
        code: Joi.string().length(7),
        id: Joi.number().integer()
    });
    return schema.validate(student);
}