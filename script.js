
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

    localStorage.setItem('iteacher-lang', lang);
}

document.addEventListener('DOMContentLoaded', function() {
    const savedLang = localStorage.getItem('iteacher-lang') || 'ru';
    const savedBtn = document.querySelector('.lang-btn[data-lang="' + savedLang + '"]');
    setLang(savedLang, savedBtn);
});

// Всё, что ниже в этом блоке, относится только к странице с формой заявки (index.html).
// Проверка ниже защищает vacancies.html и любые будущие страницы от падения скрипта,
// если на них этой формы нет.
if (document.getElementById('cta-form')) {

    document.getElementById('cta-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const phone = document.getElementById('form-phone').value.trim();
        const course = document.getElementById('form-course').value;
        const btn = document.querySelector('.cta-btn');
        const btnLabel = btn.querySelector('span');
        const currentLang = localStorage.getItem('iteacher-lang') || 'ru';

        if (!name || !phone) return;

        if (phone.replace(/\D/g, '').length !== 12) {
            document.getElementById('form-phone').classList.add('error');
            return;
        }

        if (!course) {
            document.getElementById('select-selected').classList.add('error');
            return;
        }
        const consent = document.getElementById('form-consent');
        if (!consent.checked) {
            document.getElementById('cta-consent').classList.add('error');
            return;
        }
        const sendingTexts = { en: '⏳ Sending...', ru: '⏳ Отправка...', uz: '⏳ Yuborilmoqda...' };
        const errorTexts = { en: '❌ Error. Try again.', ru: '❌ Ошибка. Повторите.', uz: '❌ Xatolik. Qaytadan urinish.' };

        btnLabel.textContent = sendingTexts[currentLang] || sendingTexts.ru;
        btn.disabled = true;

        function showError() {
            btnLabel.textContent = errorTexts[currentLang] || errorTexts.ru;
            setTimeout(function() {
                const lang = localStorage.getItem('iteacher-lang') || 'ru';
                btnLabel.textContent = btnLabel.getAttribute('data-' + lang);
                btn.disabled = false;
            }, 3000);
        }

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
                success.textContent = success.getAttribute('data-' + currentLang);
            } else {
                showError();
            }
        } catch (err) {
            showError();
        }
    });

    const customSelect = document.getElementById('custom-select');
    const selectSelectedSpan = document.getElementById('select-selected').querySelector('span');
    const formCourse = document.getElementById('form-course');

    document.getElementById('form-consent').addEventListener('change', function() {
        if (this.checked) {
            document.getElementById('cta-consent').classList.remove('error');
        }
    });

    document.getElementById('custom-select').addEventListener('click', function(e) {
        this.classList.toggle('open');
        e.stopPropagation();
    });

    document.querySelectorAll('.select-option').forEach(function(option) {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('select-selected').classList.remove('error');
            document.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');

            selectSelectedSpan.setAttribute('data-en', this.getAttribute('data-en'));
            selectSelectedSpan.setAttribute('data-ru', this.getAttribute('data-ru'));
            selectSelectedSpan.setAttribute('data-uz', this.getAttribute('data-uz'));

            const currentLang = localStorage.getItem('iteacher-lang') || 'ru';
            selectSelectedSpan.textContent = this.getAttribute('data-' + currentLang);

            formCourse.value = this.getAttribute('data-value');
            customSelect.classList.remove('open');
        });
    });

    document.addEventListener('click', function() {
        if (customSelect) customSelect.classList.remove('open');
    });

    const phoneInput = document.getElementById('form-phone');
    let prevDigitsCount = 0;

    phoneInput.addEventListener('input', function (e) {
        e.target.classList.remove('error');

        let numbers = e.target.value.replace(/\D/g, '');

        if (!numbers) {
            e.target.value = '';
            prevDigitsCount = 0;
            return;
        }

        if (numbers.startsWith('998')) {
            numbers = numbers.substring(3);
        }

        numbers = numbers.substring(0, 9);

        if (e.inputType === 'deleteContentBackward' &&
            numbers.length > 0 &&
            numbers.length === prevDigitsCount) {
            numbers = numbers.slice(0, -1);
        }

        prevDigitsCount = numbers.length;

        let formatted = '+998 ';

        if (numbers.length > 0) {
            formatted += '(' + numbers.substring(0, 2);
        }
        if (numbers.length >= 2) {
            formatted += ') ';
        }
        if (numbers.length > 2) {
            formatted += numbers.substring(2, 5);
        }
        if (numbers.length >= 5) {
            formatted += '-';
        }
        if (numbers.length > 5) {
            formatted += numbers.substring(5, 7);
        }
        if (numbers.length >= 7) {
            formatted += '-';
        }
        if (numbers.length > 7) {
            formatted += numbers.substring(7, 9);
        }

        e.target.value = formatted;
    });

    phoneInput.addEventListener('focus', function (e) {
        if (!e.target.value) {
            e.target.value = '+998 ';
        }
    });

    phoneInput.addEventListener('blur', function (e) {
        if (e.target.value === '+998 ') {
            e.target.value = '';
        }
    });

}

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

const asciiCow = `
 -------------------
 < Happy Hacking! -stsw >
 -------------------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`;


console.log(
  `%c${asciiCow}`, 
  "color: #22c55e; font-family: monospace; font-weight: bold; line-height: 1.2;"
);
const branchButtons = document.querySelectorAll('.branch-nav-btn');
const branchContents = document.querySelectorAll('.branch-content');
const branchIframe = document.getElementById('branch-iframe');

const mapSources = {
    'branch-yangi-a': 'https://google.com',
    'branch-yangi-b': 'https://google.com',
    'branch-biz-center': 'https://google.com',
    'branch-severniy': 'https://google.com',
    'branch-klara': 'https://google.com',
    'branch-eski': 'https://google.com'
};

branchButtons.forEach(button => {
    button.addEventListener('click', () => {
        branchButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const targetId = button.getAttribute('data-target');

        branchContents.forEach(content => content.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');

        if (mapSources[targetId]) {
            branchIframe.src = mapSources[targetId];
        }
    });
});
const spider = document.querySelector('.footer-spider');
if (spider) {
  document.addEventListener('mousemove', (e) => {
    const r = spider.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    spider.style.setProperty('--ex', (dx / d) * 1.5 + 'px');
    spider.style.setProperty('--ey', (dy / d) * 1.5 + 'px');
  });
}

document.querySelectorAll('.vacancy-card-header').forEach(function(header) {
    header.addEventListener('click', function() {
        this.closest('.vacancy-card').classList.toggle('open');
    });
});