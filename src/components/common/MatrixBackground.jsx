import { useEffect, useRef, useMemo, useState, useCallback } from "react"
import React from "react"

function MatrixBackground({
  opacity = 0.2,
  speed = 1.2,
  density = 1,
  colorVariant = "cyber",
  securityMode = true
}) {
  const canvasRef = useRef(null)
  const securitySymbolsRef = useRef([])
  const isVisibleRef = useRef(true)
  const isPausedRef = useRef(false)
  const [, forceUpdate] = useState(0) // For initial render only

  // Define color variants with cybersecurity focus
  const colorVariants = useMemo(
    () => ({
      green: {
        primary: "rgba(0, 255, 65, ", // Classic matrix green
        secondary: "rgba(0, 200, 50, ",
        rare: ["rgba(0, 119, 255, ", "rgba(255, 0, 255, "], // Blue and magenta for rare chars
      },
      blue: {
        primary: "rgba(0, 119, 255, ", // Security blue
        secondary: "rgba(12, 235, 255, ",
        rare: ["rgba(0, 255, 65, ", "rgba(255, 0, 255, "],
      },
      cyber: {
        primary: "rgba(255, 0, 85, ", // Cyberpunk red
        secondary: "rgba(12, 235, 255, ", // Cyan
        rare: ["rgba(0, 255, 65, ", "rgba(255, 210, 0, "], // Green and yellow
      },
      hacker: {
        primary: "rgba(0, 255, 65, ", // Classic hacker green
        secondary: "rgba(255, 0, 0, ", // Alert red
        rare: ["rgba(255, 255, 0, ", "rgba(0, 255, 255, "], // Yellow and cyan for alerts
      },
      stealth: {
        primary: "rgba(50, 50, 50, ", // Dark grey
        secondary: "rgba(100, 100, 100, ", // Light grey
        rare: ["rgba(255, 0, 0, ", "rgba(0, 255, 0, "], // Red and green for alerts
      },
      darkweb: {
        primary: "rgba(50, 0, 100, ", // Dark purple
        secondary: "rgba(100, 0, 200, ", // Purple
        rare: ["rgba(255, 0, 0, ", "rgba(0, 200, 255, "], // Red and blue
      },
    }),
    []
  )

  // Security messages for the matrix effect
  const securityMessages = useMemo(() => [
    "ACCESS DENIED", "BREACH DETECTED", "ENCRYPTION ACTIVE",
    "FIREWALL ENABLED", "INTRUSION ALERT", "MALWARE FOUND",
    "PORT SCANNING", "BACKDOOR DETECTED", "BUFFER OVERFLOW",
    "KEYLOGGER ACTIVE", "SQL INJECTION", "XSS ATTACK",
    "ROOT ACCESS", "SHELL ACCESS", "ADMIN PRIVILEGES",
    "PHISHING ALERT", "DDoS DETECTED", "RANSOMWARE",
    "CVE-2023-12345", "ZERO-DAY", "APT DETECTED"
  ], [])

  // Initialize security symbols once (using ref to avoid re-renders)
  useEffect(() => {
    securitySymbolsRef.current = Array(4).fill().map(() => ({
      text: securityMessages[Math.floor(Math.random() * securityMessages.length)],
      x: Math.random(),
      y: Math.random(),
      opacity: 0,
      fadeDirection: 1,
      fadeSpeed: Math.random() * 0.01 + 0.005,
      displayed: false,
      displayTime: 0,
      maxTime: Math.random() * 150 + 100
    }))
  }, [securityMessages])

  // Visibility-based pause using Intersection Observer and Page Visibility API
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Intersection Observer - pause when canvas is not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting
        })
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    // Page Visibility API - pause when tab is hidden
    const handleVisibilityChange = () => {
      isPausedRef.current = document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let animationId
    let lastTime = 0
    const frameRate = 24 // Reduced framerate for better performance
    let frameCount = 0

    // Set canvas dimensions with device pixel ratio for sharpness
    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(pixelRatio, pixelRatio)
      setupMatrix()
    }

    // Enhanced character set with cybersecurity-related symbols
    const chars =
      "01アイウエオカキクケコサシスセソタチツテト♠♦♣♥ノハヒフヘホマミムメモヤユヨラリルレロワヲン▓▒░█▄▀▐▌{}[]()<>~!@#$%^&ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz⚠⚡✓⚙⚪⚫⚔⚕⚛⚜⚝⚞⚟プグミ" +
      "λπΣΦΩδ∞∂∫≡≈†‡§¶©®™€£¥$¢∴∵∩∪⊂⊃⊆⊇∈∉∋∌∅∆√∞≤≥≠≡≈≜≝±∓÷×∧∨¬⇒⊕⊗"

    // Security-focused character set
    const securityChars = "01{}[]()<>~!@#$%^&*АБВГДЕЁЖЗИЙКλπΣΦΩδ∞∴∵∩∪⚠⚡⚙⚔⚕"
    let drops = []
    let brightness = []
    let colors = []
    let speeds = []
    let charTypes = [] // 0 for regular, 1 for binary, 2 for security-focused
    let fontSize = 14
    let columns = 0

    // Enhanced matrix setup
    const setupMatrix = () => {
      // Dynamic font size based on screen size
      fontSize = Math.max(12, Math.floor(window.innerWidth / 100))

      // Calculate columns with density factor
      columns = Math.floor((canvas.width / fontSize) * density)

      // Reset arrays
      drops = []
      brightness = []
      colors = []
      speeds = []
      charTypes = []

      // Get colors based on selected variant
      const colorSet = colorVariants[colorVariant] || colorVariants.cyber

      // Initialize arrays with improved randomization
      for (let i = 0; i < columns; i++) {
        // Stagger the starting position for more realistic effect
        drops[i] = Math.random() * -100

        // Variable brightness for dynamic effect
        brightness[i] = Math.random() * 0.5 + 0.5

        // Variable speed based on user setting and randomization
        speeds[i] = (Math.random() * 0.5 + 0.5) * speed

        // Determine character type
        const typeRand = Math.random()
        if (typeRand < 0.4) {
          charTypes[i] = 1 // Binary (40%)
        } else if (typeRand < 0.7 || !securityMode) {
          charTypes[i] = 0 // Regular (30%)
        } else {
          charTypes[i] = 2 // Security (30% if securityMode is true)
        }

        // Color distribution with rare highlights
        const rand = Math.random()
        if (rand < 0.7) {
          colors[i] = colorSet.primary // Primary color (70%)
        } else if (rand < 0.95) {
          colors[i] = colorSet.secondary // Secondary color (25%)
        } else {
          // Rare accent colors (5%)
          const rareIndex = Math.floor(Math.random() * colorSet.rare.length)
          colors[i] = colorSet.rare[rareIndex]
        }
      }
    }

    // Update security symbols
    const updateSecuritySymbols = () => {
      if (!securityMode) return

      securitySymbolsRef.current.forEach((symbol, index) => {
        // Update opacity based on fade direction
        symbol.opacity += symbol.fadeSpeed * symbol.fadeDirection

        // Check if we need to change fade direction
        if (symbol.opacity >= 0.8) {
          symbol.fadeDirection = 0 // Stop fading, just display
          symbol.displayed = true
        }

        // Update display time if symbol is fully displayed
        if (symbol.displayed) {
          symbol.displayTime++

          // Start fading out when display time is up
          if (symbol.displayTime >= symbol.maxTime) {
            symbol.fadeDirection = -1
            symbol.displayed = false
          }
        }

        // Reset symbol when it fades out completely
        if (symbol.opacity <= 0 && symbol.fadeDirection === -1) {
          securitySymbolsRef.current[index] = {
            text: securityMessages[Math.floor(Math.random() * 12)],
            x: Math.random(),
            y: Math.random(),
            opacity: 0,
            fadeDirection: 1,
            fadeSpeed: Math.random() * 0.01 + 0.005,
            displayed: false,
            displayTime: 0,
            maxTime: Math.random() * 150 + 100
          }
        }
      })
    }

    // Draw security message
    const drawSecurityMessages = () => {
      if (!securityMode) return

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      securitySymbolsRef.current.forEach(symbol => {
        if (symbol.opacity > 0) {
          const colorSet = colorVariants[colorVariant]
          const x = symbol.x * width
          const y = symbol.y * height

          // Draw background for better readability
          ctx.fillStyle = `rgba(0, 0, 0, ${symbol.opacity * 0.7})`
          ctx.fillRect(
            x - 5,
            y - fontSize - 5,
            symbol.text.length * (fontSize * 0.6) + 10,
            fontSize + 10
          )

          // Draw text with glowing effect
          ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`
          ctx.fillStyle = colorSet.rare[0].replace(", ", `, ${symbol.opacity * opacity * 1.5})`)
          ctx.fillText(symbol.text, x, y)

          // Add subtle glow effect
          ctx.shadowColor = colorSet.rare[0].replace(", ", `, ${symbol.opacity})`)
          ctx.shadowBlur = 5
          ctx.fillText(symbol.text, x, y)
          ctx.shadowBlur = 0
        }
      })
    }

    // Draw hexadecimal address markers
    const drawAddressMarkers = () => {
      if (!securityMode) return

      const width = canvas.width / window.devicePixelRatio
      const height = canvas.height / window.devicePixelRatio

      ctx.font = `${fontSize * 0.8}px "JetBrains Mono", monospace`
      ctx.fillStyle = `rgba(150, 150, 150, ${opacity * 0.7})`

      // Draw hex addresses on the left side
      for (let y = fontSize; y < height; y += fontSize * 4) {
        const addr = (Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()
        ctx.fillText(`0x${addr}`, 5, y)
      }
    }

    // Enhanced drawing function with optimized performance
    const draw = (timestamp) => {
      // Skip if not visible or tab is hidden
      if (!isVisibleRef.current || isPausedRef.current) {
        animationId = requestAnimationFrame(draw)
        return
      }

      // Throttle frames for performance
      if (timestamp - lastTime < 1000 / frameRate) {
        animationId = requestAnimationFrame(draw)
        return
      }

      lastTime = timestamp
      frameCount++

      // Semi-transparent black for fade effect - adjusted for smoother trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)

      // Set font with monospace for authentic cyber look
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      // Draw characters with enhanced effects
      for (let i = 0; i < drops.length; i++) {
        // Adaptive performance - skip columns on smaller screens
        if (window.innerWidth < 768 && i % 2 !== 0 && density > 0.8) continue

        // Get character based on type
        let text
        if (charTypes[i] === 1) {
          // Binary (0s and 1s)
          text = Math.random() > 0.5 ? "0" : "1"
        } else if (charTypes[i] === 2) {
          // Security symbols
          const secIndex = Math.floor(Math.random() * securityChars.length)
          text = securityChars.charAt(secIndex)
        } else {
          // Regular matrix characters
          const charIndex = Math.floor(Math.random() * chars.length)
          text = chars.charAt(charIndex)
        }

        // Calculate position
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Brightness calculation with head emphasis
        let alpha = brightness[i]
        if (drops[i] <= 1) {
          alpha = 1 // Full brightness for the first character (head)
        } else if (drops[i] <= 3) {
          // Gradient effect for characters near the head
          alpha = 0.8 + 0.2 * (3 - drops[i])
        }

        // Apply color with calculated brightness
        ctx.fillStyle = `${colors[i]}${alpha * opacity})`

        // Enhanced glow effect for leading characters and security symbols
        if (drops[i] <= 2 || charTypes[i] === 2 || Math.random() > 0.97) {
          ctx.shadowColor = `${colors[i]}1)`
          ctx.shadowBlur = 8
        } else {
          ctx.shadowBlur = 0
        }

        // Draw character if within bounds
        if (y > 0 && y < canvas.height / window.devicePixelRatio) {
          ctx.fillText(text, x, y)
        }

        // Dynamic character flickering with occasional security focus
        if (Math.random() > 0.996) {
          brightness[i] = Math.random() * 0.5 + 0.5

          // Occasionally change character type for dynamic effect
          if (Math.random() > 0.8 && securityMode) {
            charTypes[i] = Math.floor(Math.random() * 3)
          }
        }

        // Intelligent reset logic with variable column lengths
        const maxHeight = canvas.height / window.devicePixelRatio / fontSize
        const randomEnd = maxHeight * (0.5 + Math.random() * 0.5) // Variable column length

        if (drops[i] * fontSize > randomEnd) {
          // Reset with probability for more natural flow
          if (Math.random() > 0.99) {
            drops[i] = 0
            brightness[i] = Math.random() * 0.5 + 0.5
            speeds[i] = (Math.random() * 0.5 + 0.5) * speed
          }
        } else {
          // Move drop down with variable speed
          drops[i] += speeds[i] * 0.1
        }
      }

      // Every 30 frames, update and draw security elements
      if (frameCount % 30 === 0) {
        updateSecuritySymbols()
      }

      drawSecurityMessages()

      // Draw address markers every 120 frames to avoid too much visual noise
      if (frameCount % 120 === 0) {
        drawAddressMarkers()
      }

      animationId = requestAnimationFrame(draw)
    }

    // Initialize canvas and start animation
    resizeCanvas()
    setupMatrix()
    animationId = requestAnimationFrame(draw)

    // Handle window resize
    window.addEventListener("resize", resizeCanvas)

    // Cleanup function
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [opacity, speed, density, colorVariant, colorVariants, securityMode, securityMessages])

  return (
    <canvas
      ref={canvasRef}
      className="savdhaan-matrix-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: 1, // We control opacity through the color values
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  )
}

// Add performance optimization with memoization
export default React.memo(MatrixBackground, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.opacity === nextProps.opacity &&
    prevProps.speed === nextProps.speed &&
    prevProps.density === nextProps.density &&
    prevProps.colorVariant === nextProps.colorVariant &&
    prevProps.securityMode === nextProps.securityMode
  )
})