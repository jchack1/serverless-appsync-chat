// import {util} from "@aws-appsync/utils";
// import {v4 as uuidv4} from "uuid";

export function request(ctx) {
  // const chatId = `chat_${uuidv4()}`;

  // return {
  //   operation: "BatchPutItem",
  //   tables: {
  //     chatMembersTable: ctx.args.newMembers.map((member) =>
  //       util.dynamodb.toMapValues({
  //         PK: member.memberId,
  //         SK: `chat#${chatId}#${member.memberId}`,
  //         username: member.username,
  //         GSI1: chatId,
  //         lastMessage: 0,
  //       })
  //     ),
  //   },
  // };

  return {
    operation: "Invoke",
    payload: {field: "newMembers", arguments: ctx.args.input.newMembers},
  };
}

export function response(ctx) {
  if (ctx.error) return ctx.error;

  const data = ctx.result.data;

  console.log(data);

  return data;
}
