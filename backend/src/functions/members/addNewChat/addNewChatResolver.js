export function request(ctx) {
  return {
    operation: "Invoke",
    payload: {field: "addNewChat", arguments: ctx.args.input},
  };
}

export function response(ctx) {
  const {error, result} = ctx;

  if (error) {
    return util.appendError(error.message, error.type, result);
  }

  return result;
}
