/*

    Here we are going to handle the CRUD of the tasks of the user
    (only if the user had something to do ;) )

*/
const express = require('express');
const db = require('../database/connect');
const router = express.Router();
const bodyParser = require('body-parser').json();
const { validationResult, param, body, query } = require('express-validator');

const authenticateToken = require('../middleware/auth');
const { handleInputErrors } = require('../middleware/validation');
const { getAllTasks, addNewTask, updateTask, deleteTask } = require('../handlers/taskHandler');

router.use(authenticateToken);

//Read all the user tasks
router.get(
    '/tasks/',
    handleInputErrors,
    getAllTasks
);
//Create a new task
router.post(
    '/tasks/',
    bodyParser,
    [
        body('taskname').notEmpty().withMessage('The task name can\'t be empty'),
        body('taskcontent').notEmpty().withMessage('The task content cant be empty'),
        body('taskstate').notEmpty().withMessage('The task content can\'t be empty'),
    ],
    handleInputErrors,
    addNewTask
);

//Update a task (all the task)
router.put(
    '/tasks/',
    bodyParser,
    [
        param('user_id').isInt({ min: 1 }).withMessage('The user_id must be a number'),
        body('taskname').notEmpty().withMessage('The name can\'t be empty'),
        body('taskcontent').notEmpty().withMessage('The task content can\'t be empty'),
        body('taskstate').notEmpty().withMessage('The task content can\t be empty'),
    ],
    handleInputErrors,
    updateTask
);
//Delete a task
router.delete(
    '/tasks/:task_id',
    [
        param('task_id').isInt({ min: 1 }).withMessage('The id must be a number')
    ],
    handleInputErrors,
    deleteTask
);


module.exports = router;



