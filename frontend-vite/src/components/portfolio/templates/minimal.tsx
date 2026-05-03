"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { getViewStats } from "@/services/analytics";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  X,
  Code2,
  Terminal,
  Cpu,
  Database,
  Layout,
  Server,
  Smartphone,
  Cloud,
  Layers,
  Package,
  ExternalLink,
  User,
  FileText,
  Zap,
  Wind,
  Command,
  Hexagon,
  Award,
  BookOpen,
  Trophy,
  Coffee,
  Box,
  FileCode,
  FileJson,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import type { Portfolio, BlogData } from "@/types/schema";
import { cn } from "@/lib/utils";
import { ActivityCalendar } from "react-activity-calendar";
import Marquee from "react-fast-marquee";
import FloatingThemeToggle from "@/components/ui/FloatingThemeToggle";
import EarthBanner from "@/components/ui/earth-banner";
import StarBackground from "@/components/ui/star-background";
import ResumeDownload from "@/components/resume/ResumeDownload";
import SkillsMatrix from "@/components/skills/SkillsMatrix";
import TestimonialCarousel from "@/components/testimonials/TestimonialCarousel";
import FlowDiagram from "@/components/ui/FlowDiagram";

const TimelineScrollAnimation = ({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scrollY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Map scroll progress to line height and dot position
  const height = useTransform(scrollY, [0, 1], ["0%", "100%"]);

  return (
    <>
      <motion.div
        style={{ height }}
        className="absolute left-[39px] md:left-[49px] top-0 w-px bg-gradient-to-b from-[#3b82f6] via-[#a855f7] to-[#f97316] z-0 opacity-50"
      />
      <motion.div
        style={{ top: height }}
        className="absolute left-[39px] md:left-[49px] h-2 w-2 rounded-full bg-white shadow-[0_0_10px_white] z-20 -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
};

interface PortfolioTemplateProps {
  portfolio: Partial<Portfolio>;
  isPreview?: boolean;
  isLoggedIn?: boolean;
}

// --- Icon & Color Mapping for Skills ---
const TechStackMap: Record<string, { icon: any; color: string }> = {
  react: { icon: Code2, color: "#61DAFB" },
  nextjs: { icon: Zap, color: "#FFFFFF" },
  typescript: { icon: FileCode, color: "#3178C6" },
  javascript: { icon: FileJson, color: "#F7DF1E" },
  node: { icon: Server, color: "#339933" },
  python: { icon: Terminal, color: "#3776AB" },
  tailwind: { icon: Wind, color: "#06B6D4" },
  css: { icon: Layout, color: "#1572B6" },
  html: { icon: Layout, color: "#E34F26" },
  git: { icon: Github, color: "#F05032" },
  docker: { icon: Box, color: "#2496ED" },
  aws: { icon: Cloud, color: "#FF9900" },
  firebase: { icon: Database, color: "#FFCA28" },
  mongodb: { icon: Database, color: "#47A248" },
  postgres: { icon: Database, color: "#4169E1" },
  postgresql: { icon: Database, color: "#4169E1" },
  supabase: { icon: Database, color: "#3ECF8E" },
  graphql: { icon: Hexagon, color: "#E10098" },
  prisma: { icon: Database, color: "#2D3748" },
  flutter: { icon: Smartphone, color: "#02569B" },
  swift: { icon: Smartphone, color: "#F05138" },
  kotlin: { icon: Smartphone, color: "#0095D5" },
  rust: { icon: Command, color: "#DEA584" },
  go: { icon: Terminal, color: "#00ADD8" },
  solid: { icon: Code2, color: "#2C4F7C" },
  vue: { icon: Code2, color: "#4FC08D" },
  angular: { icon: Code2, color: "#DD0031" },
};

const getSkillStyle = (skill: string) => {
  const normalizedSkill = skill.toLowerCase().trim();

  // Local Icon Mapping (Priority)
  const localIconMap: Record<string, string> = {
    "python": `${import.meta.env.BASE_URL}icons/python.svg`,
    "sql": `${import.meta.env.BASE_URL}icons/sql.svg`,
    "azure": `${import.meta.env.BASE_URL}icons/azure.svg`,
    "databricks": `${import.meta.env.BASE_URL}icons/databricks.svg`,
    "n8n": `${import.meta.env.BASE_URL}icons/n8n.svg`,
    "langchain": `${import.meta.env.BASE_URL}icons/langchain.svg`,
    "langgraph": `${import.meta.env.BASE_URL}icons/langchain.svg`,
    "jupyter notebook": `${import.meta.env.BASE_URL}icons/jupyter.svg`,
    "gen ai": `${import.meta.env.BASE_URL}icons/genai.svg`,
    "ai": `${import.meta.env.BASE_URL}icons/genai.svg`,
    "mlops": `${import.meta.env.BASE_URL}icons/mlops.svg`,
    "lmops": `${import.meta.env.BASE_URL}icons/mlops.svg`,
    "rag": `${import.meta.env.BASE_URL}icons/langchain.svg`,
    "microsoft agent framework": `${import.meta.env.BASE_URL}icons/microsoft.svg`,
    "a2a (anything to action)": `${import.meta.env.BASE_URL}icons/genai.svg`,
    "multi agent systems": `${import.meta.env.BASE_URL}icons/genai.svg`
  };

  if (localIconMap[normalizedSkill]) {
    return {
      icon: () => (
        <img
          src={localIconMap[normalizedSkill]}
          alt={skill}
          className="h-16 w-16 transition-transform duration-500 group-hover:scale-110"
        />
      ),
      color: "#FFFFFF"
    };
  }

  // Fallback to skillicons.dev
  const slugMap: Record<string, string> = {
    "next.js": "nextjs",
    "tailwind css": "tailwind",
    "scikit-learn": "sklearn",
    "phidata": "phidata",
    "pytorch": "pytorch",
    "tensorflow": "tensorflow",
    "fastapi": "fastapi",
    "flask": "flask",
    "postgresql": "postgres",
    "mongodb": "mongodb",
    "docker": "docker",
    "git": "git",
    "react": "react",
    "huggingface": "huggingface",
    "transformers": "huggingface",
    "nlp": "ai",
    "machine learning": "sklearn",
    "deep learning": "pytorch"
  };

  const slug = slugMap[normalizedSkill] || normalizedSkill;

  return {
    icon: () => (
      <img
        src={`https://skillicons.dev/icons?i=${slug}`}
        alt={skill}
        className="h-16 w-16 transition-transform duration-500 group-hover:scale-110"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    ),
    color: "#FFFFFF"
  };
};

const AtomIcon = ({ color }: { color: string }) => {
  return (
    <div className="relative flex h-40 w-40 items-center justify-center perspective-[900px]">
      {/* Nucleus */}
      <div className="relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 dark:bg-white shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.8)] animate-pulse">
        <div className="h-full w-full rounded-full bg-linear-to-tr from-inherit to-transparent opacity-80" />
      </div>

      {/* Electron 1 (Horizontalish) */}
      <motion.div
        className="absolute inset-0 z-10 border border-neutral-200 dark:border-white/30 rounded-[50%]"
        style={{ rotateX: 70, rotateY: 10, borderColor: color }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-800 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_white]" />
      </motion.div>

      {/* Electron 2 (Rotated) */}
      <motion.div
        className="absolute inset-0 z-10 border border-neutral-200 dark:border-white/30 rounded-[50%]"
        style={{ rotateX: 70, rotateY: 70, borderColor: color }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-800 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_white]" />
      </motion.div>

      {/* Electron 3 (Rotated opposite) */}
      <motion.div
        className="absolute inset-0 z-10 border border-neutral-200 dark:border-white/30 rounded-[50%]"
        style={{ rotateX: 70, rotateY: -50, borderColor: color }}
        animate={{ rotateZ: 360 }} // Reverse rotation
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
      >
        <div className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-800 dark:bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_10px_white]" />
      </motion.div>

      {/* Glow */}
      <div className="absolute inset-0 bg-neutral-400/5 dark:bg-white/5 blur-3xl rounded-full pointer-events-none" />
    </div>
  );
};

// InteractiveLogo Component
const InteractiveLogo = ({ name }: { name: string }) => {
  const [colors, setColors] = useState<string[]>([]);
  const firstName = name.split(" ")[0] || "Portfolio";

  // Initialize colors
  useEffect(() => {
    setColors(new Array(firstName.length).fill("text-white"));
  }, [firstName]);

  const cycleColor = (index: number) => {
    const palette = [
      "text-blue-500",
      "text-purple-500",
      "text-[#fffdd0]", // Creamish
      "text-[#d4a373]",
      "text-white",
    ];
    setColors((prev) => {
      const newColors = [...prev];
      const currentColor = prev[index];
      const nextIndex = (palette.indexOf(currentColor) + 1) % palette.length;
      newColors[index] = palette[nextIndex === -1 ? 0 : nextIndex];
      return newColors;
    });
  };

  return (
    <div className="flex cursor-pointer select-none">
      <span
        className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl italic"
        style={{ fontFamily: "var(--font-instrument)" }}
      >
        {firstName}
      </span>
      <span
        className="text-2xl font-bold text-[#d4a373] md:text-3xl lg:text-4xl"
        style={{ fontFamily: "var(--font-instrument)" }}
      >
        .
      </span>
    </div>
  );
};

// Heatmap Component with Real API
const RealHeatmap = ({ username }: { username?: string }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract pure username from github url if needed
  const cleanUsername = useMemo(() => {
    if (!username) return null;
    if (username.includes("github.com/")) {
      const parts = username.split("github.com/");
      return parts[1].replace(/\/?$/, ""); // remove trailing slash
    }
    return username;
  }, [username]);

  useEffect(() => {
    if (!cleanUsername) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${cleanUsername}?y=last`,
        );
        const json = await res.json();
        if (json.contributions) {
          // Transform for react-activity-calendar
          // API returns contributions array. react-activity-calendar expects { date, count, level }
          // Actually api returns { date, count, level } already usually or simple structure.
          // The API returns: { total: { ... }, contributions: [ { date: "2023-01-01", count: 0, level: 0 }, ... ] }
          // We need to ensure types match.
          setData(json.contributions);
        }
      } catch (e) {
        console.error("Failed to fetch GitHub data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [cleanUsername]);

  if (!cleanUsername) {
    // Fallback visual if no username
    return (
      <div className="rounded-xl border border-white/5 bg-[#0a0a0a] p-8 text-center text-neutral-500">
        No GitHub username linked.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#0a0a0a] p-6 lg:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="h-5 w-5 text-white" />
          <h3 className="font-sans text-sm font-medium text-neutral-200">
            @{cleanUsername}
          </h3>
        </div>
        <span className="text-xs text-neutral-500">Last Year Activity</span>
      </div>

      <div className="flex w-full justify-center overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:thin-scrollbar">
        {loading ? (
          <div className="flex h-[108px] w-full items-center justify-center text-sm text-neutral-600 animate-pulse">
            Loading contributions...
          </div>
        ) : data.length > 0 ? (
          <ActivityCalendar
            data={data}
            theme={{
              light: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
              dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
            }}
            blockSize={15}
            blockRadius={3}
            blockMargin={4}
            fontSize={14}
            style={{ color: "#fff" }}
          />
        ) : (
          <div className="text-sm text-neutral-600">
            No public contribution data found.
          </div>
        )}
      </div>
    </motion.div>
  );
};

const defaultSkills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "TailwindCSS",
  "PostgreSQL",
  "Prisma",
  "Figma",
  "Docker",
];

const CoolProjectPlaceholder = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-200 dark:bg-[#0a0a0a] transition-colors duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-100 dark:from-[#0a0a0a] dark:via-[#0d0d0d] dark:to-[#111]" />
    {/* 3D Icon Simulation */}
    <div className="relative z-10 transform transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <Package
          className="h-24 w-24 text-neutral-400 dark:text-neutral-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          strokeWidth={1.5}
        />
        {/* Highlight */}
        <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-[#d4a373]/20 blur-xl" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 dark:from-white/10 to-transparent opacity-30" />
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-200/90 dark:from-black/80 via-transparent to-transparent" />
  </div>
);

const CoolBlogPlaceholder = () => (
  <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-neutral-200 dark:bg-[#0a0a0a] transition-colors duration-300">
    <div className="absolute inset-0 bg-gradient-to-br from-neutral-300 via-neutral-200 to-neutral-100 dark:from-[#0a0a0a] dark:via-[#0d0d0d] dark:to-[#111]" />
    {/* 3D Icon Simulation */}
    <div className="relative z-10 transform transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <FileText
          className="h-20 w-20 text-neutral-400 dark:text-neutral-700 drop-shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          strokeWidth={1.5}
        />
        {/* Highlight */}
        <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-[#d4a373]/20 blur-xl" />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 dark:from-white/10 to-transparent opacity-30" />
      </div>
    </div>

    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-200/90 dark:from-black/80 via-transparent to-transparent" />
  </div>
);

export function PortfolioTemplate({
  portfolio,
  isPreview = false,
  isLoggedIn = false,
}: PortfolioTemplateProps) {
  const {
    fullName = "Your Name",
    title = "Creative Developer",
    tagline,
    bio,
    skills: rawSkills,
    projects: rawProjects,
    experience: rawExperience,
    socialLinks: rawSocialLinks,
    profileImage,
    blogs: rawBlogs,
    education: rawEducation,
    positionsOfResponsibility: rawResponsibilities,
    funFacts: rawFunFacts,
    linkedinPosts: rawLinkedinPosts,
  } = portfolio;

  const skills = rawSkills ?? [];
  const projects = rawProjects ?? [];
  const experience = rawExperience ?? [];
  const socialLinks = rawSocialLinks ?? {};
  const blogs = rawBlogs ?? [];
  const education = rawEducation ?? [];
  const positionsOfResponsibility = rawResponsibilities ?? [];
  const funFacts = rawFunFacts ?? [];
  const linkedinPosts = rawLinkedinPosts ?? [];

  // Split skills for Marquee (Left/Right)
  const half = Math.ceil(skills.length / 2);
  const skillsRow1 = skills.slice(0, half);
  const skillsRow2 = skills.slice(half);

  // Hero Icon Color State
  const [heroIconColor, setHeroIconColor] = useState("#d4a373");

  const experienceContainerRef = useRef<HTMLDivElement>(null);

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Home");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [viewStats, setViewStats] = useState({ total_views: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const stats = await getViewStats();
      setViewStats(stats);
    };
    fetchStats();
  }, []);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection for sticky navbar and floating buttons
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect to re-run LinkedIn badge rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).LIRenderAll) {
      (window as any).LIRenderAll();
    } else {
      // Fallback: re-append script if not loaded or not rendering
      const script = document.createElement("script");
      script.src = "https://platform.linkedin.com/badger-js/badges.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [resolvedTheme]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, message } = formData;
    const recipient = socialLinks.email || "hello@example.com";
    const subject = `Message from ${name} via Portfolio`;
    const body = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`;

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", color: "#3b82f6", anchor: "home" },
    { name: "Work", color: "#d4a373", anchor: "projects" },
    { name: "Skills", color: "#10b981", anchor: "skills" },
    { name: "Experience", color: "#a855f7", anchor: "experience" },
    { name: "Projects", path: "/projects", isExternal: true, color: "#f59e0b" },
    { name: "Blog", path: "/blog", isExternal: true, color: "#f97316" },
    { name: "Contact", color: "#ec4899", anchor: "contact" },
  ];

  const scrollToSection = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-[#050505] text-neutral-900 dark:text-neutral-200 selection:bg-[#d4a37333] selection:text-[#d4a373] font-sans flex flex-col transition-colors duration-300">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (max-width: 1023px) {
          ::-webkit-scrollbar {
            display: none;
          }
          * {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `,
        }}
      />
      {/* Edit Button */}
      {isPreview && (
        <div className="fixed bottom-6 right-6 z-50">
          <RouterLink to={isLoggedIn ? "/dashboard" : "/signup"}>
            <button className="flex items-center gap-2 rounded-full border border-white/10 bg-[#111] px-6 py-3 text-sm font-medium text-white shadow-xl backdrop-blur-md transition-all hover:bg-white hover:text-black">
              {isLoggedIn ? "Edit Portfolio" : "Create Your Own"}
            </button>
          </RouterLink>
        </div>
      )}

      {/* Navbar - Sticky with Glassmorphism on Scroll */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full pt-3 pb-3 transition-all duration-300",
        isScrolled
          ? "bg-background/90 dark:bg-black/90 backdrop-blur-xl shadow-lg border-b border-white/10"
          : "bg-transparent"
      )}>
        <div className="mx-auto flex max-w-[95%] w-full items-center justify-between px-4 md:px-8">
          {/* Logo / Profile */}
          <div
            className="group relative flex cursor-pointer items-center gap-2 md:gap-3"
            onClick={() => setIsProfileCardOpen(true)}
            title="View Profile Card"
          >
            {profileImage && (
              <div className="relative">
                {/* LinkedIn-style 'Open to Work' Label Only */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20">
                  <span className="text-[5px] md:text-[6px] font-bold text-white uppercase tracking-tighter bg-[#057642] px-1.5 py-0.5 rounded-full shadow-lg whitespace-nowrap border border-white/20">
                    Open to Work
                  </span>
                </div>
                <div className="relative h-8 w-8 md:h-10 md:w-10 overflow-hidden rounded-full transition-transform group-hover:scale-110 border border-neutral-200 dark:border-white/10">
                  <img src={profileImage ? `${import.meta.env.BASE_URL}${profileImage.startsWith('/') ? profileImage.slice(1) : profileImage}` : ''} alt={fullName} className="h-full w-full object-cover" />
                </div>
              </div>
            )}
            <span
              className="italic text-lg md:text-2xl font-medium tracking-tight text-neutral-900 dark:text-white"
              style={{ fontFamily: "var(--font-instrument)" }}
            >
              {fullName?.split(" ")[0]}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-10">
            <div className="flex gap-6 lg:gap-10">
              {navItems.map((item: any) => (
                item.isExternal ? (
                  <RouterLink
                    key={item.name}
                    to={item.path}
                    onMouseEnter={() => setHoveredNav(item.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className="text-sm font-light tracking-wide text-neutral-500 dark:text-neutral-400 transition-all duration-300 hover:text-black dark:hover:text-white relative top-[2px]"
                    style={{ color: hoveredNav === item.name || activeNav === item.name ? item.color : undefined }}
                  >
                    {item.name}
                  </RouterLink>
                ) : (
                  <button
                    key={item.name}
                    onClick={() => { setActiveNav(item.name); scrollToSection(item.anchor); }}
                    onMouseEnter={() => setHoveredNav(item.name)}
                    onMouseLeave={() => setHoveredNav(null)}
                    className="text-sm font-light tracking-wide text-neutral-500 dark:text-neutral-400 transition-all duration-300 hover:text-black dark:hover:text-white relative top-[2px] bg-transparent border-none cursor-pointer"
                    style={{ color: hoveredNav === item.name || activeNav === item.name ? item.color : undefined }}
                  >
                    {item.name}
                    {(hoveredNav === item.name || (activeNav === item.name && !hoveredNav)) && (
                      <motion.div layoutId="nav-underline" className="absolute -bottom-2 left-0 right-0 h-px" style={{ backgroundColor: item.color }} />
                    )}
                  </button>
                )
              ))}
            </div>
            <ResumeDownload variant="button" showLabel={true} />
            {mounted && <FloatingThemeToggle />}
          </div>

          {/* Mobile: Resume + Theme + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {mounted && <FloatingThemeToggle />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-white/10 text-neutral-700 dark:text-white"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-background/95 dark:bg-black/95 backdrop-blur-xl border-t border-neutral-200 dark:border-white/10 px-6 py-4 flex flex-col gap-3"
          >
            {navItems.map((item: any) => (
              item.isExternal ? (
                <RouterLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-base font-light py-2 text-neutral-600 dark:text-neutral-300"
                  style={{ color: undefined }}
                >
                  {item.name}
                </RouterLink>
              ) : (
                <button
                  key={item.name}
                  onClick={() => { setActiveNav(item.name); scrollToSection(item.anchor); }}
                  className="text-base font-light py-2 text-neutral-600 dark:text-neutral-300 text-left bg-transparent border-none cursor-pointer"
                >
                  {item.name}
                </button>
              )
            ))}
            <div className="pt-2">
              <ResumeDownload variant="button" showLabel={true} />
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-1 flex-col items-center justify-center text-center overflow-hidden min-h-screen pt-20"
      >
        {/* Cinematic Starry Background */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-100 transition-opacity duration-1000">
          <StarBackground />
        </div>
        {/* Radial Gradient & Concentric Circles - Increased Visibility & Range */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Background Gradients - Light/Dark Galaxy feel */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,163,115,0.08)_0%,rgba(255,255,255,0)_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_70%)]" />

          {/* Subtle Nebula Effect for Light Mode */}
          <div className="absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#d4a373]/5 blur-[120px] dark:hidden" />
          <div className="absolute bottom-1/2 right-1/4 h-[400px] w-[400px] translate-y-1/2 rounded-full bg-[#3b82f6]/5 blur-[120px] dark:hidden" />

          {/* Floating Earth Planet - Premium Decorative Element */}
          <div className="absolute top-[15%] left-[5%] md:left-[10%] scale-[0.4] md:scale-[0.6] opacity-30 dark:opacity-40 animate-pulse-slow">
            <EarthBanner />
          </div>

          {/* Optional: Second smaller planet for depth */}
          <div className="absolute bottom-[20%] right-[10%] scale-[0.2] md:scale-[0.3] opacity-20 dark:opacity-30 blur-[1px]">
            <EarthBanner />
          </div>

          {/* Concentric Circles - More visible (opacity increased) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[360px] w-[360px] rounded-full border border-neutral-300 dark:border-white/10 opacity-60 dark:opacity-60" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[540px] w-[540px] rounded-full border border-neutral-300 dark:border-white/10 opacity-40 dark:opacity-40" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[810px] w-[810px] rounded-full border border-neutral-300 dark:border-white/10 opacity-30 dark:opacity-30" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1080px] w-[1080px] rounded-full border border-neutral-300 dark:border-white/10 opacity-20 dark:opacity-20" />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-5xl w-full mx-auto px-6 md:px-10 pb-10">
          {/* Centered Atom Icon */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <AtomIcon color={heroIconColor} />
          </motion.div>

          {/* Name - Ultra Premium Cormorant Garamond Font, Thin/Light */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-neutral-900 dark:text-white mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {fullName}
          </motion.h1>

          {/* LinkedIn Hero Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mb-8 flex justify-center scale-[0.65] md:scale-75 lg:scale-90"
          >
            <div
              className="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="medium"
              data-theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
              data-type="HORIZONTAL"
              data-vanity="abhishek-mane-aiml"
              data-version="v1"
            >
              <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/abhishek-mane-aiml?trk=profile-badge">
                Abhishek Mane
              </a>
            </div>
          </motion.div>

          {/* Title - Light, spaced */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 flex flex-wrap justify-center gap-3 md:gap-4"
          >
            <span className="font-sans text-sm md:text-base font-light uppercase tracking-[0.4em] text-neutral-400">
              {title?.toUpperCase()}
            </span>
          </motion.div>

          {/* Bio - Centered & Limited Width */}
          {(bio || tagline) && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl leading-relaxed text-neutral-600 dark:text-neutral-400 font-light text-center"
            >
              <p>
                {(() => {
                  let content = bio || tagline || "";
                  const highlights = [
                    "production-grade AI systems",
                    "multi-agent platforms",
                    "full-stack AI applications",
                    "Enterprise Client. Performance Awardee"
                  ];
                  
                  // Use a unique marker to prevent nested replacements
                  let parts: (string | React.ReactNode)[] = [content];
                  
                  highlights.forEach(highlight => {
                    let nextParts: (string | React.ReactNode)[] = [];
                    parts.forEach(part => {
                      if (typeof part !== 'string') {
                        nextParts.push(part);
                        return;
                      }
                      
                      const split = part.split(highlight);
                      split.forEach((text, i) => {
                        nextParts.push(text);
                        if (i < split.length - 1) {
                          nextParts.push(<span key={highlight + i} className="text-[#d4a373] font-medium">{highlight}</span>);
                        }
                      });
                    });
                    parts = nextParts;
                  });

                  // Handle the Green Bold status separately
                  const statusPhrase = "Open to AI/ML Engineer roles.";
                  let finalParts: (string | React.ReactNode)[] = [];
                  parts.forEach(part => {
                    if (typeof part !== 'string') {
                      finalParts.push(part);
                      return;
                    }
                    const split = part.split(statusPhrase);
                    split.forEach((text, i) => {
                      finalParts.push(text);
                      if (i < split.length - 1) {
                        finalParts.push(
                          <span key="status" className="text-emerald-600 dark:text-emerald-400 font-bold border-b border-emerald-500/30 pb-0.5">
                            {statusPhrase}
                          </span>
                        );
                      }
                    });
                  });

                  return finalParts;
                })()}
              </p>
            </motion.div>
          )}

          {/* Social Icons Row */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex items-center justify-center gap-6"
          >
            {Object.entries(socialLinks).map(([key, value]) => {
              if (!value) return null;
              let Icon = Globe;
              if (key.includes("github")) Icon = Github;
              if (key.includes("linkedin")) Icon = Linkedin;
              if (key.includes("twitter")) Icon = Twitter;
              if (key.includes("email")) Icon = Mail;
              if (key.includes("resume")) Icon = FileText;

              return (
                <a
                  key={key}
                  href={key === "email" ? `mailto:${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-white/5 transition-all hover:bg-neutral-200 dark:hover:bg-white/10 hover:-translate-y-1 shadow-md"
                >
                  <Icon className="h-5 w-5 text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white" />
                  {/* Tooltip */}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 px-2 py-1 text-xs text-neutral-900 dark:text-white opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                </a>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Honors & Awards Section */}
      <section id="awards" className="py-16 md:py-24 bg-background dark:bg-[#050505] transition-colors duration-300 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-[#d4a373]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="mx-auto max-w-6xl w-full px-6 md:px-10 relative z-10">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="mb-4 block font-mono text-sm font-medium uppercase tracking-[0.4em] text-[#d4a373]">
              Recognition
            </span>
            <h2 className="font-sans text-4xl font-light text-neutral-900 dark:text-white md:text-5xl">
              Honors & Awards
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#d4a373]/10 dark:border-white/5 bg-neutral-50/50 dark:bg-[#0e0e0e]/50 p-6 md:p-10 backdrop-blur-xl shadow-2xl group"
          >
            <div className="grid md:grid-cols-[100px_1fr] gap-6 items-start">
              <div className="flex justify-center">
                <div className="h-20 w-20 rounded-2xl bg-[#d4a373]/10 flex items-center justify-center border border-[#d4a373]/20 shadow-[0_0_20px_rgba(212,163,115,0.2)] group-hover:scale-110 transition-transform duration-500">
                  <Trophy className="h-10 w-10 text-[#d4a373]" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium text-neutral-900 dark:text-white mb-2 leading-tight">
                    Performance of the Month Award
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[#d4a373] font-mono text-sm">
                    <span className="px-3 py-1 rounded-full bg-[#d4a373]/10 border border-[#d4a373]/20">December 2025</span>
                    <span className="px-3 py-1 rounded-full bg-[#d4a373]/10 border border-[#d4a373]/20">Recognized</span>
                    <span>•</span>
                    <span className="uppercase tracking-wider">Industry Excellence</span>
                  </div>
                </div>

                <p className="text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed italic text-balance">
                  "Honored to share that I’ve received this recognition for designing and delivering AI-driven solutions for a Leading Renewable Energy Firm, appreciated by the Executive Chairman and leadership across the organization."
                </p>

                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Organization</span>
                    <span className="text-neutral-900 dark:text-white font-medium">Leading Renewable Energy Firm</span>
                  </div>
                  <div className="h-8 w-px bg-neutral-200 dark:bg-white/10 hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-500 uppercase tracking-widest mb-1">Role</span>
                    <span className="text-neutral-900 dark:text-white font-medium">AI Engineer</span>
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href="https://www.linkedin.com/in/abhishek-mane-aiml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-lg font-medium hover:scale-105 transition-all shadow-xl group"
                  >
                    <span>Read full story on LinkedIn</span>
                    <Linkedin className="h-4 w-4 text-[#0077b5]" />
                    <ArrowUpRight className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-3 pt-12 border-t border-neutral-200 dark:border-white/5">
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Package className="h-5 w-5 text-green-500" />
                </div>
                <h4 className="font-medium text-neutral-900 dark:text-white">AI Innovation</h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                  Designed and delivered AI-driven solutions and portals for the firm.
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-purple-500" />
                </div>
                <h4 className="font-medium text-neutral-900 dark:text-white">Leadership Recognition</h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                  Appreciated by the Executive Chairman and leadership.
                </p>
              </div>
              <div className="space-y-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-blue-500" />
                </div>
                <h4 className="font-medium text-neutral-900 dark:text-white">Business Impact</h4>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                  Focused on efficiency and real-world value for organizational goals.
                </p>
              </div>
            </div>

            {/* Gratitude Row */}
            <div className="mt-10 p-6 rounded-3xl bg-[#d4a373]/5 border border-[#d4a373]/10">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#d4a373] mb-4 block">Gratitude</span>
              <div className="flex flex-wrap gap-x-8 gap-y-3">
                {["CognitBotz Solutions", "Leading Renewable Energy Firm", "Executive Chairman", "Mentors & Team"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-[#d4a373]" />
                    <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Featured Insights Grid - Sub-section for more posts */}
          <div className="mt-24">
            <div className="flex flex-col items-center text-center mb-12">
              <span className="mb-4 block font-mono text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400">
                Additional Highlights
              </span>
              <h3 className="text-3xl font-light text-neutral-900 dark:text-white">
                Featured Insights
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  id: "7375985515499716608",
                  title: "Strategic AI Architecture",
                  desc: "Discussion on building scalable AI systems for enterprise-grade performance and reliability.",
                  icon: Cpu,
                  color: "text-blue-500",
                  bg: "bg-blue-500/5",
                },
                {
                  id: "7375631656415752192",
                  title: "Agentic Systems Growth",
                  desc: "Exploring the evolution of autonomous agents and their impact on modern business workflows.",
                  icon: Zap,
                  color: "text-amber-500",
                  bg: "bg-amber-500/5",
                },
                {
                  id: "7367863559533268992",
                  title: "Collaborative Innovation",
                  desc: "Key takeaways from delivering high-impact portals through cross-functional team synergy.",
                  icon: Globe,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/5",
                }
              ].map((post, idx) => (
                <motion.a
                  key={post.id}
                  href={`https://www.linkedin.com/feed/update/urn:li:share:${post.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-3xl border border-neutral-300 dark:border-white/10 bg-white dark:bg-[#0e0e0e] p-6 transition-all hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                >
                  <div className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/5 shadow-sm", post.bg)}>
                    <post.icon className={cn("h-6 w-6", post.color)} />
                  </div>
                  <h4 className="mb-3 text-xl font-medium text-neutral-900 dark:text-white group-hover:text-[#d4a373] transition-colors">
                    {post.title}
                  </h4>
                  <p className="mb-6 text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                    {post.desc}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-wider text-[#d4a373] opacity-0 group-hover:opacity-100 transition-all">
                    Read Post <ArrowUpRight className="h-3 w-3" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-24 bg-background dark:bg-[#080808]/50 transition-colors duration-300">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-xs font-medium uppercase tracking-wider text-[#10b981]">
              Expertise
            </span>
            <h2 className="font-sans text-4xl font-light text-neutral-900 dark:text-white md:text-5xl">
              Skills Matrix
            </h2>
          </div>
          <SkillsMatrix />
        </div>
      </section>



      {/* About Section Removed - Merged into Hero */}

      {/* Heatmap Section */}
      <section className="pb-20 pt-10">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10 overflow-x-auto md:overflow-visible">
          <div className="min-w-[700px] md:min-w-0 origin-left scale-75 md:scale-100 transform transition-transform">
            <RealHeatmap username={socialLinks.github} />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 md:py-24 bg-background/50 dark:bg-[#080808] transition-colors duration-300">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
          <div className="mb-16 text-center">
            <span className="mb-4 block font-mono text-xs font-medium uppercase tracking-wider text-[#d4a373]">
              Selected Work
            </span>
            <h2 className="font-sans text-4xl font-light text-neutral-900 dark:text-white md:text-5xl">
              Featured Projects
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-300 dark:border-white/10 bg-card dark:bg-[#0e0e0e] hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {/* Image Area */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-200 dark:bg-[#0a0a0a]">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : project.flowDiagram ? (
                    <div className="relative aspect-[16/10] flex items-center justify-center bg-black/40 overflow-hidden group-hover:bg-black/60 transition-all duration-500">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                      <div className="scale-[0.4] md:scale-[0.3] origin-center opacity-80 group-hover:opacity-100 transition-opacity w-full h-full">
                        <FlowDiagram
                          nodes={project.flowDiagram.nodes}
                          edges={project.flowDiagram.edges}
                          height="100%"
                          title={project.title}
                        />
                      </div>
                    </div>
                  ) : (
                    <CoolProjectPlaceholder />
                  )}

                  {/* No hover overlay buttons - removed Live Demo and Code buttons */}
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-medium text-neutral-900 dark:text-white">
                      {project.title}
                    </h3>
                    {project.slug && (
                      <RouterLink
                        to={`/projects/${project.slug}`}
                        className="text-xs font-mono uppercase tracking-wider text-[#d4a373] hover:underline"
                      >
                        Details
                      </RouterLink>
                    )}
                  </div>
                  <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-light">
                    {project.description}
                  </p>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono uppercase tracking-wider text-[#d4a373] bg-[#d4a373]/10 border border-[#d4a373]/20 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LinkedIn Posts Section */}
      {linkedinPosts && linkedinPosts.length > 0 && (
        <section id="posts" className="py-16 md:py-24 bg-background dark:bg-[#050505] transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-[#8b5cf6]/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10 relative z-10">
            <div className="mb-10">
              <span className="mb-3 block font-mono text-xs font-medium uppercase tracking-wider text-[#8b5cf6]">
                Insights & Thoughts
              </span>
              <h2 className="font-sans text-3xl md:text-4xl font-light text-neutral-900 dark:text-white">
                LinkedIn Posts
              </h2>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {linkedinPosts.slice(0, 4).map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-300 dark:border-white/10 bg-card dark:bg-[#0e0e0e] hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  {/* Post Image */}
                  {post.image && (
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-[#0a0a0a]">
                      <img
                        src={`${import.meta.env.BASE_URL}${post.image.startsWith('/') ? post.image.slice(1) : post.image}`}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  )}
                  {/* Post Content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="mb-3 flex items-center gap-2">
                      <Linkedin className="h-3 w-3 text-[#0077b5]" />
                      <span className="font-mono text-[10px] text-neutral-500">{post.date}</span>
                    </div>
                    <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-3 leading-snug line-clamp-2 group-hover:text-[#d4a373] transition-colors">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[9px] font-mono uppercase tracking-wider text-[#d4a373] bg-[#d4a373]/10 px-2 py-0.5 rounded border border-[#d4a373]/20">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-[#d4a373] hover:gap-3 transition-all"
                    >
                      Read full insight <ArrowUpRight className="h-3 w-3" />
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experience Section - Single Line & Animated Point */}
      {experience.length > 0 && (
        <section id="experience" className="py-24 relative overflow-hidden transition-colors duration-300">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10 relative">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
              Experience
            </span>

            <div
              className="relative pl-8 md:pl-12"
              ref={experienceContainerRef}
            >
              {/* Continuous Static Line - Hidden on Mobile */}
              <div className="hidden md:block absolute left-[39px] md:left-[49px] top-0 bottom-0 w-px bg-neutral-200 dark:bg-white/10" />

              {/* Animated Scroll Point - Hidden on Mobile */}
              <div className="hidden md:block">
                <TimelineScrollAnimation
                  containerRef={experienceContainerRef}
                />
              </div>

              <div className="space-y-12">
                {experience.map((exp, i) => {
                  const colors = [
                    "border-cyan-400 text-cyan-400",
                    "border-purple-400 text-purple-400",
                    "border-orange-400 text-orange-400",
                    "border-green-400 text-green-400",
                  ];
                  const colorClass = colors[i % colors.length];

                  return (
                    <motion.div
                      key={exp.id}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true, margin: "-50px" }}
                      className="relative grid grid-cols-[1fr] md:grid-cols-[200px_1fr] md:gap-x-12 group"
                    >
                      {/* Timeline Dot (Absolute to line) - Hidden on mobile */}
                      <div className="absolute left-[11px] md:left-[5px] -translate-x-1/2 top-1.5 hidden md:flex items-center justify-center">
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full bg-white dark:bg-[#050505] border-2 z-10 transition-transform duration-300 group-hover:scale-125",
                            colorClass.split(" ")[0],
                          )}
                        />
                      </div>

                      {/* Meta (Date) - Moves to top on mobile */}
                      <div className="mb-2 md:mb-0 md:text-right">
                        <span
                          className={cn(
                            "font-mono text-sm",
                            colorClass.split(" ")[1],
                          )}
                        >
                          {exp.duration}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col">
                        <h3 className="text-2xl text-neutral-900 dark:text-white font-medium mb-1">
                          {exp.position}
                        </h3>
                        <h4 className="text-neutral-700 dark:text-neutral-300 text-base font-light font-sans tracking-wide mb-4">
                          {exp.company}
                        </h4>
                        <p className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed max-w-2xl font-light whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <section id="education" className="py-16 md:py-24 bg-background dark:bg-[#050505] transition-colors duration-300">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
              Education
            </span>
            <div className="grid gap-8 md:grid-cols-2">
              {education.map((edu, i) => (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl border border-neutral-300 dark:border-white/10 bg-card dark:bg-[#0e0e0e] hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 transition-all shadow-lg hover:shadow-xl"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white">{edu.institution}</h3>
                    <span className="text-sm font-mono text-[#d4a373]">{edu.duration}</span>
                  </div>
                  <p className="text-[#d4a373] text-sm font-light mb-2">{edu.degree}</p>
                  {edu.description && (
                    <p className="text-neutral-700 dark:text-neutral-300 text-sm font-light leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Positions of Responsibility Section */}
      {positionsOfResponsibility.length > 0 && (
        <section id="responsibilities" className="py-16 md:py-24 bg-background dark:bg-[#0a0a0a] transition-colors duration-300">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
              Professional Activities
            </span>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {positionsOfResponsibility.map((resp, i) => {
                // Assign a variety of icons based on index or content if possible
                const icons = [Award, Zap, Terminal, Globe, User, BookOpen];
                const Icon = icons[i % icons.length];

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: i * 0.1,
                      ease: [0.23, 1, 0.32, 1]
                    }}
                    viewport={{ once: true }}
                    className="group relative h-full flex flex-col p-8 rounded-3xl border border-neutral-300 dark:border-white/10 bg-card dark:bg-[#0e0e0e] shadow-lg hover:shadow-2xl hover:border-[#d4a373] dark:hover:border-[#d4a373]/50 transition-all duration-500 overflow-hidden"
                  >
                    {/* Decorative Background Element */}
                    <div className="absolute -top-12 -right-12 h-24 w-24 bg-[#d4a373]/5 blur-2xl rounded-full group-hover:bg-[#d4a373]/10 transition-colors duration-500" />

                    <div className="mb-6 relative">
                      <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center border border-neutral-200 dark:border-white/10 group-hover:scale-110 group-hover:bg-[#d4a373]/10 group-hover:border-[#d4a373]/20 transition-all duration-500">
                        <Icon className="h-6 w-6 text-neutral-500 dark:text-neutral-400 group-hover:text-[#d4a373] transition-colors" />
                      </div>
                    </div>

                    <p className="text-neutral-800 dark:text-neutral-200 font-light leading-relaxed text-lg group-hover:text-black dark:group-hover:text-white transition-colors">
                      {resp}
                    </p>

                    {/* Corner Detail */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <ArrowUpRight className="h-4 w-4 text-[#d4a373]" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Fun Facts Section */}
      {funFacts.length > 0 && (
        <section id="fun-facts" className="py-16 md:py-24 bg-background dark:bg-[#050505] transition-colors duration-300">
          <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
              Beyond the Code
            </span>
            <div className="grid gap-6 md:grid-cols-2">
              {funFacts.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-2xl border border-neutral-300 dark:border-white/10 bg-card dark:bg-[#0e0e0e] flex items-center gap-4 shadow-md hover:shadow-lg transition-all"
                >
                  <Zap className="h-5 w-5 text-[#d4a373] shrink-0" />
                  <p className="text-neutral-700 dark:text-neutral-300 font-light italic">{fact}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}



      {/* Blogs Section */}
      {blogs && blogs.length > 0 && (
        <section id="blogs" className="py-16 md:py-24 bg-neutral-50 dark:bg-[#0a0a0a] transition-colors duration-300">
          <div className="mx-auto max-w-5xl w-full px-6 md:px-10">
            <span className="mb-16 block text-center font-mono text-3xl font-light uppercase tracking-[0.2em] text-neutral-900 dark:text-white">
              Writing
            </span>
            <div className="grid gap-12">
              {blogs.map((blog: BlogData) => {
                const isInternal = blog.slug || blog.link.startsWith('/');
                const LinkComponent = (isInternal ? RouterLink : 'a') as any;
                const linkProps = isInternal
                  ? { to: blog.slug ? `/blog/${blog.slug}` : blog.link }
                  : { href: blog.link, target: "_blank", rel: "noopener noreferrer" };

                return (
                  <LinkComponent
                    key={blog.id}
                    {...linkProps}
                    className="group grid md:grid-cols-[180px_1fr] gap-6 md:gap-10 items-start p-4 -mx-4 rounded-2xl transition-colors hover:bg-neutral-200/50 dark:hover:bg-white/5"
                  >
                    {/* Blog Image */}
                    <div className="aspect-video w-full md:w-[180px] md:h-[126px] overflow-hidden rounded-xl bg-neutral-200 dark:bg-[#0a0a0a] border border-neutral-300 dark:border-white/10 relative shrink-0">
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <CoolBlogPlaceholder />
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="flex flex-col h-full justify-center">
                      <h3 className="text-2xl font-light text-neutral-900 dark:text-white mb-2 group-hover:text-[#d4a373] transition-colors leading-tight">
                        {blog.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-3 text-sm text-neutral-500 font-mono">
                        {blog.date && (
                          <div className="flex items-center gap-1.5">
                            <span>{blog.date}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 font-light leading-relaxed line-clamp-2">
                        {blog.description}
                      </p>
                    </div>
                  </LinkComponent>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section - Redesigned Form, Light */}
      <footer id="contact" className="py-16 md:py-24 bg-background dark:bg-[#080808] border-t border-neutral-200 dark:border-white/5 transition-colors duration-300">
        <div className="mx-auto max-w-6xl w-full px-6 md:px-10">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl font-light text-neutral-900 dark:text-white md:text-5xl mb-6">
              Let's Build Something Together
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed max-w-3xl mx-auto">
              Connect with me on LinkedIn or send a message directly. I'm always open to discussing AI innovations, agentic systems, and collaborative web projects.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center">
            {/* Premium Contact Card - Focused & Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#d4a373]/20 dark:border-white/5 bg-neutral-50/50 dark:bg-[#0e0e0e]/50 p-8 md:p-12 backdrop-blur-2xl shadow-2xl group flex flex-col items-center text-center"
            >
              {/* Subtle Decorative Elements */}
              <div className="absolute -top-24 -right-24 h-48 w-48 bg-[#d4a373]/10 blur-[60px] rounded-full pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-purple-500/5 blur-[60px] rounded-full pointer-events-none" />

              <span className="mb-8 block font-mono text-sm font-medium uppercase tracking-[0.4em] text-[#d4a373]">
                Professional Summary
              </span>

              {/* Integrated Profile Card in Footer */}
              <div className="flex flex-col items-center w-full mb-12">
                <div className="relative mb-6">
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                    <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-[#057642] px-3 py-1 rounded-full shadow-xl whitespace-nowrap border border-white/30">
                      Open to Work
                    </span>
                  </div>
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-[#1a1a1a] shadow-2xl">
                    <img src={profileImage ? `${import.meta.env.BASE_URL}${profileImage.startsWith('/') ? profileImage.slice(1) : profileImage}` : ''} alt={fullName} className="h-full w-full object-cover" />
                  </div>
                </div>
                <h3 className="text-3xl font-serif font-light text-neutral-900 dark:text-white mb-2" style={{ fontFamily: "var(--font-cormorant)" }}>{fullName}</h3>
                <p className="text-sm font-mono uppercase tracking-[0.2em] text-[#d4a373]">{title}</p>
              </div>

              {/* LinkedIn Badge Container - Optional fallback or additional visibility */}
              <div className="flex justify-center w-full min-h-0 mb-4">
                <div className="relative z-20 scale-90">
                  <div
                    className="badge-base LI-profile-badge"
                    data-locale="en_US"
                    data-size="medium"
                    data-theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                    data-type="VERTICAL"
                    data-vanity="abhishek-mane-aiml"
                    data-version="v1"
                  >
                    <a className="badge-base__link LI-simple-link" href="https://in.linkedin.com/in/abhishek-mane-aiml?trk=profile-badge">
                      Abhishek Mane
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-6 max-w-md">
                <h2 className="text-3xl font-medium text-neutral-900 dark:text-white leading-tight">
                  Let's engineer the future together.
                </h2>
                <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                  I'm currently specializing in Generative AI and Agentic Workflows. Reach out for collaborations or deep technical discussions.
                </p>
                <div className="pt-6 flex flex-wrap justify-center gap-6">
                  <a
                    href="mailto:abhishek.mane.work@gmail.com"
                    className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-lg font-bold hover:scale-105 transition-all shadow-xl"
                  >
                    <Mail className="h-6 w-6" /> Get in Touch
                  </a>
                </div>
              </div>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
              <div className="flex flex-col items-center md:items-start space-y-6">
                <span className="block text-neutral-900 dark:text-white font-medium uppercase tracking-widest text-xs">
                  Connect on Social
                </span>
                <div className="flex gap-4">
                  {Object.entries(socialLinks).map(([key, value]) => {
                    if (!value || key === "email") return null;
                    let Icon = Globe;
                    if (key.includes("github")) Icon = Github;
                    if (key.includes("linkedin")) Icon = Linkedin;
                    if (key.includes("twitter")) Icon = Twitter;
                    return (
                      <a
                        key={key}
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4a373]/10 dark:border-white/10 bg-white dark:bg-[#111] text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:border-[#d4a373] transition-all shadow-sm"
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end space-y-6">
                <span className="block text-neutral-900 dark:text-white font-medium uppercase tracking-widest text-xs text-center md:text-right">
                  Collaborations
                </span>
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-[#d4a373]/20 dark:border-white/10 bg-neutral-900 dark:bg-white/5 text-white dark:text-white hover:bg-black dark:hover:bg-white/10 transition-all font-medium"
                >
                  <Mail className="h-4 w-4 text-[#d4a373]" /> Book a Technical Call
                </a>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-neutral-200 dark:border-white/5 text-center text-xs text-neutral-600 flex flex-col items-center gap-4">
            <div className="dark:text-neutral-400">© {new Date().getFullYear()} {fullName}. All rights reserved.</div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Live Engagement</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 shadow-sm">
                <span className="text-[10px] font-mono text-neutral-800 dark:text-neutral-200 font-bold uppercase tracking-tight">Total Visitors:</span>
                <img 
                  src={`https://visitor-badge.laobi.icu/badge?page_id=abhishekmane6122.portfolio.final&left_color=333333&right_color=057642&left_text=Views`} 
                  alt="Views"
                  className="h-5 pointer-events-none rounded-sm"
                  style={{ filter: resolvedTheme === 'dark' ? 'brightness(1.2) contrast(1.1)' : 'none' }}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Card Modal */}
      {isProfileCardOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 dark:bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0f0f0f] p-8 shadow-2xl"
          >
            <button
              onClick={() => setIsProfileCardOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-[#057642] px-3 py-1 rounded-full shadow-xl whitespace-nowrap border border-white/30">
                    Open to Work
                  </span>
                </div>
                <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white dark:border-[#0f0f0f] shadow-xl">
                  <img src={profileImage ? `${import.meta.env.BASE_URL}${profileImage.startsWith('/') ? profileImage.slice(1) : profileImage}` : ''} alt={fullName} className="h-full w-full object-cover" />
                </div>
              </div>
              <h3 className="mb-2 font-serif text-3xl font-light text-neutral-900 dark:text-white" style={{ fontFamily: "var(--font-cormorant)" }}>
                {fullName}
              </h3>
              <p className="mb-6 font-mono text-xs uppercase tracking-widest text-[#d4a373]">
                {title}
              </p>

              <p className="mb-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 font-light">
                {bio}
              </p>

              <div className="flex gap-4">
                {socialLinks.linkedin && (
                  <a href={socialLinks.linkedin} target="_blank" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors shadow-md">
                    <Linkedin className="h-6 w-6 text-neutral-700 dark:text-white" />
                  </a>
                )}
                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors shadow-md">
                    <Github className="h-6 w-6 text-neutral-700 dark:text-white" />
                  </a>
                )}
                {socialLinks.email && (
                  <a href={`mailto:${socialLinks.email}`} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-white/5 hover:bg-neutral-200 dark:hover:bg-white/10 transition-colors shadow-md">
                    <Mail className="h-6 w-6 text-neutral-700 dark:text-white" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setIsProfileCardOpen(false)}
                className="mt-10 w-full rounded-2xl bg-neutral-900 dark:bg-white py-4 text-sm font-bold text-white dark:text-black hover:bg-black dark:hover:bg-neutral-200 transition-colors shadow-md"
              >
                Close Card
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Profile Card Overlay */}
    </div>
  );
}



export default PortfolioTemplate;
