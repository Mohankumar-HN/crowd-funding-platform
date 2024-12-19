document.addEventListener("DOMContentLoaded", function () {
    const progressBar = document.getElementById("progress-bar");
    const totalRaisedElement = document.getElementById("total-raised");
    const contributeForm = document.getElementById("contribute-form");
    const contributionInput = document.getElementById("contribution");

    // Update progress bar and total raised
    function updateProgressBar(totalRaised, goalAmount) {
        const progress = (totalRaised / goalAmount) * 100;
        progressBar.style.width = `${progress}%`;
        totalRaisedElement.textContent = `Total Raised: $${totalRaised.toFixed(2)}`;
    }

    // Fetch initial progress
    function fetchProgress() {
        fetch("/progress")
            .then(response => response.json())
            .then(data => {
                updateProgressBar(data.totalRaised, data.goalAmount);
            })
            .catch(error => console.error("Error fetching progress:", error));
    }

    // Handle form submission
    contributeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const contribution = parseFloat(contributionInput.value);
        if (isNaN(contribution) || contribution <= 0) {
            alert("Please enter a valid contribution amount.");
            return;
        }

        fetch("/contribute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contribution }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    updateProgressBar(data.totalRaised, data.goalAmount);
                    alert(`Thank you for contributing $${contribution.toFixed(2)}!`);
                    contributionInput.value = ""; // Reset input
                }
            })
            .catch(error => console.error("Error during contribution:", error));
    });

    // Fetch initial progress on page load
    fetchProgress();
});
