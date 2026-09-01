import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Upload from './pages/Upload'
import MyProjects from './pages/MyProjects'
import CreateProject from './pages/CreateProject'
import JoinProject from './pages/JoinProject'
import Project from './pages/Project'
import ViewProfile from './pages/ViewProfile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/my-projects" element={<MyProjects />} />
        <Route path="/create-project" element={<CreateProject />} />
        <Route path="/join-project" element={<JoinProject />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/view-profile/:id" element={<ViewProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
