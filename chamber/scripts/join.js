// Set timestamp hidden field to the current date/time when the form loads
const timestampField = document.getElementById('timestamp');
if (timestampField) {
  timestampField.value = new Date().toLocaleString();
}

// Modal: open when a membership card link is clicked
document.querySelectorAll('.membership-card-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const modal = document.getElementById(link.dataset.modal);
    if (modal) modal.showModal();
  });
});

// Modal: close when the close button is clicked
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('dialog').close();
  });
});

// Modal: close when the user clicks on the backdrop
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });
});
