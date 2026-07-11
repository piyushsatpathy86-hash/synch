import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-purple/10 blur-3xl" />

      <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-200/60 p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-orange mb-2 text-center">
          About Synch
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-navy text-center mb-3">
          Built by students, for students
        </h1>
        <p className="text-gray-mid text-[15px] leading-relaxed text-center mb-8">
          Synch helps you find teammates by skill, share study resources, and
          manage projects with your team — all in one place, free forever.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8">
          <p className="text-xs text-amber-800 leading-relaxed text-center">
            <span className="font-bold">🚧 Synch is under active development.</span>{" "}
            Some features may change or be temporarily unavailable — thanks for
            bearing with us!
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <p className="text-xs font-semibold text-gray-mid uppercase tracking-wide mb-4 text-center">
            Get in touch
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:synch926@gmail.com"
              className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-orange hover:bg-orange-light transition-all"
            >
              <span className="w-9 h-9 rounded-full bg-orange/10 flex items-center justify-center text-orange text-lg">
                ✉️
              </span>
              <div>
                <p className="text-xs text-gray-mid">Email us</p>
                <p className="text-sm font-semibold text-navy">synch926@gmail.com</p>
              </div>
            </a>

            <a
              href="https://instagram.com/synchworks"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 hover:border-orange hover:bg-orange-light transition-all"
            >
              <span className="w-9 h-9 rounded-full bg-orange/10 flex items-center justify-center text-orange text-lg">
                📷
              </span>
              <div>
                <p className="text-xs text-gray-mid">Follow us</p>
                <p className="text-sm font-semibold text-navy">@synchworks</p>
              </div>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-5 text-center">
          <p className="text-xs text-gray-mid tracking-wide">
            Crafted by{" "}
            <span className="font-bold text-navy">Piyush</span>
            {" "}&{" "}
            <span className="font-bold text-navy">Samikshya</span>
          </p>
        </div>

        <p className="text-sm text-gray-mid mt-4 text-center">
          <Link to="/" className="text-orange font-semibold hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}