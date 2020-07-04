var AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  region: "us-east-1"
});

var db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

db
.update({
    TableName:"broadway_people",
    Key:{
        id: "400edb4d-d2d2-4559-9c12-a0dcdcb429eb",
    },
    UpdateExpression: "add #test :value",
    ExpressionAttributeNames: {
      "#test": "number_of_tickets"
    },
    ExpressionAttributeValues: {
      ":value": "2" * -1
    },
}).promise()
