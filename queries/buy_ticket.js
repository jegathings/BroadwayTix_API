//create customer
//update counter
//generate ticket id  
//update customer list
const AWS = require('aws-sdk');
AWS.config.update({region: "us-east-1"});
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const THE_SHOW_ID = "850af627-d394-4139-a39c-e387c8c3b724";
//create customer
dynamoDB
.put({
    Item: {
        "id": uuidv4(),
        "first_name":"Cladia",
        "last_name":"Kinkade",
        "email": "claudia@gmail.com",
        "broadway_role":"customer",
        "img":""
    },
    TableName:"broadway_people"
})
.promise()
//generate ticket id  
//update counter
//update customer list
dynamoDB
    .update({
        TableName:"broadway_people",
        Key:{
            id: THE_SHOW_ID,
        },
        UpdateExpression: `set number_of_tickets = number_of_tickets - :value`,
        ExpressionAttributeValues:{
            ':value':5
        }
    }).promise()