const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
//const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const JWT_EXPIRATION_TIME = '5m';
const broadwayTable = "broadway_users";

function response(statusCode, message) {
    return {
      statusCode: statusCode,
      body: JSON.stringify(message),
      headers: {
        'Access-Control-Allow-Origin': '*',
    },
  };
}
module.exports.handler = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  console.log("Body", reqBody);  
  const params = {
  TableName: broadwayTable,
  IndexName: "LoginIndex",
  KeyConditionExpression: "email = :email AND password = :password",
  ExpressionAttributeValues: {
      ":email":{"S": reqBody.email},
      ":password":{"S":reqBody.password}
  }
  };
  console.log("Params", params);

  db.query(params).
  promise()
  .then((result => {
    if(result.Count === 1){
      const [temp] = [result.Items[0]];
      const user = {
        img: temp.img.S,
        first_name: temp.first_name.S,
        last_name: temp.last_name.S,
        broadway_role: temp.broadway_role.S,
        email: temp.email.S
      };
      const token = jwt.sign({ user }, "SECRET", { expiresIn: JWT_EXPIRATION_TIME });
      const res = response(200,token);
      callback(null, res);
    }else{
      callback(null, response("401", "Invalid email or password."))  
    }
  }
  ))
  .catch((err) =>{ 
  console.log(err);
  callback(null, response("401", err))
  });   
}  

// for(let index=0;index<=20;index++)
// console.log("Request", reqBody);
// var params = {
// TableName: broadwayTable,
// IndexName: "EmailIndex",
// KeyConditionExpression: "email = :email and password = :password",
// ExpressionAttributeValues: {
//     ":email":reqBody.email,
//     ":password":reqBody.password
// }
// };
// db.get(params).
// promise()
// .then((user => {
// console.log("User", user);
// const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRATION_TIME });
// const res = response(200,token);
// callback(null, res);
// }))
// .catch((err) =>{ 
// console.log(err);
// callback(null, response("401", err))
// });   