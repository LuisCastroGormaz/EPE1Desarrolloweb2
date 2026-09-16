document.addEventListener('DOMContentLoaded', () => {

  const serviceCards  = document.querySelectorAll('.card-service');
  const hiddenService = document.getElementById('servicioElegido');

  const toggleBtn    = document.getElementById('toggleDetails');
  const extraDetails = document.getElementById('extraDetails');

  const form       = document.getElementById('shipmentForm');
  const clearBtn   = document.getElementById('clearForm');

  const resultPanel = document.querySelector('#resultado > div');

  function selectService(serviceName) {
    serviceCards.forEach((card) => {
      const isMatch = card.dataset.service === serviceName;
      card.classList.toggle('is-selected', isMatch);
    });
    hiddenService.value = serviceName;
  }

  serviceCards.forEach((card) => {
    const button = card.querySelector('.btn-select');

    button.addEventListener('click', () => selectService(card.dataset.service));

    card.addEventListener('click', (event) => {
      if (event.target === button) return; 
      selectService(card.dataset.service);
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectService(card.dataset.service);
      }
    });
  });

  toggleBtn.addEventListener('click', () => {
    const isHidden = extraDetails.hasAttribute('hidden');

    if (isHidden) {
      extraDetails.removeAttribute('hidden');
      toggleBtn.textContent = 'Ocultar condiciones adicionales';
    } else {
      extraDetails.setAttribute('hidden', '');
      toggleBtn.textContent = 'Ver condiciones adicionales';
    }
    toggleBtn.setAttribute('aria-expanded', String(isHidden));
  });

  function validateField(field) {
    const valid = field.checkValidity();
    field.classList.toggle('is-valid', valid);
    field.classList.toggle('is-error', !valid);
    return valid;
  }

  function validateForm() {
    const fields = form.querySelectorAll('input, select');
    let allValid = true;

    fields.forEach((field) => {
      const fieldValid = validateField(field);
      if (!fieldValid) allValid = false;
    });

    return allValid;
  }

  const SERVICE_LABELS = {
    basico: 'Servicio Básico',
    estandar: 'Servicio Estándar',
    prioritario: 'Servicio Prioritario'
  };

  function recommendByUrgency(urgencia) {
    if (urgencia === 'baja') return 'basico';
    if (urgencia === 'media') return 'estandar';
    if (urgencia === 'alta') return 'prioritario';
    return null;
  }

  function renderResult(data) {
    const serviceLabel = SERVICE_LABELS[data.servicio] || data.servicio;

    resultPanel.innerHTML = `
      <dl>
        <dt>Origen</dt>
        <dd>${data.origen}</dd>

        <dt>Destino</dt>
        <dd>${data.destino}</dd>

        <dt>Tipo de envío</dt>
        <dd>${data.tipoEnvio}</dd>

        <dt>Peso</dt>
        <dd>${data.peso} kg</dd>
      </dl>
      <p>Servicio sugerido:</p>
      <span class="result-service">${serviceLabel}</span>
    `;

    selectService(data.servicio);
  }

  function resetResultPanel() {
    resultPanel.innerHTML = '<p>Completa el formulario para ver aquí tu resumen y el servicio sugerido.</p>';
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const formData = {
      origen: form.origen.value.trim(),
      destino: form.destino.value.trim(),
      tipoEnvio: form.tipoEnvio.value,
      urgencia: form.urgencia.value,
      peso: form.peso.value,
      servicio: recommendByUrgency(form.urgencia.value)
    };

    renderResult(formData);
  });

  clearBtn.addEventListener('click', () => {

    setTimeout(() => {
      form.querySelectorAll('input, select').forEach((field) => {
        field.classList.remove('is-valid', 'is-error');
      });
      serviceCards.forEach((card) => card.classList.remove('is-selected'));
      hiddenService.value = '';
      resetResultPanel();
    }, 0);
  });

});