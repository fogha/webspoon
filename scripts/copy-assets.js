import { copyFileSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, '..');

// Ensure directories exist
mkdirSync(resolve(root, 'dist'), { recursive: true });
mkdirSync(resolve(root, 'dist/icons'), { recursive: true });
mkdirSync(resolve(root, 'public/icons'), { recursive: true });

// Copy or create manifest
if (existsSync(resolve(root, 'manifest.json'))) {
  copyFileSync(
    resolve(root, 'manifest.json'),
    resolve(root, 'dist/manifest.json')
  );
}

// Base64 encoded 1x1 pixel PNG for placeholder icons
const placeholderIcon = Buffer.from(`
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACklEQVR4nGMAAQAABQABDQottAA
AAABJRU5ErkJggg==`, 'base64');

// Copy or create icons
const icons = {
  'icon16.png': placeholderIcon,
  'icon48.png': placeholderIcon,
  'icon128.png': placeholderIcon
};

Object.entries(icons).forEach(([iconName, placeholder]) => {
  const sourcePath = resolve(root, 'public/icons', iconName);
  const destPath = resolve(root, 'dist/icons', iconName);
  
  try {
    if (existsSync(sourcePath)) {
      copyFileSync(sourcePath, destPath);
    } else {
      console.log(`Creating placeholder for ${iconName}`);
      writeFileSync(sourcePath, placeholder);
      copyFileSync(sourcePath, destPath);
    }
  } catch (error) {
    console.error(`Error handling ${iconName}:`, error);
  }
});
