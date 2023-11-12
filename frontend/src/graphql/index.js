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
  }
  `;

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

export {getAllChatMessages, addNewMessage, newMessageSubscription, getMember};
