(function() {
  'use strict';

  // Configuration
  const NMBR_CONFIG = {
    baseUrl: 'http://localhost:3000',
    version: '1.0.0'
  };

  // Widget loader class
  function NMBRWidget() {
    this.config = NMBR_CONFIG;
    this.widgets = new Map();
  }

  // Create widget container
  NMBRWidget.prototype.createContainer = function(containerId, options) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error('NMBR Widget: Container element not found:', containerId);
      return null;
    }

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = this.buildWidgetUrl(options);
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.style.overflow = 'hidden';
    
    // Set minimum height based on widget type
    const minHeight = this.getMinHeight(options.type);
    iframe.style.minHeight = minHeight + 'px';

    // Add loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.innerHTML = `
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: ${minHeight}px;
        background: #f9fafb;
        border-radius: 8px;
        color: #6b7280;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="text-align: center;">
          <div style="
            width: 24px;
            height: 24px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 8px;
          "></div>
          <div>Loading widget...</div>
        </div>
      </div>
    `;

    // Add CSS animation
    if (!document.getElementById('nmbr-styles')) {
      const style = document.createElement('style');
      style.id = 'nmbr-styles';
      style.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    container.appendChild(loadingDiv);

    // Handle iframe load
    iframe.onload = function() {
      container.removeChild(loadingDiv);
      container.appendChild(iframe);
    };

    // Handle iframe error
    iframe.onerror = function() {
      container.removeChild(loadingDiv);
      container.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          height: ${minHeight}px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="text-align: center;">
            <div style="font-size: 18px; margin-bottom: 8px;">⚠️</div>
            <div>Failed to load widget</div>
          </div>
        </div>
      `;
    };

    this.widgets.set(containerId, {
      iframe: iframe,
      options: options,
      container: container
    });

    return iframe;
  };

  // Build widget URL
  NMBRWidget.prototype.buildWidgetUrl = function(options) {
    const params = new URLSearchParams();
    
    if (options.org) params.set('org', options.org);
    if (options.type) params.set('type', options.type);
    if (options.nmbr) params.set('nmbr', options.nmbr);
    if (options.amount) params.set('amount', options.amount);
    if (options.powered === false) params.set('powered', 'false');
    if (options.theme) params.set('theme', options.theme);

    // If it's a story search with a specific NMBR, use the story display page
    if (options.type === 'story-search' && options.nmbr) {
      return `${this.config.baseUrl}/story/${options.org}/${options.nmbr}`;
    }

    return `${this.config.baseUrl}/widget?${params.toString()}`;
  };

  // Get minimum height for widget type
  NMBRWidget.prototype.getMinHeight = function(type) {
    const heights = {
      'story-search': 400,
      'donate': 500,
      'subscribe': 300
    };
    return heights[type] || 400;
  };

  // Resize widget
  NMBRWidget.prototype.resize = function(containerId, height) {
    const widget = this.widgets.get(containerId);
    if (widget && widget.iframe) {
      widget.iframe.style.height = height + 'px';
    }
  };

  // Destroy widget
  NMBRWidget.prototype.destroy = function(containerId) {
    const widget = this.widgets.get(containerId);
    if (widget) {
      widget.container.innerHTML = '';
      this.widgets.delete(containerId);
    }
  };

  // Public API
  NMBRWidget.prototype.init = function(containerId, options) {
    if (!containerId || !options.org || !options.type) {
      console.error('NMBR Widget: Missing required parameters (containerId, org, type)');
      return null;
    }

    return this.createContainer(containerId, options);
  };

  // Create global instance
  window.NMBR = new NMBRWidget();

  // Auto-initialize widgets on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Look for data-nmbr attributes
    const elements = document.querySelectorAll('[data-nmbr]');
    elements.forEach(function(element) {
      const options = {
        org: element.getAttribute('data-nmbr-org'),
        type: element.getAttribute('data-nmbr-type'),
        nmbr: element.getAttribute('data-nmbr-code'),
        amount: element.getAttribute('data-nmbr-amount'),
        powered: element.getAttribute('data-nmbr-powered') !== 'false',
        theme: element.getAttribute('data-nmbr-theme')
      };

      if (options.org && options.type) {
        const containerId = element.id || 'nmbr-widget-' + Math.random().toString(36).substr(2, 9);
        element.id = containerId;
        window.NMBR.init(containerId, options);
      }
    });
  });

  // Console log for debugging
  console.log('NMBR Widget Loader v' + NMBR_CONFIG.version + ' loaded');
})();
