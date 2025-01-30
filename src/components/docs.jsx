import React from 'react';
import { Icon } from './icons';

export function Docs() {
  return (
    <div className="w-full h-full p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Documentation</h1>
          <p className="text-muted-foreground">Learn how to use WebSpoon effectively</p>
        </header>

        <section className="space-y-4">
          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <h2 className="text-lg font-semibold mb-4">Voice Commands</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Icon name="microphone" className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Basic Commands</h3>
                  <p className="text-sm text-muted-foreground">
                    Start with "Hey WebSpoon" followed by your command. For example:
                    "Hey WebSpoon, open new tab"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="doc" className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Text Selection</h3>
                  <p className="text-sm text-muted-foreground">
                    Select text on any webpage and use commands like "copy",
                    "search", or "translate"
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Icon name="folder" className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">File Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Organize downloads and bookmarks using voice commands like
                    "save to folder" or "create new folder"
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card text-card-foreground p-6">
            <h2 className="text-lg font-semibold mb-4">Tips & Tricks</h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Icon name="check" className="w-4 h-4 text-green-500" />
                <span className="text-sm">Speak clearly and at a normal pace</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="check" className="w-4 h-4 text-green-500" />
                <span className="text-sm">Wait for the listening indicator before speaking</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="check" className="w-4 h-4 text-green-500" />
                <span className="text-sm">Use the suggested commands when available</span>
              </li>
              <li className="flex items-center space-x-2">
                <Icon name="check" className="w-4 h-4 text-green-500" />
                <span className="text-sm">Customize voice settings for better accuracy</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
