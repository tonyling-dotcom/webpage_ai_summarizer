console.log('aipage content script loaded!');

// Create the button
const createAipageButton = () => {
    const button = document.createElement('button');
    button.id = 'aipage-extract-button';
    button.textContent = '📄 Extract Text';
    button.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 999999;
    padding: 10px 16px;
    background: #4F46E5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

    button.addEventListener('mouseenter', () => {
        button.style.background = '#4338CA';
        button.style.transform = 'translateY(-1px)';
        button.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.background = '#4F46E5';
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    });

    button.addEventListener('click', extractAndShowPopup);

    document.body.appendChild(button);
};

// Extract all text from the page and show popup
const extractAndShowPopup = () => {
    // Get all visible text from the page
    const pageText = document.body.innerText;

    // Get page title
    const pageTitle = document.title;

    // Get page URL
    const pageUrl = window.location.href;

    // Store the extracted data
    chrome.storage.local.get(['extractCount'], (result) => {
        const currentCount = result.extractCount || 0;
        const newCount = currentCount + 1;

        chrome.storage.local.set({
            extractedText: pageText,
            pageTitle: pageTitle,
            pageUrl: pageUrl,
            extractCount: newCount,
            lastExtractTime: new Date().toISOString()
        }, () => {
            console.log('Text extracted and saved to storage');

            // Show the popup with extracted text
            showTextPopup(pageText, pageTitle, pageUrl, newCount);
        });
    });
};

// Show API key input dialog
const showApiKeyDialog = (onSave) => {
    // Create overlay
    const dialogOverlay = document.createElement('div');
    dialogOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 99999999;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.2s ease-in;
  `;

    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
    background: white;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

    dialog.innerHTML = `
    <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #374151;">🔑 OpenAI API Key Required</h2>
    <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280; line-height: 1.5;">
      To generate AI summaries, please enter your OpenAI API key. You can get one from 
      <a href="https://platform.openai.com/api-keys" target="_blank" style="color: #4F46E5;">platform.openai.com</a>
    </p>
    <input 
      type="password" 
      id="aipage-api-key-input" 
      placeholder="sk-..."
      style="
        width: 100%;
        padding: 12px;
        border: 2px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        font-family: monospace;
        margin-bottom: 16px;
        box-sizing: border-box;
      "
    />
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="aipage-cancel-btn" style="
        padding: 10px 20px;
        background: #e5e7eb;
        color: #374151;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Cancel</button>
      <button id="aipage-save-key-btn" style="
        padding: 10px 20px;
        background: #4F46E5;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      ">Save & Generate</button>
    </div>
  `;

    dialogOverlay.appendChild(dialog);
    document.body.appendChild(dialogOverlay);

    const input = dialog.querySelector('#aipage-api-key-input');
    const saveBtn = dialog.querySelector('#aipage-save-key-btn');
    const cancelBtn = dialog.querySelector('#aipage-cancel-btn');

    // Focus input
    setTimeout(() => input.focus(), 100);

    // Handle save
    const handleSave = () => {
        const apiKey = input.value.trim();
        if (!apiKey) {
            input.style.borderColor = '#ef4444';
            input.placeholder = 'Please enter your API key';
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            input.style.borderColor = '#ef4444';
            alert('⚠️ API key should start with "sk-"');
            return;
        }

        // Save to storage
        chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
            dialogOverlay.remove();
            onSave(apiKey);
        });
    };

    // Handle cancel
    const handleCancel = () => {
        dialogOverlay.remove();
    };

    saveBtn.addEventListener('click', handleSave);
    cancelBtn.addEventListener('click', handleCancel);

    // Enter key to save
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    });

    // Escape to cancel
    dialogOverlay.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            handleCancel();
        }
    });

    // Click outside to cancel
    dialogOverlay.addEventListener('click', (e) => {
        if (e.target === dialogOverlay) {
            handleCancel();
        }
    });
};

// Generate AI Summary using OpenAI API
const generateAISummary = async (text, contentArea, summaryBtn) => {
    // Get API key from storage
    chrome.storage.local.get(['openaiApiKey'], async (result) => {
        let apiKey = result.openaiApiKey;

        if (!apiKey) {
            // Show dialog to enter API key
            showApiKeyDialog((newApiKey) => {
                apiKey = newApiKey;
                // Proceed with generation
                proceedWithSummary(text, contentArea, summaryBtn, apiKey);
            });
            return;
        }

        // Proceed with generation
        proceedWithSummary(text, contentArea, summaryBtn, apiKey);
    });
};

// Proceed with summary generation
const proceedWithSummary = async (text, contentArea, summaryBtn, apiKey) => {
    // Update button to show loading state
    const originalText = summaryBtn.textContent;
    summaryBtn.textContent = '⏳ Generating...';
    summaryBtn.disabled = true;
    summaryBtn.style.opacity = '0.7';
    summaryBtn.style.cursor = 'not-allowed';

    try {
        // Truncate text if too long (to avoid token limits)
        const maxChars = 12000;
        const truncatedText = text.length > maxChars ? text.substring(0, maxChars) + '...' : text;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant that creates concise, well-structured summaries of web page content. Provide clear, informative summaries with key points.'
                    },
                    {
                        role: 'user',
                        content: `Please provide a concise summary of the following web page content:\n\n${truncatedText}`
                    }
                ],
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate summary');
        }

        const data = await response.json();
        const summary = data.choices[0].message.content;

        // Create summary section
        const summarySection = document.createElement('div');
        summarySection.style.cssText = `
      margin-top: 20px;
      padding: 20px;
      background: #f0f9ff;
      border-left: 4px solid #7c3aed;
      border-radius: 8px;
    `;

        const summaryTitle = document.createElement('h3');
        summaryTitle.textContent = '✨ AI Summary';
        summaryTitle.style.cssText = `
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: #7c3aed;
    `;

        const summaryContent = document.createElement('div');
        summaryContent.textContent = summary;
        summaryContent.style.cssText = `
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
      white-space: pre-wrap;
    `;

        summarySection.appendChild(summaryTitle);
        summarySection.appendChild(summaryContent);

        // Remove existing summary if any
        const existingSummary = contentArea.querySelector('.ai-summary-section');
        if (existingSummary) {
            existingSummary.remove();
        }

        summarySection.className = 'ai-summary-section';
        contentArea.insertBefore(summarySection, contentArea.firstChild);

        // Update popup title
        const popupTitle = document.querySelector('#aipage-popup-overlay h2');
        if (popupTitle) {
            popupTitle.textContent = '✨ Summarized Content';
            popupTitle.style.color = '#7c3aed';
        }

        // Update button to show success
        summaryBtn.textContent = '✓ Summary Generated!';
        summaryBtn.style.background = '#10B981';
        setTimeout(() => {
            summaryBtn.textContent = originalText;
            summaryBtn.style.background = '#7c3aed';
            summaryBtn.disabled = false;
            summaryBtn.style.opacity = '1';
            summaryBtn.style.cursor = 'pointer';
        }, 3000);

    } catch (error) {
        console.error('Error generating summary:', error);
        alert(`❌ Error generating summary: ${error.message}`);

        // Reset button
        summaryBtn.textContent = originalText;
        summaryBtn.disabled = false;
        summaryBtn.style.opacity = '1';
        summaryBtn.style.cursor = 'pointer';
    }
};

// Create and show the popup overlay
const showTextPopup = (text, title, url, count) => {
    // Remove existing popup if any
    const existingPopup = document.getElementById('aipage-popup-overlay');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'aipage-popup-overlay';
    overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999998;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.2s ease-in;
  `;

    // Create popup container
    const popup = document.createElement('div');
    popup.style.cssText = `
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease-out;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
    padding: 20px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px 12px 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

    const headerTitle = document.createElement('div');
    headerTitle.innerHTML = `
    <h2 style="margin: 0; font-size: 20px; font-weight: 600;">📄 Extracted Text</h2>
    <div style="font-size: 12px; opacity: 0.9; margin-top: 4px;">Extractions: ${count}</div>
  `;

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  `;
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    closeBtn.addEventListener('click', () => overlay.remove());

    header.appendChild(headerTitle);
    header.appendChild(closeBtn);

    // Create page info
    const pageInfo = document.createElement('div');
    pageInfo.style.cssText = `
    padding: 16px 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-size: 13px;
    color: #374151;
  `;
    pageInfo.innerHTML = `
    <div style="margin-bottom: 4px;"><strong>Page:</strong> ${title}</div>
    <div style="word-break: break-all; color: #6b7280;"><strong>URL:</strong> ${url}</div>
  `;

    // Create text content area
    const contentArea = document.createElement('div');
    contentArea.style.cssText = `
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    line-height: 1.6;
    font-size: 14px;
    color: #374151;
    white-space: pre-wrap;
    word-wrap: break-word;
  `;
    contentArea.textContent = text;

    // Custom scrollbar styles
    contentArea.style.scrollbarWidth = 'thin';
    contentArea.style.scrollbarColor = '#cbd5e1 #f1f5f9';

    // Create footer with copy button
    const footer = document.createElement('div');
    footer.style.cssText = `
    padding: 16px 24px;
    border-top: 2px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  `;

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋 Copy Text';
    copyBtn.style.cssText = `
    padding: 10px 20px;
    background: #4F46E5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  `;
    copyBtn.addEventListener('mouseenter', () => {
        copyBtn.style.background = '#4338CA';
        copyBtn.style.transform = 'translateY(-1px)';
    });
    copyBtn.addEventListener('mouseleave', () => {
        copyBtn.style.background = '#4F46E5';
        copyBtn.style.transform = 'translateY(0)';
    });
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.textContent = '✓ Copied!';
            copyBtn.style.background = '#10B981';
            setTimeout(() => {
                copyBtn.textContent = '📋 Copy Text';
                copyBtn.style.background = '#4F46E5';
            }, 2000);
        });
    });

    // Create AI Summary button
    const summaryBtn = document.createElement('button');
    summaryBtn.textContent = '✨ Generate AI Summary';
    summaryBtn.style.cssText = `
    padding: 10px 20px;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  `;
    summaryBtn.addEventListener('mouseenter', () => {
        summaryBtn.style.background = '#6d28d9';
        summaryBtn.style.transform = 'translateY(-1px)';
    });
    summaryBtn.addEventListener('mouseleave', () => {
        summaryBtn.style.background = '#7c3aed';
        summaryBtn.style.transform = 'translateY(0)';
    });
    summaryBtn.addEventListener('click', () => {
        generateAISummary(text, contentArea, summaryBtn);
    });

    footer.appendChild(summaryBtn);
    footer.appendChild(copyBtn);

    // Assemble popup
    popup.appendChild(header);
    popup.appendChild(pageInfo);
    popup.appendChild(contentArea);
    popup.appendChild(footer);
    overlay.appendChild(popup);

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideIn {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
    document.head.appendChild(style);

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Close on Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            overlay.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    document.body.appendChild(overlay);
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAipageButton);
} else {
    createAipageButton();
}
