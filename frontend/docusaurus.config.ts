import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Physical AI & Humanoid Robotics Portal',
  tagline: 'Learn Physical AI, ROS 2, and Humanoid Robotics - Panaversity',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'http://localhost:3000',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
 baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
   organizationName: 'Suhail Ahmed Aamro', // Usually your GitHub org/user name.
  projectName: 'BOOK-HACKTHOON', // Usually your repo name.


  onBrokenLinks: 'throw',

  // Internationalization for English/Urdu
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
      },
    },
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/panaversity/robotics-portal/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
   navbar: {
      title: '',
      hideOnScroll: true,
      logo: {
        alt: 'Panaversity Logo',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        // --- Left Side (Navigation) ---
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📖 The Book',
        },
       

        // --- Right Side (Tools & Auth) ---
        {
          type: 'localeDropdown',
          position: 'right',
          className: 'nav-link-language',
        },
        {
          href: 'https://localhost:3000',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          html: '<i class="fab fa-github" style="font-size: 1.5rem;"></i>', // FontAwesome icon support
        },
        // Professional Action Button for Auth
        {
          type: 'html',
          position: 'right',
          value: `
            <div class="navbar-auth-wrapper">
              <button id="login-btn" class="button button--outline button--primary button--sm" style="border-radius: 20px; padding: 5px 15px; font-weight: bold;">
                Sign In
              </button>
            </div>
          `,
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        // {
        //   title: 'Docs',
        //   items: [
        //     // {
        //     //   label: 'Tutorial',
        //     //   to: '/docs/intro',
        //     // },
        //   ],
        // },
        {
          // title: 'Community',
          items: [
            // {
            //   label: 'Stack Overflow',
            //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            // },
            // {
            //   label: 'Discord',
            //   href: 'https://discordapp.com/invite/docusaurus',
            // },
            // {
            //   label: 'X',
            //   href: 'https://x.com/docusaurus',
            // },
          ],
        },
        {
          // title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: '/blog',
            // },
            // // {
            //   label: 'GitHub',
            //   href: 'https://github.com/facebook/docusaurus',
            // },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Panaversity. Developed by Suhail Ahmed Aamro. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-Xi8rHCmBmhbuyyhbI88391ZKP2dmfnOl4rT9ZfRI7mLTdk1wblIUnrIq35nqwEvC',
      crossorigin: 'anonymous',
    },
  ],
};

export default config;
