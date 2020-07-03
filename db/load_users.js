var AWS = require("aws-sdk");
var fs = require('fs');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({region: "us-east-1"});

var documentClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing data into DynamoDB. Please wait.");

var params = {
  TableName: "broadway_users",
  Item: {
    "id": uuidv4(),
    "first_name":  "Dina Marie",
    "last_name": "Martin",
    "email":  "dina@gmail.com",
    "broadway_role": "admin",
    "password":"$2b$10$ykxAUj7Gd2zkwbpSWskAA.tWoKqqCZt92kaoQffDPekAAsolKcXTW",
    "img": ""
  }
};

documentClient.put(params, function(err, data) {
  if (err) {
    console.error("Can't add item.", JSON.stringify(err, null, 2));
  } else {
    console.log("Succeeded adding person",data);
  }
});
 