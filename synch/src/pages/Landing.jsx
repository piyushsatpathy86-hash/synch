import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user]);

  useEffect(() => {
    // Join code generator
    const generateBtn = document.getElementById("jcGenerateBtn");
    const jcCode = document.getElementById("jcCode");
    if (generateBtn && jcCode) {
      generateBtn.addEventListener("click", () => {
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        let code = "GRP-";
        for (let i = 0; i < 3; i++)
          code += chars[Math.floor(Math.random() * chars.length)];
        jcCode.textContent = code;
      });
    }

    // Copy code
    const copyBtn = document.getElementById("jcCopyBtn");
    if (copyBtn && jcCode) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(jcCode.textContent).then(() => {
          copyBtn.textContent = "✓ Copied!";
          setTimeout(() => (copyBtn.textContent = "📋 Copy code"), 1500);
        });
      });
    }

    // Drag and drop
    let draggedItem = null;
    function updateProgress() {
      const done = document.getElementById("col-done")?.querySelectorAll(".task-item").length || 0;
      const total = document.querySelectorAll(".task-item").length;
      const pct = total ? Math.round((done / total) * 100) : 0;
      const fill = document.getElementById("pbFill");
      const percent = document.getElementById("pbPercent");
      if (fill) fill.style.width = pct + "%";
      if (percent) percent.textContent = pct + "%";
    }
    document.querySelectorAll(".task-item").forEach((item) => {
      item.addEventListener("dragstart", () => {
        draggedItem = item;
        item.classList.add("dragging");
      });
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        draggedItem = null;
        updateProgress();
      });
    });
    document.querySelectorAll(".task-col").forEach((col) => {
      col.addEventListener("dragover", (e) => {
        e.preventDefault();
        col.classList.add("drag-over");
      });
      col.addEventListener("dragleave", () => col.classList.remove("drag-over"));
      col.addEventListener("drop", (e) => {
        e.preventDefault();
        col.classList.remove("drag-over");
        if (draggedItem) col.appendChild(draggedItem);
      });
    });
    updateProgress();

    // Student data
    const STUDENTS = [
      { name: "Aryan Rao", college: "NIT Rourkela · CSE", skills: ["Design", "Figma"], av: "AR", cls: "a" },
      { name: "Sneha Patel", college: "VIT Vellore · IT", skills: ["Design", "UI/UX"], av: "SP", cls: "b" },
      { name: "Rahul Kumar", college: "SRM Chennai · ECE", skills: ["Design", "Video"], av: "RK", cls: "c" },
      { name: "Devyani Sahu", college: "ITER Bhubaneswar · CSE", skills: ["React", "Figma"], av: "DS", cls: "a" },
      { name: "Rutumbhara Nayak", college: "GITA Bhubaneswar · CSE", skills: ["ML", "React"], av: "RN", cls: "b" },
      { name: "Smruti Ranjan", college: "KIIT Bhubaneswar · CSE", skills: ["Blockchain", "React"], av: "SR", cls: "c" },
      { name: "Rudra Prasad", college: "KIIT Bhubaneswar · IT", skills: ["ML", "Video"], av: "RP", cls: "a" },
      { name: "Ananya Das", college: "IIT Bhubaneswar · CSE", skills: ["UI/UX", "Figma"], av: "AD", cls: "b" },
    ];

    function matches(student, query, activeSkills) {
      const q = query.trim().toLowerCase();
      const queryMatch = !q || student.skills.some((s) => s.toLowerCase().includes(q)) || student.name.toLowerCase().includes(q);
      const chipMatch = activeSkills.length === 0 || activeSkills.some((s) => student.skills.includes(s));
      return queryMatch && chipMatch;
    }

    // Hero search
    const heroInput = document.getElementById("heroSearchInput");
    const heroChips = document.getElementById("heroChips");
    const heroResults = document.getElementById("heroResults");
    const heroCount = document.getElementById("heroCount");
    let heroActiveSkills = ["Design"];

    function renderHeroResults() {
      if (!heroInput || !heroResults || !heroCount) return;
      const q = heroInput.value;
      const list = STUDENTS.filter((s) => matches(s, q, heroActiveSkills)).slice(0, 3);
      heroCount.textContent = `${list.length} student${list.length !== 1 ? "s" : ""} found`;
      heroResults.innerHTML = list.map((s) => `
        <div class="profile-card-mini">
          <div class="avatar av-${s.cls}">${s.av}</div>
          <div class="profile-info">
            <div class="profile-name">${s.name}</div>
            <div class="profile-college">${s.college}</div>
          </div>
          <div class="profile-skills"><span class="skill-dot">${s.skills[0]}</span></div>
          <span class="view-btn">View →</span>
        </div>`).join("") || `<div class="demo-label" style="text-align:center; padding:16px 0;">No matches. Try another skill.</div>`;
      [...(heroChips?.children || [])].forEach((c) =>
        c.classList.toggle("chip-active", heroActiveSkills.includes(c.dataset.skill))
      );
    }

    heroInput?.addEventListener("input", renderHeroResults);
    heroChips?.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      const skill = chip.dataset.skill;
      heroActiveSkills = heroActiveSkills.includes(skill)
        ? heroActiveSkills.filter((s) => s !== skill)
        : [...heroActiveSkills, skill];
      renderHeroResults();
    });
    renderHeroResults();

    // Showcase search
    const showInput = document.getElementById("showcaseSearchInput");
    const showChips = document.getElementById("showcaseChips");
    const showResults = document.getElementById("showcaseResults");
    let showActiveSkills = ["Design"];

    function renderShowResults() {
      if (!showInput || !showResults) return;
      const q = showInput.value;
      const list = STUDENTS.filter((s) => matches(s, q, showActiveSkills));
      showResults.innerHTML = list.map((s) => `
        <div class="result-card">
          <div class="av-big av-big-${s.cls}">${s.av}</div>
          <div>
            <div class="rc-name">${s.name}</div>
            <div class="rc-college">${s.college}</div>
            <div class="rc-skills">${s.skills.map((sk) => `<span class="rc-skill">${sk}</span>`).join("")}</div>
          </div>
          <div class="rc-btn">View profile</div>
        </div>`).join("") || `<p style="color:var(--gray-mid); font-size:14px; padding:20px 0;">No students match that search yet.</p>`;
      [...(showChips?.children || [])].forEach((c) => {
        c.classList.toggle("fc-active", showActiveSkills.includes(c.dataset.skill));
        c.classList.toggle("fc-inactive", !showActiveSkills.includes(c.dataset.skill));
      });
    }

    showInput?.addEventListener("input", renderShowResults);
    showChips?.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;
      const skill = chip.dataset.skill;
      showActiveSkills = showActiveSkills.includes(skill)
        ? showActiveSkills.filter((s) => s !== skill)
        : [...showActiveSkills, skill];
      renderShowResults();
    });
    renderShowResults();

    // Resource search
    const resourceInput = document.getElementById("resourceSearchInput");
    const resourceCards = [...document.querySelectorAll("#resourceGrid .resource-card")];
    const resourceEmpty = document.getElementById("resourceEmpty");
    resourceInput?.addEventListener("input", () => {
      const q = resourceInput.value.trim().toLowerCase();
      let visible = 0;
      resourceCards.forEach((card) => {
        const match = card.dataset.tag.toLowerCase().includes(q) || card.dataset.title.toLowerCase().includes(q);
        card.style.display = match ? "" : "none";
        if (match) visible++;
      });
      if (resourceEmpty) resourceEmpty.style.display = visible === 0 ? "block" : "none";
    });

    // Signup modal
    const overlay = document.getElementById("signupOverlay");
    const openBtns = [document.getElementById("openSignupBtn"), document.querySelector(".nav-cta")];
    openBtns.forEach((btn) =>
      btn?.addEventListener("click", (e) => {
        e.preventDefault();
        overlay?.classList.add("open");
        document.getElementById("signupFormWrap").style.display = "block";
        document.getElementById("signupSuccessWrap").style.display = "none";
        document.getElementById("signupForm").reset();
        document.getElementById("signupError").textContent = "";
      })
    );
    document.getElementById("closeSignupBtn")?.addEventListener("click", () => overlay?.classList.remove("open"));
    overlay?.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });

    document.getElementById("signupForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("signupName").value.trim();
      const email = document.getElementById("signupEmail").value.trim();
      const errorEl = document.getElementById("signupError");
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        errorEl.textContent = "Enter a valid email address.";
        return;
      }
      errorEl.textContent = "";
      document.getElementById("signupFormWrap").style.display = "none";
      document.getElementById("signupSuccessWrap").style.display = "block";
      document.getElementById("successName").textContent = name.split(" ")[0];
      document.getElementById("successCount").textContent = "#201";
    });

    document.getElementById("signupDoneBtn")?.addEventListener("click", () => overlay?.classList.remove("open"));
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --orange: #FF4A00; --orange-lt: #FFF0EB; --orange-dk: #CC3A00;
          --navy: #0D0D1A; --navy-mid: #1A1A2E; --navy-lt: #252540;
          --white: #FFFFFF; --gray-bg: #F7F7F8; --gray-bdr: #E5E5E8;
          --gray-mid: #888899; --gray-dark: #2C2C3A;
          --purple: #534AB7; --purple-lt: #EEEDFE;
          --teal: #0F6E56; --teal-lt: #E1F5EE;
          --font: 'Inter', system-ui, sans-serif;
          --radius: 10px; --radius-lg: 16px;
        }
        html { scroll-behavior: smooth; }
        body { font-family: var(--font); background: var(--white); color: var(--gray-dark); }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 60px; background: rgba(13,13,26,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.07); }
        .nav-logo { font-size: 20px; font-weight: 800; color: var(--white); letter-spacing: -0.5px; }
        .nav-logo span { color: var(--orange); }
        .nav-links { display: flex; gap: 28px; align-items: center; }
        .nav-links a { color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 500; text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--white); }
        .nav-cta { background: var(--orange); color: var(--white); font-size: 14px; font-weight: 600; padding: 8px 20px; border-radius: 8px; text-decoration: none; transition: background 0.2s, transform 0.15s; }
        .nav-cta:hover { background: var(--orange-dk); transform: translateY(-1px); }
        .hero { background: var(--navy); min-height: 100vh; display: flex; align-items: center; padding: 120px 48px 80px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -200px; right: -100px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,74,0,0.12) 0%, transparent 70%); pointer-events: none; }
        .hero::after { content: ''; position: absolute; bottom: -150px; left: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(83,74,183,0.1) 0%, transparent 70%); pointer-events: none; }
        .hero-inner { max-width: 1100px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 420px; gap: 64px; align-items: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,74,0,0.12); border: 1px solid rgba(255,74,0,0.25); color: var(--orange); font-size: 12px; font-weight: 600; letter-spacing: 0.05em; padding: 5px 12px; border-radius: 20px; margin-bottom: 24px; }
        .hero-badge::before { content: '●'; font-size: 8px; }
        .hero h1 { font-size: 58px; font-weight: 900; color: var(--white); line-height: 1.05; letter-spacing: -2px; margin-bottom: 20px; }
        .hero h1 em { color: var(--orange); font-style: normal; }
        .hero-sub { font-size: 18px; color: rgba(255,255,255,0.55); line-height: 1.6; max-width: 460px; margin-bottom: 36px; font-weight: 400; }
        .hero-actions { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
        .btn-primary { background: var(--orange); color: var(--white); font-size: 15px; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s, transform 0.15s; display: inline-block; }
        .btn-primary:hover { background: var(--orange-dk); transform: translateY(-2px); }
        .btn-ghost { background: transparent; color: rgba(255,255,255,0.7); font-size: 15px; font-weight: 500; padding: 14px 24px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15); text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .btn-ghost:hover { color: var(--white); border-color: rgba(255,255,255,0.35); }
        .hero-note { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 14px; }
        .demo-card { background: var(--navy-mid); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-lg); padding: 20px; position: relative; z-index: 1; }
        .demo-search { display: flex; align-items: center; gap: 10px; background: var(--navy-lt); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; }
        .demo-search input { background: none; border: none; outline: none; color: var(--white); font-size: 14px; font-family: var(--font); width: 100%; }
        .demo-search input::placeholder { color: rgba(255,255,255,0.3); }
        .skill-chips { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
        .chip { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px; cursor: pointer; }
        .chip-purple { background: var(--purple-lt); color: var(--purple); }
        .chip-teal { background: var(--teal-lt); color: var(--teal); }
        .chip-orange { background: rgba(255,74,0,0.15); color: var(--orange); border: 1px solid rgba(255,74,0,0.3); }
        .demo-label { font-size: 11px; color: var(--gray-mid); font-weight: 500; margin-bottom: 10px; letter-spacing: 0.04em; text-transform: uppercase; }
        .profile-card-mini { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px 12px; margin-bottom: 8px; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
        .profile-card-mini:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,74,0,0.3); }
        .avatar { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .av-a { background: linear-gradient(135deg, #534AB7, #7B72E8); color: white; }
        .av-b { background: linear-gradient(135deg, #0F6E56, #22C98A); color: white; }
        .av-c { background: linear-gradient(135deg, #FF4A00, #FF8A5C); color: white; }
        .profile-info { flex: 1; min-width: 0; }
        .profile-name { font-size: 13px; font-weight: 600; color: var(--white); margin-bottom: 3px; }
        .profile-college { font-size: 11px; color: var(--gray-mid); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .profile-skills { display: flex; gap: 4px; flex-shrink: 0; }
        .skill-dot { font-size: 10px; font-weight: 600; padding: 2px 7px; border-radius: 10px; background: var(--purple-lt); color: var(--purple); }
        .view-btn { font-size: 11px; font-weight: 600; color: var(--orange); text-decoration: none; flex-shrink: 0; }
        .stats-strip { background: var(--gray-bg); border-top: 1px solid var(--gray-bdr); border-bottom: 1px solid var(--gray-bdr); padding: 28px 48px; }
        .stats-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-around; align-items: center; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 30px; font-weight: 800; color: var(--orange); letter-spacing: -1px; }
        .stat-label { font-size: 13px; color: var(--gray-mid); margin-top: 2px; font-weight: 500; }
        .stat-div { width: 1px; height: 40px; background: var(--gray-bdr); }
        section { padding: 96px 48px; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--orange); margin-bottom: 12px; }
        .section-title { font-size: 40px; font-weight: 800; letter-spacing: -1.5px; color: var(--gray-dark); line-height: 1.1; margin-bottom: 16px; }
        .section-sub { font-size: 17px; color: var(--gray-mid); line-height: 1.6; max-width: 520px; }
        .how-bg { background: var(--navy); }
        .how-bg .section-title { color: var(--white); }
        .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; margin-top: 56px; position: relative; }
        .steps-grid::before { content: ''; position: absolute; top: 28px; left: calc(12.5% + 12px); right: calc(12.5% + 12px); height: 1px; background: rgba(255,74,0,0.25); pointer-events: none; z-index: 0; }
        .step { padding: 0 20px; text-align: center; position: relative; z-index: 1; }
        .step-num { width: 56px; height: 56px; border-radius: 50%; background: var(--navy-mid); border: 2px solid rgba(255,74,0,0.4); color: var(--orange); font-size: 18px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .step-title { font-size: 15px; font-weight: 700; color: var(--white); margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: rgba(255,255,255,0.45); line-height: 1.6; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; }
        .feature-card { border: 1px solid var(--gray-bdr); border-radius: var(--radius-lg); padding: 28px; transition: box-shadow 0.2s, border-color 0.2s, transform 0.2s; }
        .feature-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); border-color: var(--orange); transform: translateY(-3px); }
        .feature-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
        .fi-orange { background: rgba(255,74,0,0.1); }
        .fi-purple { background: var(--purple-lt); }
        .fi-teal { background: var(--teal-lt); }
        .feature-title { font-size: 16px; font-weight: 700; color: var(--gray-dark); margin-bottom: 8px; }
        .feature-desc { font-size: 14px; color: var(--gray-mid); line-height: 1.6; }
        .search-section { background: var(--gray-bg); }
        .search-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .search-demo-big { background: var(--white); border: 1px solid var(--gray-bdr); border-radius: var(--radius-lg); padding: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
        .search-bar-big { display: flex; align-items: center; gap: 10px; border: 1.5px solid var(--orange); border-radius: 8px; padding: 12px 16px; margin-bottom: 16px; }
        .search-bar-big input { background: none; border: none; outline: none; width: 100%; font-family: var(--font); font-size: 14px; color: var(--gray-dark); }
        .filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 20px; }
        .filter-chip { font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 20px; cursor: pointer; }
        .fc-active { background: var(--orange); color: var(--white); }
        .fc-inactive { background: var(--gray-bg); color: var(--gray-mid); border: 1px solid var(--gray-bdr); }
        .result-card { display: flex; align-items: center; gap: 14px; padding: 14px; border: 1px solid var(--gray-bdr); border-radius: 10px; margin-bottom: 10px; transition: border-color 0.15s; }
        .result-card:hover { border-color: var(--orange); }
        .av-big { width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; flex-shrink: 0; }
        .av-big-a { background: linear-gradient(135deg, #534AB7, #7B72E8); color: white; }
        .av-big-b { background: linear-gradient(135deg, #0F6E56, #22C98A); color: white; }
        .av-big-c { background: linear-gradient(135deg, #FF4A00, #FF8A5C); color: white; }
        .rc-name { font-size: 14px; font-weight: 700; color: var(--gray-dark); }
        .rc-college { font-size: 12px; color: var(--gray-mid); margin-top: 2px; }
        .rc-skills { display: flex; gap: 5px; margin-top: 6px; flex-wrap: wrap; }
        .rc-skill { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 10px; background: var(--purple-lt); color: var(--purple); }
        .rc-btn { margin-left: auto; font-size: 12px; font-weight: 600; color: var(--orange); background: rgba(255,74,0,0.08); border: 1px solid rgba(255,74,0,0.2); padding: 6px 14px; border-radius: 6px; cursor: pointer; white-space: nowrap; flex-shrink: 0; }
        .library-section { background: var(--navy); }
        .library-section .section-title { color: var(--white); }
        .library-section .section-sub { color: rgba(255,255,255,0.45); }
        .resource-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 48px; }
        .resource-card { background: var(--navy-mid); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius); padding: 18px; transition: border-color 0.2s, transform 0.2s; }
        .resource-card:hover { border-color: rgba(255,74,0,0.4); transform: translateY(-2px); }
        .resource-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--orange); margin-bottom: 10px; }
        .resource-title { font-size: 14px; font-weight: 600; color: var(--white); margin-bottom: 6px; line-height: 1.4; }
        .resource-meta { font-size: 11px; color: rgba(255,255,255,0.3); }
        .resource-dl { margin-top: 14px; font-size: 12px; font-weight: 600; color: var(--orange); cursor: pointer; }
        .resource-search-bar { display: flex; align-items: center; gap: 10px; background: var(--gray-bg); border: 1px solid var(--gray-bdr); border-radius: 10px; padding: 12px 16px; margin-top: 32px; max-width: 480px; }
        .resource-search-bar input { background: none; border: none; outline: none; width: 100%; font-family: var(--font); font-size: 14px; color: var(--gray-dark); }
        .joincode-section { background: var(--gray-bg); }
        .joincode-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .jc-demo { background: var(--white); border: 1px solid var(--gray-bdr); border-radius: var(--radius-lg); padding: 28px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); text-align: center; }
        .jc-label { font-size: 12px; color: var(--gray-mid); font-weight: 500; margin-bottom: 12px; }
        .jc-code { font-size: 36px; font-weight: 900; letter-spacing: 6px; color: var(--gray-dark); background: var(--gray-bg); border: 2px dashed var(--gray-bdr); border-radius: 10px; padding: 16px 24px; margin-bottom: 16px; font-family: 'Courier New', monospace; }
        .jc-copy { font-size: 13px; font-weight: 600; color: var(--orange); cursor: pointer; margin-bottom: 20px; }
        .jc-members { display: flex; gap: 0; justify-content: center; align-items: center; margin-bottom: 8px; }
        .jc-av { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--white); font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
        .jc-av + .jc-av { margin-left: -8px; }
        .jc-a { background: linear-gradient(135deg, #534AB7, #7B72E8); color: white; }
        .jc-b { background: linear-gradient(135deg, #0F6E56, #22C98A); color: white; }
        .jc-c { background: linear-gradient(135deg, #FF4A00, #FF8A5C); color: white; }
        .jc-memberlabel { font-size: 12px; color: var(--gray-mid); }
        .task-section { background: var(--white); }
        .task-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        .task-board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .task-col { background: var(--gray-bg); border-radius: var(--radius); padding: 14px; }
        .col-header { font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--gray-mid); margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
        .col-dot { width: 6px; height: 6px; border-radius: 50%; }
        .cd-todo { background: var(--gray-mid); }
        .cd-prog { background: var(--orange); }
        .cd-done { background: var(--teal); }
        .task-item { background: var(--white); border: 1px solid var(--gray-bdr); border-radius: 7px; padding: 10px; margin-bottom: 8px; cursor: grab; }
        .task-item.dragging { opacity: 0.4; }
        .task-col.drag-over { background: var(--purple-lt); }
        .task-name { font-size: 12px; font-weight: 600; color: var(--gray-dark); margin-bottom: 6px; line-height: 1.3; }
        .task-assignee { display: flex; align-items: center; gap: 5px; }
        .ta-av { width: 18px; height: 18px; border-radius: 50%; font-size: 8px; font-weight: 700; display: flex; align-items: center; justify-content: center; color: white; }
        .ta-a { background: linear-gradient(135deg, #534AB7, #7B72E8); }
        .ta-b { background: linear-gradient(135deg, #0F6E56, #22C98A); }
        .ta-c { background: linear-gradient(135deg, #FF4A00, #FF8A5C); }
        .ta-name { font-size: 10px; color: var(--gray-mid); }
        .progress-bar-wrap { background: var(--gray-bg); border-radius: var(--radius); padding: 16px; margin-top: 12px; grid-column: 1 / -1; }
        .pb-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--gray-mid); margin-bottom: 8px; font-weight: 500; }
        .pb-track { background: var(--gray-bdr); border-radius: 10px; height: 8px; overflow: hidden; }
        .pb-fill { height: 100%; background: linear-gradient(90deg, var(--orange), #FF8A5C); border-radius: 10px; width: 60%; }
        .cta-section { background: var(--orange); padding: 96px 48px; text-align: center; }
        .cta-section h2 { font-size: 44px; font-weight: 900; color: var(--white); letter-spacing: -1.5px; margin-bottom: 16px; line-height: 1.1; }
        .cta-section p { font-size: 18px; color: rgba(255,255,255,0.75); margin-bottom: 36px; }
        .btn-white { background: var(--white); color: var(--orange); font-size: 16px; font-weight: 800; padding: 16px 36px; border-radius: 10px; text-decoration: none; display: inline-block; transition: transform 0.15s, box-shadow 0.15s; border: none; cursor: pointer; }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.15); }
        .cta-note { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 14px; }
        footer { background: var(--navy); padding: 40px 48px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.07); }
        .footer-logo { font-size: 18px; font-weight: 800; color: var(--white); }
        .footer-logo span { color: var(--orange); }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 13px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }
        .modal-overlay { display: none; position: fixed; inset: 0; z-index: 200; background: rgba(13,13,26,0.6); backdrop-filter: blur(4px); align-items: center; justify-content: center; padding: 20px; }
        .modal-overlay.open { display: flex; }
        .modal-box { background: var(--white); border-radius: var(--radius-lg); padding: 32px; max-width: 400px; width: 100%; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
        .modal-close { position: absolute; top: 16px; right: 20px; cursor: pointer; color: var(--gray-mid); font-size: 16px; }
        .modal-title { font-size: 22px; font-weight: 800; color: var(--gray-dark); letter-spacing: -0.5px; margin-bottom: 16px; }
        .modal-label { font-size: 12px; font-weight: 600; color: var(--gray-mid); display: block; margin: 12px 0 6px; }
        .modal-input { width: 100%; padding: 11px 14px; border: 1px solid var(--gray-bdr); border-radius: 8px; font-family: var(--font); font-size: 14px; outline: none; transition: border-color 0.15s; }
        .modal-input:focus { border-color: var(--orange); }
        .modal-error { color: #D92D20; font-size: 12px; margin-top: 10px; min-height: 14px; }
        @media (max-width: 768px) {
          nav { padding: 0 20px; }
          .nav-links a:not(.nav-cta) { display: none; }
          .hero { padding: 100px 20px 60px; }
          .hero-inner { grid-template-columns: 1fr; gap: 40px; }
          .hero h1 { font-size: 38px; }
          .stats-strip { padding: 20px; }
          .stats-inner { gap: 16px; }
          .stat-div { display: none; }
          section { padding: 64px 20px; }
          .steps-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .steps-grid::before { display: none; }
          .features-grid { grid-template-columns: 1fr; }
          .search-layout, .joincode-layout, .task-layout { grid-template-columns: 1fr; gap: 40px; }
          .resource-grid { grid-template-columns: 1fr; }
          .task-board { grid-template-columns: 1fr; }
          .section-title { font-size: 30px; }
          .cta-section h2 { font-size: 30px; }
          footer { flex-direction: column; gap: 20px; text-align: center; }
          .footer-links { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>

      <nav>
        <div className="nav-logo">Syn<span>ch</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#search">Find Skills</a>
          <a href="#library">Resources</a>
          <a href="#signup" className="nav-cta">Get started free</a>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-inner">
          <div>
            <div className="hero-badge">Open to all college students · India</div>
            <h1>Find your<br/><em>perfect</em><br/>teammate.</h1>
            <p className="hero-sub">Search students by skill across any college. Build projects together. No WhatsApp chaos — one place for real collaboration.</p>
            <div className="hero-actions">
              <a href="#signup" className="btn-primary">Start for free</a>
              <a href="#features" className="btn-ghost">See how it works</a>
            </div>
            <p className="hero-note">Free forever · No credit card · Students only</p>
          </div>
          <div className="demo-card">
            <div className="demo-search">
              <span>🔍</span>
              <input type="text" id="heroSearchInput" placeholder="Search a skill…" defaultValue="Design"/>
            </div>
            <div className="skill-chips" id="heroChips">
              <span className="chip chip-orange" data-skill="Design">Design</span>
              <span className="chip chip-purple" data-skill="Figma">Figma</span>
              <span className="chip chip-teal" data-skill="UI/UX">UI/UX</span>
              <span className="chip chip-purple" data-skill="React">React</span>
            </div>
            <div className="demo-label" id="heroCount">3 students found</div>
            <div id="heroResults"></div>
          </div>
        </div>
      </section>

      <div className="stats-strip">
        <div className="stats-inner">
          <div className="stat-item"><div className="stat-num">200+</div><div className="stat-label">Students</div></div>
          <div className="stat-div"></div>
          <div className="stat-item"><div className="stat-num">100+</div><div className="stat-label">Resources downloaded</div></div>
          <div className="stat-div"></div>
          <div className="stat-item"><div className="stat-num">30+</div><div className="stat-label">Active projects</div></div>
          <div className="stat-div"></div>
          <div className="stat-item"><div className="stat-num">₹0</div><div className="stat-label">Cost to use</div></div>
        </div>
      </div>

      <section className="how-bg" id="features">
        <div className="section-inner">
          <div className="eyebrow">How it works</div>
          <div className="section-title">From idea to team in four steps.</div>
          <div className="steps-grid">
            <div className="step"><div className="step-num">1</div><div className="step-title">Sign up free</div><div className="step-desc">Email or Google. 30 seconds. Free forever.</div></div>
            <div className="step"><div className="step-num">2</div><div className="step-title">Build your profile</div><div className="step-desc">Add your skills as tags. Show your contact info.</div></div>
            <div className="step"><div className="step-num">3</div><div className="step-title">Find by skill</div><div className="step-desc">Search "Design" or "React" — see who has it.</div></div>
            <div className="step"><div className="step-num">4</div><div className="step-title">Build together</div><div className="step-desc">Contact them, create a project, ship something.</div></div>
          </div>
        </div>
      </section>

      <section style={{background: "white"}}>
        <div className="section-inner">
          <div className="eyebrow">Features</div>
          <div className="section-title">Everything students need.<br/>Nothing they don't.</div>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-icon fi-purple">🔍</div><div className="feature-title">Skill discovery</div><div className="feature-desc">Search students by skill tag. Filter by multiple skills. Find exactly who you need in seconds.</div></div>
            <div className="feature-card"><div className="feature-icon fi-orange">👤</div><div className="feature-title">Student profiles</div><div className="feature-desc">Your name, college, skills, and how to reach you — all in one place. Discoverable by your whole batch.</div></div>
            <div className="feature-card"><div className="feature-icon fi-teal">📚</div><div className="feature-title">Public resource library</div><div className="feature-desc">Browse notes, checklists, and past papers — no login needed. Upload your own for others to use.</div></div>
            <div className="feature-card"><div className="feature-icon fi-orange">🔗</div><div className="feature-title">Project join codes</div><div className="feature-desc">Create a project, get a 6-char code, share it. Teammates join instantly. No invite link chaos.</div></div>
            <div className="feature-card"><div className="feature-icon fi-purple">✅</div><div className="feature-title">Task board</div><div className="feature-desc">Assign tasks to teammates. Move them To Do → In Progress → Done. See progress at a glance.</div></div>
            <div className="feature-card"><div className="feature-icon fi-teal">💸</div><div className="feature-title">100% free</div><div className="feature-desc">No plans, no paywalls, no credit card. Every feature — free for every student, enjoy.</div></div>
          </div>
        </div>
      </section>

      <section className="search-section" id="search">
        <div className="section-inner">
          <div className="search-layout">
            <div>
              <div className="eyebrow">Skill search</div>
              <div className="section-title">Need a designer?<br/>Find one across<br/>any college.</div>
              <p className="section-sub" style={{marginTop:"16px"}}>Search any skill — Design, React, ML, Video editing, Writing — and see students from any college who have it.</p>
            </div>
            <div className="search-demo-big">
              <div className="search-bar-big"><span>🔍</span><input type="text" id="showcaseSearchInput" defaultValue="Design" placeholder="Search a skill…"/></div>
              <div className="filter-row" id="showcaseChips">
                <span className="filter-chip fc-active" data-skill="Design">Design</span>
                <span className="filter-chip fc-inactive" data-skill="Figma">Figma</span>
                <span className="filter-chip fc-inactive" data-skill="React">React</span>
                <span className="filter-chip fc-inactive" data-skill="ML">ML</span>
                <span className="filter-chip fc-inactive" data-skill="Video">Video</span>
              </div>
              <div id="showcaseResults"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="library-section" id="library">
        <div className="section-inner">
          <div className="eyebrow">Resource library</div>
          <div className="section-title">Free study materials.<br/>No login needed.</div>
          <p className="section-sub" style={{marginTop:"12px"}}>Browse notes, checklists, and past papers — anyone can see them.</p>
          <div className="resource-search-bar">
            <span>🔍</span>
            <input type="text" id="resourceSearchInput" placeholder="Search resources by title or topic…"/>
          </div>
          <div className="resource-grid" id="resourceGrid">
            <div className="resource-card" data-tag="Data Structures" data-title="Complete DSA Cheat Sheet — Trees, Graphs, DP"><div className="resource-tag">Data Structures</div><div className="resource-title">Complete DSA Cheat Sheet — Trees, Graphs, DP</div><div className="resource-meta">Uploaded by Aryan · 4 pages</div><div className="resource-dl">↓ Download PDF</div></div>
            <div className="resource-card" data-tag="GATE Prep" data-title="GATE CS 2024 — Topic-wise Previous Year Questions"><div className="resource-tag">GATE Prep</div><div className="resource-title">GATE CS 2024 — Topic-wise Previous Year Questions</div><div className="resource-meta">Uploaded by Sneha · 12 pages</div><div className="resource-dl">↓ Download PDF</div></div>
            <div className="resource-card" data-tag="OS" data-title="Operating Systems — Process Scheduling Notes"><div className="resource-tag">OS</div><div className="resource-title">Operating Systems — Process Scheduling Notes</div><div className="resource-meta">Uploaded by Admin · 6 pages</div><div className="resource-dl">↓ Download PDF</div></div>
            <div className="resource-card" data-tag="DBMS" data-title="SQL Query Checklist — Joins, Subqueries, Indexes"><div className="resource-tag">DBMS</div><div className="resource-title">SQL Query Checklist — Joins, Subqueries, Indexes</div><div className="resource-meta">Uploaded by Rahul · 3 pages</div><div className="resource-dl">↓ Download PDF</div></div>
            <div className="resource-card" data-tag="Networks" data-title="Computer Networks — OSI Model Quick Reference"><div className="resource-tag">Networks</div><div className="resource-title">Computer Networks — OSI Model Quick Reference</div><div className="resource-meta">Uploaded by Admin · 5 pages</div><div className="resource-dl">↓ Download PDF</div></div>
            <div className="resource-card" data-tag="Web Dev" data-title="React + Supabase Starter Notes — Auth & DB Setup"><div className="resource-tag">Web Dev</div><div className="resource-title">React + Supabase Starter Notes — Auth & DB Setup</div><div className="resource-meta">Uploaded by Aryan · 8 pages</div><div className="resource-dl">↓ Download PDF</div></div>
          </div>
          <div id="resourceEmpty" style={{display:"none", textAlign:"center", color:"var(--gray-mid)", padding:"32px 0", fontSize:"14px"}}>No resources match that search.</div>
        </div>
      </section>

      <section className="joincode-section">
        <div className="section-inner">
          <div className="joincode-layout">
            <div>
              <div className="eyebrow">Projects</div>
              <div className="section-title">One code.<br/>Your whole team<br/>is in.</div>
              <p className="section-sub" style={{marginTop:"16px"}}>Create a project, get a join code, share it in WhatsApp. Track tasks, see who's doing what, ship it together.</p>
            </div>
            <div className="jc-demo">
              <div className="jc-label">Your project join code</div>
              <div className="jc-code" id="jcCode">GRP-XK4</div>
              <div style={{display:"flex", gap:"14px", marginBottom:"20px"}}>
                <div className="jc-copy" id="jcCopyBtn" style={{marginBottom:0}}>📋 Copy code</div>
                <div className="jc-copy" id="jcGenerateBtn" style={{marginBottom:0}}>🔁 Generate new</div>
              </div>
              <div className="jc-members">
                <div className="jc-av jc-a">AR</div>
                <div className="jc-av jc-b">SP</div>
                <div className="jc-av jc-c">RK</div>
              </div>
              <div className="jc-memberlabel" style={{marginTop:"8px"}}>3 members joined</div>
            </div>
          </div>
        </div>
      </section>

      <section className="task-section">
        <div className="section-inner">
          <div className="task-layout">
            <div className="task-board">
              <div className="task-col" id="col-todo" data-col="todo">
                <div className="col-header"><span className="col-dot cd-todo"></span>To Do</div>
                <div className="task-item" draggable="true"><div className="task-name">Design the home page</div><div className="task-assignee"><div className="ta-av ta-a">AR</div><span className="ta-name">Aryan</span></div></div>
                <div className="task-item" draggable="true"><div className="task-name">Write project README</div><div className="task-assignee"><div className="ta-av ta-b">SP</div><span className="ta-name">Sneha</span></div></div>
              </div>
              <div className="task-col" id="col-prog" data-col="prog">
                <div className="col-header"><span className="col-dot cd-prog"></span>In Progress</div>
                <div className="task-item" draggable="true"><div className="task-name">Set up Supabase auth</div><div className="task-assignee"><div className="ta-av ta-c">RK</div><span className="ta-name">Rahul</span></div></div>
                <div className="task-item" draggable="true"><div className="task-name">Build skill search UI</div><div className="task-assignee"><div className="ta-av ta-a">AR</div><span className="ta-name">Aryan</span></div></div>
              </div>
              <div className="task-col" id="col-done" data-col="done">
                <div className="col-header"><span className="col-dot cd-done"></span>Done</div>
                <div className="task-item" draggable="true"><div className="task-name">Create Vite project</div><div className="task-assignee"><div className="ta-av ta-b">SP</div><span className="ta-name">Sneha</span></div></div>
                <div className="task-item" draggable="true"><div className="task-name">Design database schema</div><div className="task-assignee"><div className="ta-av ta-c">RK</div><span className="ta-name">Rahul</span></div></div>
              </div>
              <div className="progress-bar-wrap">
                <div className="pb-label"><span>Project progress</span><span id="pbPercent">60%</span></div>
                <div className="pb-track"><div className="pb-fill" id="pbFill"></div></div>
              </div>
            </div>
            <div>
              <div className="eyebrow">Task board</div>
              <div className="section-title">Everyone knows<br/>what to build next.</div>
              <p className="section-sub" style={{marginTop:"16px"}}>Assign tasks to teammates. Move cards from To Do to Done. Watch the progress bar fill up.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section" id="signup">
        <h2>Ready to find your<br/>next teammate?</h2>
        <p>Join hundreds of students already building on Synch.</p>
        <button className="btn-white" id="openSignupBtn" style={{border:"none", cursor:"pointer"}}>Create your profile — it's free</button>
        <div className="cta-note">No credit card · No premium plans · Just students building things</div>
      </section>

      <div className="modal-overlay" id="signupOverlay">
        <div className="modal-box">
          <div className="modal-close" id="closeSignupBtn">✕</div>
          <div id="signupFormWrap">
            <div className="eyebrow">Get started</div>
            <div className="modal-title">Create your profile</div>
            <form id="signupForm">
              <label className="modal-label">Full name</label>
              <input className="modal-input" type="text" id="signupName" required placeholder="Enter Your Name..."/>
              <label className="modal-label">Email</label>
              <input className="modal-input" type="email" id="signupEmail" required placeholder="Enter Your Email..."/>
              <label className="modal-label">College/University</label>
              <input className="modal-input" type="text" id="signupCollege" required placeholder="Enter Your Institution Name..."/>
              <label className="modal-label">Your top skill</label>
              <input className="modal-input" type="text" id="signupSkill" required placeholder="e.g. React, Design, ML"/>
              <div className="modal-error" id="signupError"></div>
              <button type="submit" className="btn-primary" style={{width:"100%", marginTop:"8px"}}>Create profile</button>
            </form>
          </div>
          <div id="signupSuccessWrap" style={{display:"none", textAlign:"center"}}>
            <div style={{fontSize:"40px", marginBottom:"12px"}}>🎉</div>
            <div className="modal-title">You're in, <span id="successName"></span>!</div>
            <p style={{color:"var(--gray-mid)", fontSize:"14px", margin:"10px 0 20px"}}>You're student <strong id="successCount"></strong> on Synch.</p>
            <button className="btn-primary" id="signupDoneBtn" style={{width:"100%"}}>Done</button>
          </div>
        </div>
      </div>

      <footer>
        <div className="footer-logo">Syn<span>ch</span></div>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#search">Find Skills</a>
          <a href="#library">Resources</a>
          <a href="#signup">Sign up</a>
        </div>
        <div className="footer-copy">Made for students · Enjoy</div>
      </footer>
    </>
  );
}