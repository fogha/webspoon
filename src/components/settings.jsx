import React, { useState } from 'react';
import { Icon } from './icons';
import { cn } from '@/utils/tailwind';
import { Switch } from './ui/switch';

const settingsSections = [
  {
    id: 'voice',
    title: 'Voice Settings',
    icon: 'microphone',
    settings: [
      {
        id: 'voice-enabled',
        title: 'Enable Voice Commands',
        description: 'Allow WebSpoon to listen for voice commands',
        type: 'switch',
        defaultValue: true,
      },
      {
        id: 'continuous-listening',
        title: 'Continuous Listening',
        description: 'Keep listening after executing a command',
        type: 'switch',
        defaultValue: true,
      },
      {
        id: 'confirmation',
        title: 'Command Confirmation',
        description: 'Ask for confirmation before executing commands',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'settings',
    settings: [
      {
        id: 'dark-mode',
        title: 'Dark Mode',
        description: 'Enable dark mode for the interface',
        type: 'switch',
        defaultValue: false,
      },
      {
        id: 'animations',
        title: 'Animations',
        description: 'Enable interface animations',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy',
    icon: 'keyboard',
    settings: [
      {
        id: 'data-collection',
        title: 'Data Collection',
        description: 'Allow WebSpoon to collect usage data to improve the service',
        type: 'switch',
        defaultValue: true,
      },
      {
        id: 'command-history',
        title: 'Command History',
        description: 'Keep a history of your voice commands',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
];

export function Settings() {
  const [settings, setSettings] = useState(() => {
    const defaults = {};
    settingsSections.forEach(section => {
      section.settings.forEach(setting => {
        defaults[setting.id] = setting.defaultValue;
      });
    });
    return defaults;
  });

  const handleSettingChange = (id, value) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const renderSetting = (setting) => {
    return (
      <Switch
        id={setting.id}
        checked={settings[setting.id]}
        onCheckedChange={(checked) => handleSettingChange(setting.id, checked)}
      />
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your voice command preferences and application settings
        </p>
      </header>

      <div className="grid gap-4 sm:gap-6">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="space-y-4 rounded-lg border p-4 sm:p-6 bg-card text-card-foreground"
          >
            <div className="flex items-center space-x-2">
              <Icon name={section.icon} className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold">{section.title}</h2>
            </div>

            <div className="grid gap-4">
              {section.settings.map((setting) => (
                <div key={setting.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div className="space-y-0.5">
                    <label
                      htmlFor={setting.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {setting.title}
                    </label>
                    <p className="text-[12px] text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  {renderSetting(setting)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
