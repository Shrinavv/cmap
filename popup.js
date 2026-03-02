function loadCookies() {
  browser.cookies.getAll({})
    .then(cookies => {
      const tableBody = document.getElementById('cookieTableBody');
      tableBody.innerHTML = '';

      cookies.forEach(cookie => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${cookie.domain || 'N/A'}</td>
          <td>${cookie.name || 'N/A'}</td>
          <td>${cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : 'Session'}</td>
          <td>${cookie.secure ? 'Yes' : 'No'}</td>
          <td><button class="delete-btn" data-domain="${cookie.domain}" data-name="${cookie.name}">Delete</button></td>
        `;
        tableBody.appendChild(row);
      });

      addEventListeners();
      searchCookies(); // Initial search to apply any filters
    })
    .catch(error => console.error('Error fetching cookies:', error));
}

function addEventListeners() {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', deleteCookie);
  });

  document.getElementById('searchInput').addEventListener('input', searchCookies);
  document.getElementById('clearFilteredBtn').addEventListener('click', clearFilteredCookies);
}

function deleteCookie(event) {
  const button = event.target;
  const domain = button.dataset.domain;
  const name = button.dataset.name;

  browser.cookies.remove({ url: `https://${domain}`, name: name })
    .then(() => {
      button.closest('tr').remove();
    })
    .catch(error => console.error('Error deleting cookie:', error));
}

function searchCookies() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.getElementById('cookieTableBody').rows;
  let visibleCount = 0;

  for (let row of rows) {
    const domain = row.cells[0].textContent.toLowerCase();
    const name = row.cells[1].textContent.toLowerCase();
    if (domain.includes(input) || name.includes(input)) {
      row.style.display = '';
      visibleCount++;
    } else {
      row.style.display = 'none';
    }
  }

  const clearBtn = document.getElementById('clearFilteredBtn');
  clearBtn.disabled = visibleCount === 0;
}

function clearFilteredCookies() {
  const rows = document.getElementById('cookieTableBody').rows;
  const toDelete = [];

  for (let row of rows) {
    if (row.style.display !== 'none') {
      const domain = row.cells[0].textContent;
      const name = row.cells[1].textContent;
      toDelete.push({ domain, name, row });
    }
  }

  toDelete.forEach(({ domain, name, row }) => {
    browser.cookies.remove({ url: `https://${domain}`, name: name })
      .then(() => row.remove())
      .catch(error => console.error('Error deleting cookie:', error));
  });
}

function sortTable(columnIndex) {
  const tableBody = document.getElementById('cookieTableBody');
  const rows = Array.from(tableBody.rows);

  rows.sort((a, b) => {
    let valA = a.cells[columnIndex].textContent;
    let valB = b.cells[columnIndex].textContent;

    // Special handling for expiration date
    if (columnIndex === 2) {
      valA = valA === 'Session' ? 0 : new Date(valA).getTime();
      valB = valB === 'Session' ? 0 : new Date(valB).getTime();
    } else if (columnIndex === 3) { // Secure (Yes/No)
      valA = valA === 'Yes' ? 1 : 0;
      valB = valB === 'Yes' ? 1 : 0;
    }

    if (valA > valB) return 1;
    if (valA < valB) return -1;
    return 0;
  });

  rows.forEach(row => tableBody.appendChild(row));
}

document.addEventListener('DOMContentLoaded', loadCookies);