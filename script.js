// Sample property data with more properties
const allProperties = [
    {
        id: 1,
        title: "Modern Villa",
        price: 750000,
        location: "Beverly Hills, CA",
        description: "Luxurious 5-bedroom villa with stunning ocean views, infinity pool, and smart home technology.",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
        beds: 5,
        baths: 4,
        sqft: 4500,
        type: "villa",
        amenities: ["pool", "garage", "garden", "security"],
        status: "For Sale"
    },
    {
        id: 2,
        title: "Luxury Estate",
        price: 1200000,
        location: "Malibu, CA",
        description: "Spectacular oceanfront estate with private beach access, wine cellar, and home theater.",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 6,
        baths: 7,
        sqft: 6800,
        type: "house",
        amenities: ["pool", "garage", "garden", "security", "elevator"],
        status: "New Listing"
    },
    {
        id: 3,
        title: "Contemporary Loft",
        price: 950000,
        location: "Downtown LA, CA",
        description: "Stylish urban loft with floor-to-ceiling windows, rooftop garden, and premium finishes.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        beds: 3,
        baths: 2,
        sqft: 2200,
        type: "apartment",
        amenities: ["garage", "elevator", "parking", "furnished"],
        status: "Featured"
    },
    {
        id: 4,
        title: "Beachfront Condo",
        price: 850000,
        location: "Venice Beach, CA",
        description: "Modern beachfront condo with panoramic ocean views and direct beach access.",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 2,
        baths: 2,
        sqft: 1800,
        type: "condo",
        amenities: ["pool", "parking", "security", "furnished"],
        status: "For Sale"
    },
    {
        id: 5,
        title: "Mountain View Estate",
        price: 1500000,
        location: "Hollywood Hills, CA",
        description: "Spectacular estate with breathtaking city and mountain views, infinity pool, and home theater.",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 5,
        baths: 4,
        sqft: 5200,
        type: "house",
        amenities: ["pool", "garage", "garden", "security", "elevator"],
        status: "New Listing"
    },
    {
        id: 6,
        title: "Urban Penthouse",
        price: 2100000,
        location: "West Hollywood, CA",
        description: "Luxurious penthouse with private rooftop terrace and stunning city views.",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        beds: 4,
        baths: 3,
        sqft: 3800,
        type: "apartment",
        amenities: ["pool", "parking", "security", "elevator", "furnished"],
        status: "Featured"
    }
];

// Pagination variables
let currentPage = 1;
const propertiesPerPage = 3;
let displayedProperties = [];
let isLoading = false;

// Initialize the property grid
function initializePropertyGrid() {
    loadMoreProperties();
}

// Show loading spinner
function showLoadingSpinner() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    
    overlay.appendChild(spinner);
    document.body.appendChild(overlay);
    return overlay;
}

// Hide loading spinner
function hideLoadingSpinner(overlay) {
    if (overlay) {
        overlay.remove();
    }
}

// Load more properties with animation
async function loadMoreProperties() {
    if (isLoading) return;
    isLoading = true;

    const propertyType = document.getElementById('propertyType').value;
    const priceRange = document.getElementById('priceRange').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    // Get all amenity checkboxes
    const amenityCheckboxes = document.querySelectorAll('#amenitiesPanel input[type="checkbox"]:checked');
    const selectedAmenities = Array.from(amenityCheckboxes).map(cb => cb.value);

    // Filter properties based on all criteria
    const filteredProperties = allProperties.filter(property => {
        if (propertyType && property.type !== propertyType) return false;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (max) {
                if (property.price < min || property.price > max) return false;
            } else {
                if (property.price < min) return false;
            }
        }
        if (bedrooms && property.beds < Number(bedrooms)) return false;
        if (bathrooms && property.baths < Number(bathrooms)) return false;
        if (searchInput) {
            const searchTerms = searchInput.toLowerCase();
            const searchableText = `${property.title} ${property.location} ${property.description} ${property.type}`.toLowerCase();
            if (!searchableText.includes(searchTerms)) return false;
        }
        if (selectedAmenities.length > 0) {
            return selectedAmenities.every(amenity => property.amenities.includes(amenity));
        }
        return true;
    });

    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const newProperties = filteredProperties.slice(startIndex, endIndex);
    
    if (newProperties.length === 0) {
        document.getElementById('loadMoreBtn').style.display = 'none';
        isLoading = false;
        return;
    }

    const propertyGrid = document.getElementById('propertyGrid');
    const overlay = showLoadingSpinner();

    await new Promise(resolve => setTimeout(resolve, 800));

    for (let i = 0; i < newProperties.length; i++) {
        const property = newProperties[i];
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = createPropertyCard(property);
        propertyGrid.appendChild(card);
        card.style.animationDelay = `${i * 0.1}s`;
    }

    hideLoadingSpinner(overlay);
    currentPage++;
    displayedProperties = [...displayedProperties, ...newProperties];
    isLoading = false;
}

// Create property card HTML
function createPropertyCard(property) {
    return `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
            <div class="relative">
                <img src="${property.image}" 
                     alt="${property.title}" 
                     class="w-full h-64 object-cover">
                <div class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
                    ${property.status}
                </div>
            </div>
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-bold text-gray-900">${property.title}</h2>
                    <span class="text-2xl font-bold text-green-600">$${property.price.toLocaleString()}</span>
                </div>
                <div class="flex items-center text-gray-600 mb-4">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${property.location}</span>
                </div>
                <p class="text-gray-600 mb-6">${property.description}</p>
                <div class="flex justify-between items-center mb-6">
                    <div class="flex items-center">
                        <i class="fas fa-bed mr-2 text-gray-600"></i>
                        <span>${property.beds} Beds</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-bath mr-2 text-gray-600"></i>
                        <span>${property.baths} Baths</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-ruler-combined mr-2 text-gray-600"></i>
                        <span>${property.sqft.toLocaleString()} sqft</span>
                    </div>
                </div>
                <button onclick="openModal(${property.id})" class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                    <i class="fas fa-eye mr-2"></i>
                    View Details
                </button>
            </div>
        </div>
    `;
}

// Toggle amenities panel
function toggleAmenities() {
    const panel = document.getElementById('amenitiesPanel');
    panel.classList.toggle('hidden');
}

// Open property details modal with animation
function openModal(propertyId) {
    const property = allProperties.find(p => p.id === propertyId);
    const modal = document.getElementById('propertyModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    modalTitle.textContent = property.title;
    modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <img src="${property.image}" alt="${property.title}" class="w-full h-96 object-cover rounded-lg">
            </div>
            <div>
                <div class="flex items-center justify-between mb-4">
                    <span class="text-3xl font-bold text-green-600">$${property.price.toLocaleString()}</span>
                    <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">${property.status}</span>
                </div>
                <div class="flex items-center text-gray-600 mb-4">
                    <i class="fas fa-map-marker-alt mr-2"></i>
                    <span>${property.location}</span>
                </div>
                <p class="text-gray-600 mb-6">${property.description}</p>
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="flex items-center">
                        <i class="fas fa-bed mr-2 text-gray-600"></i>
                        <span>${property.beds} Bedrooms</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-bath mr-2 text-gray-600"></i>
                        <span>${property.baths} Bathrooms</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-ruler-combined mr-2 text-gray-600"></i>
                        <span>${property.sqft.toLocaleString()} sqft</span>
                    </div>
                    <div class="flex items-center">
                        <i class="fas fa-home mr-2 text-gray-600"></i>
                        <span>${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
                    </div>
                </div>
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-2">Amenities</h3>
                    <div class="flex flex-wrap gap-2">
                        ${property.amenities.map(amenity => `
                            <span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                                ${amenity.charAt(0).toUpperCase() + amenity.slice(1)}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <button class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center">
                    <i class="fas fa-phone-alt mr-2"></i>
                    Contact Agent
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

// Close property details modal
function closeModal() {
    const modal = document.getElementById('propertyModal');
    modal.classList.remove('flex');
    modal.classList.add('hidden');
}

// Toggle mobile filters panel
function toggleMobileFilters() {
    const panel = document.querySelector('.mobile-filter-panel');
    const overlay = document.querySelector('.filter-overlay');
    
    if (panel.classList.contains('active')) {
        panel.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        panel.classList.add('active');
        overlay.classList.add('active');
    }
}

// Apply mobile filters
function applyMobileFilters() {
    // Sync mobile filters to desktop filters
    syncFilters();
    
    // Reset pagination
    currentPage = 1;
    displayedProperties = [];
    
    // Clear existing property grid
    const propertyGrid = document.getElementById('propertyGrid');
    propertyGrid.innerHTML = '';
    
    // Show loading spinner
    const loadingOverlay = showLoadingSpinner();
    
    // Apply the filters
    setTimeout(() => {
        filterProperties();
        // Close the mobile filter panel
        toggleMobileFilters();
        // Hide the loading spinner
        hideLoadingSpinner(loadingOverlay);
    }, 500);
}

// Sync mobile filters with desktop filters
function syncFilters() {
    // Sync property type
    const desktopPropertyType = document.getElementById('propertyType');
    const mobilePropertyType = document.getElementById('mobilePropertyType');
    if (mobilePropertyType.value) {
        desktopPropertyType.value = mobilePropertyType.value;
    }

    // Sync price range
    const desktopPriceRange = document.getElementById('priceRange');
    const mobilePriceRange = document.getElementById('mobilePriceRange');
    if (mobilePriceRange.value) {
        desktopPriceRange.value = mobilePriceRange.value;
    }

    // Sync bedrooms
    const desktopBedrooms = document.getElementById('bedrooms');
    const mobileBedrooms = document.getElementById('mobileBedrooms');
    if (mobileBedrooms.value) {
        desktopBedrooms.value = mobileBedrooms.value;
    }

    // Sync bathrooms
    const desktopBathrooms = document.getElementById('bathrooms');
    const mobileBathrooms = document.getElementById('mobileBathrooms');
    if (mobileBathrooms.value) {
        desktopBathrooms.value = mobileBathrooms.value;
    }

    // Sync amenities
    const desktopAmenities = document.querySelectorAll('#amenitiesPanel input[type="checkbox"]');
    const mobileAmenities = document.querySelectorAll('.mobile-filter-panel input[type="checkbox"]');
    mobileAmenities.forEach((checkbox, index) => {
        desktopAmenities[index].checked = checkbox.checked;
    });
}

// Update filterProperties function to handle mobile filters
function filterProperties() {
    const propertyType = document.getElementById('propertyType').value;
    const priceRange = document.getElementById('priceRange').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    
    // Get all amenity checkboxes
    const amenityCheckboxes = document.querySelectorAll('#amenitiesPanel input[type="checkbox"]:checked');
    const selectedAmenities = Array.from(amenityCheckboxes).map(cb => cb.value);

    // Filter properties based on all criteria
    const filteredProperties = allProperties.filter(property => {
        if (propertyType && property.type !== propertyType) return false;
        if (priceRange) {
            const [min, max] = priceRange.split('-').map(Number);
            if (max) {
                if (property.price < min || property.price > max) return false;
            } else {
                if (property.price < min) return false;
            }
        }
        if (bedrooms && property.beds < Number(bedrooms)) return false;
        if (bathrooms && property.baths < Number(bathrooms)) return false;
        if (searchInput) {
            const searchTerms = searchInput.toLowerCase();
            const searchableText = `${property.title} ${property.location} ${property.description} ${property.type}`.toLowerCase();
            if (!searchableText.includes(searchTerms)) return false;
        }
        if (selectedAmenities.length > 0) {
            return selectedAmenities.every(amenity => property.amenities.includes(amenity));
        }
        return true;
    });

    // Reset pagination
    currentPage = 1;
    displayedProperties = [];

    // Clear existing property grid
    const propertyGrid = document.getElementById('propertyGrid');

    // Display filtered properties
    const propertiesToShow = filteredProperties.slice(0, propertiesPerPage);
    propertiesToShow.forEach((property, index) => {
        const card = document.createElement('div');
        card.className = 'property-card';
        card.innerHTML = createPropertyCard(property);
        propertyGrid.appendChild(card);
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Update load more button visibility
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = filteredProperties.length > propertiesPerPage ? 'flex' : 'none';
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
    initializePropertyGrid();

    // Add event listeners to desktop filter inputs
    document.getElementById('propertyType').addEventListener('change', filterProperties);
    document.getElementById('priceRange').addEventListener('change', filterProperties);
    document.getElementById('bedrooms').addEventListener('change', filterProperties);
    document.getElementById('bathrooms').addEventListener('change', filterProperties);
    document.getElementById('sortBy').addEventListener('change', filterProperties);
    document.getElementById('searchInput').addEventListener('input', filterProperties);

    // Add event listeners to mobile filter inputs
    document.getElementById('mobilePropertyType').addEventListener('change', () => {
        syncFilters();
        filterProperties();
    });
    document.getElementById('mobilePriceRange').addEventListener('change', () => {
        syncFilters();
        filterProperties();
    });
    document.getElementById('mobileBedrooms').addEventListener('change', () => {
        syncFilters();
        filterProperties();
    });
    document.getElementById('mobileBathrooms').addEventListener('change', () => {
        syncFilters();
        filterProperties();
    });

    // Add event listeners to amenity checkboxes
    document.querySelectorAll('#amenitiesPanel input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', filterProperties);
    });
});

// Newsletter Popup Functions
function showNewsletterPopup() {
    document.getElementById('newsletterOverlay').style.display = 'block';
    document.getElementById('newsletterPopup').style.display = 'block';
}

function closeNewsletterPopup() {
    document.getElementById('newsletterOverlay').style.display = 'none';
    document.getElementById('newsletterPopup').style.display = 'none';
}

// Virtual Tour Function
function showVirtualTour() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth'
    });
}

// Mobile Menu Functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    mobileMenu.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Form validation functions
function validateInput(input) {
    const formInput = input.closest('.form-input');
    const value = input.value.trim();
    
    // Remove existing classes
    formInput.classList.remove('error', 'success');
    
    if (value === '') {
        formInput.classList.add('error');
        return false;
    }

    // Email validation
    if (input.type === 'email' && !isValidEmail(value)) {
        formInput.classList.add('error');
        return false;
    }

    // Phone validation
    if (input.type === 'tel' && !isValidPhone(value)) {
        formInput.classList.add('error');
        return false;
    }

    formInput.classList.add('success');
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^\+?[\d\s-]{10,}$/.test(phone);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    const formInputs = document.querySelectorAll('.form-input input, .form-input select');

    // Form input validation
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            validateInput(this);
        });

        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    // Contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });

        if (isValid) {
            alert('Thank you for your interest! We will contact you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields correctly.');
        }
    });

    // Newsletter form submission
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for subscribing! We will keep you updated.');
        newsletterForm.reset();
        closeNewsletterPopup();
    });

    // Property image click handlers
    document.querySelectorAll('.property-feature img').forEach(img => {
        img.addEventListener('click', function() {
            showVirtualTour();
        });
    });

    // Mobile menu event listeners
    document.getElementById('mobileMenuOverlay').addEventListener('click', toggleMobileMenu);

    document.querySelectorAll('.mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('mobileMenuOverlay');
            mobileMenu.classList.remove('active');
            overlay.classList.remove('active');
        });
    });

    // Show newsletter popup after 5 seconds
    setTimeout(showNewsletterPopup, 5000);
}); 