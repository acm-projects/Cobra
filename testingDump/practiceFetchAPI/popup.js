document.getElementById("fetchData").addEventListener("click", async () =>{
    const username = document.getElementById("username").value.trim();
    if(!username){
        alert("please enter a username");
        return;
    }

    console.log(username);
    try {
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
        if(!response.ok) throw new Error("User not found or API error");

        const data = await response.json();
        document.getElementById("output").textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        document.getElementById("output").textContent = `Error: ${error.message}`;
    }
});
