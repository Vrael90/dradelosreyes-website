// Menu responsivo
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');

    menuToggle.addEventListener('click', () => {
        const abierto = menu.style.display === 'flex';
        menu.style.display = abierto ? 'none' : 'flex';
        menuToggle.setAttribute('aria-expanded', String(!abierto));
    });

    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.style.display = 'none';
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menu.style.display = '';
        }
    });
}

// Smooth scroll (excluye los botones que abren el modal)
document.querySelectorAll('a[href^="#"]:not(#btn-agendar):not(#btn-email-modal)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return; // enlaces sin destino: no hacer nada
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animación de scroll para elementos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card-especialidad, .proceso-step, .info-item, .faq-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Modal agendar cita
const modalOverlay = document.getElementById('modal-cita');
const btnAgendar = document.getElementById('btn-agendar');
const btnCerrar = document.querySelector('.modal-close');
const formCita = document.getElementById('form-cita');
const formSuccess = document.getElementById('form-success');

let ultimoFoco = null;

function abrirModal() {
    ultimoFoco = document.activeElement;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Trasladar el foco al primer campo del formulario
    const primerCampo = modalOverlay.querySelector('input, textarea, button');
    if (primerCampo) primerCampo.focus();
}

function cerrarModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Devolver el foco al elemento que abrió el modal
    if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
}

// Focus trap: mantener la tabulación dentro del modal mientras está abierto
if (modalOverlay) {
    modalOverlay.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !modalOverlay.classList.contains('open')) return;
        const focusables = modalOverlay.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])'
        );
        if (!focusables.length) return;
        const primero = focusables[0];
        const ultimo = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === primero) {
            e.preventDefault();
            ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
            e.preventDefault();
            primero.focus();
        }
    });
}

if (btnAgendar) {
    btnAgendar.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModal();
    });
}

const btnEmailModal = document.getElementById('btn-email-modal');
if (btnEmailModal) {
    btnEmailModal.addEventListener('click', (e) => {
        e.preventDefault();
        abrirModal();
    });
}

if (btnCerrar) {
    btnCerrar.addEventListener('click', cerrarModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) cerrarModal();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
        cerrarModal();
    }
});

if (formCita) {
    // Validación del checkbox de privacidad
    const checkboxPrivacidad = document.getElementById('privacidad');
    const errorPrivacidad = document.getElementById('privacidad-error');

    if (checkboxPrivacidad && errorPrivacidad) {
        checkboxPrivacidad.addEventListener('change', () => {
            if (checkboxPrivacidad.checked) errorPrivacidad.hidden = true;
        });
    }

    formCita.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Bloquear si el checkbox no está marcado
        if (checkboxPrivacidad && !checkboxPrivacidad.checked) {
            if (errorPrivacidad) errorPrivacidad.hidden = false;
            checkboxPrivacidad.focus();
            return;
        }

        // — Lógica de envío original, sin cambios —
        const btn = formCita.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        const formData = new FormData(formCita);
        formData.delete('privacidad'); // el campo interno no se envía a Formspree

        try {
            const res = await fetch(formCita.action, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' }
            });

            if (res.ok) {
                formCita.hidden = true;
                formSuccess.removeAttribute('hidden');
            } else {
                btn.disabled = false;
                btn.textContent = 'Enviar solicitud';
                alert('Ha ocurrido un error. Por favor inténtalo de nuevo.');
            }
        } catch {
            btn.disabled = false;
            btn.textContent = 'Enviar solicitud';
            alert('Ha ocurrido un error. Por favor inténtalo de nuevo.');
        }
    });
}

