// Vercel serves dist/404.html, with a real 404 status, for any URL that no
// file or rewrite in vercel.json matches. Copying the app shell there keeps
// the friendly in-app "Page Not Found" screen while telling crawlers the
// page does not exist (a 200 there is what Google reports as a soft 404).
import { copyFileSync } from 'node:fs';

copyFileSync('dist/index.html', 'dist/404.html');
