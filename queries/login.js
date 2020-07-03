var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var loginParams = {
    TableName: table,
    IndexName: "BroadwayRoleIndex",
    KeyConditionExpression: "broadway_role = :broadway_role",
    ExpressionAttributeValues: {
        ":broadway_role":"comedian"
    }
};