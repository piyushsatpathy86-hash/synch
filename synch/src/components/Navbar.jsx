import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  const navLinkClass =
    "relative px-1 py-2 text-slate-300 hover:text-white transition-colors after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-orange hover:after:w-full after:transition-all after:duration-300";

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-8 h-16 bg-navy text-white shadow-lg shadow-black/20">
      <Link
        to="/"
        className="font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity"
      >
        Syn<span className="text-orange">ch</span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
        <Link to="/" className={navLinkClass}>
          Resources
        </Link>
        <Link to="/search" className={navLinkClass}>
          Find Teammates
        </Link>

        {user ? (
          <>
            <Link to="/upload" className={navLinkClass}>
              Upload
            </Link>
            <Link to="/my-projects" className={navLinkClass}>
              My Projects
            </Link>
            <Link to="/profile" className={navLinkClass}>
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-orange font-semibold hover:brightness-110 active:scale-95 transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={navLinkClass}>
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-orange px-4 py-1.5 rounded-lg font-semibold shadow-md shadow-orange/20 hover:brightness-110 hover:scale-[1.03] active:scale-95 transition-all duration-150"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}