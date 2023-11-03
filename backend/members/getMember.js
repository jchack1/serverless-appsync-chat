import {util} from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "Query",
    query: {
      expression: "GSI1 = :GSI1",
      expressionValues: util.dynamodb.toMapValues({":GSI1": ctx.args.email}),
    },
    index: "GSI1",
  };
}

export function response(ctx) {
  if (ctx.error) return ctx.error;

  const data = ctx.result.items[0];

  return {
    memberId: data.PK,
    email: data.GSI1,
    username: data.username,
  };
}
