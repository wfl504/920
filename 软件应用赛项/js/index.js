// Function to fetch JSON data and update HTML
async function fetchAndDisplayJSON() {
    try {
        // Fetch JSON data from a URL (replace with your JSON endpoint)
        const response = await fetch('https://wfl504.github.io/json/format.1731543015526.json');
        const data = await response.json();

        // Get the container element
        const container = document.getElementById('data-container');

        // Create HTML content from JSON data
        let html = '<ul>';
        for (const item of data) {
            html += `<li>${item.name}: ${item.value}</li>`;
        }
        html += '</ul>';

        // Update the container with the new HTML
        container.innerHTML = html;
    } catch (error) {
        console.error('Error fetching or parsing JSON:', error);
        document.getElementById('data-container').innerHTML = 'Error loading data';
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayJSON);