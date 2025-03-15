/*document.getElementById("fetchData").addEventListener("click", async () => {
    const problemTitle = document.getElementById("titleInput").value.trim();
    if (!problemTitle) {
        alert("Please enter a problem");
        return;
    }

    try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${problemTitle}`);
        if (!response.ok) throw new Error("Problem not found or API error");

        const data = await response.json();
        document.getElementById("output").innerHTML = JSON.stringify(data.question);
    } catch (error) {
        document.getElementById("output").textContent = `Error: ${error.message}`;
    }
});*/

let problemTitle;
chrome.tabs.onUpdated.addListener(async(tabId, tab) => {
    if(tab.url && tab.url.includes("leetcode.com/problems/")){
        console.log("you're on leetcode");
        console.log("BROOOO");
        const urlSecondHalf = tab.url.split("/problems/")[1];
        problemTitle = urlSecondHalf.split("/")[0].trim();
        console.log(urlSecondHalf);
        console.log(problemTitle);
    } else {
        console.log("something went wrong");
        return;
    }   


    try {
        console.log("trying fetch");
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/select?titleSlug=${problemTitle}`);
        if (!response.ok) throw new Error("Problem not found or API error");

        const data = await response.json();
        document.getElementById("output").innerHTML = JSON.stringify(data.question);
    } catch (error) {
        document.getElementById("output").textContent = `Error: ${error.message}`;
    }

    try {
        console.log("trying to fetch solution from github");
        const response = await fetch(`https://api.github.com/repos/kamyu104/LeetCode-Solutions/contents/Python/${problemTitle}.py`);
        if (!response.ok) throw new Error("Problem not found or API error");

        const data = await response.json();
        const encodedAnswer = data.content.replace(/^"|"$/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/\n/g, "");
        document.getElementById("output").innerHTML += atob(encodedAnswer);
    } catch (error) {
        document.getElementById("output").textContent = `Error: ${error.message}`;
    }
})