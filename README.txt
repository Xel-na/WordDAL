# WordDAL — Dictionary Web Application

## About the Project

WordDAL is a simple dictionary web application that helps users understand English words. Users can search for a word and view its meaning, part of speech, example sentences, synonyms, and antonyms. The application also includes a pronunciation feature that reads the searched word aloud.

The project was developed using HTML, CSS, and JavaScript and integrates public APIs to retrieve dictionary information and related words.

## Features

- **Word Search** — Search for English words using the search bar.
- **Word Definitions** — Display one definition per part of speech to keep the results concise.
- **Parts of Speech** — Identify word categories such as nouns, verbs, and adjectives.
- **Example Sentences** — Display up to three unique example sentences when available.
- **Pronunciation** — Listen to the searched word using the browser's built-in text-to-speech feature.
- **Synonyms** — Display words with similar meanings.
- **Antonyms** — Display words with opposite meanings.
- **Autocomplete Suggestions** — Show up to five word suggestions while typing.
- **Error Handling** — Display messages when a word cannot be found or an API request fails.
- **Dynamic Results** — Update the results section without reloading the page.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Creates the structure of the homepage and dictionary application. |
| CSS3 | Styles the website's layout and appearance. |
| JavaScript | Implements search, results display, pronunciation, and autocomplete. |
| Fetch API | Requests data from external APIs. |
| Async/Await | Handles asynchronous API requests. |
| Wiktionary REST API | Provides definitions, parts of speech, and available example sentences. |
| Datamuse API | Provides synonyms, antonyms, and autocomplete suggestions. |
| Web Speech API | Reads the searched word aloud using an available browser voice. |

## APIs and Services

### 1. Wiktionary REST API

Wiktionary provides the English dictionary information used by WordDAL.

Endpoint format:

`https://en.wiktionary.org/api/rest_v1/page/definition/{word}`

The application uses the response to display definitions, parts of speech, and available examples. It processes the English entries and limits the displayed definitions to one per part of speech.

Website: https://en.wiktionary.org/

### 2. Datamuse API

Datamuse provides related-word information and autocomplete suggestions.

**Synonyms**

`https://api.datamuse.com/words?rel_syn={word}&max=10`

**Antonyms**

`https://api.datamuse.com/words?rel_ant={word}&max=10`

**Autocomplete**

`https://api.datamuse.com/words?sp={word}*&max=5`

The application displays up to ten synonyms and antonyms when available and up to five autocomplete suggestions.

Website: https://www.datamuse.com/api/

### 3. Web Speech API

The Web Speech API provides the pronunciation feature through the browser's built-in speech synthesis.

The JavaScript uses `SpeechSynthesisUtterance` and `window.speechSynthesis` to read the searched word aloud. It uses the `en-US` language setting and a speech rate of `0.85`.

No separate pronunciation API key is required. The voice quality depends on the available voices on the user's device and browser.

Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

## Project File Structure

```text
WordDAL/
│
├── index.html
├── APP.html
├── Style.css
├── Script1.js
│
└── Asset/
    ├── RMA_8368.jpg
    ├── Tajora Althea 1.jpg
    └── Bonotan, L (1).jpg
```

### File Descriptions

- **index.html** — Contains the project introduction, team members, project description, and link to the dictionary application.
- **APP.html** — Contains the dictionary interface, search form, autocomplete container, status message, and results container.
- **Style.css** — Defines the visual design, layout, and styling of the website.
- **Script1.js** — Handles API requests, searching, definitions, examples, pronunciation, synonyms, antonyms, and autocomplete.
- **Asset/** — Stores the images displayed on the group portfolio homepage.

## How the Application Works

1. The user enters an English word into the search bar.
2. JavaScript prevents the form from reloading the page and sends a request to the Wiktionary API.
3. The application checks the response and retrieves the English dictionary entries.
4. The results are displayed with the word's part of speech and one definition per entry.
5. Up to three unique example sentences are displayed when available.
6. The Datamuse API retrieves synonyms and antonyms.
7. As the user types at least two characters, Datamuse provides autocomplete suggestions.
8. The user can click **Hear Pronunciation** to listen to the searched word.
9. If a request fails or a word cannot be found, the application displays an appropriate message.

## How to Run the Project

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Check that the HTML, CSS, JavaScript, and image files are in the correct locations.
4. Open `index.html` using a web browser or the Visual Studio Code Live Server extension.
5. Click **Open Dictionary App** to access the dictionary.
6. Enter a word and click **Search**.
7. View the definition, examples, synonyms, and antonyms.
8. Click **Hear Pronunciation** to listen to the word.

**Requirement:** An internet connection is needed to retrieve information from Wiktionary and Datamuse.

## Team Members and Responsibilities

### Dhea — Research & Documentation
- Tests the application and gathers project information.
- Helps prepare the project documentation.
- Checks the application's functionality.

### Althea — CSS & UI Designer
- Designs the website's visual appearance.
- Develops the CSS styling and layout.
- Helps maintain a user-friendly interface.

### Lex — HTML & JavaScript Developer
- Creates the HTML structure.
- Develops the JavaScript functionality.
- Integrates the APIs.
- Implements word searching, autocomplete, and pronunciation.

## Limitations

- An internet connection is required for dictionary data and related-word suggestions.
- Some words may have limited definitions or no available examples.
- Synonyms and antonyms depend on the results returned by Datamuse.
- Pronunciation quality depends on the voices supported by the browser and device.
- External API errors or service interruptions may temporarily affect some features.

## Project Objective

The objective of WordDAL is to help users expand their English vocabulary through a simple and interactive dictionary. The project demonstrates the use of HTML, CSS, JavaScript, asynchronous programming, and public API integration in developing a functional web application.

## Acknowledgments

We acknowledge Wiktionary and Datamuse for providing the external word data used in this project, as well as the developers of the Web Speech API and browser speech synthesis technologies.

---

**WordDAL — Discover words. Understand meanings. Expand your vocabulary.**