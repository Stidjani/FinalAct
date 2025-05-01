let selectedMoodCount = 1; // the initial count for selected moods, starting with 1
let selectedMoods = []; // array to hold the selected moods
let multiMoodMode = false; // flag to check if multiple moods are selected

// function to show the popup for multi-mood selection
function showMultiMoodPopup() {
  document.getElementById("popup").style.display = "block"; // show the popup
}

// function to set how many moods can be selected
function selectMoodCount(count) {
    selectedMoodCount = count; // update the number of moods that can be selected
    multiMoodMode = count > 1; // if more than one, set multiMoodMode to true
    selectedMoods = []; // reset selected moods
  
    // reset the mood button styles to unselected
    document.querySelectorAll(".mood-button").forEach(btn => {
      btn.classList.remove("selected"); // remove "selected" class from all buttons
    });
  
    // hide the popup and show the confirm button only if multiMoodMode is active
    document.getElementById("popup").style.display = "none";
    document.getElementById("confirmMoodsBtn").style.display = multiMoodMode ? "block" : "none";
}
  

// function for handling clicks on mood buttons
function onMoodClick(mood) {
    if (!multiMoodMode) {
      // if not in multiMoodMode, just navigate to movies page with the selected mood
      window.location.href = `movies.html?mood=${mood}`;
    } else {
      const btn = document.querySelector(`.mood-button.${mood}`); // find the button clicked
      const isSelected = selectedMoods.includes(mood); // check if the mood is already selected
  
      if (isSelected) {
        // if the mood is already selected, unselect it
        selectedMoods = selectedMoods.filter(m => m !== mood); // remove the mood from selectedMoods
        btn.classList.remove("selected"); // remove the "selected" style from the button
      } else if (selectedMoods.length < selectedMoodCount) {
        // if there's space for more moods, add it to the selectedMoods array
        selectedMoods.push(mood);
        btn.classList.add("selected"); // add the "selected" style to the button
      }
    }
}
  

// function to confirm the selection of multiple moods
function confirmMultiMood() {
    const selectedMoods = JSON.parse(localStorage.getItem("multiSelectedMoods")) || []; // get selected moods from localStorage
    if (selectedMoods.length > 0) {
      const queryString = selectedMoods.join(","); // create a query string with the selected moods
      window.location.href = `groupMoodResult.html?mood=${queryString}`; // redirect to group mood result page with the moods in the URL
    }
}
