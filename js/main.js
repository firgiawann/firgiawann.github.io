        // Set initial theme based on localStorage
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            setTimeout(() => {
                const icon = document.getElementById('themeIcon');
                if(icon) {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            }, 50);
        }

        // Theme Toggle Function
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
        // Tab Switch Logic for SPA (Single Page Application Behavior)
        function switchTab(tabId, element, e) {
            e.preventDefault();
            
            // 1. Update active class pada navigasi bawah
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            element.classList.add('active');

            // 2. Hide all sections & reset scroll position
            document.querySelectorAll('section').forEach(sec => {
                sec.classList.remove('active-tab');
            });

            // 3. Show clicked tab
            let activeSec = document.getElementById(tabId);
            activeSec.classList.add('active-tab');
            activeSec.scrollTo(0, 0); // Balikin ke atas tiap pindah tab
        }

        // Toggle form kirim pesan
        function toggleMessageForm() {
            const formBox = document.getElementById('messageFormBox');
            if (formBox.style.display === 'none' || formBox.style.display === '') {
                formBox.style.display = 'block';
                formBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                formBox.style.display = 'none';
            }
        }

        // Escape Telegram Markdown v1 special characters in user input
        function escapeMd(text) {
            return String(text).replace(/\\/g, '\\\\').replace(/[*_`[]/g, '\\$&');
        }

        // Send Message using Telegram bot API
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

            // Detect device type from User-Agent
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

            // Fetch IP & Location first, then send to Telegram
            fetch("https://ipapi.co/json/")
                .then(res => res.json())
                .then(geo => {
                    const ip = geo.ip || "Tidak diketahui";
                    const city = geo.city || "-";
                    const region = geo.region || "-";
                    const country = geo.country_name || "-";
                    const org = geo.org || "-";

                    const textContent =
`📩 *Pesan Baru dari Website Profile*

👤 *Nama:* ${name}
💬 *Pesan:*
${message}

━━━━━━━━━━━━━━━━━━━━
📊 *Data Pengunjung*
🌐 *IP Address:* \`${ip}\`
📍 *Lokasi:* ${city}, ${region}, ${country}
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
                .catch(() => {
                    // If IP lookup fails, send without geo data
                    const textContent =
`📩 *Pesan Baru dari Website Profile*

👤 *Nama:* ${name}
💬 *Pesan:*
${message}

━━━━━━━━━━━━━━━━━━━━
📊 *Data Pengunjung*
🌐 *IP Address:* Tidak tersedia
📍 *Lokasi:* Tidak tersedia
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
                        toggleMessageForm(); // Tutup form setelah berhasil kirim
                    } else {
                        alert("❌ Gagal mengirim pesan! Silakan coba lagi.");
                    }
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("❌ Terjadi kesalahan jaringan.");
                });
        }

        // Matikan scroll bounce effect bawaan browser di body tapi izinkan di dalam section dan modal
        document.body.addEventListener('touchmove', function(e) {
            if (e.target.closest('section') || e.target.closest('#matrixModal')) {
                // Biarkan scroll berjalan di dalam section dan modal
            } else {
                e.preventDefault();
            }
        }, { passive: false });

        // Calculate Age & Matrix Dynamic Logic
        function calculateAgeAndLifecycle() {
            const birthDate = new Date('2006-04-18');
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            // Update elements with current age
            const ageEls = [document.getElementById('currentAgeValue'), document.getElementById('currentAgeTextValue'), document.getElementById('dynamicPhaseAge')];
            ageEls.forEach(el => {
                if(el) el.innerText = age;
            });
        }
        
        // Setup initial calculations
        calculateAgeAndLifecycle();

        // Matrix Modal Logic
        function openMatrixModal() {
            const modal = document.getElementById('matrixModal');
            modal.style.display = "flex";
            // slight delay to allow display to apply before opacity transition
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
            }, 400); // match transition duration
        }

        // Close modal when clicking outside the card
        window.addEventListener('click', function(event) {
            const modal = document.getElementById('matrixModal');
            if (event.target === modal) {
                closeMatrixModal();
            }
        });
