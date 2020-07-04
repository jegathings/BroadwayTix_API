var AWS = require("aws-sdk");

AWS.config.update({region: "us-east-1"});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "broadway_users",
    KeySchema: [       
        { AttributeName: "id", KeyType: "HASH"},  
    ],
    AttributeDefinitions: [   
        { AttributeName: "id", AttributeType: "S"},  
          
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: "EmailIndex",
            KeySchema: [
                { AttributeName: "email", KeyType: "HASH"},
                { AttributeName: "password", KeyType: "RANGE"}
            ],
            Projection:{
                "ProjectionType" : "ALL"
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
                }
        },
    ]
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
