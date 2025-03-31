import React, { useEffect, useState } from 'react';
import { Auth } from '../utils/auth';

interface DataStructure {
  [key: string]: string;
}

const dataStructures: DataStructure = {
  array: "Arrays are contiguous memory locations used to store multiple items of the same type.",
  linkedList: "Linked Lists consist of nodes where each node contains data and a reference to the next node.",
  tree: "Trees are hierarchical data structures with a root node and child nodes.",
  graph: "Graphs consist of vertices (nodes) and edges connecting these vertices.",
  hashTable: "Hash Tables use a hash function to map keys to indices, allowing for fast data retrieval.",
};

const algorithms: DataStructure = {
  bfs: "Breadth-First Search explores all neighbor nodes at the present depth before moving to nodes at the next depth level.",
  dfs: "Depth-First Search explores as far as possible along each branch before backtracking.",
  binarySearch: "Binary Search efficiently finds an item in a sorted list by repeatedly dividing the search interval in half.",
  dp: "Dynamic Programming solves complex problems by breaking them down into simpler subproblems.",
  twoPointers: "Two Pointers technique uses two pointers to solve array-based problems efficiently.",
};

const techniques: DataStructure = {
  slidingWindow: "Sliding Window technique is used to perform operations on a specific window size of an array or string.",
  backtracking: "Backtracking is an algorithmic technique that builds a solution incrementally, abandoning solutions that fail to satisfy constraints.",
  greedy: "Greedy algorithms make locally optimal choices at each step with the hope of finding a global optimum.",
  divideConquer: "Divide and Conquer breaks a problem into subproblems, solves them, and combines the results.",
  bitManipulation: "Bit Manipulation uses bitwise operations to perform operations at the bit level, often resulting in faster processing.",
};

const Popup: React.FC = () => {
  const [currentProblem, setCurrentProblem] = useState<string>('No problem detected');
  const [info, setInfo] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      try {
        const isAuth = await Auth.isAuthenticated();
        if (!isAuth) {
          window.location.href = 'signin.html';
          return;
        }
        getCurrentProblem();
      } catch (error) {
        console.error('Error during initialization:', error);
        window.location.href = 'signin.html';
      }
    };

    init();
  }, []);

  const getCurrentProblem = () => {
    try {
      chrome.storage.local.get(['currentPlatform', 'currentProblem'], (result) => {
        if (result.currentPlatform && result.currentProblem) {
          setCurrentProblem(`Current Problem: ${result.currentProblem} (${result.currentPlatform})`);
        }
      });
    } catch (error) {
      console.error('Error accessing storage:', error);
    }
  };

  const handleSelectChange = (data: DataStructure) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue && data[selectedValue]) {
      setInfo(data[selectedValue]);
      try {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'showHint',
              hint: data[selectedValue],
            }).catch(console.error);
          }
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }
    } else {
      setInfo('');
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      window.location.href = 'signin.html';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewToggle = () => {
    chrome.windows.getCurrent(async (window) => {
      if (chrome.sidePanel && window.id) {
        await chrome.sidePanel.open({ windowId: window.id });
        chrome.windows.remove(window.id);
      }
    });
  };

  return (
    <div className="container">
      <div className="header">
        <img src="images/cobralogo.png" alt="Cobra - Code smarter, not harder" className="logo" />
        <div className="header-actions">
          <button type="button" className="view-toggle" onClick={handleViewToggle} aria-label="Toggle view">
            <i className="fas fa-compress"></i>
          </button>
          <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
        </div>
      </div>

      <div className="info-container">{currentProblem}</div>

      <div className="dropdown-container">
        <label>Data Structure</label>
        <select onChange={handleSelectChange(dataStructures)}>
          <option value="">Select Data Structure</option>
          {Object.keys(dataStructures).map((key) => (
            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label>Algorithm</label>
        <select onChange={handleSelectChange(algorithms)}>
          <option value="">Select Algorithm</option>
          {Object.keys(algorithms).map((key) => (
            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="dropdown-container">
        <label>Technique</label>
        <select onChange={handleSelectChange(techniques)}>
          <option value="">Select Technique</option>
          {Object.keys(techniques).map((key) => (
            <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="info-container">{info}</div>
    </div>
  );
};

export default Popup; 