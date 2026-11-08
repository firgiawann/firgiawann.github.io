// ===============================================================
// FIRGIAWAN LISTIANTO & KUOTANYA AWAN — UNIFIED INTERACTIVE JS
// Includes: Typing Effect, Counters, Canva Pro Gift, QRIS Support,
//           Destiny Matrix Modal, & Telegram Direct Message
// ===============================================================

// 0. MOBILE SIDEBAR DRAWER (Flat Design Top Navbar)
function toggleSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('mobileSidebar');
    if (!overlay || !sidebar) return;
    const isOpen = sidebar.classList.contains('open');
    if (isOpen) {
        closeSidebar();
    } else {
        overlay.classList.add('open');
        sidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeSidebar() {
    const overlay = document.getElementById('sidebarOverlay');
    const sidebar = document.getElementById('mobileSidebar');
    if (overlay) overlay.classList.remove('open');
    if (sidebar) sidebar.classList.remove('open');
    document.body.style.overflow = '';
}

// 1. TYPING EFFECT (Hero Index - Clean Text Without Decorative Emoji)
const typingRoles = [
    'Mahasiswa PTIK UNM',
    'Founder Kuotanya Awan',
    'Front-End Developer',
    'AI Enthusiast',
    'Awardee GenBI UNM'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 85;

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
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % typingRoles.length;
        typingSpeed = 350;
    }

    setTimeout(typeEffect, typingSpeed);
}

// 2. COUNT-UP ANIMATION
function animateCountUp() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 1800;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            counter.textContent = current + '+';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        requestAnimationFrame(update);
    });
}

// 3. DESTINY MATRIX MODAL (di profile.html - Tanpa Tanggal Lahir)
function openMatrixModal() {
    const modal = document.getElementById('matrixModal');
    const card = document.getElementById('matrixModalCard');
    if (!modal) return;
    modal.style.display = 'flex';
    void modal.offsetHeight;
    modal.style.opacity = '1';
    if (card) card.style.transform = 'scale(1) translateY(0)';
}

function closeMatrixModal() {
    const modal = document.getElementById('matrixModal');
    const card = document.getElementById('matrixModalCard');
    if (!modal) return;
    modal.style.opacity = '0';
    if (card) card.style.transform = 'scale(0.92) translateY(20px)';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// 5. CANVA PRO GIFT & QRIS SUPPORT SYSTEM (Global)
const GIFT_CLOSED = true; // Set ke false jika ingin membuka kembali klaim Canva Pro
let CANVA_LINK = "";
const STOCK_TOTAL = 100;
const DEFAULT_STOCK = 99;
const COUNTDOWN_SECONDS = 10;
let MASA_AKTIF_END = new Date("2026-08-05T23:59:59+08:00");
let countdownTimer = null;
let canvaOpened = false;

function getStockRemaining() {
    const v = parseInt(localStorage.getItem("canva_stock"));
    if (isNaN(v)) {
        localStorage.setItem("canva_stock", DEFAULT_STOCK);
        return DEFAULT_STOCK;
    }
    return Math.max(0, v);
}

function updateStockDisplay(stock) {
    const stockLabel = document.getElementById("stockLabel");
    const klaimBtn = document.getElementById("klaimBtn");

    if (GIFT_CLOSED) {
        if (stockLabel) {
            stockLabel.innerHTML = 'Stok <strong style="color: #e11d48;">0</strong> &mdash; <span style="color: #e11d48;">Kosong (Tutup Sementara)</span>';
        }
        if (klaimBtn) {
            klaimBtn.disabled = true;
            klaimBtn.style.opacity = "0.75";
            klaimBtn.style.cursor = "not-allowed";
            klaimBtn.innerHTML = '<i class="fas fa-lock"></i> Tutup Sementara';
        }
        return;
    }

    const stockVal = Math.max(0, parseInt(stock) || 0);
    if (stockLabel) {
        stockLabel.innerHTML = 'Tersisa <strong style="color: #d97706;">' + stockVal + '</strong> dari ' + STOCK_TOTAL + ' slot';
    }
    if (klaimBtn) {
        if (stockVal <= 0) {
            klaimBtn.disabled = true;
            klaimBtn.style.opacity = "0.6";
            klaimBtn.style.cursor = "not-allowed";
            klaimBtn.innerHTML = '<i class="fas fa-ban"></i> Stok Habis';
        } else {
            klaimBtn.disabled = false;
            klaimBtn.style.opacity = "1";
            klaimBtn.style.cursor = "pointer";
            klaimBtn.innerHTML = '<i class="fas fa-hand-pointer"></i> Klaim Sekarang';
        }
    }
}

async function fetchLiveStock() {
    try {
        const r = await fetch("https://api-telegram.vercel.app/api/canva-stock");
        const d = await r.json();
        if (d && d.ok && typeof d.stock === "number") {
            localStorage.setItem("canva_stock", d.stock);
            updateStockDisplay(d.stock);
            return d.stock;
        }
    } catch (e) {}
    updateStockDisplay(getStockRemaining());
}

function openGiftPanel() {
    updateStockDisplay(getStockRemaining());
    fetchLiveStock();

    const emoji = document.getElementById("giftEmoji");
    if (emoji) {
        emoji.style.animation = "none";
        setTimeout(() => {
            emoji.style.animation = "giftShake 0.6s ease, giftBounce 0.6s ease 0.6s";
        }, 10);
    }

    const panel = document.getElementById("giftPanel");
    const card = document.getElementById("giftPanelCard");
    if (panel) {
        panel.style.display = "flex";
        void panel.offsetHeight;
        panel.style.opacity = "1";
    }
    if (card) {
        card.style.transform = "scale(1) translateY(0)";
    }
}

function closeGiftPanel() {
    const panel = document.getElementById("giftPanel");
    const card = document.getElementById("giftPanelCard");
    if (panel) panel.style.opacity = "0";
    if (card) card.style.transform = "scale(0.92) translateY(20px)";
    setTimeout(() => {
        if (panel) panel.style.display = "none";
    }, 300);
}

function openQrisModal() {
    closeGiftPanel();
    setTimeout(() => {
        const modal = document.getElementById("qrisModal");
        const card = document.getElementById("qrisModalCard");
        const qrisImage = modal ? modal.querySelector("img[data-src]") : null;
        if (qrisImage && !qrisImage.getAttribute("src")) {
            qrisImage.src = qrisImage.dataset.src;
        }
        if (modal) {
            modal.style.display = "flex";
            void modal.offsetHeight;
            modal.style.opacity = "1";
        }
        if (card) {
            card.style.transform = "scale(1) translateY(0)";
        }
    }, 320);
}

function closeQrisModal() {
    const modal = document.getElementById("qrisModal");
    const card = document.getElementById("qrisModalCard");
    if (modal) modal.style.opacity = "0";
    if (card) card.style.transform = "scale(0.92) translateY(20px)";
    setTimeout(() => {
        if (modal) modal.style.display = "none";
    }, 300);
}

function openKlaimForm() {
    if (GIFT_CLOSED) return;
    closeGiftPanel();
    setTimeout(() => {
        const modal = document.getElementById("klaimModal");
        const card = document.getElementById("klaimModalCard");
        if (modal) {
            modal.style.display = "flex";
            void modal.offsetHeight;
            modal.style.opacity = "1";
        }
        if (card) {
            card.style.transform = "scale(1) translateY(0)";
        }
    }, 320);
}

function closeKlaimModal() {
    const modal = document.getElementById("klaimModal");
    const card = document.getElementById("klaimModalCard");
    if (modal) modal.style.opacity = "0";
    if (card) card.style.transform = "scale(0.92) translateY(20px)";
    setTimeout(() => {
        if (modal) modal.style.display = "none";
    }, 300);
}

function submitKlaim() {
    const nameEl = document.getElementById("klaimName");
    const emailEl = document.getElementById("klaimEmail");
    if (!nameEl || !emailEl) return;

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();

    if (!name || !email) {
        alert("Mohon isi Nama dan Email terlebih dahulu!");
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Format email tidak valid!");
        return;
    }

    const stock = getStockRemaining();
    if (stock <= 0) {
        alert("Maaf, stok sudah habis!");
        closeKlaimModal();
        return;
    }

    const btn = document.getElementById("submitKlaimBtn");
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }

    const userAgent = navigator.userAgent || "";
    const platform = navigator.platform || "Unknown Platform";
    let deviceType = "💻 Desktop";
    if (/android/i.test(userAgent)) deviceType = "📱 Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) deviceType = "🍎 iOS";
    else if (/mobile/i.test(userAgent)) deviceType = "📱 Mobile";

    fetch("https://ipapi.co/json/")
        .then(r => r.json())
        .catch(() => null)
        .then(geo => {
            return fetch("https://api-telegram.vercel.app/api/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    ip: geo && geo.ip ? geo.ip : "",
                    location: geo ? `${geo.city || "-"}, ${geo.region || "-"}, ${geo.country_name || "-"}` : "",
                    org: (geo && geo.org) || "",
                    device: deviceType,
                    platform: platform,
                    user_agent: userAgent,
                }),
            });
        })
        .then(r => r.json())
        .then(data => {
            if (data.ok) {
                const newStock = typeof data.stock === "number" ? data.stock : Math.max(0, getStockRemaining() - 1);
                localStorage.setItem("canva_stock", newStock);
                updateStockDisplay(newStock);
                closeKlaimModal();
                setTimeout(openSuccessModal, 340);
            } else {
                alert("❌ Gagal mengirim! Silakan coba lagi.");
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Konfirmasi & Kirim';
                }
            }
        })
        .catch(() => {
            alert("❌ Terjadi kesalahan jaringan.");
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Konfirmasi & Kirim';
            }
        });
}

function openSuccessModal() {
    canvaOpened = false;
    const statusEl = document.getElementById("countdownStatusText");
    if (statusEl) {
        statusEl.innerHTML = 'Membuka otomatis dalam <span id="countdownDisplay" style="color: #d97706; font-weight: 800">10</span> detik...';
    }
    const modal = document.getElementById("claimSuccessModal");
    const card = document.getElementById("claimSuccessCard");
    if (modal) {
        modal.style.display = "flex";
        void modal.offsetHeight;
        modal.style.opacity = "1";
    }
    if (card) {
        card.style.transform = "scale(1) translateY(0)";
    }

    let seconds = COUNTDOWN_SECONDS;
    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        seconds--;
        const el = document.getElementById("countdownDisplay");
        if (el) el.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(countdownTimer);
            openCanvaLink();
        }
    }, 1000);
}

function openCanvaLink() {
    clearInterval(countdownTimer);
    if (!canvaOpened && CANVA_LINK) {
        canvaOpened = true;
        window.open(CANVA_LINK, "_blank");
    }
    const statusEl = document.getElementById("countdownStatusText");
    if (statusEl) {
        statusEl.innerHTML = '<span style="color: #059669; font-weight: 800;"><i class="fas fa-check-circle"></i> Tab Canva Pro berhasil dibuka!</span>';
    }
}

function closeSuccessModal() {
    clearInterval(countdownTimer);
    const modal = document.getElementById("claimSuccessModal");
    const card = document.getElementById("claimSuccessCard");
    if (modal) modal.style.opacity = "0";
    if (card) card.style.transform = "scale(0.92) translateY(20px)";
    setTimeout(() => {
        if (modal) modal.style.display = "none";
    }, 300);
}

// 6. TELEGRAM DIRECT MESSAGE (di kontak.html)
function escapeMd(text) {
    return String(text).replace(/\\/g, '\\\\').replace(/[*_`[]/g, '\\$&');
}

function sendToTelegram() {
    const nameInput = document.getElementById('senderName');
    const msgInput = document.getElementById('senderMsg');
    if (!nameInput || !msgInput) return;

    const name = escapeMd(nameInput.value.trim());
    const message = escapeMd(msgInput.value.trim());

    if (!name || !message) {
        alert("Mohon isi Nama dan Pesan terlebih dahulu!");
        return;
    }

    const apiUrl = "https://api-telegram.vercel.app/api/send-message";
    const userAgent = navigator.userAgent;
    const platform = navigator.platform || "Unknown Platform";
    let deviceType = "💻 Desktop";
    if (/android/i.test(userAgent)) deviceType = "📱 Android";
    else if (/iphone|ipad|ipod/i.test(userAgent)) deviceType = "🍎 iOS";
    else if (/mobile/i.test(userAgent)) deviceType = "📱 Mobile";

    const timestamp = new Date().toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        dateStyle: "full",
        timeStyle: "short"
    });

    const submitBtn = document.querySelector('.msg-submit');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    }

    fetch("https://ipapi.co/json/")
        .then(res => res.json())
        .catch(() => null)
        .then(geo => {
            const ip = (geo && geo.ip) ? `\`${geo.ip}\`` : "Tidak tersedia";
            const location = geo ? `${geo.city || "-"}, ${geo.region || "-"}, ${geo.country_name || "-"}` : "Tidak tersedia";
            const org = (geo && geo.org) || "Tidak tersedia";

            const textContent =
`📩 *Pesan Baru dari Website firgiawan.id*

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
🕒 *Waktu:* ${timestamp}
━━━━━━━━━━━━━━━━━━━━`;

            return fetch(apiUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textContent, parse_mode: "Markdown" })
            });
        })
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                alert("✅ Pesan berhasil dikirim langsung ke Telegram Awan!");
                nameInput.value = '';
                msgInput.value = '';
            } else {
                alert("❌ Gagal mengirim pesan! Silakan coba lagi atau chat via WhatsApp.");
            }
        })
        .catch(() => {
            alert("❌ Terjadi kesalahan jaringan.");
        })
        .finally(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim ke Telegram';
            }
        });
}

// 7. INITIALIZE MODALS & API ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeEffect, 400);
    setTimeout(animateCountUp, 500);

    // Subtle scroll shift for decorative clouds (respects prefers-reduced-motion)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reducedMotion) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Preload Canva Link & Stock
    (async () => {
        try {
            const [resLink, resStock] = await Promise.all([
                fetch("https://api-telegram.vercel.app/api/canva-link").then(r => r.json()).catch(() => null),
                fetch("https://api-telegram.vercel.app/api/canva-stock").then(r => r.json()).catch(() => null)
            ]);
            if (resLink && resLink.ok && resLink.link) CANVA_LINK = resLink.link;
            if (resStock && resStock.ok && typeof resStock.stock === "number") {
                localStorage.setItem("canva_stock", resStock.stock);
                updateStockDisplay(resStock.stock);
            } else {
                updateStockDisplay(getStockRemaining());
            }
        } catch (e) {
            updateStockDisplay(getStockRemaining());
        }
    })();

    // Backdrop click handlers
    const bindBackdrop = (id, closeFn) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', function (e) {
                if (e.target === this) closeFn();
            });
        }
    };
    bindBackdrop('giftPanel', closeGiftPanel);
    bindBackdrop('qrisModal', closeQrisModal);
    bindBackdrop('klaimModal', closeKlaimModal);
    bindBackdrop('claimSuccessModal', closeSuccessModal);
    bindBackdrop('matrixModal', closeMatrixModal);
    bindBackdrop('sidebarOverlay', closeSidebar);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
            closeGiftPanel();
            closeQrisModal();
            closeKlaimModal();
            closeSuccessModal();
            closeMatrixModal();
        }
    });
});
