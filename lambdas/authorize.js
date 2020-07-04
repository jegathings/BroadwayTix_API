const jwt = require('jsonwebtoken');

module.exports.handler = (event, context, callback) => {
    console.log("Event", event);
    const token = event.authorizationToken;
    console.log("Token", token);
    console.log("MethodARN", event.methodArn);
    try {
        const decoded = jwt.verify(token, "SECRET");
        const user = decoded.user;

        console.log("Decoded User", user);
        const userId = user.username;
        const authorizerContext = { user: JSON.stringify(user) };
        const policyDocument = buildIAMPolicy(userId, 'Allow', event.methodArn, authorizerContext);

        callback(null, policyDocument);
    } catch (e) {
        console.log(e);
        const policyDocument = buildIAMPolicy("dina@gmail.com", 'Allow', event.methodArn, {user:"authorizerContext"});

        callback(null, policyDocument);
    }
};

const buildIAMPolicy = (userId, effect, resource, context) => {
    const policy = {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    };

    return policy;
};
