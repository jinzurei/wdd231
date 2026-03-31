// Read URL parameters and display the required form fields
const params = new URLSearchParams(window.location.search);

const fields = [
  { label: 'First Name',    key: 'firstName' },
  { label: 'Last Name',     key: 'lastName' },
  { label: 'Email',         key: 'email' },
  { label: 'Mobile Phone',  key: 'mobilePhone' },
  { label: 'Business Name', key: 'businessName' },
  { label: 'Date Applied',  key: 'timestamp' },
];

const list = document.getElementById('submission-info');

if (list) {
  fields.forEach(({ label, key }) => {
    const value = params.get(key);
    if (value) {
      const dt = document.createElement('dt');
      dt.textContent = label;

      const dd = document.createElement('dd');
      dd.textContent = value;

      list.append(dt, dd);
    }
  });
}
