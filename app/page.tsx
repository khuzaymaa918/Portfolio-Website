"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Github, Linkedin, Mail, Menu, X } from "lucide-react"

// ==================== TYPES ====================

interface Project {
  title: string
  description: string
  tags: string[]
  href: string
}

interface Experience {
  company: string
  role: string
  period: string
  description: string
}

// ==================== DATA ====================

const NAV_ITEMS = ["work", "experience", "contact"]

const PROJECTS: Project[] = [
  {
    title: "Crewlytics",
    description:
      "ML powered workload management system that predicts employee overload risk and automatically redistributes tasks based on availability and skills.",
    tags: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "scikit-learn"],
    href: "https://github.com/khuzaymaa918",
  },
  {
    title: "Bank Loan Approval Predictor",
    description:
      "Machine learning web application predicting loan approval using a preprocessing pipeline and logistic regression model deployed through Streamlit.",
    tags: ["Python", "Pandas", "scikit-learn", "Streamlit"],
    href: "https://github.com/khuzaymaa918",
  },
]

const EXPERIENCES: Experience[] = [
  {
    company: "University of Massachusetts Amherst",
    role: "Undergraduate Teaching Assistant — Calculus I & II",
    period: "Sep 2025 — Present",
    description:
      "Lead review sessions and coordinate grading rubrics across multiple course sections, helping improve exam readiness for 300+ students.",
  },
  {
    company: "The Game Storm Studios",
    role: "Game Developer Intern",
    period: "Jun 2025 — Aug 2025",
    description:
      "Built scalable gameplay systems in Unity using C# and improved platform performance and debugging processes across cross-platform builds.",
  },
]

// ==================== NEURAL CANVAS ====================
// Interactive particle system — particles form neural network-like
// connections that glow warm gold near the cursor, representing
// the intersection of software engineering and machine learning.

function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const particlesRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; radius: number }>
  >([])
  const frameRef = useRef(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w, h }

      const count =
        w > 768
          ? Math.min(100, Math.floor((w * h) / 14000))
          : Math.min(50, Math.floor((w * h) / 18000))
      const particles: typeof particlesRef.current = []
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
        })
      }
      particlesRef.current = particles
    }

    resize()

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    }
    const onTouchEnd = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMouse)
    document.addEventListener("mouseleave", onMouseLeave)
    window.addEventListener("touchmove", onTouch, { passive: true })
    window.addEventListener("touchend", onTouchEnd)

    const animate = () => {
      const { w, h } = sizeRef.current
      ctx.clearRect(0, 0, w, h)

      const particles = particlesRef.current
      const mouse = mouseRef.current
      const connDist = w > 768 ? 150 : 100
      const mouseRad = 250

      // Update positions
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        p.x = Math.max(0, Math.min(w, p.x))
        p.y = Math.max(0, Math.min(h, p.y))
      }

      // Draw connections between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > connDist) continue

          const di = Math.hypot(
            mouse.x - particles[i].x,
            mouse.y - particles[i].y
          )
          const dj = Math.hypot(
            mouse.x - particles[j].x,
            mouse.y - particles[j].y
          )
          const near = di < mouseRad || dj < mouseRad
          const fade = 1 - dist / connDist

          if (near) {
            // Warm golden glow near cursor
            const prox = 1 - Math.min(di, dj) / mouseRad
            const r = Math.round(200 + prox * 55)
            const g = Math.round(180 + prox * 20)
            const b = Math.round(140 - prox * 30)
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${fade * 0.2})`
            ctx.lineWidth = 0.8
          } else {
            ctx.strokeStyle = `rgba(255, 255, 255, ${fade * 0.035})`
            ctx.lineWidth = 0.3
          }

          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }

      // Draw particles
      for (const p of particles) {
        const d = Math.hypot(mouse.x - p.x, mouse.y - p.y)
        const near = d < mouseRad

        if (near) {
          const prox = 1 - d / mouseRad
          const r = Math.round(200 + prox * 55)
          const g = Math.round(180 + prox * 20)
          const b = Math.round(140 - prox * 30)
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + prox * 0.5})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius * (1 + prox * 1.5), 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouse)
      document.removeEventListener("mouseleave", onMouseLeave)
      window.removeEventListener("touchmove", onTouch)
      window.removeEventListener("touchend", onTouchEnd)
      cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="absolute inset-0" style={{ opacity: 0.7 }} />
  )
}

// ==================== FADE IN ====================

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ==================== MAIN ====================

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState("")
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.97])

  // Scroll spy
  useEffect(() => {
    const onScroll = () => {
      for (const id of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (el) {
          const r = el.getBoundingClientRect()
          if (r.top <= 200 && r.bottom >= 200) {
            setActive(id)
            return
          }
        }
      }
      if (window.scrollY < 300) setActive("")
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <div className="bg-[#050505] text-[#e5e5e5] min-h-screen antialiased">
      <div className="grain" />

      {/* ===== NAV ===== */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-12 py-5 flex justify-between items-center backdrop-blur-xl bg-[#050505]/70 border-b border-white/[0.04]">
        <a
          href="#"
          className="text-sm font-medium tracking-[0.2em] text-[#e5e5e5] hover:text-white transition-colors duration-300"
        >
          KM
        </a>

        <div className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className={`text-[13px] font-mono tracking-wider transition-colors duration-300 ${
                active === item
                  ? "text-[#e5e5e5]"
                  : "text-[#555] hover:text-[#999]"
              }`}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          className="md:hidden text-[#888] hover:text-white transition-colors duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-2xl flex items-center justify-center"
        >
          <div className="flex flex-col items-center gap-10">
            {NAV_ITEMS.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item}`}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="text-3xl font-mono text-[#777] hover:text-white transition-colors duration-300"
              >
                {item}
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== HERO ===== */}
      <section className="h-screen relative flex items-center justify-center overflow-hidden">
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0">
          <NeuralCanvas />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[13px] font-mono text-[#555] tracking-[0.3em] uppercase mb-6"
          >
            Software Engineer · Machine Learning
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.1, 0, 1] }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.03em] leading-[0.95]"
          >
            Khuzayma Mushtaq
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-[17px] md:text-lg text-[#666] mt-8 max-w-lg mx-auto leading-relaxed"
          >
            Building scalable software & intelligent systems
            that is clean, measurable, and efficient.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.6 }}
            className="flex gap-6 justify-center mt-10"
          >
            {[
              {
                href: "https://github.com/khuzaymaa918",
                icon: Github,
                label: "GitHub",
              },
              {
                href: "https://linkedin.com/in/khuzayma-mushtaq",
                icon: Linkedin,
                label: "LinkedIn",
              },
              {
                href: "mailto:khuzaymamushtaq1994@gmail.com",
                icon: Mail,
                label: "Email",
              },
            ].map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                aria-label={label}
                className="text-[#444] hover:text-[#ccc] transition-colors duration-300"
              >
                <Icon size={19} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="w-[1px] h-8 bg-gradient-to-b from-transparent via-[#333] to-transparent"
          />
        </motion.div>
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />

      {/* ===== WORK ===== */}
      <section id="work" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-[13px] font-mono text-[#444] tracking-[0.3em] uppercase mb-16">
              Selected Work
            </p>
          </FadeIn>

          <div>
            {PROJECTS.map((project, i) => (
              <FadeIn key={project.title} delay={i * 0.1}>
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-10 border-t border-[#141414] hover:border-[#2a2a2a] transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-6">
                      <span className="text-[12px] font-mono text-[#2a2a2a] group-hover:text-[#444] mt-2 hidden md:block transition-colors duration-500">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-2xl md:text-[1.75rem] font-medium text-[#b0b0b0] group-hover:text-white transition-colors duration-300">
                          {project.title}
                          <ArrowUpRight
                            className="inline ml-2 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-60 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300"
                            size={18}
                          />
                        </h3>
                        <p className="text-[15px] text-[#555] mt-3 max-w-xl leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 md:mt-2 md:flex-nowrap md:ml-8">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-mono text-[#444] border border-[#1a1a1a] group-hover:border-[#2a2a2a] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors duration-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
            <div className="border-t border-[#141414]" />
          </div>
        </div>
      </section>

      {/* ===== EXPERIENCE ===== */}
      <section id="experience" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-[13px] font-mono text-[#444] tracking-[0.3em] uppercase mb-16">
              Experience
            </p>
          </FadeIn>

          <div className="space-y-14">
            {EXPERIENCES.map((exp, i) => (
              <FadeIn key={`${exp.company}-${exp.role}`} delay={i * 0.08}>
                <div className="group grid md:grid-cols-[180px_1fr] gap-1 md:gap-8">
                  <p className="text-[13px] font-mono text-[#3a3a3a] md:mt-0.5">
                    {exp.period}
                  </p>
                  <div>
                    <h3 className="text-lg font-medium text-[#b0b0b0] group-hover:text-[#e5e5e5] transition-colors duration-300">
                      {exp.role}
                    </h3>
                    <p className="text-[14px] text-[#555] mt-0.5">
                      {exp.company}
                    </p>
                    <p className="text-[15px] text-[#555] mt-3 leading-relaxed max-w-xl">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#1a1a1a] to-transparent" />

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-32 md:py-40 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-[13px] font-mono text-[#444] tracking-[0.3em] uppercase mb-10">
              Get in Touch
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <a
              href="mailto:aryamansgoenka@gmail.com"
              className="text-2xl md:text-4xl lg:text-5xl font-medium text-[#777] hover:text-white transition-colors duration-500 break-all md:break-normal"
            >
              aryamansgoenka@gmail.com
            </a>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="flex gap-8 mt-12">
              <a
                href="https://github.com/aryamangoenka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-mono text-[#444] hover:text-white transition-colors duration-300"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/aryaman-goenka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-mono text-[#444] hover:text-white transition-colors duration-300"
              >
                LinkedIn
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 md:px-12 border-t border-[#0e0e0e]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-[12px] text-[#333]">
          <p>&copy; {new Date().getFullYear()} Aryaman Goenka</p>
          <p className="font-mono">CS @ UMass Amherst</p>
        </div>
      </footer>
    </div>
  )
}
