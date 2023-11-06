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
const getMembersChats = async (memberId) => {
  console.log(`memberId: ${JSON.stringify(memberId)}`);
  try {
    const params = {
      TableName: process.env.CHAT_MEMBERS_TABLE,
      KeyConditionExpression: "PK = :memberId",
      ExpressionAttributeValues: {
        ":memberId": memberId,
      },
    };

    //should return a list of chats for this member
    const result = await dynamo.query(params).promise();

    console.log(`result: ${JSON.stringify(result)}`);

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

      console.log(`chatResult: ${JSON.stringify(chatResult)}`);

      // chatMembers.push(chatResult.Items);
      chatMembers = [...chatMembers, ...chatResult.Items];
    }

    //filter out the current member before returning the chats
    // const filteredChatMembers = chatMembers.filter(
    //   (item) => item.PK !== memberId
    // );

    // for (const chatMember of filteredChatMembers) {
    for (const chatMember of chatMembers) {
      console.log(`chatMember: ${JSON.stringify(chatMember)}`);
      console.log(`memberChats before if: ${JSON.stringify(memberChats)}`);

      const chatId = chatMember.GSI1;

      if (!memberChats.some((y) => y.chatId === chatId)) {
        //push a new object to array with that chatId, as well as the username and lastMessage
        memberChats.push({
          chatId: chatId,
          members: [{memberId: chatMember.PK, username: chatMember.username}],
          lastMessage: chatMember.lastMessage,
        });

        console.log(`memberChats in if: ${JSON.stringify(memberChats)}`);

        continue;
      }
      const chatIdIndex = memberChats.findIndex((y) => y.chatId === chatId);

      console.log(`chatIdIndex: ${JSON.stringify(chatIdIndex)}`);

      console.log(
        `memberChats[chatIdIndex]: ${JSON.stringify(memberChats[chatIdIndex])}`
      );

      memberChats[chatIdIndex].members.push({
        memberId: chatMember.PK,
        username: chatMember.username,
      });

      console.log(`memberChats after push: ${JSON.stringify(memberChats)}`);
    }

    return memberChats;
  } catch (e) {
    return e;
  }
};

module.exports.handler = getMembersChats;
