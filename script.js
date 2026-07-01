// Menu responsivo
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });

    document.querySelectorAll('.menu a').forEach(link => {
        link.addEventListener('click', () => {
            menu.style.display = 'none';
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menu.style.display = '';
        }
    });
}

// Smooth scroll (excluye el botón del modal)
document.querySelectorAll('a[href^="#"]:not(#btn-agendar)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Efecto fade-in al cargar la página
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
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

document.querySelectorAll('.card-especialidad, .proceso-step, .info-item').forEach(el => {
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

function abrirModal() {
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
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
    formCita.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = formCita.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Enviando...';

        try {
            const res = await fetch(formCita.action, {
                method: 'POST',
                body: new FormData(formCita),
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

console.log('Sitio web de Dra. Nerea de los Reyes cargado correctamente');
