export function fireConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.inset = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  let width = (canvas.width = window.innerWidth)
  let height = (canvas.height = window.innerHeight)

  const handleResize = () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)

  const colors = ['#ff6b81', '#ff4757', '#ffa502', '#2ed573', '#1e90ff', '#ffffff']
  const confettiCount = 130
  const particles = []

  for (let i = 0; i < confettiCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height - height - 100,
      size: Math.random() * 6 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 8 - 4,
      oscillation: Math.random() * 2 * Math.PI,
      oscillationSpeed: Math.random() * 0.04 + 0.015,
      shape: Math.random() > 0.6 ? 'heart' : Math.random() > 0.45 ? 'circle' : 'square',
    })
  }

  let animationFrameId
  const startTime = Date.now()

  function drawHeart(cContext, x, y, size, color) {
    cContext.fillStyle = color
    cContext.beginPath()
    cContext.moveTo(x + size / 2, y + size / 5)
    cContext.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 3.5)
    cContext.bezierCurveTo(x, y + size / 1.8, x + size / 2, y + size / 1.2, x + size / 2, y + size)
    cContext.bezierCurveTo(x + size / 2, y + size / 1.2, x + size, y + size / 1.8, x + size, y + size / 3.5)
    cContext.bezierCurveTo(x + size, y, x + size / 2, y, x + size / 2, y + size / 5)
    cContext.closePath()
    cContext.fill()
  }

  function update() {
    ctx.clearRect(0, 0, width, height)

    let active = false
    particles.forEach((p) => {
      p.y += p.speed
      p.x += Math.sin(p.oscillation) * 1.6
      p.oscillation += p.oscillationSpeed
      p.rotation += p.rotationSpeed

      if (p.y < height) {
        active = true
      }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)

      if (p.shape === 'heart') {
        drawHeart(ctx, -p.size / 2, -p.size / 2, p.size, p.color)
      } else if (p.shape === 'circle') {
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, 2 * Math.PI)
        ctx.fill()
      } else {
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      }

      ctx.restore()
    })

    if (active && Date.now() - startTime < 4000) {
      animationFrameId = requestAnimationFrame(update)
    } else {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      canvas.remove()
    }
  }

  update()
}
