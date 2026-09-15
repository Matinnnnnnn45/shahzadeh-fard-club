document.addEventListener('DOMContentLoaded', function() {

    // ===== Preloader =====
    var preloader = document.getElementById('preloader');
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 600);
    });
    // Fallback: hide preloader after 3 seconds max
    setTimeout(function() {
        preloader.classList.add('hidden');
    }, 3000);

    // ===== Header Scroll =====
    var header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ===== Mobile Nav =====
    var headerMenu = document.getElementById('headerMenu');
    var mobileNav = document.getElementById('mobileNav');
    var mobileNavClose = document.getElementById('mobileNavClose');
    var mobileNavOverlay = document.getElementById('mobileNavOverlay');

    function openMobileNav() {
        mobileNav.classList.add('open');
        mobileNavOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeMobileNav() {
        mobileNav.classList.remove('open');
        mobileNavOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    headerMenu.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavOverlay.addEventListener('click', closeMobileNav);

    document.querySelectorAll('.mobile-nav-link').forEach(function(link) {
        link.addEventListener('click', closeMobileNav);
    });

    // ===== Active Nav Link =====
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        var current = '';
        sections.forEach(function(section) {
            if (window.scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.header-nav-link').forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ===== Reveal on Scroll =====
    var revealElements = document.querySelectorAll('.about-text, .about-image, .about-feature, .master-card, .dojo-card, .contact-card, .contact-form-box');
    revealElements.forEach(function(el) { el.classList.add('reveal'); });

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(function(el) { revealObserver.observe(el); });

    // ===== Firebase: Load Dynamic Content =====
    function loadContent() {
        // Load site settings
        db.collection('settings').doc('site').get()
            .then(function(doc) {
                if (doc.exists) {
                    var s = doc.data();
                    if (s.title) document.getElementById('heroTitle').innerHTML = s.title;
                    if (s.badge) document.getElementById('heroBadge').textContent = s.badge;
                    if (s.desc) document.getElementById('heroDesc').textContent = s.desc;
                    if (s.aboutText) document.getElementById('aboutText').innerHTML = s.aboutText;
                    if (s.heroImage) {
                        document.querySelector('.hero-bg').style.backgroundImage = 'url(' + s.heroImage + ')';
                        document.querySelector('.hero-bg').style.backgroundSize = 'cover';
                        document.querySelector('.hero-bg').style.backgroundPosition = 'center';
                    }
                    if (s.aboutImage) {
                        document.getElementById('aboutImage').innerHTML = '<img src="' + s.aboutImage + '" alt="باشگاه" style="width:100%;border-radius:16px">';
                    }
                    if (s.masterPhoto) {
                        document.getElementById('masterPhoto').innerHTML = '<img src="' + s.masterPhoto + '" alt="استاد شاهزاده" style="width:180px;height:180px;border-radius:50%;object-fit:cover">';
                    }
                }
            })
            .catch(function(e) { console.log('Settings error:', e); });

        // Load dojos
        db.collection('dojos').get()
            .then(function(snapshot) {
                if (!snapshot.empty) {
                    var grid = document.getElementById('dojosGrid');
                    grid.innerHTML = '';
                    snapshot.forEach(function(doc) {
                        var d = doc.data();
                        var card = document.createElement('div');
                        card.className = 'dojo-card reveal visible';
                        card.innerHTML =
                            '<div class="dojo-header">' +
                                '<div class="dojo-icon"><i class="fas fa-dumbbell"></i></div>' +
                                '<h3>' + (d.name || '') + '</h3>' +
                            '</div>' +
                            '<div class="dojo-body">' +
                                '<div class="dojo-address">' +
                                    '<i class="fas fa-location-dot"></i>' +
                                    '<span>' + (d.address || '') + '</span>' +
                                '</div>' +
                                '<div class="dojo-info">' +
                                    '<div class="dojo-info-row">' +
                                        '<span class="dojo-info-label"><i class="fas fa-calendar-days"></i> روزها</span>' +
                                        '<span class="dojo-info-value">' + (d.days || '') + '</span>' +
                                    '</div>' +
                                    '<div class="dojo-info-row">' +
                                        '<span class="dojo-info-label"><i class="fas fa-clock"></i> ساعت</span>' +
                                        '<span class="dojo-info-value">' + (d.time || '') + '</span>' +
                                    '</div>' +
                                '</div>' +
                            '</div>';
                        grid.appendChild(card);
                    });
                }
            })
            .catch(function(e) { console.log('Dojos error:', e); });

        // Load contact info
        db.collection('settings').doc('contact').get()
            .then(function(doc) {
                if (doc.exists) {
                    var c = doc.data();
                    // Update contact cards if needed
                }
            })
            .catch(function(e) { console.log('Contact error:', e); });
    }

    loadContent();

    // ===== Firebase: Membership Form =====
    var form = document.getElementById('membershipForm');
    var formMsg = document.getElementById('formMessage');
    var submitBtn = document.getElementById('submitBtn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';

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
                formMsg.textContent = 'درخواست شما با موفقیت ثبت شد! به زودی با شما تماس خواهیم گرفت.';
                formMsg.className = 'form-msg success';
                form.reset();
            })
            .catch(function(error) {
                console.error('Error:', error);
                formMsg.textContent = 'خطایی رخ داد. لطفاً با شماره تماس در ارتباط باشید.';
                formMsg.className = 'form-msg error';
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال درخواست عضویت';
                setTimeout(function() { formMsg.className = 'form-msg'; }, 5000);
            });
    });

});
