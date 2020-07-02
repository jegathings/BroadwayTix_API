var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-east-1"
});

var db = new AWS.DynamoDB.DocumentClient();

var table = "broadway_people";

var params = {
    TableName: table,
    IndexName: "BroadwayRoleIndex",
    KeyConditionExpression: "broadway_role = :broadway_role",
    ExpressionAttributeValues: {
        ":broadway_role":"comedian"
    }
};

async function getComics(){
    await  db.query(params).promise()
.then((data) =>{
    const comics = [];
    data.Items.forEach((item) =>{
        comics.push(item);
    });
});
}
const comics = await getComics();
console.log(comics);
// const comedians = docClient.query(params, function(err, data) {
//     const comedians = [];
//     if (err) {
//         console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
//     } else {
//         data.Items.forEach((item)=> {
//             comedians.push({email: item.email, first_name: item.first_name, last_name: item.last_name});
//         })
       
//     }
//     return comedians;
// });
// const result =  docClient.query(params).promise();
// console.log(result);