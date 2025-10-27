import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import BlogLandingPage from "./pages/Blog/BlogLandingPage";
import BlogpostView from "./pages/Blog/BlogpostView";
import PostByTags from "./pages/Blog/PostByTags";
import SearchPosts from "./pages/Blog/SearchPosts";
import AdminLogin from "./pages/Admin/AdminLogin";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<BlogLandingPage />} />
          <Route path="/:slug" element={<BlogpostView />} />
          <Route path="/tag/:tagName" element={<PostByTags />} />
          <Route path="/search" element={<SearchPosts />} />

          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
