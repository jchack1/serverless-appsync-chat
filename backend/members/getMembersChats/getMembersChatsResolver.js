import {util} from "@aws-appsync/utils";

export function request(ctx) {
  return {
    operation: "Invoke",
    payload: {field: "memberId", arguments: ctx.args.memberId},
  };
}

export function response(ctx) {
  if (ctx.error) return ctx.error;
  return ctx.result;
}
