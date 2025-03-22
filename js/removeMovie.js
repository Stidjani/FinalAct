document.addEventListener("DOMContentLoaded", function () {
    // Select all remove buttons
    const removeButtons = document.querySelectorAll(".action-button");

    removeButtons.forEach(button => {
        button.addEventListener("click", function () {
            // Find the closest movie card container and remove it
            const movieCard = this.closest(".movie-card");
            if (movieCard) {
                movieCard.remove();
            }
        });
    });
});
