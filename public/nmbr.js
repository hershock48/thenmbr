(function() {
  'use strict';

  // Configuration
  const NMBR_CONFIG = {
    baseUrl: 'https://www.thenmbr.com', // Change to your production URL
    version: '1.0.0'
  };

  // Widget class
  function NMBRWidget(element, options) {
    this.element = element;
    this.options = options || {};
    this.iframe = null;
    this.init();
  }

  NMBRWidget.prototype.init = function() {
    // Get options from data attributes
    const orgId = this.element.getAttribute('data-nmbr-org');
    const type = this.element.getAttribute('data-nmbr-type') || 'story-search';
    const width = this.element.getAttribute('data-nmbr-width') || '100%';
    const height = this.element.getAttribute('data-nmbr-height') || '600px';
    const nmbr = this.element.getAttribute('data-nmbr');

    if (!orgId) {
      console.error('NMBR Widget: Organization ID is required');
      return;
    }

    // Build widget URL
    const widgetUrl = this.buildWidgetUrl({
      org: orgId,
      type: type,
      nmbr: nmbr
    });

    // Create iframe
    this.createIframe(widgetUrl, width, height);
  };

  NMBRWidget.prototype.buildWidgetUrl = function(options) {
    const params = new URLSearchParams();
    params.append('org', options.org);
    params.append('type', options.type);
    
    if (options.nmbr) {
      params.append('nmbr', options.nmbr);
    }

    return `${NMBR_CONFIG.baseUrl}/widget?${params.toString()}`;
  };

  NMBRWidget.prototype.createIframe = function(url, width, height) {
    this.iframe = document.createElement('iframe');
    this.iframe.src = url;
    this.iframe.style.width = width;
    this.iframe.style.height = height;
    this.iframe.style.border = 'none';
    this.iframe.style.borderRadius = '8px';
    this.iframe.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    this.iframe.setAttribute('allowtransparency', 'true');
    this.iframe.setAttribute('scrolling', 'no');

    // Replace element content with iframe
    this.element.innerHTML = '';
    this.element.appendChild(this.iframe);
  };

  // Auto-initialize widgets
  function initWidgets() {
    const widgets = document.querySelectorAll('[data-nmbr-org]');
    widgets.forEach(function(element) {
      new NMBRWidget(element);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets);
  } else {
    initWidgets();
  }

  // Expose global API
  window.NMBRWidget = NMBRWidget;
  window.NMBR = {
    init: initWidgets,
    version: NMBR_CONFIG.version
  };

  // Auto-refresh widgets when new ones are added
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1) { // Element node
              if (node.hasAttribute && node.hasAttribute('data-nmbr-org')) {
                new NMBRWidget(node);
              }
              // Check child elements
              const childWidgets = node.querySelectorAll ? node.querySelectorAll('[data-nmbr-org]') : [];
              childWidgets.forEach(function(element) {
                new NMBRWidget(element);
              });
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

})();
