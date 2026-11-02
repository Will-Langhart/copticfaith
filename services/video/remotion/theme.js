import { loadFont as loadCormorant } from '@remotion/google-fonts/CormorantGaramond';
import { loadFont as loadDMSans } from '@remotion/google-fonts/DMSans';

// Mirrors the site's design tokens (src/index.css).
export const colors = {
  bg: '#0a0e17',
  gold: '#e8aa00',
  text: '#f5f0e6',
  muted: 'rgba(245, 240, 230, 0.62)',
  line: 'rgba(232, 170, 0, 0.35)',
};

export const fonts = {
  heading: loadCormorant('normal', { weights: ['500', '600'], subsets: ['latin'] }).fontFamily,
  headingItalic: loadCormorant('italic', { weights: ['500'], subsets: ['latin'] }).fontFamily,
  body: loadDMSans('normal', { weights: ['400', '500', '600'], subsets: ['latin'] }).fontFamily,
};
