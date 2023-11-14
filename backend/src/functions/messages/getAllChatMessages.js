export function request(ctx) {
  return {
    operation: "Query",
    query: {
      expression: "PK = :PK",
      expressionValues: util.dynamodb.toMapValues({":PK": ctx.args.chatId}),
    },
    limit: 10,
    scanIndexForward: false,
    nextToken: ctx.args.lastMessageKey ? ctx.args.lastMessageKey : null,
  };
}

export function response(ctx) {
  if (ctx.error) return ctx.error;

  if (ctx.result.items.length === 0) {
    return {
      messages: [],
      lastMessageKey: null,
    };
  }

  let messages = [];

  for (const item of ctx.result.items) {
    messages.push({
      chatId: item.PK,
      createdAt: util.time.epochMilliSecondsToISO8601(item.SK),
      messageId: item.GSI1,
      author: item.author,
      content: item.content,
    });
  }

  return {
    messages,
    lastMessageKey: ctx.result.nextToken ? ctx.result.nextToken : null,
  };
}
