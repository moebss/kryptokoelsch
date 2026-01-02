document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // Improved Scroll Reveal with Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Magnetic Button Effect
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // Glowing Circle Parallax
    const glowingCircle = document.querySelector('.glowing-circle');
    if (glowingCircle) {
        window.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            glowingCircle.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        });
    }

    // Event Toggle Logic
    const btnUpcoming = document.getElementById('btn-upcoming');
    const btnPast = document.getElementById('btn-past');
    const iframe = document.getElementById('luma-iframe');

    if (btnUpcoming && btnPast && iframe) {
        const pastMsg = document.getElementById('past-events-msg');

        btnUpcoming.addEventListener('click', () => {
            btnUpcoming.classList.add('active');
            btnPast.classList.remove('active');
            iframe.style.display = 'block';
            pastMsg.style.display = 'none';
        });

        btnPast.addEventListener('click', () => {
            btnPast.classList.add('active');
            btnUpcoming.classList.remove('active');
            iframe.style.display = 'none';
            pastMsg.style.display = 'flex';
        });
    }

    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
