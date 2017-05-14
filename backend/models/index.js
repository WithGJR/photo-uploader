const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const Sequelize = require('sequelize');
const db = require('../config.js').db;
const sequelize = new Sequelize(
    `${db.database}://${db.username}:${db.password}@${db.host}:${db.port}/${db.dbname}`,
    {
        logging: () => { /* Don't print anything */ }
    }
);

var models = {};

// Import all models

fs
.readdirSync(__dirname)
.filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
})
.forEach((file) => {
    var model = sequelize.import(path.join(__dirname, file));
    var exportedModelName = _.map(model.name.split('_'), (name) => {
        return _.capitalize(name);
    }).join('');
    models[exportedModelName] = model;
});

Object.keys(models).forEach((modelName) => {
    if ("associate" in models[modelName]) {
        models[modelName].associate(models);
    }
});

sequelize.sync({ force: true });

module.exports = models;
module.exports.sequelize = sequelize;