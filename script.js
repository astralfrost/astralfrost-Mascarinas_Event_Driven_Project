(function() {
    "use strict";

    // DOM elements
    const sidebar = document.getElementById('dynamicSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const openBtn = document.getElementById('openSidebarBtn');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const alertBtn = document.getElementById('alertBtn');
    const themeBtn = document.getElementById('themeBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');

    // Live briefing video elements
    const liveVideo = document.getElementById('newsVideo');
    const playBtn = document.getElementById('playBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const videoMsg = document.getElementById('videoMessage');

    // Form elements
    const form = document.getElementById('newsForm');
    const emailInput = document.getElementById('emailInput');
    const formFeedback = document.getElementById('formFeedback');
    const resizeIndicator = document.getElementById('resizeIndicator');

    // DARK/LIGHT 
    function setTheme(theme) {
        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark');
            localStorage.setItem('eventTheme', 'dark');
            themeBtn.innerHTML = 'light tint';
        } else {
            body.classList.remove('dark');
            localStorage.setItem('eventTheme', 'light');
            themeBtn.innerHTML = 'dark tint';
        }
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains('dark');
        setTheme(isDark ? 'light' : 'dark');
    }

    const savedTheme = localStorage.getItem('eventTheme');
    if (savedTheme) setTheme(savedTheme);

    themeBtn.addEventListener('click', toggleTheme);

    // SIDEBAR 
    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    }

    openBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeSidebar();
        if (e.key.toLowerCase() === 'o') openSidebar();
        if (e.key.toLowerCase() === 'c') closeSidebar();
    });

    // SCROLL TO SECTION 
    function scrollToSection(sectionId, sectionTitle) {
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        closeSidebar();

        targetSection.scrollIntoView({ behavior: 'smooth' });

        history.pushState(null, null, `#${sectionId}`);

        showNotification(`Now showing: ${sectionTitle}`);

        const video = targetSection.querySelector('video');
        if (video && sectionId === 'liveBriefing') {
            setTimeout(() => video.play().catch(() => {}), 500);
        }
    }

    if (alertBtn) {
        alertBtn.addEventListener('click', () => {
            scrollToSection('liveBriefing', 'LIVE BRIEFING');
        });
    }

    document.querySelectorAll('.sidebar li').forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-target');
            const text = item.innerText.trim();
            if (id) scrollToSection(id, text);
        });
    });

    function showNotification(message) {
        const n = document.createElement('div');
        n.textContent = message;
        n.style.cssText = `
            position:fixed;top:20px;right:20px;
            background:#f97316;color:#fff;
            padding:12px 20px;border-radius:30px;
            z-index:10000;
        `;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 2000);
    }

    // BACK TO HOME
    function goToHome() {
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, null, ' ');
    }

    backToHomeBtn.addEventListener('click', goToHome);

    // SCROLL ANIMATION 
    function checkScrollVisibility() {
        document.querySelectorAll('.scroll-animate').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight * 0.85) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScrollVisibility);
    checkScrollVisibility();

    // VIDEO STATUS
    const videos = document.querySelectorAll('video');

    videos.forEach(video => {
        video.addEventListener('play', () => {
            const status = document.getElementById(video.id.replace('Video', 'Status'));
            if (status) status.innerText = 'Now playing';
        });

        video.addEventListener('pause', () => {
            const status = document.getElementById(video.id.replace('Video', 'Status'));
            if (status) status.innerText = 'Paused';
        });
    });

    // AUTO PLAY/PAUSE ON SCROLL
    function setupAutoPlayVideos() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target;

                if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                    document.querySelectorAll('video').forEach(v => {
                        if (v !== video) v.pause();
                    });

                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, {
            threshold: [0.6]
        });

        document.querySelectorAll('video').forEach(video => {
            observer.observe(video);
        });
    }

    setupAutoPlayVideos();

    // ---- FORM ----
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!email.includes('@')) {
                formFeedback.innerText = 'Invalid email';
                formFeedback.style.color = 'red';
            } else {
                formFeedback.innerText = 'Subscribed!';
                formFeedback.style.color = 'green';
                emailInput.value = '';
            }
        });
    }

    console.log('Auto-play videos enabled 🎥');
})();