const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const { Sequelize } = require('sequelize');
const Op = Sequelize.Op;

router.get('/', (req, res) => {
  Gig.findAll()
    .then(gigs => {
      const context = {
        gigs: gigs.map(g => {
          return {
            title: g.title,
            technologies: g.technologies,
            budget: g.budget,
            description: g.description,
            contact_email: g.contact_email
          };
        })
      };

      res.render('gigs', {
        gigs: context.gigs
      });
    })
    .catch(err => console.log(err));
});

router.get('/add', (req, res) => res.render('add'));

// Add a gig
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;

  let errors = [];

  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add some technologies' });
  }
  if (!description) {
    errors.push({ text: 'Please add a description' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add a contact email' });
  }

  // Check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email
    });
  } else {
    if (!budget) {
      budget = 'Unknown';
    } else {
      budget = `$${budget}`;
    }
    //Make lowercase and remove space after comma
    technologies = technologies.toLoweCase().replace(/, /g, ',');

    // Insert into table
    Gig.create({
      title,
      technologies,
      description,
      budget,
      contact_email
    })
      .then(gig => res.redirect('/gigs'))
      .catch(err => console.log(err));
  }
});

// Search for gigs
router.get('/search', (req, res) => {
  let { term } = req.query;

  term = term.toLoweCase();

  Gig.findAll({
    where: { technologies: { [Op.like]: '%' + term + '%' } }
  })
    .then(gigs => {
      const context = {
        gigs: gigs.map(g => {
          return {
            title: g.title,
            technologies: g.technologies,
            budget: g.budget,
            description: g.description,
            contact_email: g.contact_email
          };
        })
      };

      res.render('gigs', { gigs: context.gigs });
    })
    .catch(err => console.log(err));
});

module.exports = router;
