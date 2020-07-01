var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "broadway_people";

var params = {
    TableName: table,
    IndexName: "ShowDateTimeIndex",
    KeyConditionExpression: "show_date = :show_date",
    ExpressionAttributeValues: {
        ":show_date":"07/10/2020"
    }
};

docClient.query(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", data);
    }
});
