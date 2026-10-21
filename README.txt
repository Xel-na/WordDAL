# WordDAL — Dictionary Web Application

## Project Description

WordDAL is a web-based dictionary application that helps users understand English vocabulary through definitions, parts of speech, example sentences, synonyms, antonyms, autocomplete suggestions, and pronunciation.

## Group Members

- **Dhea** — Research and HTML Developer
- **Althea** — CSS and UI Designer
- **Lex** — JavaScript Developer and Documentation

## Features

- Word definitions and parts of speech
- Example sentences, when available
- Synonyms and antonyms
- Autocomplete word suggestions
- Pronunciation using browser-based speech synthesis
- Responsive user interface

## APIs Used

**1. Wiktionary REST API**

Retrieves word definitions, parts of speech, and available example sentences.

- Website: https://en.wiktionary.org/
- Endpoint: `https://en.wiktionary.org/api/rest_v1/page/definition/{word}`

**2. Datamuse API**

Provides autocomplete suggestions and related words, including synonyms and antonyms.

- Documentation: https://www.datamuse.com/api/

**3. Web Speech API**

Uses the browser's speech synthesis to read searched words aloud.

- Documentation: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

## Technologies Used

- HTML5
- CSS3
- JavaScript
- REST APIs
- Visual Studio Code


- `index.html` — Group portfolio homepage
- `APP.html` — Dictionary application interface
- `Style.css` — Website styling and layout
- `Script1.js` — Application logic and API integration
- `Asset/` — Team member images and other assets

## How to Run

1. Download or clone the project repository.
2. Open the project folder in Visual Studio Code.
3. Ensure all required files and assets are present.
4. Open `index.html` in a browser or use Visual Studio Code Live Server.
5. Click **Open Dictionary App**.
6. Enter an English word and click **Search**.
7. Review the available word information and use the pronunciation feature.

## Requirements

- An active internet connection is required for API requests.
- Use a modern browser, such as Google Chrome, Microsoft Edge, or Brave.
- No API key is required for the APIs used.
- Available definitions, examples, synonyms, and antonyms depend on API responses.
- Pronunciation depends on browser support and available speech voices.
- Keep filenames and folder locations consistent with the HTML references.

## Project Objective

To develop a functional dictionary web application that supports English vocabulary learning and demonstrates the use of HTML, CSS, JavaScript, and external APIs.

