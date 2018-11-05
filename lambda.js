const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const tableName = "email-subscribers";

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

exports.handler = (event, context, callback) => {
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*'
    };

    const defaultResponse = {
        "headers": headers,
        "isBase64Encoded": false,
    };

    switch (event.httpMethod) {
        case "OPTIONS":
            const response = {
                "statusCode": 200,
                ...defaultResponse,
            };
            callback(null, response);
            break;
        case "POST": {
            const body = JSON.parse(event.body);
            if (!emailRegex.test(body.email)) {
                const responseBody = { error: "Invalid email" };
                const response = {
                    statusCode: 400,
                    body: JSON.stringify(responseBody),
                    ...defaultResponse,
                };
                callback(null, response);
                break;
            }
            dynamodb.putItem({
                TableName: tableName,
                Item : {
                    "email": {S: body.email },
                }
            }, function(err, data) {
                if (err) {
                    console.error('putting item into dynamodb failed: '+err);
                    const responseBody = { error: "Server error" };
                    const response = {
                        "statusCode": 500,
                        body: JSON.stringify(responseBody),
                        ...defaultResponse,
                    };
                    callback(null, response);
                }
                else {
                    console.log('successfully put item into dybamodb');
                    const responseBody = { email: body.email };
                    const response = {
                        "statusCode": 201,
                        body: JSON.stringify(responseBody),
                        ...defaultResponse,
                    };
                    callback(null, response);
                }
            });
            break;
        }
        default: {
            console.error('unsupported method' + event.httpMethod);
            const response = {
                "statusCode": 405,
                ...defaultResponse,
            };
            callback(null, response);
        }
    }
};
