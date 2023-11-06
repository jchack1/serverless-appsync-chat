const {v4: uuidv4} = require("uuid");

const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

/**
 * @name addChatMember
 *
 * util that adds a new chatmember to the database; can be from a brand new chat or adding a member to an existing chat
 *
 */
const addChatMember = async (data) => {
  const params = {
    TableName: process.env.CHAT_MEMBERS_TABLE,
    Item: {
      PK: data.memberId,
      SK: `chat#${data.chatId}#${data.memberId}`,
      username: data.username,
      GSI1: data.chatId,
      lastMessage: data.lastMessage,
    },
  };

  await dynamo.put(params).promise();

  return true;
};

/**
 * @name addNewChat
 *
 * takes in new members, creates a new chatId, adds new chatMembers to database
 *
 */

// payload has this format:
// {
//   "version": "2018-05-29",
//   "operation": "Invoke",
//   "payload": {
//       "arguments": {
//           "id": "postId1"
//       }
//   }
// }
const addNewChatLambda = async (payload) => {
  const newMembers = payload.arguments.newMembers;
  const chatId = `chat_${uuidv4()}`;

  for (const member of newMembers) {
    await addChatMember({
      memberId: member.memberId,
      lastMessage: 0,
      chatId,
      username: member.username,
    });
  }

  return true;
};

module.exports.handler = addNewChatLambda;
