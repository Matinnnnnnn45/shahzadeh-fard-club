document.addEventListener('DOMContentLoaded', function() {

    // ===== CACHED DOM REFERENCES =====
    var loader = document.getElementById('loader');
    var loaderCanvas = document.getElementById('loaderCanvas');
    var smokeCanvas = document.getElementById('smokeCanvas');
    var scrollProg = document.getElementById('scrollProgress');
    var hdr = document.getElementById('hdr');
    var burger = document.getElementById('hdrBurger');
    var mobnav = document.getElementById('mobnav');
    var mobClose = document.getElementById('mobnavClose');
    var mobBg = document.getElementById('mobnavBg');
    var secs = document.querySelectorAll('section[id]');
    var hdrLinks = document.querySelectorAll('.hdr-link');
    var reveals = document.querySelectorAll('[data-anim]');
    var counters = document.querySelectorAll('.trophy-val[data-count]');
    var master3d = document.getElementById('master3d');
    var masterCard = document.getElementById('masterCard');
    var filterBtns = document.querySelectorAll('.gallery-filter');
    var galleryItems = document.querySelectorAll('.gallery-item');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');
    var isMobile = window.innerWidth <= 992;

    // ===== LOADER =====
    var lCtx = loaderCanvas.getContext('2d');
    var sparks = [];

    function resizeLoader() {
        loaderCanvas.width = window.innerWidth;
        loaderCanvas.height = window.innerHeight;
    }
    resizeLoader();

    function Spark() {
        this.x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
        this.y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
        this.color = Math.random() > 0.5 ? '212,175,55' : '139,0,0';
    }
    Spark.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.speedY += 0.02;
    };
    Spark.prototype.draw = function() {
        lCtx.beginPath();
        lCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        lCtx.fillStyle = 'rgba(' + this.color + ',' + this.life + ')';
        lCtx.fill();
    };

    function animateSparks() {
        lCtx.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
        if (sparks.length < 100) sparks.push(new Spark());
        sparks = sparks.filter(function(s) { return s.life > 0; });
        sparks.forEach(function(s) { s.update(); s.draw(); });
        if (!loader.classList.contains('hidden')) requestAnimationFrame(animateSparks);
    }
    animateSparks();

    setTimeout(function() {
        loader.classList.add('hidden');
    }, 3000);

    // ===== SMOKE CANVAS (visibility-aware, reduced particles) =====
    var sCtx = smokeCanvas.getContext('2d');
    var smokeParticles = [];
    var smokeRunning = true;
    var smokeCount = isMobile ? 6 : 14;

    function resizeSmoke() {
        smokeCanvas.width = window.innerWidth;
        smokeCanvas.height = window.innerHeight;
    }
    resizeSmoke();

    function Smoke() {
        this.x = Math.random() * smokeCanvas.width;
        this.y = smokeCanvas.height + 20;
        this.size = Math.random() * 80 + 40;
        this.speedY = -(Math.random() * 0.5 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.03 + 0.01;
    }
    Smoke.prototype.update = function() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.size += 0.2;
        if (this.y < -this.size) {
            this.y = smokeCanvas.height + this.size;
            this.x = Math.random() * smokeCanvas.width;
        }
    };
    Smoke.prototype.draw = function() {
        sCtx.beginPath();
        sCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        sCtx.fillStyle = 'rgba(100,100,100,' + this.opacity + ')';
        sCtx.fill();
    };

    for (var i = 0; i < smokeCount; i++) smokeParticles.push(new Smoke());

    function animateSmoke() {
        if (!smokeRunning) { requestAnimationFrame(animateSmoke); return; }
        sCtx.clearRect(0, 0, smokeCanvas.width, smokeCanvas.height);
        smokeParticles.forEach(function(p) { p.update(); p.draw(); });
        requestAnimationFrame(animateSmoke);
    }
    animateSmoke();

    // Pause smoke when page hidden
    document.addEventListener('visibilitychange', function() {
        smokeRunning = !document.hidden;
    });

    window.addEventListener('resize', function() {
        resizeSmoke();
        isMobile = window.innerWidth <= 992;
    });

    // ===== CUSTOM CURSOR (throttled, desktop only) =====
    if (!isMobile) {
        var curOuter = document.getElementById('cursorOuter');
        var curInner = document.getElementById('cursorInner');
        var mouseX = 0, mouseY = 0;
        var outerX = 0, outerY = 0;
        var cursorTicking = false;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!cursorTicking) {
                cursorTicking = true;
                requestAnimationFrame(function() {
                    curInner.style.left = mouseX + 'px';
                    curInner.style.top = mouseY + 'px';
                    cursorTicking = false;
                });
            }
        }, { passive: true });

        function animateCursor() {
            outerX += (mouseX - outerX) * 0.15;
            outerY += (mouseY - outerY) * 0.15;
            curOuter.style.left = outerX + 'px';
            curOuter.style.top = outerY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Event delegation for cursor hover
        document.addEventListener('mouseover', function(e) {
            var t = e.target;
            if (t.matches && (t.matches('a,button,.gallery-item,.hdr-burger,.mobnav-close') || t.closest('a,button,.gallery-item,.hdr-burger,.mobnav-close'))) {
                curOuter.classList.add('hover');
            }
        }, { passive: true });
        document.addEventListener('mouseout', function(e) {
            var t = e.target;
            if (t.matches && (t.matches('a,button,.gallery-item,.hdr-burger,.mobnav-close') || t.closest('a,button,.gallery-item,.hdr-burger,.mobnav-close'))) {
                curOuter.classList.remove('hover');
            }
        }, { passive: true });
    }

    // ===== COMBINED SCROLL HANDLER (passive, single listener) =====
    var scrollTicking = false;

    function onScroll() {
        if (!scrollTicking) {
            scrollTicking = true;
            requestAnimationFrame(function() {
                var scrollY = window.scrollY;
                var docEl = document.documentElement;
                var maxScroll = docEl.scrollHeight - docEl.clientHeight;

                // Scroll progress
                scrollProg.style.width = ((scrollY / maxScroll) * 100) + '%';

                // Header scrolled state
                hdr.classList.toggle('scrolled', scrollY > 50);

                // Active nav
                var cur = '';
                for (var i = 0; i < secs.length; i++) {
                    if (scrollY >= secs[i].offsetTop - 200) cur = secs[i].id;
                }
                for (var j = 0; j < hdrLinks.length; j++) {
                    var isActive = hdrLinks[j].getAttribute('href') === '#' + cur;
                    hdrLinks[j].classList.toggle('active', isActive);
                }

                scrollTicking = false;
            });
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ===== MOBILE NAV =====
    function openMob() { mobnav.classList.add('open'); mobBg.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeMob() { mobnav.classList.remove('open'); mobBg.classList.remove('open'); document.body.style.overflow = ''; }
    burger.addEventListener('click', openMob);
    mobClose.addEventListener('click', closeMob);
    mobBg.addEventListener('click', closeMob);
    document.querySelectorAll('.mobnav-link').forEach(function(l) { l.addEventListener('click', closeMob); });

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
            var t = document.querySelector(this.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ===== REVEAL ON SCROLL (IntersectionObserver) =====
    var revealObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    reveals.forEach(function(el) { revealObs.observe(el); });

    // ===== COUNTER ANIMATION (rAF-based) =====
    var counterObs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var el = entry.target;
                var target = parseInt(el.getAttribute('data-count'));
                var duration = 2000;
                var startTime = null;

                function stepCounter(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    var eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(stepCounter);
                    else el.textContent = target;
                }
                requestAnimationFrame(stepCounter);
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { counterObs.observe(c); });

    // ===== 3D MASTER CARD =====
    if (master3d && masterCard && !isMobile) {
        var masterTicking = false;
        master3d.addEventListener('mousemove', function(e) {
            if (!masterTicking) {
                masterTicking = true;
                requestAnimationFrame(function() {
                    var rect = master3d.getBoundingClientRect();
                    var x = e.clientX - rect.left;
                    var y = e.clientY - rect.top;
                    var centerX = rect.width / 2;
                    var centerY = rect.height / 2;
                    var rotateX = (y - centerY) / 20;
                    var rotateY = (centerX - x) / 20;
                    masterCard.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
                    masterTicking = false;
                });
            }
        }, { passive: true });
        master3d.addEventListener('mouseleave', function() {
            masterCard.style.transform = 'rotateX(0) rotateY(0)';
        });
    }

    // ===== GALLERY FILTER =====
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');
            galleryItems.forEach(function(item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ===== LIGHTBOX =====
    lightboxClose.addEventListener('click', function() { lightbox.classList.remove('active'); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) lightbox.classList.remove('active'); });
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
            }
        });
    });

    // ===== FIREBASE (deferred to after page interactive) =====
    function loadFirebaseContent() {
        // Settings
        db.collection('settings').doc('site').get()
            .then(function(doc) {
                if (doc.exists) {
                    var s = doc.data();
                    if (s.title) document.getElementById('heroTitle').innerHTML = s.title;
                    if (s.badge) document.querySelector('.hero-badge span:nth-child(2)').textContent = s.badge;
                    if (s.desc) document.getElementById('heroDesc').textContent = s.desc;
                    if (s.heroImage) {
                        document.querySelector('.hero-bg').style.backgroundImage = 'url(' + s.heroImage + ')';
                        document.querySelector('.hero-bg').style.backgroundSize = 'cover';
                    }
                    if (s.aboutImage) {
                        document.getElementById('masterPhoto').innerHTML = '<img src="' + s.aboutImage + '" alt="استاد" style="width:100%;height:100%;border-radius:50%;object-fit:cover">';
                    }
                    if (s.gallery && Array.isArray(s.gallery)) {
                        var grid = document.getElementById('galleryGrid');
                        grid.innerHTML = '';
                        s.gallery.forEach(function(item, i) {
                            var el = document.createElement('div');
                            el.className = 'gallery-item' + (i % 3 === 0 ? ' gallery-item-lg' : '');
                            el.setAttribute('data-category', item.category || 'training');
                            el.innerHTML = '<img src="' + item.url + '" alt="' + (item.title || 'گالری') + '" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover">';
                            grid.appendChild(el);
                        });
                        rebindGalleryItems();
                    }
                }
            })
            .catch(function(e) { console.log('Settings:', e); });

        // Gallery
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
                            item.setAttribute('data-category', d.category || 'training');
                            item.innerHTML = '<img src="' + d.image + '" alt="' + (d.title || 'گالری') + '" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover">';
                            grid.appendChild(item);
                        }
                    });
                    rebindGalleryItems();
                }
            })
            .catch(function(e) { console.log('Gallery:', e); });

        // News
        db.collection('news').get()
            .then(function(snapshot) {
                if (!snapshot.empty) {
                    var grid = document.getElementById('newsGrid');
                    grid.innerHTML = '';
                    snapshot.forEach(function(doc) {
                        var n = doc.data();
                        var card = document.createElement('div');
                        card.className = 'news-card';
                        card.innerHTML = '<div class="news-card-img"><i class="fas ' + (n.icon || 'fa-trophy') + '"></i></div><div class="news-card-body"><span class="news-card-date">' + (n.date || '') + '</span><h4>' + (n.title || '') + '</h4><p>' + (n.description || '') + '</p></div>';
                        grid.appendChild(card);
                    });
                }
            })
            .catch(function(e) { console.log('News:', e); });
    }

    function rebindGalleryItems() {
        var items = document.querySelectorAll('.gallery-item');
        items.forEach(function(item) {
            item.addEventListener('click', function() {
                var img = item.querySelector('img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                }
            });
        });
    }

    // Defer Firebase until after first paint
    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadFirebaseContent, { timeout: 2000 });
    } else {
        setTimeout(loadFirebaseContent, 100);
    }

    // ===== FORM =====
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
