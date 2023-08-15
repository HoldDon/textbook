export default {
    title: '个人日志',
    base: "/textbook/",
    themeConfig: {
        siteTitle: "个人日志",
        logo: "/favicon.ico",
        nav: [
            {
                text: '编程', items: [
                    { text: "教程", link: '/chapter/code/algorithm/leetcode' },
                    { text: "记录", link: '/chapter/note' }
                ]
            },
            // { text: '数学', link: '/chapter/math/linearAlgebra' },
            {
                text: '数据库', items: [
                    { text: 'mysql', link: '/chapter/database/mysql' },
                    { text: 'redis', link: '/chapter/database/redis' },
                ]
            },
            {
                text: 'DevOps', items: [
                    { text: 'docker', link: '/chapter/devops/docker' },
                    { text: 'ffmpeg', link: '/chapter/devops/ffmpeg' },
                ]
            },
        ],
        sidebar: {
            '/chapter/code/': [
                {
                    text: "算法",
                    items: [
                        {
                            text: 'leetcode',
                            link: "/chapter/code/algorithm/leetcode",
                        }
                    ],
                }, 
                {
                    text: "编程语言",
                    items: [
                        {
                            text: 'java',
                            link: "/chapter/code/language/java",
                        }
                    ]
                }
            ],
        }
    },
}