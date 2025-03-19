document.addEventListener('DOMContentLoaded', function() {
    // Button to open the popup
    const groupPromptButton = document.getElementById('group-prompt');
    const popup = document.getElementById('popup');
    
    // Dropdown elements
    const dropdown = document.getElementById('groupDropdown');
    const selectedOption = document.getElementById('selectedOption');
    const options = document.querySelectorAll('.dropdown-option');
    
    // Open popup when clicking the button
    groupPromptButton.addEventListener('click', function() {
        popup.style.display = 'flex';
    });
    
    // Close popup when clicking outside content
    popup.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
    
    // Toggle dropdown visibility when clicking on the select
    dropdown.addEventListener('click', function(event) {
        dropdown.classList.toggle('open');
        event.stopPropagation();
    });
    
    // Handle option selection
    options.forEach(function(option) {
        option.addEventListener('click', function() {
            selectedOption.textContent = this.getAttribute('data-value');
            dropdown.classList.remove('open');
            
            // can add additional logic for when an option is selected
            // show different mood options based on the number selected
        });
    });
    
    // Close dropdown when clicking elsewhere on the page
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('open');
        }
    });
});