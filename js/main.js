// =========== THEME ===========
if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    setTimeout(() => {
        const icon = document.getElementById('themeIcon');
        if (icon) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }, 50);
}

function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    }
}

// =========== TAB SWITCH (SPA) ===========
function switchTab(tabId, element, e) {
    e.preventDefault();

    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    element.classList.add('active');

    document.querySelectorAll('section').forEach(sec => {
        sec.classList.remove('active-tab');
    });

    let activeSec = document.getElementById(tabId);
    activeSec.classList.add('active-tab');
    activeSec.scrollTo(0, 0);

    // Dynamic progress bar animation for Kuota tab
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        if (tabId === 'kuota') {
            setTimeout(() => {
                progressFill.style.width = '68%';
            }, 300);
        } else {
            progressFill.style.width = '0%';
        }
    }
}

// =========== TYPING EFFECT ===========
const typingRoles = [
    'IT Student 🎓',
    'Web Developer 💻',
    'Digital Entrepreneur 🚀',
    'AI Enthusiast 🤖',
    'Kuotanya Awan ☁️'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const currentRole = typingRoles[roleIndex];

    if (isDeleting) {
        el.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 40;
    } else {
        el.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 80;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % typingRoles.length;
        typingSpeed = 400; // Pause before new word
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
setTimeout(typeEffect, 800);

// =========== COUNT-UP ANIMATION ===========
function animateCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            counter.textContent = current + (target >= 100 ? '+' : '+');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    });
}

// Trigger count-up when home tab is visible
setTimeout(animateCountUp, 1200);

// =========== MESSAGE FORM ===========
function toggleMessageForm() {
    const formBox = document.getElementById('messageFormBox');
    if (formBox.style.display === 'none' || formBox.style.display === '') {
        formBox.style.display = 'block';
        formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        formBox.style.display = 'none';
    }
}

// Escape Telegram Markdown v1 special characters
function escapeMd(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/[*_`[]/g, '\\$&');
}

// Send Message via Telegram bot API
function sendToTelegram() {
    const name = escapeMd(document.getElementById('senderName').value.trim());
    const message = escapeMd(document.getElementById('senderMsg').value.trim());

    if (!name || !message) {
        alert("Mohon isi Nama dan Pesan terlebih dahulu!");
        return;
    }

    const botToken = "8430081251:AAEJIIRT0m-3hZrgZCB-iTW6KtdmQeafBpA";
    const chatId = "2010496733";
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const userAgent = navigator.userAgent;
    const platform = navigator.platform || "Unknown Platform";

    let deviceType = "💻 Desktop";
    if (/android/i.test(userAgent)) {
        deviceType = "📱 Android";
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
        deviceType = "🍎 iOS";
    } else if (/mobile/i.test(userAgent)) {
        deviceType = "📱 Mobile";
    }

    const timestamp = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        dateStyle: "full",
        timeStyle: "short"
    });

    return fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .catch((err) => { console.warn("IP lookup failed:", err); return null; })
        .then(geo => {
            const ip = (geo && geo.ip) ? `\`${geo.ip}\`` : "Tidak tersedia";
            const location = geo
                ? `${geo.city || "-"}, ${geo.region || "-"}, ${geo.country_name || "-"}`
                : "Tidak tersedia";
            const org = (geo && geo.org) || "Tidak tersedia";

            const textContent =
`📩 *Pesan Baru dari Website Profile*

👤 *Nama:* ${name}
💬 *Pesan:*
${message}

━━━━━━━━━━━━━━━━━━━━
📊 *Data Pengunjung*
🌐 *IP Address:* ${ip}
📍 *Lokasi:* ${location}
🏢 *ISP/Org:* ${org}
🖥️ *Device:* ${deviceType}
📐 *Platform:* ${platform}
🔍 *User-Agent:*
\`${userAgent}\`
🕒 *Waktu:* ${timestamp}
━━━━━━━━━━━━━━━━━━━━`;

            return fetch(telegramUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: textContent,
                    parse_mode: "Markdown"
                })
            });
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("✅ Pesan berhasil dikirim!");
                document.getElementById('senderName').value = '';
                document.getElementById('senderMsg').value = '';
                toggleMessageForm();
            } else {
                alert("❌ Gagal mengirim pesan! Silakan coba lagi.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("❌ Terjadi kesalahan jaringan.");
        });
}

// =========== TOUCH SCROLL CONTROL ===========
document.body.addEventListener('touchmove', function(e) {
    if (e.target.closest('section') || e.target.closest('#matrixModal') || e.target.closest('#giftPanel') || e.target.closest('#klaimModal')) {
        // Allow scroll inside these containers
    } else {
        e.preventDefault();
    }
}, { passive: false });

// =========== AGE CALCULATOR ===========
function calculateAgeAndLifecycle() {
    const birthDate = new Date('2006-04-18');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const ageEls = [
        document.getElementById('currentAgeValue'),
        document.getElementById('currentAgeTextValue'),
        document.getElementById('dynamicPhaseAge')
    ];
    ageEls.forEach(el => {
        if (el) el.innerText = age;
    });
}

calculateAgeAndLifecycle();

// =========== MATRIX MODAL ===========
function openMatrixModal() {
    const modal = document.getElementById('matrixModal');
    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "1";
        document.getElementById('matrixModalCard').style.transform = "scale(1) translateY(0)";
    }, 10);
}

function closeMatrixModal() {
    const modal = document.getElementById('matrixModal');
    modal.style.opacity = "0";
    document.getElementById('matrixModalCard').style.transform = "scale(0.9) translateY(30px)";
    setTimeout(() => {
        modal.style.display = "none";
    }, 400);
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('matrixModal');
    if (event.target === modal) {
        closeMatrixModal();
    }
});

// =========== INTERSECTION OBSERVER — Fade In ===========
function setupFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Setup on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFadeInObserver);
} else {
    setupFadeInObserver();
}

// =========== KUOTA OPERATOR TAB SWITCHER ===========
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.operator-block');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabTarget = btn.getAttribute('data-tab');

            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update active content block
            tabContents.forEach(content => {
                if (content.getAttribute('data-tab-content') === tabTarget) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { escapeMd, sendToTelegram, toggleMessageForm };
}
