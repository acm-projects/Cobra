let latestCode = "";

chrome.runtime.onConnect.addListener(port => {
    if (port.name === "contentChannel") {
        console.log("content script connected.");
        port.onMessage.addListener((message) => {
            if (message.url) {
                chrome.storage.local.get({pages:{}}, (result) =>{
                    let pages = result.pages;
                    pages[message.url] = message.data;

                    chrome.storage.local.set({ pages }, () => {
                        console.log("Data saved for", message.url);
                    });
                });
            }
        });

        // Send data to popup when it connects
        port.onDisconnect.addListener(() => {
            console.log("Port disconnected, reconnecting...");
            connect; // Reconnect after 1 second
        });
    }
});
