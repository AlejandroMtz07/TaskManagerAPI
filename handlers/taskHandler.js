const db = require('../database/connect');

const getAllTasks = (req, res) => {

    let sqlQuery = 'select * from tasks where user_id = ?';
    db.query(sqlQuery, [req.user_id], (err, result) => {
        if (err) {
            return res.status(404).send('Something happened');
        }
        if (result.length === 0) {
            return res.status(404).send({ msg: 'You don\'t have any tasks' });
        }
        res.status(200).send(result);
    });

}

const addNewTask = (req, res) => {
    const { taskname, taskcontent, taskstate } = req.body;
    const sqlQuery = 'insert into tasks (taskname,taskcontent,taskstate,user_id) values (?,?,?,?);';
    db.query(
        sqlQuery,
        [taskname, taskcontent, taskstate, req.user_id],
        (err, queryResult) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send({ msg: 'Task added successfuly'});
        }
    );
}

const updateTask = (req, res) => {

    let { taskname, taskcontent, taskstate } = req.body;

    let sqlQuery = 'update tasks set taskname = ?, taskcontent = ?, taskstate = ? where id =? and user_id = ?';
    db.query(
        sqlQuery,
        [ taskname, taskcontent, taskstate, req.params.id , req.user_id],
        (err, sqlResult) => {
            if (err) {
                return res.status(500).send({ msg: 'Something went wrong' });
            }
            res.status(200).send({ msg: 'The task has been updated' });
        }
    );
}
const deleteTask = (req, res) => {

    const sqlQuery = 'delete from tasks where id = ? and user_id = ?';
    const { task_id } = req.params;
    db.query(
        sqlQuery,
        [task_id, req.user_id],
        (err, queryResult) => {
            if (queryResult.affectedRows === 0) {
                return res.status(500).send({ error: 'Task not found' });
            }
            res.status(200).send({ msg: 'Task deleted' });
        }
    );
}

module.exports = { getAllTasks, addNewTask, updateTask, deleteTask };