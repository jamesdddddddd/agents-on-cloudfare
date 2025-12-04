// app.js

// the worker live url
const WORKER_URL = "https://agents-on-cloudfare.jamie-jj-jd.workers.dev/"; 

async function analyzeSentiment() {
    const inputElement = document.getElementById('sentenceInput');
    const outputElement = document.getElementById('output');
    const sentence = inputElement.value.trim();

    if (!sentence) {
        outputElement.innerHTML = "Please enter some text to analyze.";
        return;
    }

    // 1. Construct the API call URL with the user input
    const apiURL = `${WORKER_URL}/?text=${encodeURIComponent(sentence)}`;
    
    outputElement.innerHTML = "Analyzing...";

    try {
        // 2. Fetch data from your deployed Cloudflare Worker API
        const response = await fetch(apiURL);
        const data = await response.json();

        if (data.error) {
            outputElement.innerHTML = `<span style="color: red;">API Error:</span> ${data.error}`;
            return;
        }

        // 3. Format the result for display
        const sentimentClass = data.sentiment.toLowerCase();
        
        outputElement.innerHTML = `
            <p><strong>Input:</strong> ${data.input}</p>
            <p><strong>Sentiment:</strong> <span class="${sentimentClass}">${data.sentiment}</span></p>
            <p><strong>Confidence:</strong> ${data.confidence}</p>
        `;

    } catch (e) {
        outputElement.innerHTML = `<span style="color: red;">Network Error:</span> Could not connect to the Worker.`;
        console.error(e);
    }
}