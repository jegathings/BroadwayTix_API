// require csvtojson module
const CSVToJSON = require('csvtojson');

// convert users.csv file to JSON array
const anArray = []
CSVToJSON().fromFile('broadway_people.csv')
    .then(users => {

        // users is a JSON array
        // log the JSON array
        console.log(users);
    }).catch(err => {
        // log error if any
        console.log(err);
    });