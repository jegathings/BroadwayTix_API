var AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid');

const random = (data) =>{
    return data[Math.floor(Math.random() * data.length)];
}
AWS.config.update({
  region: "us-east-1"
});

var docClient = new AWS.DynamoDB.DocumentClient();
const table="broadway_people";

var params = {
    TableName: table,
    Item:{
        email: "dina@gmail.com",
        id: uuidv4(),
        category : "comedy",
        number_of_tickets : 45,
        show_name: "Friday's Cash Money Show",
        show_date: "07/10/2020",
        show_time: "23:00",
        show_comedians: [
            {
              img: '',
              broadway_role: 'comedian',
              last_name: 'Robinson',
              email: 'keith_robinson@gmail.com',
              id: '6a977cd4-298b-488a-9a6f-ff4d110953b0',
              first_name: 'Keith'
            },
            {
              img: '',
              broadway_role: 'comedian',
              last_name: 'Ray',
              email: 'adam_ray@gmail.com',
              id: '3bf69b32-7b66-4d1b-9c40-e1325e956828',
              first_name: 'Adam'
            },
            {
              img: '',
              broadway_role: 'comedian',
              last_name: 'Gomez',
              email: 'luis_gomez@gmail.com',
              id: 'cd887bf7-71cf-421a-b00f-c9b2944a829b',
              first_name: 'Luis J'
            }
          ],
        show_room: "Brooklyn Showroom"
    }
};

docClient.put(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    }
    else {
      console.log(data);
    }
});
  