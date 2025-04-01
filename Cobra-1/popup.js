/*let problemTitle;
chrome.tabs.onUpdated.addListener(async(tabId, tab) => {
    if(tab.url && tab.url.includes("leetcode.com/problems/")){
        console.log("User is on a LeetCode problem.");
        const urlSecondHalf = tab.url.split("/problems/")[1];
        problemTitle = urlSecondHalf.split("/")[0].trim();
        console.log("Title: " + problemTitle);
    } else {
        console.log("URL does not belong to a LeetCode problem.");
        return;
    }   

    let questionId;
    try {
        console.log("Attempting to fetch problem description...");
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${problemTitle}`);
        if (!response.ok) throw new Error("Problem not found or API error.");

        const data = await response.json();
        document.getElementById("output").innerHTML = JSON.stringify(data.question);
        console.log("Found description.")
        questionId = data.questionId;
    } catch (error) {
        document.getElementById("output").textContent = `Error: ${error.message}`;
    }

    const response = await fetch("solutions.json");
    const data = await response.json();
    console.log(questionId);
    const thisProblemSolutions =  data[questionId-1].Solution;
    console.log(thisProblemSolutions);
    thisProblemSolutions.forEach(async(solutionArray)=> {
        try {
            languagePath = solutionArray[1];
            console.log("trying to fetch solution from github");
            const response = await fetch(`https://api.github.com/repos/kamyu104/LeetCode-Solutions/contents/${languagePath}`);
            if (!response.ok) throw new Error("Problem not found or API error");
    
            const data = await response.json();
            const encodedAnswer = data.content.replace(/^"|"$/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/\n/g, "");

            document.getElementById("output").innerHTML += languagePath.split("\\")[0];
            document.getElementById("output").innerHTML += atob(encodedAnswer);
        } catch (error) {
            document.getElementById("output").textContent = `Error: ${error.message}`;
        }
    });
    
})*/