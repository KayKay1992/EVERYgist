import {
    LuLayoutDashboard,
    LuGalleryVerticalEnd,
    LuMessageSquareQuote,
    LuLayoutTemplate,
    LuTag,
} from 'react-icons/lu'

export const SIDE_MENU_DATA = [
    {
        id: '01',
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: '/admin/dashboard',
    },
    {
        id: '02',
        label: 'Blog Posts',
        icon: LuGalleryVerticalEnd,
        path: '/admin/posts'
    },
    {
        id: '03',
        label: 'Comments',
        icon: LuMessageSquareQuote,
        path: '/admin/comments'
    },
    // {
    //     id: '04',
    //     label: 'Tags',
    //     icon: LuTag,
    //     path: '/admin/tags'
    // }
]

export const BLOG_NAVBAR_DATA = [
    {
        id: '01',
        label: 'Home',
        icon: LuLayoutTemplate,
        path: '/'
    },
    {
        id: '02',
        label: 'Reactjs',
        icon: LuTag,
        path: '/tag/React'
    },
    {
        id: '03',
        label: 'Nextjs',
        icon: LuTag,
        path: '/tag/Next.js'
    }
]