// endpoints:
//   POST - https://4o319y7qe2.execute-api.us-east-1.amazonaws.com/dev/post
//   GET - https://4o319y7qe2.execute-api.us-east-1.amazonaws.com/dev/posts
// functions:
//   createPost: broadway-tix-dev-createPost
//   getAllPosts: broadway-tix-dev-getAllPosts

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const broadwayTable = "broadway_people";

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.getAllReservations = (event, context, callback) => {
  return db.scan({
    TableName: broadwayTable
  })
  .promise()
  .then((res) => {
    callback(null, response(200, res.Items.sort(sortByDate)));
  })
  .catch((err) => callback(null, response(err.statusCode, err)));  
}

module.exports.createReservation = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  console.log("TABLE",broadwayTable);
  console.log("1",!reqBody.first_name);
  console.log("1",reqBody.first_name.trim() === '');
  console.log("2",!reqBody.last_name);
  console.log("2",reqBody.last_name.trim() === '');
  console.log("3",!reqBody.email);
  console.log("3",reqBody.email.trim() === '');
  console.log("4",!reqBody.broadway_role);
  console.log("4",reqBody.broadway_role.trim() === '');
  console.log("5",!reqBody.number_of_tickets);
  console.log("5",reqBody.number_of_tickets.trim() === '');
  console.log("6",!reqBody.show_id);
  console.log("6",reqBody.show_id.trim() === '');

  if (
    !reqBody.first_name ||
    reqBody.first_name.trim() === '' ||
    !reqBody.last_name ||
    reqBody.last_name.trim() === '' ||
    !reqBody.email ||
    reqBody.email.trim() === '' ||
    !reqBody.broadway_role ||
    reqBody.broadway_role.trim() === '' ||
    !reqBody.number_of_tickets ||
    reqBody.number_of_tickets.trim() === '',
    !reqBody.show_id ||
    reqBody.show_id.trim() === ''
  ) {
    return callback(
      null,
      response(400, {
        error: 'Reservation not properly formatted'
      })
    );
  }

  const reservation = {
    id: uuidv4(),
    first_name: reqBody.first_name,
    last_name: reqBody.last_name,    
    email: reqBody.email,
    broadway_role: reqBody.broadway_role,
    img:reqBody.img,
    number_of_tickets:reqBody.number_of_tickets    
  };
  console.log("Reservation",reservation);
  console.log("Table",broadwayTable);
  return db
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

    // db
    // .update({
    //     TableName:broadwayTable,
    //     Key:{
    //         id: reqBody.show_id,
    //     },
    //     UpdateExpression: `set number_of_tickets = number_of_tickets - :value`,
    //     ExpressionAttributeValues:{
    //         ':value':reqBody.number_of_tickets
    //     }
    // }).promise()
};