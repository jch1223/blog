/*
 * @file Theme configuration
 */
import { defineConfig } from './src/helpers/config-helper';

export default defineConfig({
  lang: 'ko-KR',
  site: 'https://blog.vitnal.xyz',
  avatar: '/avatar.png',
  title: 'Blog',
  description:
    '4년차 프론트엔드 개발자로서, 개발 과정에서 효과적인 커뮤니케이션을 통해 협업 효율성을 높이기 위해 노력합니다.',
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
    {
      icon: 'linkedin',
      link: 'https://www.linkedin.com/in/chulhee-jang/',
    },
    {
      icon: 'mail',
      link: 'mailto:vitnal.dev@gmail.com',
    },
  ],
});
