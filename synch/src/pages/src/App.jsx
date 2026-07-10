import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ViewProfile from "./pages/ViewProfile";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CreateProject from "./pages/CreateProject";
import JoinProject from "./pages/JoinProject";
import Project from "./pages/Project";
import MyProjects from "./pages/MyProjects";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
       <Route path="/" element={<Landing />} />
<Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/profile/:id" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />

        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/create-project" element={<ProtectedRoute><CreateProject /></ProtectedRoute>} />
<Route path="/join-project" element={<ProtectedRoute><JoinProject /></ProtectedRoute>} />
<Route path="/project/:id" element={<ProtectedRoute><Project /></ProtectedRoute>} />
<Route path="/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
