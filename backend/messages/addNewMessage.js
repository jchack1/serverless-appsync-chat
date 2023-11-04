import {util} from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      "PK": ctx.args.chatId,
      "SK": util.time.nowEpochMilliSeconds(),
    }),
    attributeValues: util.dynamodb.toMapValues({
      "GSI1": ctx.args.messageId,
      "author": ctx.args.author,
      "content": ctx.args.content,
    }),
  };
}

export function response(ctx) {
  if (ctx.error) return ctx.error;

  const data = ctx.result;

  return {
    chatId: data.PK,
    createdAt: util.time.epochMilliSecondsToISO8601(data.SK),
    messageId: data.GSI1,
    content: data.content,
    author: data.author,
  };
}
