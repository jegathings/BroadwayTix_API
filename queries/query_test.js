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
        id: "cb4ad98b-d7d5-429d-bbb7-87ea7722708b",
    },
    UpdateExpression: "add #test :value",
    ExpressionAttributeNames: {
      "#test": "number_of_tickets"
    },
    ExpressionAttributeValues: {
      ":value": "-1"
    },
}).promise()
.then(() => {
})
.catch((err) => {
  console.log(err);
});

