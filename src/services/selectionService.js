class SelectionService {
  constructor() {
    this.currentSelection = null;
    this.isSelecting = false;
    this.overlay = null;
    this.setupOverlay();
  }

  setupOverlay() {
    // Create selection overlay
    this.overlay = document.createElement('div');
    this.overlay.style.cssText = `
      position: fixed;
      pointer-events: none;
      border: 2px solid #1a73e8;
      background-color: rgba(26, 115, 232, 0.1);
      z-index: 999999;
      display: none;
    `;
    document.body.appendChild(this.overlay);
  }

  startSelection() {
    this.isSelecting = true;
    document.body.style.cursor = 'crosshair';
    
    // Add selection event listeners
    document.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);
  }

  stopSelection() {
    this.isSelecting = false;
    document.body.style.cursor = 'default';
    this.overlay.style.display = 'none';
    
    // Remove selection event listeners
    document.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  handleMouseDown = (e) => {
    if (!this.isSelecting) return;
    
    this.startX = e.pageX;
    this.startY = e.pageY;
    this.overlay.style.display = 'block';
  };

  handleMouseMove = (e) => {
    if (!this.isSelecting || !this.startX) return;
    
    const currentX = e.pageX;
    const currentY = e.pageY;
    
    const left = Math.min(this.startX, currentX);
    const top = Math.min(this.startY, currentY);
    const width = Math.abs(currentX - this.startX);
    const height = Math.abs(currentY - this.startY);
    
    this.overlay.style.left = left + 'px';
    this.overlay.style.top = top + 'px';
    this.overlay.style.width = width + 'px';
    this.overlay.style.height = height + 'px';
  };

  handleMouseUp = (e) => {
    if (!this.isSelecting) return;
    
    const selection = {
      rect: {
        left: parseInt(this.overlay.style.left),
        top: parseInt(this.overlay.style.top),
        width: parseInt(this.overlay.style.width),
        height: parseInt(this.overlay.style.height)
      },
      text: window.getSelection().toString()
    };
    
    this.currentSelection = selection;
    this.stopSelection();
    
    // Dispatch selection event
    const event = new CustomEvent('webspoon-selection', {
      detail: selection
    });
    document.dispatchEvent(event);
  };

  getCurrentSelection() {
    return this.currentSelection;
  }

  async takeScreenshot() {
    if (!this.currentSelection) {
      throw new Error('No active selection');
    }

    const { rect } = this.currentSelection;
    
    // Create a canvas to capture the screenshot
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    // Set canvas size to selection size
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    try {
      // Capture the screen using chrome.tabs.captureVisibleTab
      const dataUrl = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'CAPTURE_SCREENSHOT' }, resolve);
      });
      
      // Load the screenshot into an image
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });
      
      // Draw the selected portion to the canvas
      context.drawImage(
        img,
        rect.left,
        rect.top,
        rect.width,
        rect.height,
        0,
        0,
        rect.width,
        rect.height
      );
      
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Screenshot error:', error);
      throw new Error('Failed to capture screenshot');
    }
  }

  async saveToDocument(content, format = 'markdown') {
    if (!content) {
      throw new Error('No content to save');
    }

    try {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `webspoon-selection-${new Date().toISOString()}.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Save error:', error);
      throw new Error('Failed to save content');
    }
  }
}

export default SelectionService;
