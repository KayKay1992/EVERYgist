import {
  LuLayoutDashboard,
  LuGalleryVerticalEnd,
  LuMessageSquareQuote,
  LuLayoutTemplate,
  LuGraduationCap,
  LuLaptop,
  LuLandmark,
  LuHeart,
  LuNewspaper,
  LuTrophy,
  LuRocket,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Blog Posts",
    icon: LuGalleryVerticalEnd,
    path: "/admin/posts",
  },
  {
    id: "03",
    label: "Comments",
    icon: LuMessageSquareQuote,
    path: "/admin/comments",
  },
  // {
  //     id: '04',
  //     label: 'Tags',
  //     icon: LuTag,
  //     path: '/admin/tags'
  // }
];

export const BLOG_NAVBAR_DATA = [
  {
    id: "01",
    label: "Home",
    icon: LuLayoutTemplate,
    path: "/",
  },
  {
    id: "02",
    label: "Education",
    icon: LuGraduationCap,
    path: "/tag/Education",
  },
  {
    id: "03",
    label: "Technology",
    icon: LuLaptop,
    path: "/tag/Technology",
  },
  {
    id: "04",
    label: "Politics",
    icon: LuLandmark,
    path: "/tag/Politics",
  },
  {
    id: "05",
    label: "Lifestyle",
    icon: LuHeart,
    path: "/tag/Lifestyle",
  },
  {
    id: "06",
    label: "News",
    icon: LuNewspaper,
    path: "/tag/News",
  },
  {
    id: "07",
    label: "Sports",
    icon: LuTrophy,
    path: "/tag/Sports",
  },
  {
    id: "08",
    label: "Startup",
    icon: LuRocket,
    path: "/tag/Startup",
  },
];
