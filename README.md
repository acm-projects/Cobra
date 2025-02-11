

# <h1 align="center">Cobra</h1>

<p align="center">
Mastering coding challenges on platforms like LeetCode and HackerRank can be daunting, especially when you're stuck without any guidance. Well worry no more, Cobra is here to help. Cobra is a browser extension designed to enhance your coding challenge experience by providing contextual hints, real-time explanations, and solution breakdowns tailored to the problem you're working on. With integrations to resources like Stack Overflow and GitHub, it delivers relevant discussions, code snippets, and optimal strategies directly within the challenge interface, helping you learn as you solve.
</p>
<br>

## MVP :trophy:

- User account with secure authentication
- Automatic Detection of Coding Platforms:
  - Seamless integration with platforms like:
    - LeetCode, HackerRank, Codeforces, and GeeksforGeeks.
  - Identifies the coding problem currently being worked on by analyzing the page content or URL structure.
- Contextual Hints and Explanations:
  - Dynamically provides hints and breakdowns tailored to the specific problem, categorized into tiers (e.g., basic, intermediate, advanced).
  - Highlights problem-solving patterns or common strategies.
- External Resources Integrations:
  - Pulls relevant discussions and code snippets from Stack Overflow threads and GitHub repositories.
  - Suggests additional learning materials, such as documentation or tutorials for relevant concepts.
- Real-time error suggestions and quick fixes for submitted code.
  - Analyzes user-submitted code for syntax and logic errors.
  - Provides suggestions or fixes with explanations.
- AI Chatbot for further assistance
  - Answer questions about the challenge, clarify hints, or provide additional support.

## Stretch Goals :hourglass_flowing_sand:

- Personalized problem-solving strategies based on user performance and history.
- Gamification: Achievement tracking and tips to improve speed and accuracy.
- Support for competitive programming platforms like Codeforces and CodeChef.
- Sample Solutions and Walkthroughs:
  - Offers a library of optimized code samples for standard problem types (e.g., DFS, dynamic programming) with step-by-step explanations.
  - Highlights potential pitfalls and alternative approaches to solving the problem.
- Personalized Tutorials:
  - Suggests curated tutorials and step-by-step guides tailored to the type of problem or algorithm being solved.
- Integrated Video Learning:
  - Embeds relevant YouTube videos or platform-specific video explanations directly within the coding challenge interface.
- Resource Hub:
  - A collection of tutorials, guides, and cheat sheets to deepen understanding of algorithms and data structures.

<br>

## Milestones :calendar:

<details>
  
**<summary>Week 1: Set Up :rocket:</summary>**

#### General:
- Discuss with the team who’s frontend/backend and the overall project/tech stack
- Set up communication, environments, and WhenToMeet(Link available in doc) 📆
- Go over GitHub basics
- Create a Figma account and start working on UI designs (For Everyone) 🎨
  - Start with Low Fidelity and then build up to High Fidelity
  - Create User Flowchart

#### Backend:
- Start looking into AWS and frameworks
- Look into API’s and playing around with Postman
  - Identify accessible data for our use and strategize on leveraging this data to our advantage.


<br>
</details>
  
<details>
  
**<summary>Week 2: Further Preparations :mag:</summary>**

#### General:
- Research Chrome Extension structure and manifest files

#### Frontend:
- Go over some UI design basics and do’s/don’ts
- Try to finish up the Figma Design and Flowchart by the end of this week
- Start planning UI components for Chrome Extension, including:
  - Popup UI (enabling/disabling features).
  - Overlay for coding hints and solutions.
  - Settings Page.
- If not done already, create app logo!!


#### Backend:
- Start setting up the User Authentication and the Database. Have a working prototype of the user auth by the end of the 2nd week
  - Database:
    - User preferences (e.g., preferred coding platform, hint frequency).
    - Saved challenges, solutions, and user code drafts for future reference.
- Keep doing research with the AWS Tech Stack
- Start looking into APIs for LeetCode and look into OpenAI

<br>
</details>

<details>
  
**<summary>Weeks 3/4: Coding :technologist:</summary>**
  
#### Frontend:
- Start working on the frontend components
  - Popup for toggling features and preferences.
  - Overlay UI for displaying hints and error suggestions.
- Login/Create Page
  - Have this done by end of 4th week
- Assist Page
  - Serve as the main dashboard for accessing personalized solutions, summaries, and preferences.
  - Show recently accessed problems with a "quick assist" button to revisit hints or solutions.
- Chatbot Page
  - Build an interactive interface for the AI Chatbot, allowing users to type questions or seek clarification.
  - Include predefined suggestion buttons (e.g., "Explain this error" or "Optimize this code").
- Settings Page (optional)
   
#### Backend:
- Start working on these features. Have a plan created for these features by the end of the 3rd week and start working on them starting on the 4th week.
- Fetching Problem and User Code:
  - Identify the current problem the user is viewing based on browser extension data.
    - Fetch the problem statement, inputs/outputs, and constraints.
  - Capture and store user-typed code (even if incomplete or unsubmitted) for analysis and later reference if the user opts in.
    - Begin implementing logic to analyze saved user code for common error patterns and improvement suggestions.
  - Include a feature to save multiple drafts of user code with timestamps for version tracking.
- Assist Page Logic:
  - Create an API to retrieve coding challenge metadata from platforms like LeetCode and HackerRank.
  - Fetch problem-specific discussions, solutions, and hints using integrations with Stack Overflow and GitHub APIs.
  - Implement filtering to prioritize high-quality and relevant results based on upvotes or credibility.
- If time permits look into Chatbot Integration and play around with the api in Postman

<br>
</details>

<details>

**<summary>Weeks 5/6: Middle Ground :construction:</summary>**
#### General:
- Start looking into prepping for the Presentation.
- Work on Presentation Script over the weeks.
- Each person will be assigned a section of the script that they need to complete by the end of Week 7.
- Start of Week 6 begin integrating backend with frontend components.

#### Frontend:
- Continue working on any remaining pages
- Finalize the Login/Create Page and Assist Page
  - Refine the Assist Page:
    - Displaying fetched problem details
    - Organized sections for hints
- New Features:
  - Implement real-time error suggestions as users type code:
    - Highlight syntax or logical issues inline. (optional)
    - OR
    - Have a separate page solutions to such issues.
  - Add a sidebar or modal for saving user code drafts with version timestamps.
  - Ensure all pages are responsive and accessible for users on different devices.
- Have new features planned out by end of week 6 and completed by end of week 7

#### Backend:
- Finish working on remaining backend features. Once completed start working on these new features: 
  - Hint and Explanation System:
    - Store pre-curated hints and explanations for common algorithms and problem-solving patterns in the database.
  - Chatbot Integration:
    - Build APIs to handle user queries and connect them with an AI-powered chatbot.
    - Ensure chatbot responses are contextual to the current coding challenge by using metadata from problem pages.
      - Optimize the responses to deliver problem-specific guidance.
  - Real-Time Error Analysis:
    - Analyze user-submitted or in-progress code for common errors and provide suggestions.
    - Use third-party tools or custom logic to identify and resolve syntax errors, runtime exceptions, or logical issues.
- Curate a plan and start working on these features. Have these done by end of week 6 or week 7.
- Once all is done start testing integration with real-world problem sets from LeetCode.

<br>
</details>

<details>

**<summary>Weeks 7/8: Finishing Touches :checkered_flag:</summary>**

#### General:
- Finish any remaining pages and implementations by the 7th week
- Finish connecting Frontend with Backend by the 8th week
- Start testing integration with real-world problem sets from LeetCode.
- If possible work on stretch goals
- Start looking into Presentation material and creating a script

<br>
</details>

<details>

**<summary>Weeks 9/10: Preparations :sparkles:</summary>** 

#### General:
- Prep for Presentation Night! :partying_face:
- Make sure the Slides and Demo are ready and good to go
<br>
</details>

<br>

## Tech Stack & Resources :computer:

#### React Chrome Extension
- <a href="https://www.luckymedia.dev/blog/how-to-create-a-chrome-extension-with-react-typescript-tailwindcss-and-vite-in-2024">How to Create a Chrome Extension with React, TypeScript, TailwindCSS, and Vite</a>
- <a href="https://web-highlights.com/blog/how-to-build-a-chrome-extension-using-react/">How To Build A Chrome Extension Using React</a>
- Youtube Playlist:
- <a href="https://www.youtube.com/watch?v=rAZXWkVhCgg&list=PLBS1L3Ug2VVods9GnWbJc__STt9VnrJ9Z">ReactJS Chrome Extension using ReactJS 18 & Webpack 5</a>
- Tailwind CSS:
  - <a href="https://tailwindcss.com/docs/installation">Documentation</a>
  - <a href="https://www.youtube.com/watch?v=bv_YdzsW3XY">Build a Chrome Extension in MINUTES With React and Tailwind CSS!</a>
- Vite:
  - <a href="https://vite.dev/guide/">Documentation</a>
  - <a href="https://www.youtube.com/watch?v=GGi7Brsf7js">Full Tutorial | Building a Chrome Extension in Typescript and Vite</a>
- <a href="https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts?utm_source=chatgpt.com">Content Scripts:</a>
  - It allows you to read details from the web page
  - <a href="https://dev.to/oluwatobi2001/a-beginners-guide-to-building-content-scripts-df?utm_source=chatgpt.com">Beginners guide to Building Content Scripts</a>

#### AWS Tech Stack
- Must Read!!
  - Provides architecture, walkthroughs and how to set an example 
  - <a href="https://aws.amazon.com/blogs/mobile/how-to-build-a-chrome-extension-that-integrates-with-amplify-resources/">How to build a Chrome extension that integrates with Amplify resources</a>

- Must Watch!!
  - <a href="https://www.youtube.com/watch?v=0n809nd4Zu4">Build a Chrome Extension - Course for Beginners</a>

- User Auth:
  - <a href="https://aws.amazon.com/cognito/">Cognito</a>
    - <a href="https://www.youtube.com/watch?v=QEGo6ZoN-ao&t=1472s">Amazon Cognito Beginner Guide</a>

- Database/Storage:
  - <a href="https://stackoverflow.com/questions/37880961/aws-dynamodb-over-aws-s3">AWS DynamoDB over AWS S3?</a>
  - <a href="https://aws.amazon.com/dynamodb/">DynamoDB</a>
    - <a href="https://www.youtube.com/watch?v=2k2GINpO308">AWS DynamoDB Tutorial For Beginners</a>
  - <a href="https://aws.amazon.com/s3/">S3</a>
    - <a href="https://www.youtube.com/watch?v=mDRoyPFJvlU">Amazon/AWS S3 (Simple Storage Service) Basics | S3 Tutorial, Creating a Bucket | AWS for Beginners</a>
    - <a href="https://www.youtube.com/watch?v=eQAIojcArRY">Storing Images in S3 from Node Server</a>
      - Goes over how to use AWS S3 with Node

- API:
  - <a href="https://aws.amazon.com/amplify/">Amplify</a>
    - <a href="https://www.youtube.com/watch?v=HdCmo0a3ngM">AWS Amplify (Gen 1) in Plain English | Getting Started Tutorial for Beginners</a>

  - <a href="https://rapidapi.com/bharathkalyans/api/leetcode-api">Leetcode API</a>
    - Good for gathering user data
   
  - OpenAI:
    - <a href="https://platform.openai.com/docs/api-reference/introduction">Documentation</a>
    - <a href="https://www.youtube.com/watch?v=GmEfKFI2Ki0">ChatGPT Chrome Extension with React and TailwindCSS</a>

  - Socket.IO (optional):
    - Good for real-time features like dynamic error suggestions.
    - <a href="https://socket.io/docs/v4/">Documentation</a>

  - StackExchange API:
    - Look into this to see if we can use this to get information from StackOverflow
    - <a href="https://api.stackexchange.com/docs'">Documentation</a>

  - Github API:
    - <a href="https://docs.github.com/en/rest?apiVersion=2022-11-28">GitHub REST API documentation</a>


- Servers: (Optional)
  - <a href="https://aws.amazon.com/ec2/">EC2</a>

<br>

## Alternatives 🔄

#### Flutter
- <a href="https://docs.flutter.dev/">Documentation</a>
- Installation:
  - <a href="https://www.youtube.com/watch?v=8saLa5fh0ZI">How to install flutter in windows 10</a>
- Beginners Guide:
  - <a href="https://www.youtube.com/watch?v=33kyEzDMTZU&list=PLdTodMosi-Bxf___3xPh3_NS-on4dc0sJ">How to build a Flutter Website</a>
- Basics:
  - <a href="https://www.youtube.com/watch?v=D4nhaszNW4o">Flutter Basics by a REAL Project</a>

#### MERN Stack
- This works really well with React Native and with MongoDB it can handle any form of data without any issue
- MERN Stack Playlist. It goes over how to create user authentication. Hence, I suggest looking at that portion
  - <a href="https://www.youtube.com/watch?v=P5QbE9aRCLQ&list=PLaAoUJDWH9WrPXMOkqHHsPHxbhvRDqryM">React Native & Node JS Authentication App</a>
- MongoDB Playlist:
  - <a href="https://www.youtube.com/watch?v=ExcRbA7fy_A&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA">Complete MongoDB Tutorial</a>

#### Alternatives to Amazon Kendra
- <a href="https://www.elastic.co/?utm_campaign=Google-B-Amer-US&utm_content=Brand-Core&utm_source=google&utm_medium=cpc&device=c&utm_term=elasticsearch&gad_source=1&gclid=Cj0KCQjw-uK0BhC0ARIsANQtgGO1pKPMVuSnAdgAh-VXuHT4qjSfQpXrN9Terx7H_twhS92yP3RiO34aAvX2EALw_wcB">Elasticsearch:</a>
  - Overview: Elasticsearch is a powerful open-source search engine that can index and search large volumes of data quickly.
- <a href="https://learn.microsoft.com/en-us/azure/search/search-what-is-azure-search">Azure Cognitive Search:</a>
  - Overview: A fully managed search service by Microsoft that provides AI-powered search capabilities.

#### Alternatives to Amazon Lex
- <a href="https://cloud.google.com/dialogflow">Dialogflow (by Google Cloud):</a>
  - Overview: Dialogflow is a natural language understanding platform that makes it easy to design and integrate conversational user interfaces. 
- <a href="https://dev.botframework.com/">Microsoft Bot Framework:</a>
  - Overview: A comprehensive framework for building conversational AI experiences, part of the Azure Bot Service.
 
#### Alternative to Apify/UTD Coursebook
- <a href="https://www.utdnebula.com/docs/api-docs/nebula-api">Nebula API:</a>
  - Overview: An API developed by UTD Nebula Labs that provides data regarding UTD class sections as sourced from Coursebook. 

<br>

## Roadblocks and Possible Solutions :construction: :bulb:

- Having everyone’s machine work with React.
  - If this is an issue then we can switch to Flutter and see if that works, otherwise confer with others to find a better solution that works for everyone.
- Either the Frontend or Backend team falling behind.
  - If this happens the best course would be to get some assistance from the other side until caught up
- Running into AWS Tech Stack Issues.
  - If for any reason we are having a hard time with utilizing AWS in the early stages of development then we immediately switch over to MERN as it is similar.
- Issues with Amazon Kendra or Lex
  - If we are having a hard time developing either of these two, or the cost becomes abnormally high then we switch to alternatives. If not enough available time then switch AI assistance with the next available stretch goal.

<br>

## Competition :vs:

- Blackboard, Canvas (No dedicated collaboration focus)
- Discord, Slack, GroupMe, Microsoft Teams (General communication tools)
- StudyBlue, Quizlet (Study tools without collaboration focus)
- Google Classroom (Limited collaboration features)

<br>

## Other Resources ➕
- <a href="https://code.visualstudio.com/">Visual Studio Code</a>
- <a href="https://nodejs.org/en/">Node.js</a>
- <a href="https://git-scm.com/downloads">GitHub</a> - <a href="https://docs.github.com/en/get-started/quickstart/hello-world">Docs</a> - <a href="https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners">Tutorial/a>
- <a href="https://react.dev/learn/start-a-new-react-project">React</a>

<br>

## Git Commands :notebook:

| Command                       | What it does                        |
| ----------------------------- | ----------------------------------- |
| git branch                    | lists all the branches              |
| git branch "branch name"      | makes a new branch                  |
| git checkout "branch name"    | switches to speicified branch       |
| git checkout -b "branch name" | combines the previous 2 commands    |
| git add .                     | finds all changed files             |
| git commit -m "Testing123"    | commit with a message               |
| git push origin "branch"      | push to branch                      |
| git pull origin "branch"      | pull updates from a specific branch |

<br>

## Cobra TEAM!! :partying_face: :fireworks:

- 
