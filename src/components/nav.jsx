import React from 'react';
import { Icon } from './icons';
import { cn } from '@/utils/tailwind';

const navItems = [
  {
    name: 'Home',
    icon: 'home',
    href: 'home',
  },
  {
    name: 'Documents',
    icon: 'doc',
    href: 'docs',
  },
  {
    name: 'Folders',
    icon: 'folder',
    href: 'folders',
  },
  {
    name: 'Settings',
    icon: 'settings',
    href: 'settings',
  }
];

export function Nav({ className, onNavigate, currentPage = 'home' }) {
  return (
    <nav className={cn(
      "flex justify-evenly items-center h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      {navItems.map((item) => (
        <button
          key={item.name}
          onClick={() => onNavigate?.(item.href)}
          className={cn(
            "p-2 bg-transparent transition-colors relative group",
            currentPage === item.href
              ? "text-primary"
              : "text-muted-foreground hover:text-primary"
          )}
        >
          <Icon name={item.icon} className="w-5 h-5" />
          <span className="sr-only">{item.name}</span>
          {/* Tooltip for mobile */}
          <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-transform bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
            {item.name}
          </span>
        </button>
      ))}
    </nav>
  );
}
