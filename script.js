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
        btnUpcoming.addEventListener('click', () => {
            btnUpcoming.classList.add('active');
            btnPast.classList.remove('active');
            // Standard URL for upcoming
            iframe.src = "https://lu.ma/embed/calendar/cal-By6C0aAuF3FgjeU/events";
        });

        btnPast.addEventListener('click', () => {
            btnPast.classList.add('active');
            btnUpcoming.classList.remove('active');
            // Append ?period=past for past events
            iframe.src = "https://lu.ma/embed/calendar/cal-By6C0aAuF3FgjeU/events?period=past";
        });
    }
});
