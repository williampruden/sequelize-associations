const { User, Project } = require('../models/')

function index(req,res) {
  Project.findAll()
  .then((project) => {
    return res.status(200).json(project)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Project.create({
    title: req.body.title,
    description: req.body.description,
    complete: req.body.complete
  })
  .then((project) => {
    return res.status(200).json(project)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(404).json({ message: 'Project Not Found' });
      }

      return res.status(200).json(project);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(404).json({ message: 'Project Not Found' });
      }

      project.update({
        ...project, //spread out existing project
        ...req.body //spread out body - the differences in the body will over ride the project returned from DB.
      })
      .then((updatedProject) => {
        return res.status(200).json(updatedProject)
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
  Project.findById(req.params.id)
    .then((project) => {
      if (!project) {
        return res.status(400).json({ message: 'Project Not Found' });
      }
      
      project.destroy()
        .then((project) => {
          return res.status(200).json(project)
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
