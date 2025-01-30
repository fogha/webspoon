import React from 'react';
import {
  Mic,
  MicOff,
  ChevronRight,
  Check,
  X as Close,
  Home,
  FileText,
  Folder,
  Settings,
  Volume2,
  VolumeX,
  Globe,
  Keyboard
} from "lucide-react"

const icons = {
  microphone: Mic,
  microphoneOff: MicOff,
  chevronRight: ChevronRight,
  check: Check,
  close: Close,
  home: Home,
  doc: FileText,
  folder: Folder,
  settings: Settings,
  volume: Volume2,
  volumeMute: VolumeX,
  language: Globe,
  keyboard: Keyboard
}

export function Icon({ name, ...props }) {
  const IconComponent = icons[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  return <IconComponent {...props} />;
}
