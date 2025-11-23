import React, { useState, useEffect, useContext, useRef } from "react";
import BlogLayout from "../../components/layouts/BlogLayout/BlogLayout";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import {
  LuUser,
  LuLock,
  LuMessageSquare,
  LuCamera,
  LuSave,
  LuX,
  LuUpload,
} from "react-icons/lu";
import Tabs from "../../components/Tabs";
import moment from "moment";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    bio: "",
    profileImageUrl: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // User comments state
  const [userComments, setUserComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    // Set initial profile data
    setProfileData({
      name: user.name || "",
      bio: user.bio || "",
      profileImageUrl: user.profileImageUrl || "",
    });
  }, [user, navigate]);

  // Fetch user comments when tab changes to "comments"
  useEffect(() => {
    if (activeTab === "comments" && user) {
      fetchUserComments();
    }
  }, [activeTab]);

  const fetchUserComments = async () => {
    try {
      setCommentsLoading(true);
      const response = await axiosInstance.get(API_PATHS.AUTH.MY_COMMENTS);
      setUserComments(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosInstance.post(
        API_PATHS.IMAGE.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = response.data.imageUrl;
      setProfileData({ ...profileData, profileImageUrl: imageUrl });
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setProfileData({ ...profileData, profileImageUrl: "" });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axiosInstance.put(
        API_PATHS.AUTH.UPDATE_PROFILE,
        profileData
      );

      // Update user context
      setUser({ ...user, ...response.data });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: LuUser },
    { id: "security", label: "Security", icon: LuLock },
    { id: "comments", label: "My Comments", icon: LuMessageSquare },
  ];

  if (!user) {
    return null;
  }

  return (
    <BlogLayout>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-rose-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Gradient Top Border */}
            <div className="h-2 bg-linear-to-r from-purple-600 via-pink-600 to-rose-600"></div>

            {/* Tabs */}
            <div className="border-b border-gray-200 px-8 pt-6">
              <Tabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {/* Profile Info Tab */}
              {activeTab === "profile" && (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Profile Photo Upload */}
                  <div className="flex flex-col items-center mb-8">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="relative group">
                      {profileData.profileImageUrl ? (
                        <>
                          <img
                            src={profileData.profileImageUrl}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg group-hover:border-purple-400 transition-all"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
                          >
                            <LuX className="text-lg" />
                          </button>
                        </>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-purple-200 shadow-lg">
                          <LuUser className="text-5xl text-purple-600" />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="absolute -bottom-2 -right-2 w-10 h-10 flex items-center justify-center bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 disabled:opacity-50"
                      >
                        {imageUploading ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <LuCamera className="text-lg" />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">
                      Click camera icon to upload (max 5MB)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData({ ...profileData, bio: e.target.value })
                      }
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <LuSave className="text-lg" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <form
                  onSubmit={handlePasswordChange}
                  className="space-y-6 max-w-lg"
                >
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Password Requirements:</strong> At least 6
                      characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="Enter new password"
                      required
                      minLength="6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all"
                      placeholder="Confirm new password"
                      required
                      minLength="6"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                    >
                      <LuLock className="text-lg" />
                      {isLoading ? "Changing..." : "Change Password"}
                    </button>
                  </div>
                </form>
              )}

              {/* My Comments Tab */}
              {activeTab === "comments" && (
                <div>
                  {commentsLoading ? (
                    <div className="text-center py-12">
                      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                      <p className="mt-4 text-gray-600">Loading comments...</p>
                    </div>
                  ) : userComments.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <LuMessageSquare className="text-4xl text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        No Comments Yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        You haven't made any comments yet. Start engaging with
                        posts to see them here!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          Your Comments ({userComments.length})
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          All your comments across blog posts
                        </p>
                      </div>

                      {userComments.map((comment) => (
                        <div
                          key={comment._id}
                          className="bg-linear-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-6 border-2 border-purple-100 hover:border-purple-300 transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-semibold text-purple-600">
                                  On Post:
                                </span>
                                {comment.post ? (
                                  <button
                                    onClick={() =>
                                      navigate(`/${comment.post.slug}`)
                                    }
                                    className="text-sm font-medium text-gray-900 hover:text-purple-600 transition-colors"
                                  >
                                    {comment.post.title}
                                  </button>
                                ) : (
                                  <span className="text-sm text-gray-500 italic">
                                    Post deleted
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {moment(comment.createdAt).format(
                                  "MMM DD, YYYY [at] h:mm A"
                                )}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-700 leading-relaxed">
                            {comment.content}
                          </p>

                          {comment.post && (
                            <button
                              onClick={() => navigate(`/${comment.post.slug}`)}
                              className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              View Post →
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default Profile;
