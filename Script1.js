// ========================================
// WORDDAL DICTIONARY
// ========================================

// Get HTML elements
const searchForm = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const statusMessage = document.getElementById("statusMessage");
const resultContainer = document.getElementById("resultContainer");
const suggestions = document.getElementById("suggestions");


// ========================================
// UTILITY FUNCTIONS (Defined First)
// ========================================

// Escape HTML to prevent injection
function escapeHTML(text) {
    if (!text) return "";
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

// Remove HTML tags from raw Wiktionary API responses
function cleanHTML(html) {
    if (!html) return "";
    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = html;
    return temporaryElement.textContent || temporaryElement.innerText || "";
}


// ========================================
// SEARCH FOR A WORD (Wiktionary API)
// ========================================

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const word = wordInput.value.trim().toLowerCase();

    if (!word) {
        statusMessage.textContent = "Please enter a word.";
        statusMessage.className = "status error";
        return;
    }

    statusMessage.textContent = "Searching...";
    statusMessage.className = "status";
    resultContainer.innerHTML = "";
    suggestions.innerHTML = "";
    suggestions.classList.remove("active");

    const apiURL =
        "https://en.wiktionary.org/api/rest_v1/page/definition/" +
        encodeURIComponent(word);

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error(
                response.status === 404
                    ? "Word not found. Check your spelling."
                    : "Dictionary request failed. Please try again."
            );
        }

        const data = await response.json();
        const entries = data.en;

        if (!Array.isArray(entries) || entries.length === 0) {
            throw new Error("No English definitions were found.");
        }

        displayWord(word, entries);

        statusMessage.textContent = "Word found!";
        statusMessage.className = "status";

    } catch (error) {
        console.error("Dictionary error:", error);

        statusMessage.textContent =
            error.message === "Failed to fetch"
                ? "Unable to connect to the dictionary. Please try again."
                : error.message;

        statusMessage.className = "status error";
        resultContainer.innerHTML = "";
    }
});


// ========================================
// DISPLAY WORD DETAILS (GROUPED BY PART OF SPEECH)
// ========================================

function displayWord(word, entries) {
    const groupedMeanings = {};
    const allExamples = [];

    // 1. Group definitions by partOfSpeech
    entries.forEach(function (entry) {
        const pos = (entry.partOfSpeech || "Meaning").toLowerCase();
        
        if (!groupedMeanings[pos]) {
            groupedMeanings[pos] = [];
        }

        (entry.definitions || []).forEach(function (item) {
            const definition = cleanHTML(item.definition || "");
            if (definition) {
                groupedMeanings[pos].push(definition);
            }

            // Collect example sentences
            const examples = item.examples || [];
            examples.forEach(function (example) {
                const cleanedExample = cleanHTML(example);
                if (cleanedExample) {
                    allExamples.push(cleanedExample);
                }
            });
        });
    });

    // 2. Build grouped HTML output
    let meaningsHTML = "";

    for (const [pos, definitions] of Object.entries(groupedMeanings)) {
        if (definitions.length === 0) continue;

        // Capitalize the first letter of the Part of Speech (e.g., "noun" -> "Noun")
        const formattedPOS = pos.charAt(0).toUpperCase() + pos.slice(1);

        meaningsHTML += `
            <div class="meaning-item">
                <h4>${escapeHTML(formattedPOS)}</h4>
                <ol>
                    ${definitions.slice(0, 3).map(def => `<li>${escapeHTML(def)}</li>`).join("")}
                </ol>
            </div>
        `;
    }

    // 3. Remove duplicate examples (Limit to top 3)
    const uniqueExamples = [...new Set(allExamples)].slice(0, 3);

    const examplesHTML = uniqueExamples.length
        ? uniqueExamples.map(function (example) {
            return `<li>${escapeHTML(example)}</li>`;
        }).join("")
        : "<li>No examples available.</li>";

    // 4. Render to DOM
    resultContainer.innerHTML = `
        <div class="word-heading">
            <h2>${escapeHTML(word)}</h2>

            <p class="pronunciation">
                <strong>Pronunciation:</strong>
                <button type="button" id="speakButton">
                    🔊 Hear Pronunciation
                </button>
            </p>
        </div>

        <hr>

        <h3>Meaning</h3>
        ${meaningsHTML || "<p>No meanings available.</p>"}

        <hr>

        <h3>Example Sentences</h3>
        <ul>${examplesHTML}</ul>

        <hr>

        <h3>Synonyms</h3>
        <p id="synonyms">Loading synonyms...</p>

        <h3>Antonyms</h3>
        <p id="antonyms">Loading antonyms...</p>
    `;

    setupPronunciation(word);
    loadRelatedWords(word);
}


// ========================================
// PRONUNCIATION (Web Speech API)
// ========================================

function setupPronunciation(word) {
    const speakButton = document.getElementById("speakButton");

    if (speakButton) {
        speakButton.addEventListener("click", function () {
            speakWord(word);
        });
    }
}

function speakWord(word) {
    if (!("speechSynthesis" in window)) {
        statusMessage.textContent = "Pronunciation is not supported by this browser.";
        statusMessage.className = "status error";
        return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = "en-US";
    speech.rate = 0.85;

    window.speechSynthesis.speak(speech);
}


// ========================================
// LOAD SYNONYMS & ANTONYMS (Datamuse API)
// ========================================

async function loadRelatedWords(word) {
    try {
        const [synonymResponse, antonymResponse] = await Promise.all([
            fetch("https://api.datamuse.com/words?rel_syn=" + encodeURIComponent(word) + "&max=10"),
            fetch("https://api.datamuse.com/words?rel_ant=" + encodeURIComponent(word) + "&max=10")
        ]);

        if (!synonymResponse.ok || !antonymResponse.ok) {
            throw new Error("Related words could not be loaded.");
        }

        const synonyms = await synonymResponse.json();
        const antonyms = await antonymResponse.json();

        const synonymElement = document.getElementById("synonyms");
        const antonymElement = document.getElementById("antonyms");

        if (synonymElement) {
            synonymElement.textContent = synonyms.length
                ? synonyms.map(item => item.word).join(", ")
                : "No synonyms available.";
        }

        if (antonymElement) {
            antonymElement.textContent = antonyms.length
                ? antonyms.map(item => item.word).join(", ")
                : "No antonyms available.";
        }

    } catch (error) {
        console.error("Related words error:", error);

        const synonymElement = document.getElementById("synonyms");
        const antonymElement = document.getElementById("antonyms");

        if (synonymElement) synonymElement.textContent = "Unable to load synonyms.";
        if (antonymElement) antonymElement.textContent = "Unable to load antonyms.";
    }
}


// ========================================
// AUTOCOMPLETE SUGGESTIONS (FIXED)
// ========================================

let debounceTimer;

wordInput.addEventListener("input", function () {
    const text = wordInput.value.trim();

    clearTimeout(debounceTimer);

    if (text.length < 2) {  
        suggestions.innerHTML = "";
        suggestions.classList.remove("active");
        return;
    }

    // Debounce to prevent flooding the API while typing fast
    debounceTimer = setTimeout(() => {
        getSuggestions(text);
    }, 200);
});

async function getSuggestions(text) {
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

        // Clear existing suggestions
        suggestions.innerHTML = "";

        // Ensure text hasn't changed while request was in transit
        if (wordInput.value.trim() !== text) {
            return;
        }

        if (data.length === 0) {
            suggestions.classList.remove("active");
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
                suggestions.classList.remove("active");

                // Trigger form search safely
                if (typeof searchForm.requestSubmit === "function") {
                    searchForm.requestSubmit();
                } else {
                    searchForm.dispatchEvent(new Event("submit", { cancelable: true }));
                }
            });

            suggestions.appendChild(suggestion);
        });

        // Show suggestions box
        suggestions.classList.add("active");

    } catch (error) {
        console.error("Suggestion error:", error);
    }
}


// ========================================
// CLOSE SUGGESTIONS WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener("click", function (event) {
    if (
        !wordInput.contains(event.target) &&
        !suggestions.contains(event.target)
    ) {
        suggestions.innerHTML = "";
        suggestions.classList.remove("active");
    }
});