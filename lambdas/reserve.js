const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dbClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

module.exports.handler  = (event, context, callback) => {
    const reqBody = JSON.parse(event.body);
  
    const reservation = {
      id: uuidv4(),
      first_name: reqBody.first_name,
      last_name: reqBody.last_name,    
      email: reqBody.email,
      broadway_role: "customer",
      number_of_tickets:reqBody.number_of_tickets    
    };
  
    const output =  dbClient
      .put({
        TableName: broadwayTable,
        Item: reservation
      })
      .promise()
      .then(() => {
        callback(null, response(201, reservation));
      })
      .catch((err) => {
        console.log(err);
        response(null, response(err.statusCode, err))
      });
  
      dbClient
      .update({
          TableName:broadwayTable,
          Key:{
              id: reqBody.show_id,
          },
          UpdateExpression: "add #test :value",
          ExpressionAttributeNames: {
            "#test": "number_of_tickets"
          },
          ExpressionAttributeValues: {
            ":value": reqBody.number_of_tickets * -1
          },
      }).promise()
      .then(() => {
        callback(null, response(201, reservation));
      })
      .catch((err) => {
        console.log(err);
        response(null, response(err.statusCode, err))
      });
  
      return output;
  };
  