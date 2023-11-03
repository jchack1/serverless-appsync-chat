const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1",
});
const {v4: uuidv4} = require("uuid");

const postSignUp = async (event) => {
  console.log(JSON.stringify(event));

  if (event.request.userAttributes.email) {
    try {
      const params = {
        TableName: "appsync-chat-app-members",
        Item: {
          PK: `member_${uuidv4()}`,
          SK: Date.now(),
          username: event.request.userAttributes["custom:username"],
          GSI1: event.request.userAttributes.email,
        },
      };

      await db.put(params).promise();
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  return event;
};

module.exports.handler = postSignUp;
