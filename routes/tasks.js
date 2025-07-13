/*

    Here we are going to handle the CRUD of the tasks of the user
    (only if the user had something to do ;) )

*/
const express = require('express');
const db = require('../database/connect');
const router = express.Router();
const bodyParser = require('body-parser').json();
const { validationResult, param, body } = require('express-validator');


//Read a task
router.get(
    '/tasks/:user_id',
    [
        param('user_id').isInt({ min: 1 }).withMessage('The id must be a number'),
    ],
    (req, res) => {
        let validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(500).send(validation.array());
        }
        const { user_id } = req.params;
        let sqlQuery = 'select * from tasks where user_id = ?';
        db.query(sqlQuery, [user_id], (err, result) => {
            if (err) {
                return res.status(404).send('Something happened');
            }
            if (result.length === 0) {
                return res.status(404).send({ msg: 'You don\'t have any tasks' });
            }
            res.status(200).send(result);
        });

    });
//Create a new task
router.post(
    '/tasks/',
    bodyParser,
    [
        body('taskname').notEmpty().withMessage('The task name can\'t be empty'),
        body('taskcontent').notEmpty().withMessage('The task content cant be empty'),
        body('taskstate').notEmpty().withMessage('The task content can\'t be empty'),
        body('user_id').notEmpty().withMessage('The user ID can\'t be empty'),
        body('user_id').isInt({ min: 1 }).withMessage('The user ID must be a number')
    ],
    (req, res) => {
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(500).send(result.array());
        }
        const { taskname, taskcontent, taskstate, user_id } = req.body;
        const sqlQuery = 'insert into tasks (taskname,taskcontent,taskstate,user_id) values (?,?,?,?);';
        db.query(
            sqlQuery,
            [taskname, taskcontent, taskstate, user_id],
            (err, queryResult) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send('Task added successfully');
            }
        );
    }
);

//Update a task (all the task)
router.put(
    '/tasks/:user_id',
    bodyParser,
    [
        param('user_id').isInt({ min: 1 }).withMessage('The user_id must be a number'),
        body('taskname').notEmpty().withMessage('The name can\'t be empty'),
        body('taskcontent').notEmpty().withMessage('The task content can\'t be empty'),
        body('taskstate').notEmpty().withMessage('The task content can\t be empty'),
    ],
    (req, res) => {
        let validation = validationResult(req);
        if (!validation.isEmpty()) {
            return res.status(500).send(validation.array());
        }

        let { user_id } = req.params;
        let { taskname, taskcontent, taskstate } = req.body;

        let sqlQuery = 'update tasks set taskname = ?, taskcontent = ?, taskstate = ? where user_id = ?';
        db.query(
            sqlQuery,
            [taskname, taskcontent, taskstate, user_id],
            (err, sqlResult) => {
                if(err){
                    return res.status(500).send({msg: 'Something went wrong'});
                }
                res.status(200).send('The task has been updated');
            }
        );
    }
);
//Delete a task
router.delete(
    '/tasks/:task_id',
    [
        param('task_id').isInt({ min: 1 }).withMessage('The id must be a number')
    ],
    (req, res) => {
        let result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(500).send(result.array());
        }
        const sqlQuery = 'delete from tasks where id = ?';
        const { task_id } = req.params;
        db.query(
            sqlQuery,
            [task_id],
            (err, queryResult) => {
                if (err) {
                    return res.status(500).send(err);
                }
                res.status(200).send({ msg: 'The task has been deleted' });
            }
        );
    }
);

function getUserid(username, password) {
    let query = 'select * from users where username = ? and password = ?';
    return new Promise(
        (resolve, reject) => {
            db.query(
                query,
                [username, password],
                (err, queryResult) => {
                    if (err) return reject(err);
                    resolve(queryResult.length ? queryResult[0].id : null);
                }
            );
        }
    );
}

module.exports = router;



