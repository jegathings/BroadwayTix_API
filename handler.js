const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const dbClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
const db = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

const BROADWAY_TIX = "broadway_people";
const BROADWAY_USERS = "broadway_users";
const JWT_EXPIRATION_TIME = '55m';

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message),
    headers: {
      'Access-Control-Allow-Origin': '*'
  },
};
}
module.exports.login = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  console.log("Event",event);
  console.log("Body", reqBody);  
  const params = {
  TableName: "broadway_users",
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
module.exports.getTheComics = (event, context, callback) => {
  console.log("Start getTheComics");
  var params = {
    TableName: BROADWAY_TIX,
    IndexName: "BroadwayRoleIndex",
    KeyConditionExpression: "broadway_role = :broadway_role",
    ExpressionAttributeValues: {
        ":broadway_role":{"S":"comedian"}
    }
  };
  db.query(params).
  promise()
  .then((result => {
    callback(null, response(200,result.Items));
  }))
  .catch((err) => callback(null, response(err.statusCode, err)));  
  console.log("End getTheComics");
}

module.exports.getTheEvents = (event, context, callback) => {
  console.log("Events");  
}

module.exports.createShow = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);
  console.log("Email",reqBody.show_name);
  console.log("Number of tickets", reqBody.number_of_tickets);
  console.log("Show Name", reqBody.show_name);
  console.log("Show Date", reqBody.show_date);
  console.log("Show Time", reqBody.show_time);
  const show = {
    id: {"S": uuidv4()},
    email: {"S": reqBody.email},
    category : {"S": "comedy"},
    number_of_tickets : {"S": reqBody.number_of_tickets},
    show_name: {"S":reqBody.show_name},
    show_date: {"S": reqBody.show_date},
    show_time: {"S": reqBody.show_time},
    show_room: {"S":"The Brooklyn Room"},
    show_comedians: {"S":"Chris Rock"}
  }
  console.log("The Show", show);
  const output =  db
  .putItem({
    TableName: BROADWAY_TIX,
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
    broadway_role: "customer",
    number_of_tickets:reqBody.number_of_tickets    
  };

  const output =  dbClient
    .put({
      TableName: BROADWAY_TIX,
      Item: reservation
    })
    .promise()
    .then(() => {
      console.log("Reservation", reservation);
      callback(null, response(201, reservation));
    })
    .catch((err) => {
      console.log(err);
      response(null, response(err.statusCode, err))
    });

};

module.exports.createUser = (event, context, callback) => {
  const reqBody = JSON.parse(event.body);

  const user = {
    id: uuidv4(),
    first_name: reqBody.first_name,
    last_name: reqBody.last_name,    
    email: reqBody.email,
    password: reqBody.password,
    broadway_role: "admin",
  };
  dbClient
  .put({
    TableName: BROADWAY_USERS,
    Item: user
  })
  .promise()
  .then(() => {
    console.log("User", user);
    callback(null, response(201, user));
  })
  .catch((err) => {
    console.log(err);
    response(null, response(err.statusCode, err))
  });
};