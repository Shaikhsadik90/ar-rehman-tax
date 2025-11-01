// Show location announcement banner on page load
document.addEventListener('DOMContentLoaded', function() {
  // Show moving promotional banner immediately
  const movingBanner = document.getElementById('movingPromotionalBanner');
  if (movingBanner) {
    movingBanner.style.display = 'block';
  }

  // Show location announcement banner immediately and keep it permanent
  const locationBanner = document.getElementById('locationAnnouncementBanner');
  if (locationBanner) {
    locationBanner.classList.add('show');
    locationBanner.style.display = 'block';
  }

  // Show job alert banner after 5 seconds
  setTimeout(function() {
    const jobBanner = document.getElementById('jobAlertBanner');
    if (jobBanner) {
      jobBanner.classList.add('show');

      // Hide job alert after 10 seconds automatically
      setTimeout(function() {
        closeJobBanner();
      }, 10000);
    }
  }, 5000);
});

// Location announcement banner functions
function showLocationDetails() {
  const modal = document.getElementById('locationModal');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function closeLocationModal() {
  const modal = document.getElementById('locationModal');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}

// Close modal when clicking outside of it
document.addEventListener('click', function(event) {
  const modal = document.getElementById('locationModal');
  if (modal && event.target === modal) {
    closeLocationModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeLocationModal();
  }
});

// Existing job banner functions
function closeJobBanner() {
  const jobBanner = document.getElementById('jobAlertBanner');
  if (jobBanner) {
    jobBanner.classList.remove('show');
  }
}

// Scroll to top on page load
window.scrollTo(0, 0);

