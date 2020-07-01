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

module.exports.createShow = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  console.log("Show Comedians", reqBody.show_comedians);
  const show = {
    id: uuidv4(),
    email: reqBody.email,
    category : reqBody.category,
    number_of_tickets : reqBody.number_of_tickets,
    show_name: reqBody.show_name,
    show_date: reqBody.show_date,
    show_time: reqBody.show_time,
    show_room: reqBody.show_room,
    show_comedians: reqBody.show_comedians
  }
  const output =  db
  .put({
    TableName: broadwayTable,
    Item: show
  })
  .promise()
  .then(() => {
    callback(null, response(201, show));
  })
  .catch((err) => {
    console.log(err);
    response(null, response(err.statusCode, err))
  });

  return output;
}
module.exports.createReservation = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const reservation = {
    id: uuidv4(),
    first_name: reqBody.first_name,
    last_name: reqBody.last_name,    
    email: reqBody.email,
    broadway_role: reqBody.broadway_role,
    img:reqBody.img,
    number_of_tickets:reqBody.number_of_tickets    
  };

  const output =  db
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

    db
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
// if (
//   !reqBody.first_name ||
//   reqBody.first_name.trim() === '' ||
//   !reqBody.last_name ||
//   reqBody.last_name.trim() === '' ||
//   !reqBody.email ||
//   reqBody.email.trim() === '' ||
//   !reqBody.broadway_role ||
//   reqBody.broadway_role.trim() === '' ||
//   !reqBody.number_of_tickets ||
//   reqBody.number_of_tickets.trim() === '',
//   !reqBody.show_id ||
//   reqBody.show_id.trim() === ''
// ) {
//   return callback(
//     null,
//     response(400, {
//       error: 'Reservation not properly formatted'
//     })
//   );
// }

