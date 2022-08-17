export default {
    title: 'hoe-book',
    description: '个人日志',

    themeConfig: {
        siteTitle: "个人日志",
        logo: "/favicon.ico",
        nav: [
            { text: 'LeetCode', link: '/chapter/leetcode/' },
            { text: '多线程', link: '/chapter/thread/synchronized' },
            {
                text: '数据库', items: [
                    { text: 'mysql', link: '/chapter/database/mysql' },
                    { text: 'redis', link: '/chapter/database/redis' },
                ]
            },
            {
                text: 'DevOps', items: [
                    { text: 'docker', link: '/chapter/devops/docker' },
                    { text: '其他', link: '/chapter/devops/other' },
                ]
            },
        ],
        sidebar: {
            '/chapter/leetcode/': [
                {
                    text: "算法",
                    items: [
                        {
                            text: '排序',
                            link: "/chapter/leetcode/sort",
                        },
                        {
                            text: '回溯算法',
                            link: "/chapter/leetcode/backtracking",
                        },
                        {
                            text: '树算法',
                            link: "/chapter/leetcode/tree",
                        },
                        {
                            text: '链表算法',
                            link: "/chapter/leetcode/listnode",
                        },
                        {
                            text: '字符串',
                            link: "/chapter/leetcode/string",
                        },
                        {
                            text: '其他',
                            link: "/chapter/leetcode/other",
                        },
                    ],
                },
            ],
        }
    },
}