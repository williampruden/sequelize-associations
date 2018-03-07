const { User, Task } = require('../models/')

function index(req,res) {
  Task.findAll()
  .then((task) => {
    return res.status(200).json(task)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Task.create({
    title: req.body.title,
    complete: false,
    userId: req.body.userId
  })
  .then((task) => {
    return res.status(200).json(task)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Task Not Found' });
      }

      return res.status(200).json(task);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(404).json({ message: 'Task Not Found' });
      }

      task.update({
        ...task, //spread out existing task
        ...req.body //spread out body - the differences in the body will over ride the task returned from DB.
      })
      .then((updatedTask) => {
        return res.status(200).json(updatedTask)
      })
      .catch((error) => {
        return res.status(400).json(error)
      });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function destroy(req,res) {
  Task.findById(req.params.id)
    .then((task) => {
      if (!task) {
        return res.status(400).json({ message: 'Task Not Found' });
      }
      
      task.destroy()
        .then((task) => {
          return res.status(200).json(task)
        })
        .catch((error) => {
          return res.status(400).json(error)
        });
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

module.exports = { index, create, show, update, destroy }
