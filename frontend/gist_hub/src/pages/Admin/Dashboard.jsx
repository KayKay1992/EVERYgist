import { useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useEffect } from "react";
import moment from "moment";
import {
  LuChartLine,
  LuCheckCheck,
  LuGalleryVerticalEnd,
  LuHeart,
  LuSparkles,
  LuTrendingUp,
  LuMessageSquare,
} from "react-icons/lu";
import DashboardSummaryCard from "../../components/Cards/DashboardSummaryCard";
import TagInsights from "../../components/Cards/TagInsights";
import TopPostCard from "../../components/Cards/TopPostCard";
import RecentCommentsList from "../../components/Cards/RecentCommentsList";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [maxViews, setMaxViews] = useState(0);

  // Dynamic greeting based on time of day
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return "Good morning";
    } else if (currentHour >= 12 && currentHour < 17) {
      return "Good afternoon";
    } else if (currentHour >= 17 && currentHour < 21) {
      return "Good evening";
    } else {
      return "Good night";
    }
  };

  const getDashboardData = async () => {
    //fetch dashboard data from API
    try {
      const response = await axiosInstance.get(
        API_PATHS.DASHBOARD.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);

        const topPosts = response.data?.topPosts || [];
        const totalViews = Math.max(...topPosts.map((p) => p.views), 1);
        setMaxViews(totalViews);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  //fetch dashboard data on component mount
  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);
  return (
    <DashboardLayout activeMenu="Dashboard">
      {dashboardData && (
        <>
          {/* Hero Section with Gradient */}
          <div className="relative overflow-hidden bg-linear-to-br from-purple-600 via-pink-600 to-rose-600 rounded-3xl shadow-2xl shadow-purple-500/30 p-8 md:p-10 mt-6">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LuSparkles className="text-yellow-300 text-2xl animate-pulse" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                      {getTimeBasedGreeting()}, {user?.name}! 👋
                    </h2>
                  </div>
                  <p className="text-purple-100 text-sm md:text-base font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    {moment().format("dddd, MMMM Do YYYY")}
                  </p>
                </div>

                {/* Quick Stats Badge */}
                <div className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/30 p-3 rounded-xl">
                      <LuTrendingUp className="text-white text-2xl" />
                    </div>
                    <div>
                      <p className="text-white/80 text-xs font-medium">
                        Total Engagement
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {(dashboardData?.stats?.totalViews || 0) +
                          (dashboardData?.stats?.totalLikes || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-500/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <LuGalleryVerticalEnd className="text-sky-100 text-xl" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium">
                        Total Posts
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {dashboardData?.stats?.totalPosts || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <LuCheckCheck className="text-green-100 text-xl" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium">
                        Published
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {dashboardData?.stats?.published || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <LuChartLine className="text-blue-100 text-xl" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium">
                        Total Views
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {dashboardData?.stats?.totalViews || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="flex items-center gap-3">
                    <div className="bg-pink-500/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                      <LuHeart className="text-pink-100 text-xl" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs font-medium">
                        Total Likes
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {dashboardData?.stats?.totalLikes || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6">
            {/* Tag Insights */}
            <div className="col-span-12 md:col-span-7 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-300">
              <div className="bg-linear-to-r from-purple-50 to-pink-50 p-6 border-b border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-br from-purple-600 to-pink-600 p-3 rounded-xl">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold bg-linear-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">
                      Tag Insights
                    </h5>
                    <p className="text-xs text-gray-500 font-medium">
                      Most used categories
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <TagInsights tagUsage={dashboardData?.tagUsage || []} />
              </div>
            </div>

            {/* Top Posts */}
            <div className="col-span-12 md:col-span-5 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-200/30 transition-all duration-300">
              <div className="bg-linear-to-r from-blue-50 to-purple-50 p-6 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-br from-blue-600 to-purple-600 p-3 rounded-xl">
                    <LuTrendingUp className="text-white text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold bg-linear-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                      Top Posts
                    </h5>
                    <p className="text-xs text-gray-500 font-medium">
                      Your best performing content
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {dashboardData?.topPosts?.slice(0, 3).map((post) => (
                  <TopPostCard
                    key={post._id}
                    title={post.title}
                    views={post.views}
                    coverImageUrl={post.coverImageUrl}
                    likes={post.likes}
                    maxViews={maxViews}
                  />
                ))}
              </div>
            </div>

            {/* Recent Comments */}
            <div className="col-span-12 bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-pink-200/30 transition-all duration-300">
              <div className="bg-linear-to-r from-pink-50 to-rose-50 p-6 border-b border-pink-100">
                <div className="flex items-center gap-3">
                  <div className="bg-linear-to-br from-pink-600 to-rose-600 p-3 rounded-xl">
                    <LuMessageSquare className="text-white text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xl font-bold bg-linear-to-r from-pink-700 to-rose-700 bg-clip-text text-transparent">
                      Recent Comments
                    </h5>
                    <p className="text-xs text-gray-500 font-medium">
                      Latest feedback from readers
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <RecentCommentsList
                  comments={dashboardData?.recentComments || []}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
