// Load the AWS SDK for JS
var AWS = require("aws-sdk");
AWS.config.update({region: "us-east-1"});

// -----------------------------------------
// Create the Service interface for dynamoDB
var dynamodb = new AWS.DynamoDB({apiVersion: "2012-08-10"});

var params = {
    TableName: "broadway_tix",
    AttributeDefinitions: [
    {
      AttributeName: "first_name",
      AttributeType: "S"
    },
    {
      AttributeName: "last_name",
      AttributeType: "S"
    },
    {
        AttributeName: "email",
        AttributeType: "S"
    },
    {
        AttributeName: "role",
        AttributeType: "S"
    },
    {
        AttributeName: "category",
        AttributeType: "S"
    },
    {
        AttributeName: "number_of_tickets",
        AttributeType: "N"
    },
    {
        AttributeName: "show_name",
        AttributeType: "S"
    },
    {
        AttributeName: "show_date",
        AttributeType: "S"
    },
    {
        AttributeName: "show_commedians",
        AttributeType: "S"
    },
    {
        AttributeName: "show_room",
        AttributeType: "S"
    }
  ],
  
  KeySchema: [
    {
      AttributeName: "role",
      AttributeType: "HASH"
    },
    {
      AttributeName: "email",
      AttributeType: "RANGE"
    },    
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  },
  GlobalSecondaryIndexes: [{
    IndexName: "show_index",
    KeySchema: [
        {
            AttributeName: "show_name",
            KeyType: "HASH"
        },
        {
            AttributeName: "show_date",
            KeyType: "RANGE"
        }
    ],
    Projection: {
        ProjectionType: "ALL"
    },
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
    }
    }]
};

// Create the table.
dynamodb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Table Created", data);
  }
});
