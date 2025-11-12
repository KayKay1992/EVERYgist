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
} from "react-icons/lu";
import DashboardSummaryCard from "../../components/Cards/DashboardSummaryCard";

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
          <div className="bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 mt-6">
            <div className="">
              <div className="col-span-3">
                <h2 className="text-2xl md:text-2xl font-medium">
                  {getTimeBasedGreeting()}! {user?.name}
                </h2>
                <p className="text-xs md:text-[13px]font-medium text-gray-400 mt-1.5">
                  {moment().format("dddd, MMMM Do YYYY")}
                </p>
              </div>
            </div>
            <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 mt-5">
              <DashboardSummaryCard
                label="Total Posts"
                bgColor="bg-sky-100/60"
                value={dashboardData?.stats?.totalPosts || 0}
                color="text-sky-500"
                icon={<LuGalleryVerticalEnd />}
              />

              <DashboardSummaryCard
                label="Published"
                bgColor="bg-green-100/60"
                value={dashboardData?.stats?.published || 0}
                color="text-orange-500"
                icon={<LuCheckCheck />}
              />

              <DashboardSummaryCard
                label="Total Views"
                bgColor="bg-blue-100/60"
                value={dashboardData?.stats?.totalViews || 0}
                color="text-blue-500"
                icon={<LuChartLine />}
              />

              <DashboardSummaryCard
                label="Total Likes"
                bgColor="bg-yellow-100/60"
                value={dashboardData?.stats?.totalLikes || 0}
                color="text-yellow-500"
                icon={<LuHeart />}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-4 md:my-6">
            <div className="col-span-12 md:col-span-7 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 ">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium mt-8 mb-4">Tag Insights</h5>
              </div>
            </div>
            <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 ">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium mt-8 mb-4">Top Posts</h5>
              </div>
            </div>

            <div className="col-span-12 bg-white p-6 rounded-2xl shadow-md shadow-gray-100 border border-gray-200/50 ">
              <div className="flex justify-between items-center">
                <h5 className="text-lg font-medium mt-8 mb-4">
                  Recent Comments
                </h5>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
