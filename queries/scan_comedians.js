var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();

var table = "broadway_people";

var params = {
    TableName: table,
    FilterExpression: "broadway_role = :broadway_role",
    ExpressionAttributeValues: {
        ":broadway_role": "comedian"
   }
};    
docClient.scan(params, (err,data)=>{
    if(err){
        console.log("An error happened during scan.",JSON.stringify(err, null, 2));
    }else{
        data.Items.forEach((person)=>{
            console.log(person);
        })
    }
})