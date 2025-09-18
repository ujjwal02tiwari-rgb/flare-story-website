/*
 * Script for the Flare story website.
 * Implements:
 *  - scroll progress indicator (pixel‑ometer)
 *  - intersection observers for fade‑in animations
 *  - animated counters for stats
 */

document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress bar update
  const progressBar = document.getElementById('progress-bar');
  const updateProgressBar = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = (scrollTop / docHeight) * 100;
    progressBar.style.width = `${scrolled}%`;
  };
  window.addEventListener('scroll', updateProgressBar);
  updateProgressBar();

  // Fade in elements when they enter the viewport
  const faders = document.querySelectorAll('.fade-element');
  const fadeObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  faders.forEach(el => fadeObserver.observe(el));

  // Counter animation when stats become visible
  const counters = document.querySelectorAll('.counter');
  const animateCounter = counter => {
    const target = +counter.dataset.target;
    let current = 0;
    const step = Math.max(Math.floor(target / 200), 1);
    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
      } else {
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(update);
      }
    };
    update();
  };
  const counterObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 1.0 }
  );
  counters.forEach(counter => counterObserver.observe(counter));
});