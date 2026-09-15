document.addEventListener('DOMContentLoaded', function() {

    // ===== TABS =====
    var sidebarLinks = document.querySelectorAll('.sidebar-link');
    var tabContents = document.querySelectorAll('.tab-content');

    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var tab = this.getAttribute('data-tab');
            sidebarLinks.forEach(function(l) { l.classList.remove('active'); });
            this.classList.add('active');
            tabContents.forEach(function(t) { t.classList.remove('active'); });
            document.getElementById('tab-' + tab).classList.add('active');
        });
    });

    // ===== LOGIN =====
    var loginForm = document.getElementById('loginForm');
    var loginBox = document.getElementById('loginBox');
    var dashboard = document.getElementById('dashboard');
    var loginMsg = document.getElementById('loginMsg');

    // Check if already logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loginBox.style.display = 'none';
            dashboard.style.display = 'block';
            loadAllData();
        }
    });

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        var email = document.getElementById('loginEmail').value;
        var pass = document.getElementById('loginPass').value;
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(function() {
                loginBox.style.display = 'none';
                dashboard.style.display = 'block';
                loadAllData();
            })
            .catch(function(err) {
                loginMsg.textContent = 'ایمیل یا رمز اشتباه است.';
                loginMsg.className = 'msg error';
            });
    });

    // ===== LOGOUT =====
    document.getElementById('logoutBtn').addEventListener('click', function() {
        firebase.auth().signOut().then(function() {
            loginBox.style.display = 'flex';
            dashboard.style.display = 'none';
        });
    });

    // ===== LOAD DATA =====
    function loadAllData() {
        loadNewsList();
        loadGalleryList();
        loadMembersList();
        loadSettings();
        countDocs();
    }

    function countDocs() {
        db.collection('members').get().then(function(s) { document.getElementById('memberCount').textContent = s.size; });
        db.collection('news').get().then(function(s) { document.getElementById('newsCount').textContent = s.size; });
        db.collection('gallery').get().then(function(s) { document.getElementById('galleryCount').textContent = s.size; });
    }

    // ===== NEWS =====
    var addNewsBtn = document.getElementById('addNewsBtn');
    var newsFormCard = document.getElementById('newsFormCard');
    var saveNewsBtn = document.getElementById('saveNewsBtn');
    var cancelNewsBtn = document.getElementById('cancelNewsBtn');
    var newsList = document.getElementById('newsList');

    addNewsBtn.addEventListener('click', function() { newsFormCard.style.display = 'block'; });
    cancelNewsBtn.addEventListener('click', function() { newsFormCard.style.display = 'none'; });

    saveNewsBtn.addEventListener('click', function() {
        var data = {
            title: document.getElementById('newsTitle').value,
            description: document.getElementById('newsDesc').value,
            date: document.getElementById('newsDate').value,
            icon: document.getElementById('newsIcon').value || 'fa-trophy',
            createdAt: new Date().toISOString()
        };
        db.collection('news').add(data).then(function() {
            newsFormCard.style.display = 'none';
            document.getElementById('newsTitle').value = '';
            document.getElementById('newsDesc').value = '';
            document.getElementById('newsDate').value = '';
            document.getElementById('newsIcon').value = '';
            loadNewsList();
            countDocs();
        });
    });

    function loadNewsList() {
        db.collection('news').orderBy('createdAt', 'desc').get().then(function(snapshot) {
            newsList.innerHTML = '';
            if (snapshot.empty) {
                newsList.innerHTML = '<div class="empty"><i class="fas fa-newspaper"></i>خبری ثبت نشده</div>';
                return;
            }
            snapshot.forEach(function(doc) {
                var n = doc.data();
                var item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = '<div class="list-item-info"><h4>' + (n.title || '') + '</h4><p>' + (n.date || '') + '</p></div><div class="list-item-actions"><button class="btn btn-danger btn-sm" data-id="' + doc.id + '"><i class="fas fa-trash"></i></button></div>';
                newsList.appendChild(item);
            });
            newsList.querySelectorAll('.btn-danger').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    if (confirm('آیا مطمئن هستید؟')) {
                        db.collection('news').doc(this.getAttribute('data-id')).delete().then(function() {
                            loadNewsList();
                            countDocs();
                        });
                    }
                });
            });
        });
    }

    // ===== GALLERY =====
    var addGalleryBtn = document.getElementById('addGalleryBtn');
    var galleryFormCard = document.getElementById('galleryFormCard');
    var saveGalleryBtn = document.getElementById('saveGalleryBtn');
    var cancelGalleryBtn = document.getElementById('cancelGalleryBtn');
    var galleryList = document.getElementById('galleryList');

    addGalleryBtn.addEventListener('click', function() { galleryFormCard.style.display = 'block'; });
    cancelGalleryBtn.addEventListener('click', function() { galleryFormCard.style.display = 'none'; });

    saveGalleryBtn.addEventListener('click', function() {
        var data = {
            title: document.getElementById('galleryTitle').value,
            image: document.getElementById('galleryUrl').value,
            category: document.getElementById('galleryCategory').value,
            createdAt: new Date().toISOString()
        };
        db.collection('gallery').add(data).then(function() {
            galleryFormCard.style.display = 'none';
            document.getElementById('galleryTitle').value = '';
            document.getElementById('galleryUrl').value = '';
            loadGalleryList();
            countDocs();
        });
    });

    function loadGalleryList() {
        db.collection('gallery').orderBy('createdAt', 'desc').get().then(function(snapshot) {
            galleryList.innerHTML = '';
            if (snapshot.empty) {
                galleryList.innerHTML = '<div class="empty"><i class="fas fa-images"></i>تصویری ثبت نشده</div>';
                return;
            }
            snapshot.forEach(function(doc) {
                var g = doc.data();
                var item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = '<div class="list-item-info"><h4>' + (g.title || '') + '</h4><p>' + (g.category || '') + '</p></div><div class="list-item-actions"><button class="btn btn-danger btn-sm" data-id="' + doc.id + '"><i class="fas fa-trash"></i></button></div>';
                galleryList.appendChild(item);
            });
            galleryList.querySelectorAll('.btn-danger').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    if (confirm('آیا مطمئن هستید؟')) {
                        db.collection('gallery').doc(this.getAttribute('data-id')).delete().then(function() {
                            loadGalleryList();
                            countDocs();
                        });
                    }
                });
            });
        });
    }

    // ===== MEMBERS =====
    var membersList = document.getElementById('membersList');

    function loadMembersList() {
        db.collection('members').orderBy('createdAt', 'desc').get().then(function(snapshot) {
            membersList.innerHTML = '';
            if (snapshot.empty) {
                membersList.innerHTML = '<div class="empty"><i class="fas fa-users"></i>درخواستی ثبت نشده</div>';
                return;
            }
            snapshot.forEach(function(doc) {
                var m = doc.data();
                var item = document.createElement('div');
                item.className = 'list-item';
                item.innerHTML = '<div class="list-item-info"><h4>' + (m.fullName || '') + '</h4><p>' + (m.phone || '') + ' | ' + (m.age || '') + ' سال | ' + (m.location || '') + '</p></div><div class="list-item-actions"><button class="btn btn-danger btn-sm" data-id="' + doc.id + '"><i class="fas fa-trash"></i></button></div>';
                membersList.appendChild(item);
            });
            membersList.querySelectorAll('.btn-danger').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    if (confirm('آیا مطمئن هستید؟')) {
                        db.collection('members').doc(this.getAttribute('data-id')).delete().then(function() {
                            loadMembersList();
                            countDocs();
                        });
                    }
                });
            });
        });
    }

    // ===== SETTINGS =====
    var saveSettingsBtn = document.getElementById('saveSettingsBtn');
    var settingsMsg = document.getElementById('settingsMsg');

    function loadSettings() {
        db.collection('settings').doc('site').get().then(function(doc) {
            if (doc.exists) {
                var s = doc.data();
                document.getElementById('setHeroTitle').value = s.title || '';
                document.getElementById('setHeroBadge').value = s.badge || '';
                document.getElementById('setHeroDesc').value = s.desc || '';
                document.getElementById('setMasterPhoto').value = s.masterPhoto || '';
                document.getElementById('setAboutImage').value = s.aboutImage || '';
                document.getElementById('setHeroImage').value = s.heroImage || '';
            }
        });
    }

    saveSettingsBtn.addEventListener('click', function() {
        var data = {
            title: document.getElementById('setHeroTitle').value,
            badge: document.getElementById('setHeroBadge').value,
            desc: document.getElementById('setHeroDesc').value,
            masterPhoto: document.getElementById('setMasterPhoto').value,
            aboutImage: document.getElementById('setAboutImage').value,
            heroImage: document.getElementById('setHeroImage').value
        };
        db.collection('settings').doc('site').set(data, { merge: true })
            .then(function() {
                settingsMsg.textContent = 'تنظیمات ذخیره شد!';
                settingsMsg.className = 'msg success';
                setTimeout(function() { settingsMsg.className = 'msg'; }, 3000);
            })
            .catch(function() {
                settingsMsg.textContent = 'خطا در ذخیره!';
                settingsMsg.className = 'msg error';
            });
    });

});
