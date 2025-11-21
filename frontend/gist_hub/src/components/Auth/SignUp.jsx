import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axioInstance";
import { UserContext } from "../../context/userContext";
import { API_PATHS } from "../../utils/apiPaths";
import AUTH_IMG from "../../assets/auth-img-blog.jpg";
import Input from "../Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import uploadImage from "../../utils/uploadImage";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminAccessToken, setAdminAccessToken] = useState("");
  const [error, setError] = useState(null);
  const { updateUser, setOpenAuthForm } = useContext(UserContext);
  const navigate = useNavigate();

  //handle SignUp Form submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";
    if (!fullName) {
      setError("Please enter your full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter your password");
      return;
    }

    setError(""); //clear previous errors

    //SignUp API call
    try {
      //upload Image if present
      if (profilePic) {
        const imgUploadsRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadsRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminAccessToken,
      });

      const { token, role } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        //Navigate based on role
        if (role === "admin") {
          setOpenAuthForm(false);
          navigate("/admin/dashboard");
        }
        navigate("/");
        setOpenAuthForm(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred during sign up. Please try again.");
      }
    }
  };
  return (
    <div className="flex items-center min-h-[520px]">
      <div className="w-[90vw] md:w-[45vw] p-10 flex flex-col justify-center">
        <div className="mb-6">
          <h3 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create an account
          </h3>
          <p className="text-sm text-gray-600">
            Please fill in the details below to create an account.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
            />

            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email"
              type="email"
              placeholder="Enter your email"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <Input
              value={adminAccessToken}
              onChange={({ target }) => setAdminAccessToken(target.value)}
              label="Admin Access Token (Only for admin)"
              type="number"
              placeholder="Enter admin access token"
            />
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          <button type="submit" className="btn-primary w-full mt-4">
            Sign Up
          </button>

          <p className="text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-primary hover:underline cursor-pointer"
              onClick={() => setCurrentPage("login")}
            >
              Log In
            </button>
          </p>
        </form>
      </div>
      <div className="hidden md:block">
        <img
          src={AUTH_IMG}
          alt="Login"
          className="h-[520px] w-auto object-cover"
        />
      </div>
    </div>
  );
};

export default SignUp;
