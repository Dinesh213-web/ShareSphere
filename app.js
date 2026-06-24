// main app.js - all the frontend logic is here
// this is the base url for all api calls
const API_URL = 'http://localhost:5000/api';

// store the current resource being booked
let currentResourceId = null;
let allResources = []; // store all resources for filtering

// this runs when the page loads
window.onload = function() {
  checkAuth();
  loadResources();
  setMinDate();
  loadHomeStats();
};

// set minimum date to today so users cant book in past
function setMinDate() {
  let today = new Date().toISOString().split('T')[0];
  let dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    dateInput.min = today;
  }
}

// check if user is logged in and update the navbar
function checkAuth() {
  let token = localStorage.getItem('token');
  let user = JSON.parse(localStorage.getItem('user') || 'null');

  if (token && user) {
    // show user info in navbar
    document.getElementById('navAuth').style.display = 'none';
    document.getElementById('navUser').style.display = 'flex';
    document.getElementById('userGreeting').textContent = 'Hi, ' + user.name;

    // show protected nav links
    document.getElementById('navMyBookings').style.display = 'block';

    // show admin panel link if admin
    if (user.role === 'admin') {
      document.getElementById('navAdmin').style.display = 'block';
    }
  } else {
    // show login/register buttons
    document.getElementById('navAuth').style.display = 'flex';
    document.getElementById('navUser').style.display = 'none';
    document.getElementById('navMyBookings').style.display = 'none';
    document.getElementById('navAdmin').style.display = 'none';
  }
}

// show a specific page and hide others
function showPage(pageName) {
  // check if user is logged in for protected pages
  let token = localStorage.getItem('token');
  let user = JSON.parse(localStorage.getItem('user') || 'null');

  if ((pageName === 'myBookings' || pageName === 'adminPanel') && !token) {
    showPage('login');
    return;
  }

  if (pageName === 'adminPanel' && user && user.role !== 'admin') {
    alert('Admin access only!');
    return;
  }

  // hide all pages
  let pages = document.querySelectorAll('.page');
  pages.forEach(function(page) {
    page.classList.remove('active');
  });

  // show the selected page
  let selectedPage = document.getElementById('page-' + pageName);
  if (selectedPage) {
    selectedPage.classList.add('active');
  }

  // update active nav link
  let navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(function(link) {
    link.classList.remove('active');
  });

  let navMap = {
    'home': 'navHome',
    'resources': 'navResources',
    'myBookings': 'navMyBookings',
    'adminPanel': 'navAdmin'
  };

  if (navMap[pageName]) {
    let navEl = document.getElementById(navMap[pageName]);
    if (navEl) navEl.classList.add('active');
  }

  // load data when navigating to certain pages
  if (pageName === 'resources') {
    loadResources();
  }
  if (pageName === 'myBookings') {
    loadMyBookings();
  }
  if (pageName === 'adminPanel') {
    loadAdminResources();
    loadAdminBookings();
  }

  // scroll to top
  window.scrollTo(0, 0);
}

// load home page stats
async function loadHomeStats() {
  try {
    let res = await fetch(API_URL + '/resources');
    let resources = await res.json();
    document.getElementById('statResources').textContent = resources.length;
  } catch (err) {
    console.log('Error loading stats:', err);
  }
}

// ===== AUTH FUNCTIONS =====

// register new user
async function register() {
  let name = document.getElementById('registerName').value;
  let email = document.getElementById('registerEmail').value;
  let password = document.getElementById('registerPassword').value;
  let role = document.getElementById('registerRole').value;
  let errorDiv = document.getElementById('registerError');

  // basic validation
  if (!name || !email || !password) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Please fill in all fields';
    return;
  }

  if (password.length < 6) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Password must be at least 6 characters';
    return;
  }

  errorDiv.style.display = 'none';

  try {
    let response = await fetch(API_URL + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, role })
    });

    let data = await response.json();

    if (!response.ok) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = data.message || 'Registration failed';
      return;
    }

    // save token and user to localstorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    checkAuth();
    showPage('home');

  } catch (err) {
    console.log('Register error:', err);
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Something went wrong. Is the server running?';
  }
}

// login user
async function login() {
  let email = document.getElementById('loginEmail').value;
  let password = document.getElementById('loginPassword').value;
  let errorDiv = document.getElementById('loginError');

  if (!email || !password) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Please enter email and password';
    return;
  }

  errorDiv.style.display = 'none';

  try {
    let response = await fetch(API_URL + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    let data = await response.json();

    if (!response.ok) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = data.message || 'Login failed';
      return;
    }

    // save to localstorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    checkAuth();
    showPage('home');

  } catch (err) {
    console.log('Login error:', err);
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Something went wrong. Is the server running?';
  }
}

// logout user
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  checkAuth();
  showPage('home');
}

// ===== RESOURCE FUNCTIONS =====

// get icon based on resource type
function getTypeIcon(type) {
  let icons = {
    'classroom': 'fas fa-chalkboard-teacher',
    'lab': 'fas fa-flask',
    'sports': 'fas fa-futbol',
    'auditorium': 'fas fa-microphone'
  };
  return icons[type] || 'fas fa-building';
}

// load all resources
async function loadResources() {
  let listDiv = document.getElementById('resourcesList');
  if (!listDiv) return;

  listDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading resources...</div>';

  try {
    let response = await fetch(API_URL + '/resources');
    let resources = await response.json();

    allResources = resources; // save for filtering
    renderResources(resources);

  } catch (err) {
    console.log('Error loading resources:', err);
    listDiv.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Could not load resources. Make sure the server is running.</p></div>';
  }
}

// render resources to the grid
function renderResources(resources) {
  let listDiv = document.getElementById('resourcesList');

  if (resources.length === 0) {
    listDiv.innerHTML = '<div class="empty-state"><i class="fas fa-building"></i><p>No resources found.</p></div>';
    return;
  }

  let html = '';

  for (let i = 0; i < resources.length; i++) {
    let resource = resources[i];
    let icon = getTypeIcon(resource.type);
    let typeClass = 'type-' + resource.type;
    let availableText = resource.available ? 'Available' : 'Unavailable';
    let availableClass = resource.available ? 'badge-available' : 'badge-unavailable';

    html += `
      <div class="resource-card">
        <div class="resource-card-header ${typeClass}">
          <span class="resource-badge ${availableClass}">${availableText}</span>
          <i class="${icon}"></i>
          <h3>${resource.name}</h3>
        </div>
        <div class="resource-card-body">
          <div class="resource-detail">
            <i class="fas fa-tag"></i>
            <span>${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</span>
          </div>
          <div class="resource-detail">
            <i class="fas fa-users"></i>
            <span>Capacity: ${resource.capacity}</span>
          </div>
          <div class="resource-detail">
            <i class="fas fa-map-marker-alt"></i>
            <span>${resource.location}</span>
          </div>
          ${resource.description ? `<p class="resource-description">${resource.description}</p>` : ''}
        </div>
        <div class="resource-card-footer">
          ${resource.available
            ? `<button class="btn btn-primary btn-sm" onclick="goToBooking('${resource._id}')"><i class="fas fa-calendar-plus"></i> Book Now</button>`
            : `<button class="btn btn-sm" disabled style="background:#e2e8f0;color:#94a3b8;cursor:not-allowed;">Not Available</button>`
          }
        </div>
      </div>
    `;
  }

  listDiv.innerHTML = html;
}

// filter resources based on search and type
function filterResources() {
  let searchText = document.getElementById('searchInput').value.toLowerCase();
  let typeFilter = document.getElementById('typeFilter').value;

  let filtered = allResources.filter(function(resource) {
    let matchSearch = resource.name.toLowerCase().includes(searchText) ||
                      resource.location.toLowerCase().includes(searchText);
    let matchType = typeFilter === '' || resource.type === typeFilter;
    return matchSearch && matchType;
  });

  renderResources(filtered);
}

// ===== BOOKING FUNCTIONS =====

// go to booking page for a resource
async function goToBooking(resourceId) {
  let token = localStorage.getItem('token');
  if (!token) {
    alert('Please login to book a resource');
    showPage('login');
    return;
  }

  currentResourceId = resourceId;

  try {
    let response = await fetch(API_URL + '/resources/' + resourceId);
    let resource = await response.json();

    let icon = getTypeIcon(resource.type);
    let typeClass = 'type-' + resource.type;

    let infoDiv = document.getElementById('bookingResourceInfo');
    infoDiv.innerHTML = `
      <div class="resource-info-header ${typeClass}">
        <i class="${icon}"></i>
        <h2>${resource.name}</h2>
        <p>${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</p>
      </div>
      <div class="resource-info-body">
        <div class="resource-detail" style="margin-bottom:0.6rem">
          <i class="fas fa-users"></i>
          <span>Capacity: ${resource.capacity}</span>
        </div>
        <div class="resource-detail" style="margin-bottom:0.6rem">
          <i class="fas fa-map-marker-alt"></i>
          <span>${resource.location}</span>
        </div>
        ${resource.description ? `<p style="color:#64748b;font-size:0.9rem;margin-top:0.75rem">${resource.description}</p>` : ''}
      </div>
    `;

  } catch (err) {
    console.log('Error loading resource:', err);
  }

  // clear booking form
  document.getElementById('bookingDate').value = '';
  document.getElementById('bookingStartTime').value = '';
  document.getElementById('bookingEndTime').value = '';
  document.getElementById('bookingPurpose').value = '';
  document.getElementById('bookingError').style.display = 'none';
  document.getElementById('bookingSuccess').style.display = 'none';

  showPage('booking');
}

// submit the booking form
async function submitBooking() {
  let date = document.getElementById('bookingDate').value;
  let startTime = document.getElementById('bookingStartTime').value;
  let endTime = document.getElementById('bookingEndTime').value;
  let purpose = document.getElementById('bookingPurpose').value;
  let errorDiv = document.getElementById('bookingError');
  let successDiv = document.getElementById('bookingSuccess');

  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  // validation
  if (!date || !startTime || !endTime || !purpose) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Please fill in all fields';
    return;
  }

  if (startTime >= endTime) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'End time must be after start time';
    return;
  }

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        resourceId: currentResourceId,
        date: date,
        startTime: startTime,
        endTime: endTime,
        purpose: purpose
      })
    });

    let data = await response.json();

    if (!response.ok) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = data.message || 'Booking failed';
      return;
    }

    successDiv.style.display = 'block';
    successDiv.textContent = 'Booking submitted! Check My Bookings to see your booking.';

    // clear form
    document.getElementById('bookingDate').value = '';
    document.getElementById('bookingStartTime').value = '';
    document.getElementById('bookingEndTime').value = '';
    document.getElementById('bookingPurpose').value = '';

  } catch (err) {
    console.log('Booking error:', err);
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Something went wrong!';
  }
}

// load my bookings
async function loadMyBookings() {
  let listDiv = document.getElementById('myBookingsList');
  listDiv.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/bookings/my', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    let bookings = await response.json();

    if (bookings.length === 0) {
      listDiv.innerHTML = '<div class="empty-state"><i class="fas fa-calendar"></i><p>No bookings yet. <a href="#" onclick="showPage(\'resources\')">Browse resources</a> to make a booking.</p></div>';
      return;
    }

    let html = '';
    bookings.forEach(function(booking) {
      let resourceName = booking.resource ? booking.resource.name : 'Unknown';
      let resourceType = booking.resource ? booking.resource.type : '';
      let resourceLocation = booking.resource ? booking.resource.location : '';

      html += `
        <div class="booking-item">
          <div class="booking-info">
            <h3><i class="${getTypeIcon(resourceType)}"></i> ${resourceName}</h3>
            <div class="booking-meta">
              <span><i class="fas fa-calendar"></i> ${booking.date}</span>
              <span><i class="fas fa-clock"></i> ${booking.startTime} - ${booking.endTime}</span>
              <span><i class="fas fa-map-marker-alt"></i> ${resourceLocation}</span>
            </div>
            <p style="color:#64748b;font-size:0.85rem;margin-top:0.4rem">Purpose: ${booking.purpose}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.75rem">
            <span class="status-badge status-${booking.status}">${booking.status}</span>
            ${booking.status !== 'cancelled' && booking.status !== 'rejected'
              ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking('${booking._id}')"><i class="fas fa-times"></i> Cancel</button>`
              : ''
            }
          </div>
        </div>
      `;
    });

    listDiv.innerHTML = html;

  } catch (err) {
    console.log('Error loading bookings:', err);
    listDiv.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Error loading bookings.</p></div>';
  }
}

// cancel a booking
async function cancelBooking(bookingId) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/bookings/' + bookingId + '/cancel', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      loadMyBookings(); // reload the list
    } else {
      alert('Failed to cancel booking');
    }

  } catch (err) {
    console.log('Cancel booking error:', err);
    alert('Something went wrong!');
  }
}

// ===== ADMIN FUNCTIONS =====

// switch admin tabs
function switchAdminTab(tabName) {
  // hide all tabs
  document.getElementById('adminResourcesTab').classList.remove('active');
  document.getElementById('adminBookingsTab').classList.remove('active');

  // remove active from all tab buttons
  let tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(function(btn) {
    btn.classList.remove('active');
  });

  // show selected tab
  if (tabName === 'resources') {
    document.getElementById('adminResourcesTab').classList.add('active');
    tabBtns[0].classList.add('active');
  } else {
    document.getElementById('adminBookingsTab').classList.add('active');
    tabBtns[1].classList.add('active');
  }
}

// add new resource (admin)
async function addResource() {
  let name = document.getElementById('adminName').value;
  let type = document.getElementById('adminType').value;
  let capacity = document.getElementById('adminCapacity').value;
  let location = document.getElementById('adminLocation').value;
  let description = document.getElementById('adminDescription').value;
  let errorDiv = document.getElementById('adminResourceError');
  let successDiv = document.getElementById('adminResourceSuccess');

  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  if (!name || !type || !capacity || !location) {
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Please fill in all required fields';
    return;
  }

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ name, type, capacity: parseInt(capacity), location, description })
    });

    let data = await response.json();

    if (!response.ok) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = data.message || 'Failed to add resource';
      return;
    }

    successDiv.style.display = 'block';
    successDiv.textContent = 'Resource added successfully!';

    // clear form
    document.getElementById('adminName').value = '';
    document.getElementById('adminCapacity').value = '';
    document.getElementById('adminLocation').value = '';
    document.getElementById('adminDescription').value = '';

    // reload admin resources list
    loadAdminResources();

  } catch (err) {
    console.log('Add resource error:', err);
    errorDiv.style.display = 'block';
    errorDiv.textContent = 'Something went wrong!';
  }
}

// load all resources in admin table
async function loadAdminResources() {
  let listDiv = document.getElementById('adminResourcesList');
  listDiv.innerHTML = '<div class="loading">Loading...</div>';

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/resources', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    let resources = await response.json();

    if (resources.length === 0) {
      listDiv.innerHTML = '<div class="empty-state"><p>No resources added yet.</p></div>';
      return;
    }

    let html = '<table class="admin-table"><thead><tr>';
    html += '<th>Name</th><th>Type</th><th>Capacity</th><th>Location</th><th>Status</th><th>Actions</th>';
    html += '</tr></thead><tbody>';

    resources.forEach(function(resource) {
      html += `
        <tr>
          <td><strong>${resource.name}</strong></td>
          <td>${resource.type}</td>
          <td>${resource.capacity}</td>
          <td>${resource.location}</td>
          <td><span class="status-badge ${resource.available ? 'status-approved' : 'status-rejected'}">${resource.available ? 'Available' : 'Unavailable'}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-sm btn-outline" onclick="toggleAvailability('${resource._id}', ${resource.available})">
                ${resource.available ? 'Disable' : 'Enable'}
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteResource('${resource._id}')">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    listDiv.innerHTML = html;

  } catch (err) {
    console.log('Error loading admin resources:', err);
    listDiv.innerHTML = '<div class="empty-state"><p>Error loading resources.</p></div>';
  }
}

// toggle resource availability
async function toggleAvailability(resourceId, currentStatus) {
  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/resources/' + resourceId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ available: !currentStatus })
    });

    if (response.ok) {
      loadAdminResources();
    } else {
      alert('Failed to update resource');
    }

  } catch (err) {
    console.log('Toggle error:', err);
  }
}

// delete resource
async function deleteResource(resourceId) {
  if (!confirm('Are you sure you want to delete this resource? This cannot be undone.')) return;

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/resources/' + resourceId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      loadAdminResources();
    } else {
      alert('Failed to delete resource');
    }

  } catch (err) {
    console.log('Delete error:', err);
  }
}

// load all bookings for admin
async function loadAdminBookings() {
  let listDiv = document.getElementById('adminBookingsList');
  listDiv.innerHTML = '<div class="loading">Loading...</div>';

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/bookings/all', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    let bookings = await response.json();

    if (bookings.length === 0) {
      listDiv.innerHTML = '<div class="empty-state"><p>No bookings found.</p></div>';
      return;
    }

    let html = '<table class="admin-table"><thead><tr>';
    html += '<th>Student</th><th>Resource</th><th>Date</th><th>Time</th><th>Purpose</th><th>Status</th><th>Actions</th>';
    html += '</tr></thead><tbody>';

    bookings.forEach(function(booking) {
      let studentName = booking.user ? booking.user.name : 'Unknown';
      let resourceName = booking.resource ? booking.resource.name : 'Unknown';

      html += `
        <tr>
          <td>${studentName}</td>
          <td>${resourceName}</td>
          <td>${booking.date}</td>
          <td>${booking.startTime} - ${booking.endTime}</td>
          <td>${booking.purpose}</td>
          <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
          <td>
            <div class="action-buttons">
              ${booking.status === 'pending' ? `
                <button class="btn btn-sm btn-success" onclick="updateBookingStatus('${booking._id}', 'approved')">Approve</button>
                <button class="btn btn-sm btn-danger" onclick="updateBookingStatus('${booking._id}', 'rejected')">Reject</button>
              ` : ''}
              <button class="btn btn-sm btn-outline" onclick="deleteAdminBooking('${booking._id}')"><i class="fas fa-trash"></i></button>
            </div>
          </td>
        </tr>
      `;
    });

    html += '</tbody></table>';
    listDiv.innerHTML = html;

  } catch (err) {
    console.log('Error loading admin bookings:', err);
    listDiv.innerHTML = '<div class="empty-state"><p>Error loading bookings.</p></div>';
  }
}

// update booking status (approve/reject)
async function updateBookingStatus(bookingId, status) {
  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/bookings/' + bookingId + '/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ status: status })
    });

    if (response.ok) {
      loadAdminBookings();
    } else {
      alert('Failed to update status');
    }

  } catch (err) {
    console.log('Update status error:', err);
  }
}

// delete booking from admin
async function deleteAdminBooking(bookingId) {
  if (!confirm('Delete this booking?')) return;

  let token = localStorage.getItem('token');

  try {
    let response = await fetch(API_URL + '/bookings/' + bookingId, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (response.ok) {
      loadAdminBookings();
    } else {
      alert('Failed to delete booking');
    }

  } catch (err) {
    console.log('Delete booking error:', err);
  }
}
