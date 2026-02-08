import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid({
  title: 'LiveTradingLeague',
  description: 'Official documentation for LiveTradingLeague platform',
  base: '/trade-cmp-docs/',
  ignoreDeadLinks: true,

  themeConfig: {
    logo: '/logo.svg',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Getting Started', link: '/getting-started/introduction' },
      { text: 'Guide', link: '/guide/architecture' },
      { text: 'API', link: '/api/overview' },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Contributing', link: '/contributing' }
        ]
      }
    ],

    sidebar: {
      '/getting-started/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/getting-started/introduction' },
            { text: 'Installation', link: '/getting-started/installation' },
            { text: 'Quick Start', link: '/getting-started/quick-start' },
            { text: 'Development Setup', link: '/getting-started/development' }
          ]
        }
      ],

      '/guide/': [
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/guide/architecture' },
            { text: 'Technology Stack', link: '/guide/tech-stack' },
            { text: 'Data Flow', link: '/guide/data-flow' }
          ]
        },
        {
          text: 'Backend',
          items: [
            { text: 'Server Overview', link: '/guide/server' },
            { text: 'Database Models', link: '/guide/models' },
            { text: 'Authentication', link: '/guide/authentication' }
          ]
        },
        {
          text: 'Frontend',
          items: [
            { text: 'Components', link: '/guide/components' },
            { text: 'Pages', link: '/guide/pages' },
            { text: 'Navigation', link: '/guide/navigation' }
          ]
        },
        {
          text: 'Features',
          items: [
            { text: 'Broker Integration', link: '/guide/broker-integration' },
            { text: 'Email System', link: '/guide/email-system' },
            { text: 'Participant Management', link: '/guide/participant-management' }
          ]
        }
      ],

      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/overview' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Tournaments', link: '/api/tournaments' },
            { text: 'Users', link: '/api/users' },
            { text: 'Participants', link: '/api/participants' },
            { text: 'Settings', link: '/api/settings' }
          ]
        }
      ],

      '/deployment/': [
        {
          text: 'Deployment',
          items: [
            { text: 'Production Setup', link: '/deployment/production' },
            { text: 'Docker Deployment', link: '/deployment/docker' },
            { text: 'Environment Variables', link: '/deployment/environment' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/livetradingcoder/trade-cmp' }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026 LiveTradingLeague'
    },

    editLink: {
      pattern: 'https://github.com/livetradingcoder/trade-cmp-docs/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'theme-color', content: '#667eea' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:locale', content: 'en' }],
    ['meta', { name: 'og:site_name', content: 'LiveTradingLeague' }]
  ]
})
