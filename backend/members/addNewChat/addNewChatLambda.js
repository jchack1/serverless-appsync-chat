// import {AddMembersToNewChatInput} from "../_types/index";
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
  try {
    const params = {
      TableName: process.env.CHAT_MEMBERS_TABLE,
      Item: {
        PK: data.memberId,
        SK: `chat#${data.chatId}#${data.memberId}`,
        displayName: data.displayName,
        GSI1: data.chatId,
        lastMessage: data.lastMessage,
      },
    };

    const result = await dynamo.put(params).promise();

    console.log(`addChatMember result: ${JSON.stringify(result)}`);

    return true;
  } catch (e) {
    return e;
  }
};

/**
 * @name addNewChat
 *
 * takes in new members, creates a new chatId, adds new chatMembers to database
 *
 */
const addNewChatLambda = async (newMembers) => {
  try {
    const chatId = `chat_${uuidv4()}`;

    for (const member of newMembers) {
      await addChatMember({
        memberId: member.memberId,
        lastMessage: 0,
        chatId,
        displayName: member.displayName,
      });
    }

    return true;
  } catch (e) {
    return e;
  }
};

module.exports.handler = addNewChatLambda;
