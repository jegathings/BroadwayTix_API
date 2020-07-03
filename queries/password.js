const bcrypt = require('bcrypt');

console.log(bcrypt.hashSync(
    "password",
    bcrypt.genSaltSync(10)
));