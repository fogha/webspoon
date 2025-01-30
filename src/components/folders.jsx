import React, { useState } from 'react';
import { Icon } from './icons';
import { Button } from './ui/button';

export function Folders() {
  const [folders, setFolders] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setFolders(prev => [...prev, {
      id: Date.now(),
      name: newFolderName.trim(),
      items: []
    }]);
    setNewFolderName('');
    setIsCreating(false);
  };

  return (
    <div className="w-full h-full p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Folders</h1>
            <p className="text-sm text-muted-foreground">
              Organize your downloads and bookmarks
            </p>
          </div>
          {!(folders.length === 0 && !isCreating) && (
            <Button
              onClick={() => setIsCreating(true)}
              className="flex items-center space-x-2"
            >
              <Icon name="folder" className="w-4 h-4" />
              <span>New Folder</span>
            </Button>
          )}
        </header>

        {folders.length === 0 && !isCreating ? (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-card text-card-foreground">
            <div className="flex flex-col items-center space-y-4 p-8 text-center">
              <div className="rounded-full bg-primary/10 p-3">
                <Icon name="folder" className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold tracking-tight">No folders yet</h3>
                <p className="text-sm text-muted-foreground max-w-[300px]">
                  Create your first folder to start organizing your downloads and bookmarks
                </p>
              </div>
              <Button
                onClick={() => setIsCreating(true)}
                className="flex items-center space-x-2"
              >
                <Icon name="folder" className="w-4 h-4" />
                <span>Create Folder</span>
              </Button>
            </div>
          </div>
        ) : null}

        {isCreating && (
          <form onSubmit={handleCreateFolder} className="border rounded-lg bg-card p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="folderName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Folder Name
                </label>
                <input
                  id="folderName"
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Enter folder name"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  autoFocus
                />
              </div>
              <div className="flex space-x-2">
                <Button type="submit" disabled={!newFolderName.trim()}>
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewFolderName('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}

        {folders.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {folders.map(folder => (
              <div
                key={folder.id}
                className="flex items-start space-x-3 p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <Icon name="folder" className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{folder.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {folder.items.length} items
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
