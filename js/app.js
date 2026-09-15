document.addEventListener('DOMContentLoaded', function() {

    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');
    var menuToggle = document.getElementById('menuToggle');
    var navLinks = document.getElementById('navLinks');

    // Navbar scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    // Back to top
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Mobile menu
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    });

    // Active nav link on scroll
    var sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function() {
        var current = '';
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        document.querySelectorAll('.nav-links a').forEach(function(link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Fade-in animation
    var fadeElements = document.querySelectorAll('.about-content, .about-image, .master-card, .location-card, .contact-info, .contact-form-wrapper');
    fadeElements.forEach(function(el) {
        el.classList.add('fade-in');
    });

    var fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(function(el) {
        fadeObserver.observe(el);
    });

    // Membership form - Firebase
    var membershipForm = document.getElementById('membershipForm');
    var formMessage = document.getElementById('formMessage');

    membershipForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var submitBtn = membershipForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';

        var memberData = {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            age: parseInt(document.getElementById('age').value),
            location: document.getElementById('location').value,
            experience: document.getElementById('experience').value || 'none',
            message: document.getElementById('message').value.trim(),
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        db.collection('members').add(memberData)
            .then(function() {
                formMessage.textContent = 'درخواست شما با موفقیت ثبت شد! به زودی با شما تماس خواهیم گرفت.';
                formMessage.className = 'form-message success';
                membershipForm.reset();
            })
            .catch(function(error) {
                console.error('Error:', error);
                formMessage.textContent = 'خطایی رخ داد. لطفاً با شماره تماس در ارتباط باشید.';
                formMessage.className = 'form-message error';
            })
            .finally(function() {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال درخواست عضویت';
                setTimeout(function() {
                    formMessage.className = 'form-message';
                }, 5000);
            });
    });

});
