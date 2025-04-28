import React from 'react';
import {ErrorCard} from './components/ErrorPage';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';

// Add custom CSS for code formatting
const injectCustomCSS = () => {
  const styleElement = document.createElement('style');
  styleElement.id = 'cobra-error-styles';
  styleElement.innerHTML = `
    .cobra-error-card {
      margin-bottom: 16px;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .cobra-error-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.05);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .cobra-error-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
    }
    
    .cobra-error-severity {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 4px;
      background: rgba(239, 68, 68, 0.2);
      color: #ef4444;
    }
    
    .cobra-error-content {
      padding: 16px;
      background: rgba(255, 255, 255, 0.02);
    }
    
    .cobra-error-message {
      margin-bottom: 12px;
      font-size: 14px;
      line-height: 1.5;
      color: #e2e8f0;
    }
    
    .cobra-code-block {
      margin: 12px 0;
      padding: 12px;
      border-radius: 6px;
      background: rgba(0, 0, 0, 0.3);
      border-left: 3px solid rgba(139, 92, 246, 0.5);
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      overflow-x: auto;
      white-space: pre;
      color: #e2e8f0;
    }
    
    .cobra-fix-label {
      font-size: 14px;
      font-weight: 600;
      margin: 16px 0 8px;
      color: #10b981;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .cobra-fix-label:before {
      content: '✓';
      font-size: 14px;
    }
    
    .cobra-solution-code {
      background: rgba(16, 185, 129, 0.05);
      border-left: 3px solid rgba(16, 185, 129, 0.5);
    }
  `;
  document.head.appendChild(styleElement);
};

// Define interface for error card props
interface EnhancedErrorCardProps {
  title: string;
  error: string;
  userCode?: string;
  solution: string;
  solutionCode?: string;
}

// Enhanced ErrorCard component
const EnhancedErrorCard: React.FC<EnhancedErrorCardProps> = ({ title, error, userCode, solution, solutionCode }) => {
  return (
    <div className="cobra-error-card">
      <div className="cobra-error-header">
        <div className="cobra-error-title">{title}</div>
        <div className="cobra-error-severity">High</div>
      </div>
      <div className="cobra-error-content">
        <div className="cobra-error-message">{error}</div>
        {userCode && (
          <pre className="cobra-code-block">{userCode}</pre>
        )}
        <div className="cobra-fix-label">{solution}</div>
        {solutionCode && (
          <pre className="cobra-code-block cobra-solution-code">{solutionCode}</pre>
        )}
      </div>
    </div>
  );
};

console.log("Attempting to log changes to code...")
const target = "#editor > div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text";
const config = { childList: true, subtree: true, characterData: true };

const documentObserver = new MutationObserver((mutations, obs) => {
    if(document.querySelector(target)){        
        const codeObserver = new MutationObserver((codeMutations, codeObs) => {
            //console.log("something changed");
            for (const mutation of codeMutations) {
                //console.log(mutation);
                //console.log(mutation.addedNodes[0].innerText);
            }
            let userCode = "";
            let n = 1;
            let lineObjects = [];
            for(const line of Array.from(document.querySelector(target)!.childNodes)){
                lineObjects.push(line as HTMLElement);
            }
            lineObjects = lineObjects.sort((a,b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
            console.log(lineObjects);
            for(const lineObj of lineObjects){
                userCode += `line ${n}: ` + lineObj.innerText + "\n";
                n++;
            }
            chrome.runtime.sendMessage({type: "sendDraft", data:  userCode});

        });
        codeObserver.observe(document.querySelector(target)!, config);
        obs.disconnect();
    } else {
        console.log("waiting for code frame to load in...");
    }
});

let showErrorWidget = true;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received from background script:", request);
    if(request.type === "toggleErrorWidget") {
        showErrorWidget = request.value; // Toggle the boolean value
        console.log("Toggled showErrorWidget to:", showErrorWidget);
    } else if (request.type === "showErrorWidget" && showErrorWidget) {
        console.log("showErrorWidget message received");
        console.log(request.errors.mistakes);
        const errors = request.errors.mistakes;
        // Find the specific target element where you want to inject the widget
        let targetElement = document.querySelector(target); 
        document.getElementById('errorWidget')?.remove(); // Remove any existing widget
        let currentIndex = 0;

        //let card = <ErrorCard title={errors[currentIndex].title} error={errors[currentIndex].mistakeDescription} userCode={errors[currentIndex].mistakeCode} solution="Suggested Fix:" solutionCode={errors[currentIndex].suggestedFix}/>;
        // Inject custom CSS if not already added
        if (!document.getElementById('cobra-error-styles')) {
          injectCustomCSS();
        }

        // Create the custom error card
        const errorCardContent = 
          <EnhancedErrorCard 
            title={errors[currentIndex].title} 
            error={errors[currentIndex].mistakeDescription} 
            userCode={errors[currentIndex].mistakeCode} 
            solution="Suggested Fix" 
            solutionCode={errors[currentIndex].suggestedFix} 
          />;

        if (targetElement) {
        // Create the widget element
        let widget = document.createElement('div');
        widget.id = 'errorWidget';
        widget.innerHTML = `
          <div class="error-widget-container">
            <div class="error-widget-header">
              <h3>Code Analysis</h3>
              <div class="error-widget-actions">
                <button id="nextErrorBtn">Next</button>
                <button id="closeBtn"><i class="fas fa-times"></i></button>
              </div>
            </div>
            <div id="errorCardContainer"></div>
          </div>
        `;
        
        // Position the widget relative to the target element
        let rect = targetElement.getBoundingClientRect();
        widget.style.position = 'absolute';
        widget.style.left = `${rect.left}px`;
        widget.style.top = `${rect.top+((18*(errors[0].lineNumber))+8)}px`;
        widget.style.zIndex = '9999';

        document.body.appendChild(widget);
        const errorCardContainer = document.getElementById('errorCardContainer');
        const root = createRoot(errorCardContainer!);
        root.render(errorCardContent);

        // Base widget styles
        Object.assign(widget.style, {
            position: 'absolute',
            backgroundColor: 'rgba(10, 11, 30, 0.95)',
            borderRadius: '12px',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
            color: '#e3e3e3',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '14px',
            zIndex: '9999',
            width: '320px',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
        });

        // Style the widget container
        const widgetContainer = widget.querySelector('.error-widget-container') as HTMLElement;
        Object.assign(widgetContainer.style, {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        });

        // Style the widget header
        const widgetHeader = widget.querySelector('.error-widget-header') as HTMLElement;
        Object.assign(widgetHeader.style, {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
        });

        // Style the header title
        const headerTitle = widgetHeader.querySelector('h3') as HTMLElement;
        Object.assign(headerTitle.style, {
            margin: '0',
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
        });

        // Style the actions container
        const actionsContainer = widget.querySelector('.error-widget-actions') as HTMLElement;
        Object.assign(actionsContainer.style, {
            display: 'flex',
            gap: '8px',
        });

        // Button styles
        const buttonStyle = {
            backgroundColor: 'rgba(139, 92, 246, 0.25)',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
        };

        // Style the buttons
        const nextErrorBtn = document.getElementById('nextErrorBtn') as HTMLElement;
        Object.assign(nextErrorBtn.style, buttonStyle);
        
        const closeBtn = document.getElementById('closeBtn') as HTMLElement;
        Object.assign(closeBtn.style, {
            ...buttonStyle,
            padding: '8px 10px',
            marginLeft: '6px',
        });

        // Add hover effect to buttons
        const addHoverEffect = (element: HTMLElement) => {
            element.addEventListener('mouseover', () => {
                element.style.backgroundColor = 'rgba(139, 92, 246, 0.4)';
                element.style.transform = 'translateY(-1px)';
            });
            element.addEventListener('mouseout', () => {
                element.style.backgroundColor = 'rgba(139, 92, 246, 0.25)';
                element.style.transform = 'translateY(0)';
            });
        };
        
        addHoverEffect(nextErrorBtn);
        addHoverEffect(closeBtn);

        // Style the error container
        const errorContainer = document.getElementById('errorCardContainer') as HTMLElement;
        Object.assign(errorContainer.style, {
            padding: '16px',
            backgroundColor: 'rgba(10, 11, 30, 0.4)',
            maxHeight: '400px',
            overflowY: 'auto',
        });

        // Add custom scrollbar to the error container
        const scrollbarStyle = document.createElement('style');
        scrollbarStyle.innerHTML = `
            #errorCardContainer::-webkit-scrollbar {
                width: 8px;
            }
            #errorCardContainer::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
            }
            #errorCardContainer::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            #errorCardContainer::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.2);
            }
        `;
        document.head.appendChild(scrollbarStyle);

        document.getElementById('nextErrorBtn')!.addEventListener('click', () => {
            console.log('Next error clicked');
            currentIndex++;
            if (currentIndex >= errors.length) {
                currentIndex = 0; // Reset to the first error
            }
            console.log(errors[currentIndex]);
            // Update the widget position and content based on the current error
            widget.style.left = `${rect.left}px`;
            widget.style.top = `${rect.top+(18*(errors[currentIndex].lineNumber))+8}px`;  // Adjust to position the widget above the target
            
            // Update with enhanced error card
            const updatedErrorCard = 
              <EnhancedErrorCard 
                title={errors[currentIndex].title} 
                error={errors[currentIndex].mistakeDescription} 
                userCode={errors[currentIndex].mistakeCode} 
                solution="Suggested Fix" 
                solutionCode={errors[currentIndex].suggestedFix} 
              />;
            
            root.render(updatedErrorCard);
        });
        document.getElementById('closeBtn')!.addEventListener('click', () => {
            console.log('Next error clicked');
            currentIndex=0;
            console.log("closing widget...");
            widget.style.left = `${rect.left}px`;
            widget.style.top = `${rect.top+(18*(errors[currentIndex].lineNumber))+8}px`;  // Adjust to position the widget above the target
            widget.remove();
        });
        // Append widget to the body
        }
    }
});

documentObserver.observe(document, {childList: true, subtree: true});