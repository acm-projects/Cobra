document.getElementById("button").addEventListener("click", function() {
        chrome.tabs.create({ url: "https://leetcode.com/accounts/login/" });
  });

async function printUsername(){
      let username = await chrome.runtime.sendMessage({action: "requestUsername"});
      document.getElementById("output").innerText = username;
}

printUsername();