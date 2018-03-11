const { Passport, User } = require('../models/')

function index(req,res) {
  Passport.findAll()
  .then((passport) => {
    return res.status(200).json(passport)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function create(req,res) {
  Passport.create({
    country: req.body.country,
    passportNumber: req.body.passportNumber,
    issueDate: req.body.issueDate,
    expirationDate: req.body.expirationDate,
    passportId: req.body.passportId
  })
  .then((passport) => {
    return res.status(200).json(passport)
  })
  .catch((error) => {
    return res.status(400).json(error)
  });
}

function show(req,res) {
  Passport.findById(req.params.id)
    .then((passport) => {
      if (!passport) {
        return res.status(404).json({ message: 'Passport Not Found' });
      }

      return res.status(200).json(passport);
    })
    .catch((error) => {
      return res.status(400).json(error)
    });
}

function update(req,res) {
  Passport.findById(req.params.id)
    .then((passport) => {
      if (!passport) {
        return res.status(404).json({ message: 'Passport Not Found' });
      }

      passport.update({
        ...passport, //spread out existing passport
        ...req.body //spread out req.body - the differences in the body will override the passport returned from DB.
      })
      .then((updatedPassport) => {
        return res.status(200).json(updatedPassport)
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
  Passport.findById(req.params.id)
    .then((passport) => {
      if (!passport) {
        return res.status(400).json({ message: 'Passport Not Found' });
      }
      passport.destroy()
        .then((passport) => {
          return res.status(200).json(passport)
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
