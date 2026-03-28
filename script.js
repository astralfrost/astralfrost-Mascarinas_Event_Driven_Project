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

    // ---- DARK/LIGHT THEME LOGIC ----
    function setTheme(theme) {
        const body = document.body;
        if (theme === 'dark') {
            body.classList.add('dark');
            localStorage.setItem('eventTheme', 'dark');
            themeBtn.innerHTML = '☀️ light tint';
        } else {
            body.classList.remove('dark');
            localStorage.setItem('eventTheme', 'light');
            themeBtn.innerHTML = '🌙 dark tint';
        }
    }

    function toggleTheme() {
        const isDark = document.body.classList.contains('dark');
        if (isDark) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    }

    const savedTheme = localStorage.getItem('eventTheme');
    if (savedTheme === 'dark') {
        setTheme('dark');
    } else if (savedTheme === 'light') {
        setTheme('light');
    } else {
        if (!document.body.classList.contains('dark')) {
            themeBtn.innerHTML = '🌙 dark tint';
        }
    }

    themeBtn.addEventListener('click', toggleTheme);

    // ---- SIDEBAR FUNCTIONS ----
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
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Function to scroll to any section with highlight
    function scrollToSection(sectionId, sectionTitle, showNotificationMsg = true) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            // Close sidebar
            closeSidebar();
            
            // Smooth scroll to the section
            targetSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
            
            // Add highlight effect
            targetSection.style.animation = 'none';
            targetSection.offsetHeight; // Trigger reflow
            targetSection.style.animation = 'sectionGlow 0.6s ease-out';
            
            // Update URL hash without jumping
            history.pushState(null, null, `#${sectionId}`);
            
            // Show toast notification if enabled
            if (showNotificationMsg) {
                showNotification(`📺 Now showing: ${sectionTitle}`);
            }
            
            // Auto-play the video in the section for better user experience
            const videoInSection = targetSection.querySelector('video');
            if (videoInSection && sectionId === 'liveBriefing') {
                // Auto-play breaking news video for immediate impact
                setTimeout(() => {
                    videoInSection.play().catch(e => console.log('Auto-play prevented:', e));
                    if (videoMsg) videoMsg.innerText = '🔴 BREAKING NEWS · playing live';
                }, 500);
            }
            
            console.log(`✅ Navigated to: ${sectionTitle}`);
        }
    }
    
    // ---- BREAKING NEWS BUTTON: DIRECT TO LIVE BRIEFING ----
    if (alertBtn) {
        alertBtn.addEventListener('click', () => {
            scrollToSection('liveBriefing', 'LIVE BRIEFING · Breaking News', true);
            
            // Add extra pulse effect to the live briefing section
            const liveSection = document.getElementById('liveBriefing');
            if (liveSection) {
                liveSection.style.animation = 'sectionGlow 0.6s ease-out';
                setTimeout(() => {
                    liveSection.style.animation = '';
                }, 600);
            }
        });
    }
    
    // ---- SIDEBAR NAVIGATION: REDIRECT TO CORRESPONDING VIDEO SECTION ----
    const sidebarNavItems = document.querySelectorAll('.sidebar li');
    
    // Add click handlers to sidebar items
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            const itemText = item.innerText.trim().replace(/[🔹🌍🤖🗳️🚀📈]/g, '').trim();
            if (targetId) {
                scrollToSection(targetId, itemText, true);
            }
        });
    });
    
    // Simple notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f97316;
            color: white;
            padding: 12px 24px;
            border-radius: 40px;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    // Add CSS animations for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ---- BACK TO HOME BUTTON ----
    function goToHome() {
        closeSidebar();
        const homeSection = document.getElementById('home');
        homeSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start'
        });
        
        // Remove URL hash
        history.pushState(null, null, ' ');
        
        // Highlight home section
        homeSection.querySelector('.parallax-container').style.animation = 'sectionGlow 0.6s ease-out';
        setTimeout(() => {
            if (homeSection.querySelector('.parallax-container')) {
                homeSection.querySelector('.parallax-container').style.animation = '';
            }
        }, 600);
        
        showNotification('🏠 Returned to front page');
        console.log('🏠 Navigated back to home');
    }
    
    backToHomeBtn.addEventListener('click', goToHome);
    
    // Show/hide back to home button based on scroll position
    window.addEventListener('scroll', () => {
        const homeSection = document.getElementById('home');
        const homeBottom = homeSection.getBoundingClientRect().bottom;
        
        if (homeBottom < 0) {
            backToHomeBtn.classList.add('show');
        } else {
            backToHomeBtn.classList.remove('show');
        }
    });

    // ---- SCROLL ANIMATION ----
    function checkScrollVisibility() {
        const animated = document.querySelectorAll('.scroll-animate');
        const winHeight = window.innerHeight;
        const trigger = winHeight * 0.85;
        animated.forEach(el => {
            const rectTop = el.getBoundingClientRect().top;
            if (rectTop < trigger) {
                el.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkScrollVisibility);
    window.addEventListener('resize', () => {
        checkScrollVisibility();
        if (resizeIndicator) {
            resizeIndicator.style.opacity = '1';
            resizeIndicator.innerText = `📐 ${window.innerWidth}px · responsive`;
            setTimeout(() => {
                resizeIndicator.style.opacity = '0.6';
            }, 700);
        }
    });
    checkScrollVisibility();
    
    // ---- LIVE BRIEFING VIDEO CONTROLS ----
    if (liveVideo) {
        liveVideo.addEventListener('play', () => {
            if (videoMsg) videoMsg.innerText = '🔴 LIVE · breaking news coverage';
        });
        liveVideo.addEventListener('pause', () => {
            if (videoMsg) videoMsg.innerText = '⏸️ live briefing paused';
        });
        liveVideo.addEventListener('ended', () => {
            if (videoMsg) videoMsg.innerText = '⏹️ briefing ended — replay available';
        });
        liveVideo.addEventListener('loadeddata', () => {
            if (videoMsg) videoMsg.innerText = '⚡ BREAKING NEWS · ready to watch';
        });
        if (playBtn) playBtn.addEventListener('click', () => liveVideo.play());
        if (pauseBtn) pauseBtn.addEventListener('click', () => liveVideo.pause());
        if (restartBtn) restartBtn.addEventListener('click', () => {
            liveVideo.currentTime = 0;
            liveVideo.play();
        });
    }
    
    // ---- VIDEO CONTROLS FOR ALL TOPIC VIDEOS ----
    const videos = {
        climateVideo: document.getElementById('climateVideo'),
        aiVideo: document.getElementById('aiVideo'),
        electionVideo: document.getElementById('electionVideo'),
        spaceVideo: document.getElementById('spaceVideo'),
        marketVideo: document.getElementById('marketVideo')
    };
    
    // Add status updates for each video
    Object.keys(videos).forEach(videoId => {
        const video = videos[videoId];
        if (video) {
            const statusId = videoId.replace('Video', 'Status');
            const statusElement = document.getElementById(statusId);
            
            if (statusElement) {
                video.addEventListener('play', () => {
                    statusElement.innerHTML = '▶️ Now playing';
                });
                video.addEventListener('pause', () => {
                    statusElement.innerHTML = '⏸️ Paused';
                });
                video.addEventListener('ended', () => {
                    statusElement.innerHTML = '⏹️ Ended - click restart';
                });
            }
        }
    });
    
    // Add event listeners to all video control buttons
    document.querySelectorAll('.play-specific').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video');
            if (videos[videoId]) videos[videoId].play();
        });
    });
    
    document.querySelectorAll('.pause-specific').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video');
            if (videos[videoId]) videos[videoId].pause();
        });
    });
    
    document.querySelectorAll('.restart-specific').forEach(btn => {
        btn.addEventListener('click', () => {
            const videoId = btn.getAttribute('data-video');
            if (videos[videoId]) {
                videos[videoId].currentTime = 0;
                videos[videoId].play();
            }
        });
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (email === '') {
                formFeedback.innerText = '⚠️ email cannot be empty';
                formFeedback.style.color = '#dc2626';
            } else if (!email.includes('@') || !email.includes('.') || email.indexOf('@') === 0) {
                formFeedback.innerText = '⚠️ enter valid email (e.g., name@domain.com)';
                formFeedback.style.color = '#dc2626';
            } else {
                formFeedback.innerText = '✅ subscribed! welcome to event horizon.';
                formFeedback.style.color = '#16a34a';
                emailInput.value = '';
                setTimeout(() => {
                    formFeedback.innerText = '';
                }, 3000);
            }
        });
    }

    // Handle hash navigation on page load
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection && targetId !== 'home') {
            setTimeout(() => {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Resize indicator initial
    if (resizeIndicator) {
        resizeIndicator.innerText = `📐 ${window.innerWidth}px · adaptive`;
    }

    console.log('✨ Interactive news active | Breaking news button now redirects to Live Briefing section');
})();