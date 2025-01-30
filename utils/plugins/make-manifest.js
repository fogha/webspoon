import * as fs from 'fs';
import * as path from 'path';
import { outputFolderName } from '../constants';

const manifestPath = path.resolve('manifest.json');

export default function makeManifest() {
  return {
    name: 'make-manifest',
    buildEnd() {
      if (fs.existsSync(manifestPath)) {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }));
        const distDir = path.resolve(outputFolderName);

        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir);
        }

        fs.writeFileSync(
          path.resolve(distDir, 'manifest.json'),
          JSON.stringify(manifest, null, 2)
        );

        // Copy icons if they exist
        ['icon16.png', 'icon48.png', 'icon128.png'].forEach(iconFile => {
          const iconPath = path.resolve('public', iconFile);
          if (fs.existsSync(iconPath)) {
            fs.copyFileSync(iconPath, path.resolve(distDir, iconFile));
          }
        });
      }
    },
  };
}
