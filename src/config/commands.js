export const commands = [
  {
    trigger: 'click',
    description: 'Click on any element containing the specified text',
    action: 'click',
    example: 'click submit button',
    extractParam: cmd => cmd.replace('click', '').trim()
  },
  {
    trigger: 'scroll',
    description: 'Scroll the page up or down',
    action: 'scroll',
    example: 'scroll down',
    extractParam: cmd => cmd.includes('up') ? 'up' : 'down'
  },
  {
    trigger: 'go to',
    description: 'Navigate to a website',
    action: 'navigate',
    example: 'go to google.com',
    extractParam: cmd => cmd.replace('go to', '').trim()
  },
  {
    trigger: 'back',
    description: 'Go back in browser history',
    action: 'goBack',
    example: 'back',
    extractParam: () => null
  },
  {
    trigger: 'forward',
    description: 'Go forward in browser history',
    action: 'goForward',
    example: 'forward',
    extractParam: () => null
  },
  {
    trigger: 'refresh',
    description: 'Refresh the current page',
    action: 'refresh',
    example: 'refresh',
    extractParam: () => null
  },
  {
    trigger: 'search',
    description: 'Search for text on the page',
    action: 'search',
    example: 'search pricing',
    extractParam: cmd => cmd.replace('search', '').trim()
  },
  {
    trigger: 'focus',
    description: 'Focus on an input field or interactive element',
    action: 'focus',
    example: 'focus search box',
    extractParam: cmd => cmd.replace('focus', '').trim()
  },
  {
    trigger: 'type',
    description: 'Type text into the focused input field',
    action: 'type',
    example: 'type hello world',
    extractParam: cmd => cmd.replace('type', '').trim()
  },
  {
    trigger: 'press',
    description: 'Press a keyboard key (enter, escape, tab)',
    action: 'press',
    example: 'press enter',
    extractParam: cmd => cmd.replace('press', '').trim()
  },
  {
    trigger: 'zoom',
    description: 'Zoom in or out on the page',
    action: 'zoom',
    example: 'zoom in',
    extractParam: cmd => cmd.includes('in') ? 'in' : 'out'
  },
  {
    trigger: 'select',
    description: 'Select text or an option from a dropdown',
    action: 'select',
    example: 'select dark mode',
    extractParam: cmd => cmd.replace('select', '').trim()
  },
  {
    trigger: 'copy',
    description: 'Copy text from the page',
    action: 'copy',
    example: 'copy heading',
    extractParam: cmd => cmd.replace('copy', '').trim()
  },
  {
    trigger: 'scroll to',
    description: 'Scroll to a specific element on the page',
    action: 'scrollTo',
    example: 'scroll to contact form',
    extractParam: cmd => cmd.replace('scroll to', '').trim()
  },
  {
    trigger: 'open',
    description: 'Open a link in a new tab',
    action: 'openLink',
    example: 'open documentation',
    extractParam: cmd => cmd.replace('open', '').trim()
  },
  {
    trigger: 'close',
    description: 'Close the current tab',
    action: 'closeTab',
    example: 'close tab',
    extractParam: () => null
  },
  {
    trigger: 'maximize',
    description: 'Maximize the browser window',
    action: 'maximize',
    example: 'maximize window',
    extractParam: () => null
  },
  {
    trigger: 'minimize',
    description: 'Minimize the browser window',
    action: 'minimize',
    example: 'minimize window',
    extractParam: () => null
  },
  {
    trigger: 'mute',
    description: 'Mute/unmute media on the page',
    action: 'mute',
    example: 'mute video',
    extractParam: cmd => cmd.includes('unmute') ? 'unmute' : 'mute'
  },
  {
    trigger: 'play',
    description: 'Play/pause media on the page',
    action: 'playMedia',
    example: 'play video',
    extractParam: cmd => cmd.includes('pause') ? 'pause' : 'play'
  },
  // Selection-based commands
  {
    trigger: 'summarize selection',
    description: 'Generate an AI summary of the selected text',
    example: 'summarize this selection',
    action: 'SUMMARIZE_SELECTION'
  },
  {
    trigger: 'screenshot selection',
    description: 'Take a screenshot of the selected area',
    example: 'take a screenshot of this',
    action: 'SCREENSHOT_SELECTION'
  },
  {
    trigger: 'save selection',
    description: 'Save the selected content to a document',
    example: 'save this to document',
    action: 'SAVE_SELECTION'
  },
  {
    trigger: 'translate selection',
    description: 'Translate the selected text to another language',
    example: 'translate this to spanish',
    action: 'TRANSLATE_SELECTION',
    extractParam: (text) => {
      const match = text.match(/to\s+(\w+)$/i);
      return match ? match[1].toLowerCase() : 'english';
    }
  },
  {
    trigger: 'analyze selection',
    description: 'Analyze the sentiment and key points of the selected text',
    example: 'analyze this text',
    action: 'ANALYZE_SELECTION'
  }
];
