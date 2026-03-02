/* ==========================================================================
   Cookie Insight Dashboard - Universal JavaScript (Chrome & Firefox)
   ========================================================================== */

// 1. Universal API Bridge: Uses 'chrome' if available, otherwise 'browser'
const api = typeof chrome !== "undefined" ? chrome : (typeof browser !== "undefined" ? browser : null);

// 2. Promise Wrapper: Chrome's 'cookies.getAll' in MV3 returns a promise, 
// but some browsers/versions still prefer callbacks. This ensures it works everywhere.
function getAllCookies() {
    return new Promise((resolve, reject) => {
        try {
            api.cookies.getAll({}, (cookies) => {
                if (api.runtime.lastError) {
                    reject(api.runtime.lastError);
                } else {
                    resolve(cookies);
                }
            });
        } catch (e) {
            // Fallback for Firefox/Modern Chrome Promise support
            api.cookies.getAll({}).then(resolve).catch(reject);
        }
    });
}

function loadCookies() {
    getAllCookies()
        .then(cookies => {
            const tableBody = document.getElementById('cookieTableBody');
            if (!tableBody) return;
            tableBody.innerHTML = '';

            cookies.forEach(cookie => {
                const row = document.createElement('tr');
                // We store the full URL and store info in data attributes for easier deletion
                const cookieUrl = (cookie.secure ? "https://" : "http://") + cookie.domain.replace(/^\./, "") + cookie.path;
                
                row.innerHTML = `
                    <td>${cookie.domain || 'N/A'}</td>
                    <td>${cookie.name || 'N/A'}</td>
                    <td>${cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toLocaleString() : 'Session'}</td>
                    <td>${cookie.secure ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="delete-btn" 
                                data-url="${cookieUrl}" 
                                data-name="${cookie.name}"
                                data-store="${cookie.storeId || ''}">
                        Delete
                        </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            addEventListeners();
            searchCookies(); 
        })
        .catch(error => console.error('Error fetching cookies:', error));
}

function addEventListeners() {
    // Remove existing listeners to prevent duplicates if loadCookies is called multiple times
    const searchInput = document.getElementById('searchInput');
    const clearBtn = document.getElementById('clearFilteredBtn');

    searchInput.removeEventListener('input', searchCookies);
    clearBtn.removeEventListener('click', clearFilteredCookies);

    searchInput.addEventListener('input', searchCookies);
    clearBtn.addEventListener('click', clearFilteredCookies);

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', deleteCookie);
    });
}

function deleteCookie(event) {
    const button = event.target;
    const url = button.dataset.url;
    const name = button.dataset.name;
    const storeId = button.dataset.store;

    // Chrome is very strict about the 'url' parameter in cookies.remove
    api.cookies.remove({ url: url, name: name, storeId: storeId }, (details) => {
        if (api.runtime.lastError) {
            console.error('Delete failed:', api.runtime.lastError);
        } else {
            console.log(`Deleted ${name}`);
            button.closest('tr').remove();
            searchCookies(); // Refresh button state
        }
    });
}

function searchCookies() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('cookieTableBody');
    if (!tableBody) return;
    
    const rows = tableBody.rows;
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
    if (clearBtn) {
        clearBtn.disabled = visibleCount === 0;
    }
}

function clearFilteredCookies() {
    const rows = Array.from(document.getElementById('cookieTableBody').rows);
    
    rows.forEach(row => {
        if (row.style.display !== 'none') {
            const btn = row.querySelector('.delete-btn');
            const url = btn.dataset.url;
            const name = btn.dataset.name;
            const storeId = btn.dataset.store;

            api.cookies.remove({ url: url, name: name, storeId: storeId }, () => {
                row.remove();
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', loadCookies);