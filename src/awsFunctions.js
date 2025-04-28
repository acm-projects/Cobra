import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
//import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';

import {signIn, signOut, signUp, confirmSignUp, fetchAuthSession } from "aws-amplify/auth";
import { Amplify } from 'aws-amplify';
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import HintCard from './components/HintCard';



const dynamoClient = new DynamoDBClient(
  {
    region: "us-east-1",
  } 
);
const dynamoDB = DynamoDBDocumentClient.from(dynamoClient);

Amplify.configure({
Auth: {
    Cognito: {
      userPoolId: "us-east-1_ThNCqe4mv",
      userPoolClientId: "1ripj2993qj4kuq1e9fdf35id4",
    },

    },
});

let currentUserId = "";

export const signOutUser = async() => {
  signOut();
}

export const verifyEmail = async(username, confirmationCode) => {
  try {
    await confirmSignUp({username: username, confirmationCode: confirmationCode});
    console.log("successfully verified email");
    chrome.browsingData.remove({
      origins: ["https://leetcode.com"]
    }, {
      cookies: true,
      localStorage: false,
      indexedDB: true,
      serviceWorkers: true,
      cache: true
    }, () => {
      console.log("Session data cleared.");
    });
    await chrome.tabs.create({ url: "https://leetcode.com/accounts/login/" });
    chrome.runtime.sendMessage({type: "linkedLeetCodeLogin"});
    console.log("created tab");
    return true;
  } catch (error){
    console.error(error);
    return false;
  }
}

export const sendChat = async(message, history) => {
  console.log("sending chat with userid: " + currentUserId);
  try{
    const code = await chrome.runtime.sendMessage({type: "getDraft"});
    console.log("code: " + code);
    console.log("sending chat: " + message);
    const response = await fetch(`https://i27yrfhe70.execute-api.us-east-1.amazonaws.com/dev/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message, code: code, userid: currentUserId, history: history }),
    });
     const responseObject = await response.json();
     console.log(responseObject);
     const chatbotSays =  responseObject.reply;
     console.log(chatbotSays);
     return chatbotSays;
  } catch (error) {
    console.error("Error sending chat:", error);
  }
}

export const getHints = async(slug) => {
  try{
    //console.log("getting problem solutions with slug: " + slug);
    //const solResponse = await fetch(`https://api.github.com/repos/kamyu104/LeetCode-Solutions/contents/Python/${problemTitle}`);
    console.log("grabbing hints with slug: " + slug);
    const response = await fetch (`https://vmecerx9b2.execute-api.us-east-1.amazonaws.com/dev/hints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ leetcodeSlug: slug })
    });
     const responseObject = await response.json();
     const hints =  JSON.parse(responseObject.body).reply;
     //console.log(hints);
     return hints;
  } catch (error) {
    console.error("Error fetching hints:", error);
  }
}

export const getErrorAnalysis = async(slug, code) => {
  try{
    if(!code){
      throw new Error("No code provided for error analysis.");
    }
    //console.log("code before call to geterroranalysis: " + code);
    //console.log("getting problem solutions with slug: " + slug);
    //const solResponse = await fetch(`https://api.github.com/repos/kamyu104/LeetCode-Solutions/contents/Python/${problemTitle}`);
    //console.log("grabbing error analysis with slug: " + slug);
    const bodyObject = { leetcodeSlug: slug, code: code };
    console.log("bodyObject: " + JSON.stringify(bodyObject));
    const response = await fetch (`https://vmecerx9b2.execute-api.us-east-1.amazonaws.com/dev/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyObject),
    });
     const responseObject = await response.json();
     console.log(responseObject);
     const analysis = JSON.parse(responseObject.body).reply;
     const whatGPTreads = JSON.parse(responseObject.body).code;
     console.log(analysis);
     //console.log(whatGPTreads);
     return analysis;
  } catch (error) {
    console.error("Error fetching analysis:", error);
  }
}

export const getCodeSnipets = async(slug) => {
  try{
    console.log("grabbing code snippets with slug: " + slug);
    const response = await fetch (`https://vmecerx9b2.execute-api.us-east-1.amazonaws.com/dev/snippets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ "leetcodeSlug": slug })
    });
     const responseObject = await response.json();
     //console.log(responseObject);
     const replyJSON =  JSON.parse(responseObject.body).reply;
     //console.log(replyJSON);
     const result = JSON.parse(replyJSON).hints;
     return result;
  } catch (error) {
    console.error("Error fetching code snippets:", error);
  }
}

export const errorAnalysis = async(code) => {
  try{

  } catch (e) {

  }
}

export const saveDraftToDynamo = async(username, problemSlug, codeDraft) => {
  try {
    console.log("saving...")
    console.log("username: " + username);
    let userId = username.toLowerCase();
    const command = new UpdateCommand({
      TableName: 'UserCodeDrafts',
      Key: {
        userID: userId,
      },
      UpdateExpression: "set CodeDrafts.#ps = :slug",
      ExpressionAttributeNames: {
        "#ps": problemSlug
      },
      ExpressionAttributeValues: {
        ":slug": codeDraft
      },
    });

    const dtscommand = new UpdateCommand({
      TableName: 'UserCodeDrafts',
      Key: {
        userID: userId,
      },
      UpdateExpression: "set DraftTimeStamps.#dts = :slug",
      ExpressionAttributeNames: {
        "#dts": problemSlug
      },
      ExpressionAttributeValues: {
        ":slug": Date.now()
      },
    });


    console.log('Attempting to save draft for ' + problemSlug + ' to UserCodeDrafts table: ');//, command);
    const response = await dynamoDB.send(command);
    console.log('User information successfully saved to UserCodeDrafts table');
    console.log(response);

    console.log('Attempting to save timestamp for ' + problemSlug + ' to UserCodeDrafts table: ');//, dtscommand);
    const dtsResponse = await dynamoDB.send(dtscommand);
    console.log('User information successfully saved to UserCodeDrafts table');
    console.log(dtsResponse);
    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}

export const signInUser = async(username, password) => {
      const signOutResponse = await signOut();
      //console.log(signOutResponse);
      const signInResponse = await signIn({username: username, password: password});
      //console.log(signInResponse);
      //const user = await Auth.currentAuthenticatedUser();
      //const userId = user.attributes.userId;
      //console.log("userId: " + userId);
      //currentUserId = userId;
      console.log("sign in successful");
      return signInResponse;
}

export const signUpUser = async(uusername, eemail, ppassword) => {
  console.log("signing up user: " + uusername + " with email: " + eemail + " and password: " + ppassword);
  const signUpResponse = await signUp({
    "username": uusername, 
    "password": ppassword, 
    "options": {"userAttributes": {"email": eemail}}
  });
  console.log("sign up successful");
  return signUpResponse;
}

export const writeLeetCodeUsername = async(id, LCusername) => {
  try{
    const command = new UpdateCommand({
      TableName: 'Users',
      Key: {
        userID: id.toLowerCase(),
      },
      UpdateExpression: "set LeetCodeUsername = :sLCU",
      ExpressionAttributeValues: {
        ":sLCU": LCusername
      },
    });
    console.log('Attempting to save user leetcodeusername to Users table:');//, command);
    const response = await dynamoDB.send(command);
    console.log('User information successfully saved to Users table');
  } catch (error) {
    console.error("Verification error: " + error);
  }
}

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