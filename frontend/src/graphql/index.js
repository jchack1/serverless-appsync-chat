const getAllChatMessages = `query getAllChatMessages(
    $chatId: String, $lastMessageKey: String
  ) {
    getAllChatMessages(chatId: $chatId, lastMessageKey: $lastMessageKey) {
      messages {
        createdAt
        messageId
        author
        content
        chatId
      }
      lastMessageKey
    }
  }
  `;

const getMember = `query getMember(
    $email: String
  ) {
    getMember(email: $email) {
        memberId
        email
        username
    }
  }
  `;

const addNewMessage = `mutation addNewMessage(
     $messageId: String, $author: String, $content: String, $chatId: String
  ) {
    addNewMessage(messageId: $messageId, author: $author, content: $content, chatId: $chatId) {
        createdAt
        messageId
        author
        content
        chatId
    }
  }`;

// const addNewChat = `mutation addNewChat($memberId: String, $username: String) {
//   addNewChat(input: {newMembers: {memberId: $memberId, username: $username}})
// }
// `;

const addNewChat = `mutation addNewChat($input: AddNewChatInput) {
  addNewChat(input: $input){
    chatId
    members {
      memberId
      username
    }
    lastMessage
  }
}`;

const newMessageSubscription = `subscription newMessage{
    newMessage{
        createdAt
        messageId
        author
        content
        chatId
    }
  }
  `;

const getMembersChats = `query getMembersChats(
    $memberId: String
  ) {
    getMembersChats(memberId: $memberId) {
      chatId
      members {
        memberId
        username
      }
      lastMessage
    }
  }
`;

export {
  getAllChatMessages,
  addNewMessage,
  newMessageSubscription,
  getMember,
  addNewChat,
  getMembersChats,
};
