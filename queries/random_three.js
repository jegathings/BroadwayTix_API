var AWS = require("aws-sdk");

const random = (data) =>{
    return data[Math.floor(Math.random() * data.length)];
}
AWS.config.update({
  region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "broadway_people";

var random_three_params = {
    TableName: table,
    IndexName: "BroadwayRoleIndex",
    KeyConditionExpression: "broadway_role = :broadway_role",
    ExpressionAttributeValues: {
        ":broadway_role":"comedian"
    }
};

docClient.query(random_three_params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        const randomThree = [];
        randomThree.push(random(data.Items));
        randomThree.push(random(data.Items));
        randomThree.push(random(data.Items));
        console.log(randomThree);
    }
});
