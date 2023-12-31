// replace these with your own aws info
const config = {
  cognito: {
    REGION: "YOUR_COGNITO_REGION",
    USER_POOL_ID: "YOUR_COGNITO_USER_POOL_ID",
    APP_CLIENT_ID: "YOUR_COGNITO_APP_CLIENT_ID",
    IDENTITY_POOL_ID: "YOUR_IDENTITY_POOL_ID",
  },
  graphql: {
    URL: "YOUR_GRAPHQL_URL",
    REGION: "YOUR_GRAPHQL_REGION",
    AUTHENTICATION_TYPE: "AMAZON_COGNITO_USER_POOLS",
  },
};

export default config;
