var monk = require('monk');

var db_uri = 'mongodb://admin:BostonFL17@ds249565.mlab.com:49565/team19';

module.exports = monk(db_uri);

