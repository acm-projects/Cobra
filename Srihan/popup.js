const dataStructures = {
    array: "Arrays are contiguous memory locations used to store multiple items of the same type.",
    linkedList: "Linked Lists consist of nodes where each node contains data and a reference to the next node.",
    tree: "Trees are hierarchical data structures with a root node and child nodes.",
    graph: "Graphs consist of vertices (nodes) and edges connecting these vertices.",
    hashTable: "Hash Tables use a hash function to map keys to indices, allowing for fast data retrieval.",
  }
  
  const algorithms = {
    bfs: "Breadth-First Search explores all neighbor nodes at the present depth before moving to nodes at the next depth level.",
    dfs: "Depth-First Search explores as far as possible along each branch before backtracking.",
    binarySearch:
      "Binary Search efficiently finds an item in a sorted list by repeatedly dividing the search interval in half.",
    dp: "Dynamic Programming solves complex problems by breaking them down into simpler subproblems.",
    twoPointers: "Two Pointers technique uses two pointers to solve array-based problems efficiently.",
  }
  
  const techniques = {
    slidingWindow:
      "Sliding Window technique is used to perform operations on a specific window size of an array or string.",
    backtracking:
      "Backtracking is an algorithmic technique that builds a solution incrementally, abandoning solutions that fail to satisfy constraints.",
    greedy: "Greedy algorithms make locally optimal choices at each step with the hope of finding a global optimum.",
    divideConquer: "Divide and Conquer breaks a problem into subproblems, solves them, and combines the results.",
    bitManipulation:
      "Bit Manipulation uses bitwise operations to perform operations at the bit level, often resulting in faster processing.",
  }
  
  function updateInfo(selectId, data) {
    const select = document.getElementById(selectId)
    const info = document.getElementById("info")
    if (!select || !info) return
  
    select.addEventListener("change", (event) => {
      const selectedValue = event.target.value
      if (selectedValue && data[selectedValue]) {
        info.textContent = data[selectedValue]
        try {
          chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, {
                type: 'showHint',
                hint: data[selectedValue]
              }).catch(console.error)
            }
          })
        } catch (error) {
          console.error('Error sending message:', error)
        }
      } else {
        info.textContent = ""
      }
    })
  }
  
  function getCurrentProblem() {
    try {
      chrome.storage.local.get(['currentPlatform', 'currentProblem'], (result) => {
        const problemElement = document.getElementById('current-problem')
        if (!problemElement) return
  
        if (result.currentPlatform && result.currentProblem) {
          problemElement.textContent = `Current Problem: ${result.currentProblem} (${result.currentPlatform})`
        } else {
          problemElement.textContent = 'No problem detected'
        }
      })
    } catch (error) {
      console.error('Error accessing storage:', error)
    }
  }
  
  function setupSignOut() {
    const signOutBtn = document.getElementById('signOutBtn')
    if (!signOutBtn) return
  
    signOutBtn.addEventListener('click', async () => {
      try {
        await Auth.signOut()
        window.location.href = 'signin.html'
      } catch (error) {
        console.error('Error signing out:', error)
      }
    })
  }
  
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const isAuth = await Auth.isAuthenticated()
      if (!isAuth) {
        window.location.href = 'signin.html'
        return
      }
  
      updateInfo("dataStructures", dataStructures)
      updateInfo("algorithms", algorithms)
      updateInfo("techniques", techniques)
      getCurrentProblem()
      setupSignOut()
    } catch (error) {
      console.error('Error during initialization:', error)
      window.location.href = 'signin.html'
    }
  })
  
  