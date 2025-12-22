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

    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        revealElements.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();



    // Event Toggle Logic
    const btnUpcoming = document.getElementById('btn-upcoming');
    const btnPast = document.getElementById('btn-past');
    const iframe = document.getElementById('luma-iframe');

    if (btnUpcoming && btnPast && iframe) {
        const pastMsg = document.getElementById('past-events-msg');

        btnUpcoming.addEventListener('click', () => {
            btnUpcoming.classList.add('active');
            btnPast.classList.remove('active');
            // Show Iframe, Hide Msg
            iframe.style.display = 'block';
            pastMsg.style.display = 'none';
        });

        btnPast.addEventListener('click', () => {
            btnPast.classList.add('active');
            btnUpcoming.classList.remove('active');
            // Hide Iframe, Show Msg
            iframe.style.display = 'none';
            pastMsg.style.display = 'flex';
        });
    }
});
