const { Sequelize } = require('sequelize'); // fix intellisense with this style
module.exports = new Sequelize('codegig', 'root', 'q1w2e3r4Q!W@E#R$', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
