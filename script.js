const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('open');
    if (navMenu.classList.contains('open')) {
        hamburger.textContent = '✕';
    } else {
        hamburger.textContent = '☰';
    }
});

document.querySelectorAll('.nav-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
        navMenu.classList.remove('open');
        hamburger.textContent = '☰';
    });
});
function setLang(lang, btn) {
    document.querySelectorAll('[data-en]').forEach(function(el) {
        const translation = el.getAttribute('data-' + lang);
        if (translation) {
            el.textContent = translation;
        }
    });
document.querySelectorAll('[data-en-placeholder]').forEach(function(el) {
        const translation = el.getAttribute('data-' + lang + '-placeholder');
        if (translation) {
            el.placeholder = translation;
        }
    });
    document.querySelectorAll('.lang-btn').forEach(function(b) {
        b.classList.remove('active');
    });

    if (btn) {
        btn.classList.add('active');
    }

    localStorage.setItem('sakura-lang', lang);
}

document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('sakura-lang') || 'en';
    const savedBtn = document.querySelector('.lang-btn[data-lang="' + savedLang + '"]');
    setLang(savedLang, savedBtn);
});

document.getElementById('cta-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const phone = document.getElementById('form-phone').value.trim();
    const course = document.getElementById('form-course').value;
    const btn = document.querySelector('.cta-btn');

    if (!name || !phone) return;
if (!course) {
    document.getElementById('select-selected').style.border = '2px solid #e60000';
    return;
}

    btn.textContent = '⏳ Sending...';
    btn.disabled = true;
    try {
        const response = await fetch('/api/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, course })
        });

        const data = await response.json();

        if (data.ok) {
            document.getElementById('cta-form').style.display = 'none';
            const success = document.getElementById('cta-success');
            success.style.display = 'block';
            success.textContent = success.getAttribute('data-' + (localStorage.getItem('sakura-lang') || 'en'));
        } else {
            btn.textContent = '❌ Error. Try again.';
            btn.disabled = false;
        }
    } catch (err) {
        btn.textContent = '❌ Error. Try again.';
        btn.disabled = false;
    }
    document.getElementById('select-selected').style.border = 'none';
});
const customSelect = document.getElementById('custom-select');
const selectSelected = document.getElementById('select-selected').querySelector('span');
const selectDropdown = document.getElementById('select-dropdown');
const formCourse = document.getElementById('form-course');

document.getElementById('custom-select').addEventListener('click', function(e) {
    this.classList.toggle('open');
    e.stopPropagation();
});

document.querySelectorAll('.select-option').forEach(function(option) {
    option.addEventListener('click', function() {
        document.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
        this.classList.add('selected');
        selectSelected.textContent = this.textContent;
        formCourse.value = this.getAttribute('data-value');
        customSelect.classList.remove('open');
    });
});

document.addEventListener('click', function() {
    customSelect.classList.remove('open');
});
document.querySelectorAll('.faq-question').forEach(function(question) {
    question.addEventListener('click', function() {

        const item = this.closest('.faq-item');

        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(function(openItem) {
            openItem.classList.remove('open');
        });

        if (!isOpen) {
            item.classList.add('open');
        }
    });
});