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

    // Close mobile menu when clicking a link
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

    // Intersection Observer for counters
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
    const fadeElements = document.querySelectorAll('.about-content, .about-image, .member-card, .news-card, .contact-info, .contact-form-wrapper');

    fadeElements.forEach(function(el) {
        el.classList.add('fade-in');
    });

    const fadeObserver = new IntersectionObserver(function(entries) {
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

    // ===== Firebase: Membership Form =====
    const membershipForm = document.getElementById('membershipForm');
    const formMessage = document.getElementById('formMessage');

    membershipForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = membershipForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';

        const memberData = {
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            age: parseInt(document.getElementById('age').value),
            group: document.getElementById('group').value,
            experience: document.getElementById('experience').value || 'none',
            message: document.getElementById('message').value.trim(),
            createdAt: new Date().toISOString(),
            status: 'pending'
        };

        try {
            await db.collection('members').add(memberData);

            formMessage.textContent = 'درخواست شما با موفقیت ثبت شد! به زودی با شما تماس خواهیم گرفت.';
            formMessage.className = 'form-message success';
            membershipForm.reset();

        } catch (error) {
            console.error('Error adding member:', error);
            formMessage.textContent = 'خطایی رخ داد. لطفاً دوباره تلاش کنید.';
            formMessage.className = 'form-message error';
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال درخواست عضویت';

        setTimeout(function() {
            formMessage.className = 'form-message';
        }, 5000);
    });

    // ===== Firebase: Load News =====
    async function loadNews() {
        const newsGrid = document.getElementById('newsGrid');
        try {
            const snapshot = await db.collection('news')
                .orderBy('date', 'desc')
                .limit(6)
                .get();

            if (!snapshot.empty) {
                newsGrid.innerHTML = '';
                snapshot.forEach(function(doc) {
                    const news = doc.data();
                    const newsCard = createNewsCard(news);
                    newsGrid.appendChild(newsCard);
                });
            }
        } catch (error) {
            console.log('Using default news content');
        }
    }

    function createNewsCard(news) {
        const card = document.createElement('div');
        card.className = 'news-card fade-in visible';

        const icons = ['fa-trophy', 'fa-graduation-cap', 'fa-calendar-alt', 'fa-star', 'fa-medal'];
        const randomIcon = icons[Math.floor(Math.random() * icons.length)];

        card.innerHTML = `
            <div class="news-image">
                <div class="news-placeholder"><i class="fas ${news.icon || randomIcon}"></i></div>
            </div>
            <div class="news-content">
                <span class="news-date">${news.date || ''}</span>
                <h4>${news.title || ''}</h4>
                <p>${news.description || ''}</p>
            </div>
        `;
        return card;
    }

    // ===== Firebase: Load Schedule =====
    async function loadSchedule() {
        const scheduleBody = document.getElementById('scheduleBody');
        try {
            const snapshot = await db.collection('schedule')
                .orderBy('order')
                .get();

            if (!snapshot.empty) {
                scheduleBody.innerHTML = '';
                snapshot.forEach(function(doc) {
                    const item = doc.data();
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.day || ''}</td>
                        <td>${item.time || ''}</td>
                        <td>${item.group || ''}</td>
                        <td>${item.coach || ''}</td>
                        <td>${item.level || ''}</td>
                    `;
                    scheduleBody.appendChild(row);
                });
            }
        } catch (error) {
            console.log('Using default schedule content');
        }
    }

    // ===== Firebase: Load Members =====
    async function loadMembers() {
        const membersGrid = document.getElementById('membersGrid');
        try {
            const snapshot = await db.collection('coaches')
                .orderBy('order')
                .get();

            if (!snapshot.empty) {
                membersGrid.innerHTML = '';
                snapshot.forEach(function(doc) {
                    const member = doc.data();
                    const card = createMemberCard(member);
                    membersGrid.appendChild(card);
                });
            }
        } catch (error) {
            console.log('Using default members content');
        }
    }

    function createMemberCard(member) {
        const card = document.createElement('div');
        card.className = 'member-card fade-in visible' + (member.featured ? ' featured' : '');

        card.innerHTML = `
            <div class="member-avatar">
                <i class="fas ${member.icon || 'fa-user'}"></i>
            </div>
            <div class="member-info">
                <h4>${member.name || ''}</h4>
                <span class="member-role">${member.role || ''}</span>
                <span class="member-belt">${member.belt || ''}</span>
            </div>
        `;
        return card;
    }

    // Load data from Firebase
    loadNews();
    loadSchedule();
    loadMembers();

    // ===== Smooth scroll for all anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

});
