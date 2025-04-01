chrome.runtime.sendMessage({status: "DOM loaded"});
let user = "username: nothing"

chrome.runtime.onMessage.addListener(   
    function(request, sender, sendResponse) {
        if(request.action === "getUsername"){
            console.log("recieved message");
            try {
                returnUserName().then((result) => sendResponse(result));
                console.log("sent response. closing tab...");
            } catch (error) {
                console.error("Error fetching username:", error);
                sendResponse({error: "Failed to retrieve username"});
            }
        }
        return true;
    });
    
async function returnUserName(){
    console.log("grabbing username");
    user = "username: async function running";
    const profileButtonPath = "#headlessui-menu-button-5";
    return new Promise((resolve, reject) => {
        const profilePopupWatcher = new MutationObserver((mutations, obs) => {
            console.log("something changed");
            if(document.querySelector(profileButtonPath)){
                console.log("profile button loaded in")
                profileButton = document.querySelector("#headlessui-menu-button-5");
                profileButton.click();
                const username = document.querySelector("#web-user-menu > div > div > div.z-base-1.relative.flex.h-full.w-full.flex-col.items-end.p-4 > div > div.flex.shrink-0.items-center.px-4.pb-4.pt-1.md\\:px-\\[1px\\] > div > a").innerText;
                console.log("username: " + username);
                obs.disconnect();
                resolve(username);
            }
        });
        profilePopupWatcher.observe(document, {childList: true, subtree: true});
    });
}