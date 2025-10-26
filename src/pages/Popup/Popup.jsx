import React, { useState, useEffect } from 'react';
import './Popup.css';

const Popup = () => {
  const [extractedText, setExtractedText] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageUrl, setPageUrl] = useState('');
  const [extractCount, setExtractCount] = useState(0);
  const [lastExtractTime, setLastExtractTime] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    // Load data from chrome storage
    chrome.storage.local.get(
      ['extractedText', 'pageTitle', 'pageUrl', 'extractCount', 'lastExtractTime', 'openaiApiKey'],
      (result) => {
        setExtractedText(result.extractedText || 'No text extracted yet. Click the "Extract Text" button on any webpage to get started!');
        setPageTitle(result.pageTitle || 'N/A');
        setPageUrl(result.pageUrl || 'N/A');
        setExtractCount(result.extractCount || 0);
        setLastExtractTime(result.lastExtractTime || '');
        setApiKey(result.openaiApiKey || '');
      }
    );
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(extractedText);
    alert('Text copied to clipboard!');
  };

  const saveApiKey = () => {
    if (!apiKey.trim()) {
      setSaveMessage('Please enter an API key');
      return;
    }

    chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
      setSaveMessage('✓ API Key saved successfully!');
      setTimeout(() => {
        setSaveMessage('');
        setShowSettings(false);
      }, 2000);
    });
  };

  const clearApiKey = () => {
    setApiKey('');
    chrome.storage.local.remove('openaiApiKey', () => {
      setSaveMessage('✓ API Key cleared!');
      setTimeout(() => setSaveMessage(''), 2000);
    });
  };

  return (
    <div className="aipage-popup">
      <div className="popup-header">
        <h1>📄 aipage</h1>
        <div className="header-actions">
          <span className="stat-badge">Extractions: {extractCount}</span>
          <button
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="settings-panel">
          <h3>OpenAI API Settings</h3>
          <p className="settings-description">
            Enter your OpenAI API key to enable AI-powered summaries
          </p>
          <div className="api-key-input-group">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="api-key-input"
            />
            <button onClick={saveApiKey} className="save-btn">
              Save
            </button>
            {apiKey && (
              <button onClick={clearApiKey} className="clear-btn">
                Clear
              </button>
            )}
          </div>
          {saveMessage && (
            <div className="save-message">{saveMessage}</div>
          )}
          <div className="api-status">
            {apiKey ? '✓ API Key configured' : '⚠ No API Key set'}
          </div>
        </div>
      )}

      {pageTitle !== 'N/A' && (
        <div className="page-info">
          <div className="info-item">
            <strong>Page:</strong> {pageTitle}
          </div>
          <div className="info-item url">
            <strong>URL:</strong> {pageUrl}
          </div>
          {lastExtractTime && (
            <div className="info-item">
              <strong>Last Extract:</strong> {formatDate(lastExtractTime)}
            </div>
          )}
        </div>
      )}

      <div className="text-container">
        <div className="text-header">
          <h2>Extracted Text</h2>
          {extractedText && extractedText !== 'No text extracted yet. Click the "Extract Text" button on any webpage to get started!' && (
            <button onClick={copyToClipboard} className="copy-btn">
              Copy
            </button>
          )}
        </div>
        <div className="text-content">
          {extractedText}
        </div>
      </div>
    </div>
  );
};

export default Popup;
