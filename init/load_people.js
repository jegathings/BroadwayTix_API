var AWS = require("aws-sdk");
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({region: "us-east-1"});

var documentClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

const broadway_people = JSON.parse(fs.readFileSync('../data/broadway_people.json', 'utf8'));
broadway_people.forEach(function(person) {
  var params = {
    TableName: "broadway_people",
    Item: {
      "id": uuidv4(),
      "first_name":  person.first_name,
      "last_name": person.last_name,
      "email":  person.email,
      "broadway_role": person.role,
      "img": ""
    }
  };

  documentClient.put(params, function(err, data) {
    if (err) {
      console.error("Can't add item.", JSON.stringify(err, null, 2));
    } else {
      console.log("Succeeded adding person", person.email);
    }
  });
});

 