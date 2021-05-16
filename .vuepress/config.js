module.exports = {
  title: "kcqnly的博客",
  description: "记录学习过程，分享生活琐碎。",
  dest: "public",
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  head: [
    [
      "link",
      {
        rel: "icon",
        href: "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no"
      }
    ]
  ],
  theme: "reco",
  themeConfig: {
    nav: [
      {
        text: "Home",
        link: "/",
        icon: "reco-home"
      },
      {
        text: "TimeLine",
        link: "/timeline/",
        icon: "reco-date"
      },
      // {
      //   "text": "Docs",
      //   "icon": "reco-message",
      //   "items": [
      //     {
      //       "text": "vuepress-reco",
      //       "link": "/docs/theme-reco/"
      //     }
      //   ]
      // },
      // {
      //   "text": "Github",
      //   "icon": "reco-github",
      //   "link": "https://github.com/kcqnly",
      // },
      {
        text: "About",
        icon: "reco-account",
        link: "/others/about"
      }
    ],
    type: "blog",
    blogConfig: {
      category: {
        location: 2,
        text: "Category"
      },
      tag: {
        location: 3,
        text: "Tag"
      }
    },
    friendLink: [
      {
        title: "Token团队",
        desc: "因理而生，为理而来",
        link: "https://itoken.team/",
        logo: "/token.png"
      },
    ],
    logo: "/logo.png",
    search: true,
    searchMaxSuggestions: 10,
    lastUpdated: "Last Updated",
    author: "kcqnly",
    authorAvatar: "/avatar.png",
    // "record": "xxxx",
    startYear: "2019"
  },
  markdown: {
    lineNumbers: true
  },
  plugins: [
    '@maginapp/vuepress-plugin-katex'
  ]
}