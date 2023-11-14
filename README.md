# React/AppSync Chat App

Backend created with Serverless Framework and AWS. GraphQL API and real-time chat functionality created with AppSync, using DynamoDB and Lambda as datasources and Cognito for authentication.

Frontend created with React and Styled-Components.

## How to run this project

Backend: deploy into your AWS account, running `sls deploy --aws-profile-<your profile name here>` in backend folder.

Frontend: For authentication to work, and to connect to AppSync, you need to create a `config.js` file, like the config-sample.js file included. Once the backend is deployed, get the following items from Cognito and the GraphQL API: USER_POOL_ID, APP_CLIENT_ID, IDENTITY_POOL_ID, and GraphQL url. Start the app by running `npm start` in frontend folder.
