// =============================================
// Main Application Script
// =============================================

document.addEventListener('DOMContentLoaded', function() {

    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    });

    // ===== Back to Top =====
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== Mobile Menu Toggle =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // ===== Active Nav Link =====
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(function(section) {
            const sectionTop = section.offsetTop - 200;
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

    // ===== Counter Animation =====
    const counters = document.querySelectorAll('.stat-number');

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(function() {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16);
    }

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
        counterObserver.observe(counter);
    });

    // ===== Fade-in Animation =====
    function setupFadeIn() {
        var fadeElements = document.querySelectorAll('.about-content, .about-image, .member-card, .news-card, .contact-info, .contact-form-wrapper');

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
    }

    // ===== Firebase: Membership Form =====
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
            group: document.getElementById('group').value,
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
                console.error('Error adding member:', error);
                formMessage.textContent = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
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

    // ===== Firebase: Load News =====
    function loadNews() {
        var newsGrid = document.getElementById('newsGrid');
        var defaultNewsHTML = newsGrid.innerHTML;

        db.collection('news').get()
            .then(function(snapshot) {
                if (!snapshot.empty) {
                    newsGrid.innerHTML = '';
                    snapshot.forEach(function(doc) {
                        var news = doc.data();
                        var card = document.createElement('div');
                        card.className = 'news-card fade-in visible';

                        var icons = ['fa-trophy', 'fa-graduation-cap', 'fa-calendar-alt', 'fa-star', 'fa-medal'];
                        var randomIcon = icons[Math.floor(Math.random() * icons.length)];

                        card.innerHTML =
                            '<div class="news-image">' +
                                '<div class="news-placeholder"><i class="fas ' + (news.icon || randomIcon) + '"></i></div>' +
                            '</div>' +
                            '<div class="news-content">' +
                                '<span class="news-date">' + (news.date || '') + '</span>' +
                                '<h4>' + (news.title || '') + '</h4>' +
                                '<p>' + (news.description || '') + '</p>' +
                            '</div>';
                        newsGrid.appendChild(card);
                    });
                }
            })
            .catch(function(error) {
                console.error('Error loading news:', error);
            });
    }

    // ===== Firebase: Load Schedule =====
    function loadSchedule() {
        var scheduleBody = document.getElementById('scheduleBody');

        db.collection('schedule').get()
            .then(function(snapshot) {
                if (!snapshot.empty) {
                    scheduleBody.innerHTML = '';
                    snapshot.forEach(function(doc) {
                        var item = doc.data();
                        var row = document.createElement('tr');
                        row.innerHTML =
                            '<td>' + (item.day || '') + '</td>' +
                            '<td>' + (item.time || '') + '</td>' +
                            '<td>' + (item.group || '') + '</td>' +
                            '<td>' + (item.coach || '') + '</td>' +
                            '<td>' + (item.level || '') + '</td>';
                        scheduleBody.appendChild(row);
                    });
                }
            })
            .catch(function(error) {
                console.error('Error loading schedule:', error);
            });
    }

    // ===== Firebase: Load Members =====
    function loadMembers() {
        var membersGrid = document.getElementById('membersGrid');

        db.collection('coaches').get()
            .then(function(snapshot) {
                if (!snapshot.empty) {
                    membersGrid.innerHTML = '';
                    snapshot.forEach(function(doc) {
                        var member = doc.data();
                        var card = document.createElement('div');
                        var isFeatured = member.featured ? ' featured' : '';
                        card.className = 'member-card fade-in visible' + isFeatured;

                        card.innerHTML =
                            '<div class="member-avatar">' +
                                '<i class="fas ' + (member.icon || 'fa-user') + '"></i>' +
                            '</div>' +
                            '<div class="member-info">' +
                                '<h4>' + (member.name || '') + '</h4>' +
                                '<span class="member-role">' + (member.role || '') + '</span>' +
                                '<span class="member-belt">' + (member.belt || '') + '</span>' +
                            '</div>';
                        membersGrid.appendChild(card);
                    });
                }
            })
            .catch(function(error) {
                console.error('Error loading members:', error);
            });
    }

    // ===== Init =====
    loadNews();
    loadSchedule();
    loadMembers();
    setupFadeIn();

    // ===== Smooth scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
