document.addEventListener("DOMContentLoaded", async () => {
    const outputElement = document.getElementById("output");

    function extractImportantTestValues(example) {
        return example
            .replace(/[^a-zA-Z0-9 ]/g, "") 
            .split(" ")
            .filter(word => word.length > 2) 
            .slice(0, 10) 
            .join(" ");
    }

    
    async function fetchLeetCodeData(problemSlug) {
        const cacheKey = `leetcode_${problemSlug}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            console.log("🔄 Using cached data for:", problemSlug);
            return JSON.parse(cachedData); 
        }

        const leetcodeApiUrl = `https://alfa-leetcode-api.onrender.com/select?titleSlug=${problemSlug}`;
        console.log("🌍 Fetching from LeetCode API:", leetcodeApiUrl);

        try {
            const response = await fetch(leetcodeApiUrl);

            if (response.status === 429) {
                throw new Error("LeetCode API Rate Limit Exceeded (Error 429). Try again later.");
            }

            if (!response.ok) {
                throw new Error(`LeetCode API Error: ${response.status}`);
            }

            const data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify(data)); 
            console.log("Cached API response for:", problemSlug);
            return data;
        } catch (error) {
            console.error("Fetch Error:", error);
            throw error;
        }
    }

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes("leetcode.com/problems/")) {
            outputElement.textContent = "Not on a LeetCode problem page.";
            return;
        }

        const urlParts = tab.url.split("/problems/");
        if (urlParts.length < 2) {
            outputElement.textContent = "Unable to extract problem title.";
            return;
        }

        const problemSlug = urlParts[1].split("/")[0].trim();
        console.log("Extracted Problem Slug:", problemSlug);

        const leetcodeData = await fetchLeetCodeData(problemSlug);
        if (!leetcodeData || !leetcodeData.questionTitle) throw new Error("No valid data from LeetCode API");

        let problemTitle = leetcodeData.questionTitle;

        let problemTags = Array.isArray(leetcodeData.topicTags) ? leetcodeData.topicTags : [];
        let tagNames = problemTags.map(tag => tag.name).filter(Boolean); 

        let exampleTestCases = extractImportantTestValues(leetcodeData.exampleTestcases);

        // console.log(exampleTestcases);

        console.log("Problem Title:", problemTitle);
        console.log("Problem Tags:", tagNames);
        console.log("Example Test Cases Query:", exampleTestCases);

        let discussions = [];

        if (tagNames.length > 0) {
            const filteredTags = tagNames.map(tag => tag.split(" ").join("-")).join(";");
            let stackOverflowTagsUrl = `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&tagged=${encodeURIComponent(filteredTags)}&site=stackoverflow`;
            
            console.log("Stack Overflow API URL (Tags):", stackOverflowTagsUrl);
            
            let tagResponse = await fetch(stackOverflowTagsUrl);
            let tagData = await tagResponse.json();
            console.log("Stack Overflow API Response (Tags):", tagData);

            if (tagData.items && tagData.items.length > 0) {
                discussions.push(
                    ...tagData.items.slice(0, 3).map((item) =>
                        `<a href="${item.link}" target="_blank">${item.title}</a> (${item.score} votes)`
                    )
                );
            }
        }

        if (exampleTestCases) {
            let stackOverflowExamplesUrl = `https://api.stackexchange.com/2.3/search?order=desc&sort=relevance&q=${encodeURIComponent(exampleTestCases)}&site=stackoverflow`;
            
            console.log("🔍 Stack Overflow API URL (Examples):", stackOverflowExamplesUrl);
            
            let exampleResponse = await fetch(stackOverflowExamplesUrl);
            let exampleData = await exampleResponse.json();
            console.log("Stack Overflow API Response (Examples):", exampleData);

            if (exampleData.items && exampleData.items.length > 0) {
                discussions.push(
                    ...exampleData.items.slice(0, 2).map((item) =>
                        `<a href="${item.link}" target="_blank">${item.title}</a> (${item.score} votes)`
                    )
                );
            }
        }

        if (discussions.length === 0) {
            outputElement.textContent = "No relevant Stack Overflow discussions found.";
            return;
        }

        outputElement.innerHTML = `
            <h3>LeetCode Problem</h3>
            <strong>${problemTitle}</strong> <br>
            Tags: ${tagNames.join(", ")} <br><br>
            <h3>Top Related Discussions</h3>
            ${discussions.join("<br><br>")}
        `;
    } catch (error) {
        console.error("Fetch Error:", error);
        outputElement.textContent = `Error: ${error.message}`;
    }
});