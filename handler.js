const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const broadwayTable = process.env.TABLE;

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
  if (
    !reqBody.firstName ||
    reqBody.firstName.trim() === '' ||
    !reqBody.lastName ||
    reqBody.lastName.trim() === '' ||
    !reqBody.email ||
    reqBody.email.trim() === '' ||
    !reqBody.show ||    
    reqBody.show.trim() === '' 
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
    createdAt: new Date().toISOString(),
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,    
    email: reqBody.email,
    show: reqBody.show
  };
  console.log("Reservation",reservation);
  console.log("Table",broadwayTable);
  return db
    .put({
      TableName: 'broadway_comedy_club',
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
};