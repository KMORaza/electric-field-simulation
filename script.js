document.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const outerContainer = document.getElementById('outer-container');

  let particles = [];
  const numParticles = 5;

  function resetParticles() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1, // Random velocity between -1 and 1
        vy: Math.random() * 2 - 1,
        charge: (Math.random() < 0.5 ? -1 : 1) * 10 // Default charge strength of 10
      });
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      moveParticle(particle);
      drawParticle(particle);
      drawFieldLines(particle);
    });

    requestAnimationFrame(animate);
  }

  function moveParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off walls
    if (particle.x < 0 || particle.x > canvas.width) {
      particle.vx *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.vy *= -1;
    }
  }

  function drawParticle(particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = particle.charge > 0 ? 'blue' : 'red';
    ctx.fill();
  }

  function drawFieldLines(particle) {
    const step = 10;
    for (let x = 0; x < canvas.width; x += step) {
      for (let y = 0; y < canvas.height; y += step) {
        let totalElectricFieldX = 0;
        let totalElectricFieldY = 0;

        particles.forEach(otherParticle => {
          if (particle !== otherParticle) {
            const dx = x - otherParticle.x;
            const dy = y - otherParticle.y;
            const distanceSquared = dx * dx + dy * dy;
            const distance = Math.sqrt(distanceSquared);

            const electricFieldStrength = otherParticle.charge / distanceSquared;
            const electricFieldX = electricFieldStrength * dx / distance;
            const electricFieldY = electricFieldStrength * dy / distance;

            totalElectricFieldX += electricFieldX;
            totalElectricFieldY += electricFieldY;
          }
        });

        const fieldMagnitude = Math.sqrt(totalElectricFieldX * totalElectricFieldX + totalElectricFieldY * totalElectricFieldY);
        const maxLength = 30;

        if (fieldMagnitude > 0) {
          const startX = x;
          const startY = y;
          const endX = startX + maxLength * totalElectricFieldX / fieldMagnitude;
          const endY = startY + maxLength * totalElectricFieldY / fieldMagnitude;

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = particle.charge > 0 ? 'blue' : 'red';
          ctx.stroke();
        }
      }
    }
  }

  resetParticles();
});
