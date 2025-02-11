

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

#### React
- <a href="https://legacy.reactjs.org/tutorial/tutorial.html#setup-for-the-tutorial">Setup</a>
- <a href="https://reactnative.dev/docs/environment-setup">Setting up the Environment</a>
- <a href="https://www.youtube.com/watch?v=mrjy92pW0kM">React Native #1: Setup Visual Studio Code</a>
- Drag & Drop Documents:
  - <a href="https://www.youtube.com/watch?v=8uChP5ivQ1Q">Upload Files in React - Typescript, Drag and Drop, & Form Examples</a>
- Do’s and Don'ts
  - <a href="https://www.youtube.com/watch?v=b0IZo2Aho9Y">10 React Antipatterns to Avoid - Code This, Not That!</a>

#### Node
- <a href="https://nodejs.org/en/download/prebuilt-installer">Node Download</a>
- <a href="https://www.codecademy.com/article/what-is-node">What is Node?</a>
  - This is optional but I recommend taking a look at this.

#### AWS Tech Stack
- Great Video to watch!!
  - <a href="https://www.youtube.com/watch?v=7m_q1ldzw0U">AWS Project: Architect and Build an End-to-End AWS Web Application from Scratch, Step by Step</a>

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
    - <a href="https://www.youtube.com/watch?v=kqi4gPfdVHY">Working with Data in DynamoDB from React with AWS Amplify</a>
      - This video will go over how to use DynamoDB with AWS Amplify and React.
      - 
  - <a href="https://aws.amazon.com/kendra/">Amazon Kendra</a>
    - Amazon Kendra is an advance search service that will retrieve any information based on a basic search query. This is good for if we treat our documents and chats as a knowledge base and have Kendra retrieve relevant information based off the student’s questions
    - <a href="https://www.youtube.com/watch?v=NJoEyIZ_Tas">Build an intelligent search application in a few clicks with Amazon Kendra</a>
    - <a href="https://www.youtube.com/watch?v=QqLE_8mJCR8">AWS Kendra - Enterprise Search Service | Create Index, Custom Datasource & Search Experience</a>
    
  - <a href="https://aws.amazon.com/lex/">Amazon Lex</a>
    - Amazon Lex is a conversational AI that, given any information and question, will be able to reply in a human-like manner. This is great if we combine this with Kendra to gather the important information first and then have Lex reply to the student in a conversational manner.
    - <a href="https://www.youtube.com/watch?v=RB8yw2nzA2Q&list=PLAMHV77MSKJ7s4jE7F_k_Od8qZlFGf1BY">Conversational AI and Chatbot (Amazon Lex Tutorial)</a>
    - <a href="https://www.youtube.com/watch?v=iDCWxfI2EQo">Amazon Lex: 8 Things You HAVE To Know 🔥 | AWS</a>
    
  - <a href="https://aws.amazon.com/blogs/machine-learning/integrate-amazon-kendra-and-amazon-lex-using-a-search-intent/">Integrating Kendra and Lex</a>

  - <a href="https://apify.com/?utm_term=apify&utm_campaign=US-EN+%7C+SEA+%7C+Brand&utm_source=adwords&utm_medium=ppc&hsa_acc=9303439903&hsa_cam=12208847443&hsa_grp=115467448485&hsa_ad=495840157411&hsa_src=g&hsa_tgt=kwd-401768082175&hsa_kw=apify&hsa_mt=e&hsa_net=adwords&hsa_ver=3&gad_source=1&gclid=CjwKCAjw2Je1BhAgEiwAp3KY76gLLgb-wTrbohek0h_HAgHMQDZ2w3sbsr5vu651dnyeRYdAiRGe0hoCI8MQAvD_BwE">Apify</a>
    - A powerful automation platform that offers ready-made scraping tools for websites like Facebook, Amazon, and Twitter, and supports JS rendering, CAPTCHA solving, and IP rotation. Use this to web scrape UTD Coursebook.
    - <a href="https://www.youtube.com/watch?v=3rrpfW0bEdc">Apify Tutorial For Beginners | How To Use Apify</a>
    - <a href="https://www.youtube.com/watch?v=K76Hib0cY0k">How to use Web Scraper from Apify to scrape any website</a>

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
