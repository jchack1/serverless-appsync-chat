import React from "react";
import ReactDOM from "react-dom/client";
import {Amplify} from "aws-amplify";
import config from "./config";
import "./index.css";
import App from "./App";

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID,
  },
});

let graphqlConfig = {
  aws_appsync_graphqlEndpoint: config.graphql.URL,
  aws_appsync_region: config.graphql.REGION,
  aws_appsync_authenticationType: config.graphql.AUTHENTICATION_TYPE,
};

Amplify.configure(graphqlConfig);

const rootElement = document.getElementById("root");

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
