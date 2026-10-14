
// ========================================
// WORDDAL DICTIONARY
// ========================================

// Get HTML elements
const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const statusMessage = document.getElementById("statusMessage");
const resultContainer = document.getElementById("resultContainer");
const suggestions = document.getElementById("suggestions");

// QuickPronounce API key
const API_KEY = "https://api.quickpronounce.site/v1/dictionary/wonderful";


// ========================================
// SEARCH FOR A WORD
// ========================================

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const word = wordInput.value.trim();

    if (word === "") {
        statusMessage.textContent = "Please enter a word.";
        statusMessage.className = "status error";
        return;
    }

    statusMessage.textContent = "Searching...";
    statusMessage.className = "status";
    resultContainer.innerHTML = "";
    suggestions.innerHTML = "";

    const apiURL =
        "https://api.quickpronounce.site/v1/dictionary/" +
        encodeURIComponent(word);

    try {
        const response = await fetch(apiURL, {
            method: "GET",
            headers: {
                "X-API-Key": API_KEY
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Word not found. Please check your spelling.");
            }

            if (response.status === 401 || response.status === 403) {
                throw new Error("API key is missing or invalid.");
            }

            throw new Error("Dictionary request failed. Please try again.");
        }

        const result = await response.json();

        // Support the documented data object and common response wrappers.
        const entry = result.data || result;

        displayWord(entry, word);

        statusMessage.textContent = "Word found!";
        statusMessage.className = "status";

    } catch (error) {
        console.error("Dictionary error:", error);

        statusMessage.textContent =
            error.message || "Unable to connect to the dictionary.";

        statusMessage.className = "status error";
        resultContainer.innerHTML = "";
    }
});


// ========================================
// DISPLAY WORD DETAILS
// ========================================

function displayWord(entry, searchedWord) {
    const word = entry.word || searchedWord;
    const entries = Array.isArray(entry.entries) ? entry.entries : [];

    const phonetics = entry.phonetics || {};
    const pronunciation =
        phonetics.us ||
        phonetics.uk ||
        entry.phonetic ||
        "Pronunciation unavailable";

    let meaningsHTML = "";
    let allSynonyms = Array.isArray(entry.synonyms)
        ? [...entry.synonyms]
        : [];
    let allAntonyms = Array.isArray(entry.antonyms)
        ? [...entry.antonyms]
        : [];

    entries.forEach(function (item) {
        meaningsHTML += `
            <div class="meaning-item">
                <h4>${escapeHTML(item.partOfSpeech || "Meaning")}</h4>
        `;

        const definitions = Array.isArray(item.definitions)
            ? item.definitions
            : [];

        definitions.forEach(function (definition) {
            // Definitions may be strings or objects.
            const definitionText =
                typeof definition === "string"
                    ? definition
                    : definition.definition || "";

            meaningsHTML += `
                <p>${escapeHTML(definitionText)}</p>
            `;

            if (
                typeof definition === "object" &&
                definition.example
            ) {
                meaningsHTML += `
                    <p class="example">
                        <strong>Example:</strong>
                        ${escapeHTML(definition.example)}
                    </p>
                `;
            }

            if (
                typeof definition === "object" &&
                Array.isArray(definition.synonyms)
            ) {
                allSynonyms.push(...definition.synonyms);
            }

            if (
                typeof definition === "object" &&
                Array.isArray(definition.antonyms)
            ) {
                allAntonyms.push(...definition.antonyms);
            }
        });

        // Also collect synonyms and antonyms attached to each entry.
        if (Array.isArray(item.synonyms)) {
            allSynonyms.push(...item.synonyms);
        }

        if (Array.isArray(item.antonyms)) {
            allAntonyms.push(...item.antonyms);
        }

        // Display entry-level examples if supplied.
        if (Array.isArray(item.examples)) {
            item.examples.forEach(function (example) {
                meaningsHTML += `
                    <p class="example">
                        <strong>Example:</strong>
                        ${escapeHTML(example)}
                    </p>
                `;
            });
        }

        meaningsHTML += "</div>";
    });

    // Remove duplicate words.
    allSynonyms = [...new Set(allSynonyms)];
    allAntonyms = [...new Set(allAntonyms)];

    const synonymHTML = allSynonyms.length
        ? allSynonyms.map(escapeHTML).join(", ")
        : "No synonyms available.";

    const antonymHTML = allAntonyms.length
        ? allAntonyms.map(escapeHTML).join(", ")
        : "No antonyms available.";

    // Display the result.
    resultContainer.innerHTML = `
        <div class="word-heading">
            <h2>${escapeHTML(word)}</h2>
            <p class="pronunciation">
                <strong>Pronunciation:</strong>
                ${escapeHTML(pronunciation)}
            </p>
        </div>

        <hr>

        <h3>Meaning</h3>
        ${
            meaningsHTML ||
            "<p>No meanings available for this word.</p>"
        }

        <hr>

        <h3>Synonyms</h3>
        <p>${synonymHTML}</p>

        <h3>Antonyms</h3>
        <p>${antonymHTML}</p>
    `;
}


// ========================================
// AUTOCOMPLETE SUGGESTIONS
// Uses the Datamuse API
// ========================================

wordInput.addEventListener("input", async function () {
    const text = wordInput.value.trim();

    suggestions.innerHTML = "";

    if (text.length < 2) {
        return;
    }

    const suggestionURL =
        "https://api.datamuse.com/words?sp=" +
        encodeURIComponent(text) +
        "*&max=5";

    try {
        const response = await fetch(suggestionURL);

        if (!response.ok) {
            throw new Error("Unable to load suggestions.");
        }

        const data = await response.json();

        // Do not display suggestions if the input has changed.
        if (wordInput.value.trim() !== text) {
            return;
        }

        data.forEach(function (item) {
            const suggestion = document.createElement("div");

            suggestion.className = "suggestion-item";
            suggestion.textContent = item.word;
            suggestion.setAttribute("role", "option");

            suggestion.addEventListener("click", function () {
                wordInput.value = item.word;
                suggestions.innerHTML = "";
                searchForm.requestSubmit();
            });

            suggestions.appendChild(suggestion);
        });

    } catch (error) {
        console.error("Suggestion error:", error);
    }
});


// ========================================
// CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener("click", function (event) {
    if (
        !wordInput.contains(event.target) &&
        !suggestions.contains(event.target)
    ) {
        suggestions.innerHTML = "";
    }
});


// ========================================
// ESCAPE HTML TO HELP PREVENT HTML INJECTION
// ========================================

function escapeHTML(text) {
    return String(text).replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}