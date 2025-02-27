//navigation and section handling
document.addEventListener('DOMContentLoaded', async () => {
    //check authentication first
    await Auth.checkAuth();
  
    //theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const themeIcon = themeToggle?.querySelector('i');
  
    if (themeToggle && themeIcon) {
      //check for saved theme preference
      const savedTheme = localStorage.getItem('theme') || 'dark';
      html.setAttribute('data-theme', savedTheme);
      updateThemeIcon(savedTheme);
  
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }
  
    function updateThemeIcon(theme) {
      if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
      }
    }
  
    //set up sign out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
      signOutBtn.addEventListener('click', async () => {
        try {
          await Auth.signOut();
          window.location.href = 'signin.html';
        } catch (error) {
          console.error('Error signing out:', error);
        }
      });
    }
  
    //navigation handling
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelector('.nav-item.active').classList.remove('active');
        item.classList.add('active');
        
        const sectionId = item.dataset.section;
        document.querySelector('.section.active').classList.remove('active');
        document.getElementById(sectionId).classList.add('active');
      });
    });
  
    //learning Path functionality
    const dataStructuresSelect = document.getElementById('dataStructures');
    const algorithmsSelect = document.getElementById('algorithms');
    const dsDescription = document.getElementById('ds-description');
    const algoDescription = document.getElementById('algo-description');
  
    const descriptions = {
      dataStructures: {
        array: "Arrays offer constant-time access and are great for sequential data storage.",
        linkedList: "Linked Lists excel at insertions and deletions with dynamic size management.",
        tree: "Trees are perfect for hierarchical data and efficient searching.",
        graph: "Graphs represent complex relationships and networks between elements.",
        hashTable: "Hash Tables provide fast data retrieval using key-value pairs."
      },
      algorithms: {
        bfs: "BFS explores level by level, ideal for finding shortest paths.",
        dfs: "DFS explores as deep as possible first, great for maze-solving.",
        binarySearch: "Binary Search efficiently finds elements in sorted arrays.",
        dp: "Dynamic Programming optimizes solutions by storing subproblem results.",
        twoPointers: "Two Pointers technique efficiently processes arrays and strings."
      }
    };
  
    dataStructuresSelect?.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (dsDescription) {
        dsDescription.textContent = selected ? descriptions.dataStructures[selected] : '';
        dsDescription.style.display = selected ? 'block' : 'none';
      }
    });
  
    algorithmsSelect?.addEventListener('change', (e) => {
      const selected = e.target.value;
      if (algoDescription) {
        algoDescription.textContent = selected ? descriptions.algorithms[selected] : '';
        algoDescription.style.display = selected ? 'block' : 'none';
      }
    });
  }); 