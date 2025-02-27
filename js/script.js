// script.js

// ======================
// Theme Toggle Functionality (Fixed)
// ======================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (!themeToggle) return;

    function toggleTheme() {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', toggleTheme);
}

// ======================
// Profile Data Generation
// ======================
const professions = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason'];
const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];
const names = ['Rahul', 'Amit', 'Rajesh', 'Suresh', 'Vijay', 'Anil', 'Sunil', 'Deepak', 'Manoj', 'Sanjay'];

function generateRandomProfile(id) {
    return {
        id: id,
        name: `${names[Math.floor(Math.random() * names.length)]} ${names[Math.floor(Math.random() * names.length)]}`,
        profession: professions[Math.floor(Math.random() * professions.length)],
        experience: Math.floor(Math.random() * 10) + 1,
        rating: (Math.random() * 3 + 2).toFixed(1),
        location: locations[Math.floor(Math.random() * locations.length)],
        image: `https://randomuser.me/api/portraits/men/${id}.jpg`,
        reviews: Array.from({ length: 3 }, () => ({
            rating: (Math.random() * 4 + 1).toFixed(1),
            comment: ['Great work!', 'Professional service', 'On time completion', 'Highly recommended'][Math.floor(Math.random() * 4)],
            author: ['Rohan', 'Priya', 'Amit', 'Neha'][Math.floor(Math.random() * 4)],
            date: new Date(Date.now() - Math.random() * 31536000000).toLocaleDateString()
        })),
        workPhotos: Array.from({ length: 6 }, (_, i) => `https://picsum.photos/200/200?random=${id}${i}`)
    };
}

// Generate 100 profiles
const profiles = Array.from({ length: 100 }, (_, i) => generateRandomProfile(i + 1));

// ======================
// Profile Rendering
// ======================
function renderProfiles(filteredProfiles) {
    const container = document.getElementById('profilesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    filteredProfiles.forEach(profile => {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.innerHTML = `
            <img src="${profile.image}" alt="${profile.name}" class="profile-image">
            <h3>${profile.name}</h3>
            <p class="profession">${profile.profession}</p>
            <p class="location">📍 ${profile.location}</p>
            <p class="rating">⭐ ${profile.rating} (${Math.floor(Math.random() * 100 + 50)} reviews)</p>
            <p class="experience">${profile.experience}+ years experience</p>
            <button class="hire-btn">Hire Now</button>
        `;
        container.appendChild(card);
    });

    // Attach hire button listeners
    document.querySelectorAll('.hire-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.profile-card');
            const profileData = profiles.find(p => 
                p.name === card.querySelector('h3').textContent &&
                p.profession === card.querySelector('.profession').textContent
            );
            showHirePanel(profileData);
        });
    });
}

// ======================
// Search & Filter Functionality
// ======================
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const experienceFilter = document.getElementById('experienceFilter').value;

    const filtered = profiles.filter(profile => {
        const matchesSearch = profile.name.toLowerCase().includes(searchTerm) ||
                            profile.profession.toLowerCase().includes(searchTerm) ||
                            profile.location.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || profile.profession === categoryFilter;
        
        let matchesExperience = true;
        if (experienceFilter) {
            const [min, max] = experienceFilter.split(/\D+/).map(Number);
            matchesExperience = experienceFilter === '5+ years' ? 
                profile.experience >= 5 :
                profile.experience >= min && profile.experience <= max;
        }

        return matchesSearch && matchesCategory && matchesExperience;
    });

    renderProfiles(filtered);
}

// Event Listeners for Search/Filters
if (document.getElementById('searchInput')) {
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('categoryFilter').addEventListener('change', handleSearch);
    document.getElementById('experienceFilter').addEventListener('change', handleSearch);
}

// ======================
// Hire Panel Functionality
// ======================
function showHirePanel(profile) {
    const panel = document.getElementById('hirePanel');
    const overlay = document.createElement('div');
    overlay.className = 'overlay active';
    document.body.appendChild(overlay);
    
    // Populate profile data
    document.getElementById('labourName').textContent = profile.name;
    document.getElementById('labourProfession').textContent = profile.profession;
    document.getElementById('labourExperience').textContent = 
        `${profile.experience}+ years experience | ${profile.profession}`;
    document.getElementById('labourRating').textContent = profile.rating;
    document.querySelector('.panel-profile').src = profile.image;

    // Populate work gallery
    const gallery = document.getElementById('workGallery');
    gallery.innerHTML = profile.workPhotos.map(url => 
        `<img src="${url}" alt="Work sample">`).join('');

    // Populate reviews
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = profile.reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div>
                    <strong>${review.author}</strong>
                    <span class="rating-badge">⭐ ${review.rating}</span>
                </div>
                <small>${review.date}</small>
            </div>
            <p>${review.comment}</p>
        </div>
    `).join('');

    // Configure price slider
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    if (priceRange && priceValue) {
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `₹${e.target.value}`;
        });
    }

    // View profile button
    const viewProfileBtn = document.getElementById('viewProfile');
    if (viewProfileBtn) {
        viewProfileBtn.addEventListener('click', () => {
            localStorage.setItem('selectedProfile', JSON.stringify(profile));
            window.location.href = 'profile.html';
        });
    }

    // Show panel
    panel.classList.add('active');
    
    // Close handlers
    overlay.addEventListener('click', closePanel);
    document.getElementById('closePanel').addEventListener('click', closePanel);
}

function closePanel() {
    const panel = document.getElementById('hirePanel');
    if (panel) panel.classList.remove('active');
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
}

// ======================
// Form Submission Handler
// ======================
const hireForm = document.querySelector('.hire-form');
if (hireForm) {
    hireForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const bookingDetails = {
            labourName: document.getElementById('labourName').textContent,
            price: document.getElementById('priceValue').textContent,
            date: formData.get('date'),
            paymentMethod: formData.get('paymentMethod')
        };
        
        console.log('Booking Details:', bookingDetails);
        alert('Booking request submitted successfully!');
        closePanel();
    });
}

// ======================
// Initialization
// ======================
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    
    // Initial render for main page
    if (document.getElementById('profilesContainer')) {
        renderProfiles(profiles);
    }

    // Login/Signup functionality
    const userCards = document.querySelectorAll('.user-card');
    if (userCards.length > 0) {
        const userTypeInput = document.getElementById('userType');
        
        userCards.forEach(card => {
            card.addEventListener('click', () => {
                userCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                if (userTypeInput) userTypeInput.value = card.dataset.type;
            });
        });
    }

    // Form Validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!form.checkValidity()) {
                e.preventDefault();
                alert('Please fill all required fields');
            }
        });
    });
});