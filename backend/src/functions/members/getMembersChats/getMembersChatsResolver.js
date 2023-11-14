export function request(ctx) {
  return {
    operation: "Invoke",
    payload: {field: "getMembersChats", arguments: ctx.args},
  };
}

export function response(ctx) {
  if (ctx.error) return ctx.error;
  return ctx.result;
}
