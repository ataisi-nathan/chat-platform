(function () {
  // Prevent duplicate initialization
  if (window.__MY_WIDGET_INITIALIZED__) return;
  window.__MY_WIDGET_INITIALIZED__ = true;

  // 1. Create Iframe Container
  const iframe = document.createElement('iframe');
  iframe.src = 'https://yourdomain.com/embed/widget?color=%232563eb&botName=Support';
  
  // Set default launcher dimensions & position
  Object.assign(iframe.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '64px',
    height: '64px',
    border: 'none',
    zIndex: '999999',
    background: 'transparent',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  });

  document.body.appendChild(iframe);

  // 2. Listen for postMessage events from the iframe
  window.addEventListener('message', (event) => {
    // Optional domain security check:
    // if (event.origin !== 'https://yourdomain.com') return;

    if (event.data && event.data.type === 'WIDGET_TOGGLE') {
      if (event.data.isOpen) {
        // Expand iframe to fit full chat window
        iframe.style.width = '380px';
        iframe.style.height = '520px';
      } else {
        // Collapse iframe back to launcher bubble
        iframe.style.width = '64px';
        iframe.style.height = '64px';
      }
    }
  });
})();