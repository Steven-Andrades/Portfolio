document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  let isScrolling = false;
  let scrollTimeout;

  // Section Observer
  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      // Prevent updates during smooth scroll.
      if (isScrolling) return;

      // Track which section is most visible.
      const visibleSections = entries.filter(entry => entry.intersectionRatio > 0.1);

      if (visibleSections.length > 0) {
        // Find the section with highest visibility.
        const mostVisible = visibleSections.reduce((max, entry) =>
          entry.intersectionRatio > max.intersectionRatio ? entry : max
        );

        navLinks.forEach(link => link.classList.remove('active'));
        const id = mostVisible.target.getAttribute('id');
        const correspondingLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (correspondingLink) {
          correspondingLink.classList.add('active');
        }
      }
    },
      {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5]
      });
    sections.forEach(section => observer.observe(section));

    // Smooth scroll with flag.
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          isScrolling = true;
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });

          // Clear timeout.
          clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            isScrolling = false;
          }, 1000);
        }
      });
    });
  }

  // Navbar Shrink.
  if (navbar) {
    function throttle(func, limit) {
      let inThrottle;
      return function () {
        if (!inThrottle) {
          func();
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    }

    function scrollFunction() {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

      if (scrollTop > 100) {
        navbar.classList.add('navbar-shrink');
      }
      else {
        navbar.classList.remove('navbar-shrink');
      }
    }

    // Set throttle scroll event.
    window.onscroll = throttle(scrollFunction, 50);

    // Initialise navbar state.
    scrollFunction();

    // Also check on window load.
    window.addEventListener('load', scrollFunction);

    // Force check after delay to catch initial state problems.
    setTimeout(scrollFunction, 200);
  }
});

// Portfolio Filter.
document.addEventListener('DOMContentLoaded', () => {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('#portfolio-grid .col');

  function filterProjects(filter) {
    portfolioItems.forEach(item => {
      const itemType = item.getAttribute('data-type');

      if (filter === 'all' || itemType === filter) {
        item.classList.remove('hidden');
        item.classList.add('visible');
        item.style.display = 'block';
      }
      else {
        item.classList.remove('visible');
        item.classList.add('hidden');
        item.style.display = 'none';
      }
    });

    // Update active button
    filterButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      }
    });
    // Update URL hash
    history.replaceState(null, null, `#${filter}`);
  }

  // Add event for filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      filterProjects(filter);
    });
  });
});

// Update year automatically
function updateYear() {
  const currentYear = document.getElementById('current-year');
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }
}
document.addEventListener('DOMContentLoaded', updateYear);