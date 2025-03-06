/*
 * @file Theme configuration
 */
import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  lang: 'ko-KR',
  site: 'https://slate-blog-topaz.vercel.app/',
  avatar: '/avatar.png',
  title: 'Blog',
  description: '',
  lastModified: true,
  readTime: true,
  footer: {
    copyright: '© 2025 Slate Design',
  },
  socialLinks: [
    {
      icon: 'github',
      link: 'https://github.com/jch1223',
    },
  ],
});
