import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
//import { CognitoIdentityProviderClient, SignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

import {signIn, signOut, signUp, confirmSignUp} from "aws-amplify/auth";

Amplify.configure({
Auth: {
    Cognito: {
      userPoolId: "us-east-1_ThNCqe4mv",
      userPoolClientId: "1ripj2993qj4kuq1e9fdf35id4",
    },
    },
});

export const signUpUser = async(username, email, password) => {
  const user = await signUp(username, email, password, "");
  console.log("sign up successful");
}

const dynamoClient = new DynamoDBClient();
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);
export const handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2)); // log the entire event
  // extracts user details from the event
  const userId = event.userName;
  const email = event.request.userAttributes.email;
  const username = event.request.userAttributes.name;
  const createdAt = Date.now();
  // logs extracted details for debugging
  console.log('Extracted user details:', { userId, email, username, createdAt });
  // saves user information to the Users table
  const userParams = {
    TableName: 'Users',
    Item: {
      userID: userId,
      email: email,
      Username: username,
      CreatedAt: createdAt
    }
  };
  // saves user preferences to the UserPreferences table
  /*const preferencesParams = {
    TableName: 'UserPreferences',
    Item: {
      userID: userId,
      PreferredPlatform: 'LeetCode',
      HintFrequency: '2x a problem'
    }
  };
  // saves user code drafts to the UserCodeDrafts table
  const codeDraftsParams = {
    TableName: 'UserCodeDrafts',
    Item: {
      userID: userId,
      CreatedAt: createdAt,
      Drafts: []
    }
  };*/
  try {
    // save to Users table
    console.log('Attempting to save user information to Users table:', userParams);
    await dynamoDB.send(new PutCommand(userParams));
    console.log('User information successfully saved to Users table');
    // save to UserPreferences table
    //console.log('Attempting to save user preferences to UserPreferences table:', preferencesParams);
    //await dynamoDB.send(new PutCommand(preferencesParams));
    //console.log('User preferences successfully saved to UserPreferences table');
    // save to UserCodeDrafts table
    //console.log('Attempting to save user code drafts to UserCodeDrafts table:', codeDraftsParams);
    //await dynamoDB.send(new PutCommand(codeDraftsParams));
    //console.log('User code drafts successfully saved to UserCodeDrafts table');
    // returns the event how it was initially received
    return event;
  } catch (error) {
    console.error('Error saving user information:', error);
    // returns the event even if there's an error
    return event;
  }
};