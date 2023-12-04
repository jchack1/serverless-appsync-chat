const config = {
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_JQiNELlvq",
    APP_CLIENT_ID: "260934mb54cga2j5prv1cqb5bj",
    IDENTITY_POOL_ID: "us-east-1:8a78f252-e9c1-46bd-93cc-7f03ec4b1acd",
  },
  graphql: {
    URL: "https://g7ziznjvmzafhc3o7vlzvd7uiu.appsync-api.us-east-1.amazonaws.com/graphql",
    REGION: "us-east-1",
    AUTHENTICATION_TYPE: "AMAZON_COGNITO_USER_POOLS",
  },
};

export default config;
