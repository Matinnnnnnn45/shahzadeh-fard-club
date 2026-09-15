document.addEventListener('DOMContentLoaded', function() {

    // ===== LOADER =====
    var loader = document.getElementById('loader');
    setTimeout(function() { loader.classList.add('hidden'); }, 2500);

    // ===== CUSTOM CURSOR =====
    var cursor = document.getElementById('cursor');
    var cursorDot = document.getElementById('cursorDot');
    if (window.innerWidth > 992) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
        document.querySelectorAll('a,button,.gallery-item').forEach(function(el) {
            el.addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
            el.addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
        });
    }

    // ===== SCROLL PROGRESS =====
    var scrollProgress = document.getElementById('scrollProgress');
    window.addEventListener('scroll', function() {
        var h = document.documentElement;
        var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
        scrollProgress.style.width = pct + '%';
    });

    // ===== PARTICLES =====
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var particles = [];
    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    Particle.prototype.update = function() {
        this.x += this.speedX; this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    };
    Particle.prototype.draw = function() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(220,38,38,' + this.opacity + ')'; ctx.fill();
    };
    for (var i = 0; i < 60; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) { p.update(); p.draw(); });
        for (var a = 0; a < particles.length; a++) {
            for (var b = a + 1; b < particles.length; b++) {
                var dx = particles[a].x - particles[b].x;
                var dy = particles[a].y - particles[b].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = 'rgba(220,38,38,' + (0.08 * (1 - dist / 120)) + ')';
                    ctx.lineWidth = 0.5; ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ===== HEADER =====
    var hdr = document.getElementById('hdr');
    window.addEventListener('scroll', function() {
        hdr.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== MOBILE NAV =====
    var burger = document.getElementById('hdrBurger');
    var mobnav = document.getElementById('mobnav');
    var mobClose = document.getElementById('mobnavClose');
    var mobBg = document.getElementById('mobnavBg');
    function openMob() { mobnav.classList.add('open'); mobBg.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeMob() { mobnav.classList.remove('open'); mobBg.classList.remove('open'); document.body.style.overflow = ''; }
    burger.addEventListener('click', openMob);
    mobClose.addEventListener('click', closeMob);
    mobBg.addEventListener('click', closeMob);
    document.querySelectorAll('.mobnav-link').forEach(function(l) { l.addEventListener('click', closeMob); });

    // ===== ACTIVE NAV =====
    var secs = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        var cur = '';
        secs.forEach(function(s) { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
        document.querySelectorAll('.hdr-nav-link').forEach(function(l) {
            l.classList.remove('active');
            if (l.getAttribute('href') === '#' + cur) l.classList.add('active');
        });
    });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            var t = document.querySelector(this.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== REVEAL ON SCROLL =====
    var reveals = document.querySelectorAll('[data-anim]');
    var revealObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(function(el) { revealObs.observe(el); });

    // ===== COUNTER ANIMATION =====
    var counters = document.querySelectorAll('.stat-val[data-count]');
    var counterObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'));
                var duration = 2000;
                var step = target / (duration / 16);
                var current = 0;
                var timer = setInterval(function() {
                    current += step;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, 16);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { counterObs.observe(c); });

    // ===== FIREBASE: LOAD CONTENT =====
    db.collection('settings').doc('site').get()
        .then(function(doc) {
            if (doc.exists) {
                var s = doc.data();
                if (s.title) document.getElementById('heroTitle').innerHTML = s.title;
                if (s.badge) document.getElementById('heroBadge').textContent = s.badge;
                if (s.desc) document.getElementById('heroDesc').textContent = s.desc;
                if (s.aboutTitle) document.getElementById('aboutTitle').textContent = s.aboutTitle;
                if (s.aboutText) document.getElementById('aboutText').innerHTML = '<p>' + s.aboutText + '</p>';
                if (s.heroImage) {
                    document.querySelector('.hero-bg').style.backgroundImage = 'url(' + s.heroImage + ')';
                    document.querySelector('.hero-bg').style.backgroundSize = 'cover';
                }
                if (s.aboutImage) {
                    document.getElementById('aboutImage').innerHTML = '<img src="' + s.aboutImage + '" alt="باشگاه" style="width:100%;border-radius:16px;aspect-ratio:1;object-fit:cover">';
                }
                if (s.masterPhoto) {
                    document.getElementById('masterPhoto').innerHTML = '<div class="master-photo"><img src="' + s.masterPhoto + '" alt="استاد" style="width:100%;height:100%;border-radius:50%;object-fit:cover;position:relative;z-index:2"><div class="master-photo-ring"></div></div>';
                }
                // Gallery
                if (s.gallery && Array.isArray(s.gallery)) {
                    var grid = document.getElementById('galleryGrid');
                    grid.innerHTML = '';
                    s.gallery.forEach(function(url, i) {
                        var item = document.createElement('div');
                        item.className = 'gallery-item' + (i % 3 === 0 ? ' gallery-item-lg' : '');
                        item.innerHTML = '<img src="' + url + '" alt="گالری" style="width:100%;height:100%;object-fit:cover">';
                        grid.appendChild(item);
                    });
                }
            }
        })
        .catch(function(e) { console.log('Settings:', e); });

    // ===== FIREBASE: GALLERY COLLECTION =====
    db.collection('gallery').get()
        .then(function(snapshot) {
            if (!snapshot.empty) {
                var grid = document.getElementById('galleryGrid');
                grid.innerHTML = '';
                snapshot.forEach(function(doc) {
                    var d = doc.data();
                    if (d.image) {
                        var item = document.createElement('div');
                        item.className = 'gallery-item';
                        item.innerHTML = '<img src="' + d.image + '" alt="' + (d.title || 'گالری') + '" style="width:100%;height:100%;object-fit:cover">';
                        grid.appendChild(item);
                    }
                });
            }
        })
        .catch(function(e) { console.log('Gallery:', e); });

    // ===== FIREBASE: TESTIMONIALS =====
    db.collection('testimonials').get()
        .then(function(snapshot) {
            if (!snapshot.empty) {
                var grid = document.querySelector('.testimonials-grid');
                grid.innerHTML = '';
                snapshot.forEach(function(doc) {
                    var t = doc.data();
                    var card = document.createElement('div');
                    card.className = 'testimonial-card';
                    card.innerHTML =
                        '<div class="testimonial-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>' +
                        '<p class="testimonial-text">«' + (t.text || '') + '»</p>' +
                        '<div class="testimonial-author"><div class="testimonial-avatar"><i class="fas fa-user"></i></div><div><h5>' + (t.name || '') + '</h5><span>' + (t.role || '') + '</span></div></div>';
                    grid.appendChild(card);
                });
            }
        })
        .catch(function(e) { console.log('Testimonials:', e); });

    // ===== FIREBASE: FORM =====
    var form = document.getElementById('membershipForm');
    var fMsg = document.getElementById('formMessage');
    var sBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        sBtn.disabled = true;
        sBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';

        var data = {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            age: parseInt(document.getElementById('age').value),
            location: document.getElementById('location').value,
            experience: document.getElementById('experience').value || 'none',
            message: document.getElementById('message').value.trim(),
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        db.collection('members').add(data)
            .then(function() {
                fMsg.textContent = 'درخواست ثبت شد! به زودی تماس می‌گیریم.';
                fMsg.className = 'f-msg success';
                form.reset();
            })
            .catch(function() {
                fMsg.textContent = 'خطا! لطفاً با شماره تماس بگیرید.';
                fMsg.className = 'f-msg error';
            })
            .finally(function() {
                sBtn.disabled = false;
                sBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال درخواست';
                setTimeout(function() { fMsg.className = 'f-msg'; }, 5000);
            });
    });

});
