var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var db = new AWS.DynamoDB();

var table = "broadway_users";

const params = {
    TableName: table,
    IndexName: "LoginIndex",
    KeyConditionExpression: "email = :email AND password = :password",
    ExpressionAttributeValues: {
        ":email":{"S": "dina@gmail.com"},
        ":password":{"S":"$2b$10$ykxAUj7Gd2zkwbpSWskAA.tWoKqqCZt92kaoQffDPekAAsolKcXTW"}
    }
    };
    console.log("Params", params);
    db.query(params).
    promise()
    .then((result => {
        console.log(result.Items);
        if(result.Count === 1){
            const [user] = [result.Items[0]];
            console.log("Destructure",user);
            console.log("Image",user.img.S);
            console.log("First name", user.first_name.S);
            console.log("Last name", user.last_name.S);
            console.log("Broadway Role", user.broadway_role.S);
            console.log("Email",user.email.S);
        }
    }))
    .catch((err) =>{ 
    console.log(err);
    })