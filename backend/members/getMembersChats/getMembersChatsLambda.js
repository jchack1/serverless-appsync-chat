const AWS = require("aws-sdk");

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION,
});

/**
 * @name getMembersChats
 *
 * gets a list of chats the member is a part of
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

const getMembersChats = async (payload) => {
  const memberId = payload.arguments.memberId;

  const params = {
    TableName: process.env.CHAT_MEMBERS_TABLE,
    KeyConditionExpression: "PK = :memberId",
    ExpressionAttributeValues: {
      ":memberId": memberId,
    },
  };

  //should return a list of chats for this member
  const result = await dynamo.query(params).promise();

  if (result.Items.length === 0) {
    return [];
  }

  //for each chat, we want to get the username(s) associated with them and build an object
  let chatMembers = [];
  let memberChats = [];

  for (const chat of result.Items) {
    const chatId = chat.GSI1;

    const chatParams = {
      TableName: process.env.CHAT_MEMBERS_TABLE,
      IndexName: "GSI1",
      KeyConditionExpression: "GSI1 = :chatId",
      ExpressionAttributeValues: {
        ":chatId": chatId,
      },
    };

    //should return a list of chat members
    const chatResult = await dynamo.query(chatParams).promise();

    // chatMembers.push(chatResult.Items);
    chatMembers = [...chatMembers, ...chatResult.Items];
  }

  for (const chatMember of chatMembers) {
    const chatId = chatMember.GSI1;

    if (!memberChats.some((y) => y.chatId === chatId)) {
      //push a new object to array with that chatId, as well as the username and lastMessage
      memberChats.push({
        chatId: chatId,
        members: [{memberId: chatMember.PK, username: chatMember.username}],
        lastMessage: chatMember.lastMessage,
      });

      continue;
    }
    const chatIdIndex = memberChats.findIndex((y) => y.chatId === chatId);

    memberChats[chatIdIndex].members.push({
      memberId: chatMember.PK,
      username: chatMember.username,
    });
  }

  return memberChats;
};

module.exports.handler = getMembersChats;
