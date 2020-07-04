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
        { AttributeName: "email", AttributeType: "S"},
        { AttributeName: "password", AttributeType: "S"}
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: "LoginIndex",
            KeySchema: [
                { AttributeName: "email", KeyType: "HASH"},
                { AttributeName: "password", KeyType: "RANGE"}
            ],
            Projection:{
                "NonKeyAttributes":["first_name", "last_name","email","img","broadway_role"],
                "ProjectionType" : "INCLUDE"
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
