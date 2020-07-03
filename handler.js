const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const broadwayTable = "broadway_people";

function response(statusCode, message) {
  console.log("Should be returning cors.");
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

module.exports.getTheComics = (event, context, callback) => {
  console.log("Start getTheComics");
  var params = {
    TableName: broadwayTable,
    IndexName: "BroadwayRoleIndex",
    KeyConditionExpression: "broadway_role = :broadway_role",
    ExpressionAttributeValues: {
        ":broadway_role":"comedian"
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
  const show = {
    id: uuidv4(),
    email: reqBody.email,
    category : "comedy",
    number_of_tickets : parseInt(reqBody.number_of_tickets),
    show_name: reqBody.show_name,
    show_date: reqBody.show_date,
    show_time: reqBody.show_time,
    show_room: "The Brooklyn Room",
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
    for(let index=0;index<10;index++)
      console.log("Finsished request.")
    return output;
};