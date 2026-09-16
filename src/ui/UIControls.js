// Wires the fixed HTML HUD (camera buttons + scene option toggles) to
// callbacks provided by main.js. Kept framework-free and dependency-free.
export function setupUI({ onView, onToggleRoof, onToggleLabels, onFlexMode }) {
  const buttons = Array.from(document.querySelectorAll('#camera-controls button[data-view]'));
  const roofToggle = document.getElementById('toggle-roof');
  const labelsToggle = document.getElementById('toggle-labels');
  const flexSelect = document.getElementById('flex-mode');
  const infoText = document.getElementById('info-text');

  function setActiveButton(view) {
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      setActiveButton(view);
      onView(view);
    });
  });

  roofToggle.addEventListener('change', () => onToggleRoof(roofToggle.checked));
  labelsToggle.addEventListener('change', () => onToggleLabels(labelsToggle.checked));
  flexSelect.addEventListener('change', () => onFlexMode(flexSelect.value));

  return {
    setActiveButton,
    setInfoText: (text) => { infoText.textContent = text; },
  };
}
