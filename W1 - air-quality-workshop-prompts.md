# Air Quality Checker Web App: Copilot Agent Prompts

Below are example prompt sets to guide a developer step-by-step as they build an **Air Quality Checker** web app using Copilot in agent mode. Prompts are designed to support mainstream languages and frameworks (e.g., JavaScript/React, Python/Flask, etc.), and are structured for progressive enhancement.

---

## 1. Basic Web App Scaffold Prompt

**Goal:**  
Create a web app that lets the user input city, state/province/region, and country (or city & state for USA by default).

**Prompt:**
```
Create a minimal web app that allows a user to enter either:
- a city, state/province/region, and country
- or, just a city and state (assuming USA as the default country).

Show a simple form with the required input fields and a submit button. The app should have basic client-side validation to ensure all required fields are filled. Use any popular frontend framework or plain HTML/JS, and set up the basic project structure.
```

---

## 2. Add AQI Data Fetching and Display

**Goal:**  
Enhance the app to fetch air quality data from a public API and display AQI and relevant info.

**Prompt:**
```
Update the web app to fetch the current air quality index (AQI) and other relevant air quality information for the location the user enters.

- Use the Open-Meteo Air Quality API (https://open-meteo.com/en/docs/air-quality-api), which does not require authentication or an API token.
- When the form is submitted, convert the user’s location input into geographic coordinates (latitude and longitude) using a public geocoding API (such as Nominatim: https://nominatim.openstreetmap.org/).
- Fetch the AQI and display it on the page, along with key details such as the main pollutant, measurement time, and any health advisories if available.
- Handle errors gracefully (e.g., location not found, API issues).
- Organize the code for maintainability.
```

---

## 3. Optional: Add Unit/Integration Tests

**Goal:**  
Add testing to the project.

**Prompt:**
```
Add a test suite for the web app.

- Include both unit and integration tests.
- Test form validation, the API fetch logic, and the rendering of AQI results.
- Use a popular testing framework appropriate for the tech stack (e.g., Jest for React, Pytest for Flask, etc.).
- Provide example test cases for key components and functions.
```

---

## 4. Optional: Add Build & Test Automation with GitHub Actions

**Goal:**  
Set up CI to automate testing and builds.

**Prompt:**
```
Add a GitHub Actions workflow to the project.

- The workflow should run automatically on pull requests and pushes to the main branch.
- It should install dependencies, build the app (if required), and run all tests.
- Use a template appropriate for the chosen language and framework.
- Place the workflow YAML in the .github/workflows directory.
```

---

## 5. Further Workshop Extension Suggestions

Here are additional ways to extend the Air Quality Checker app, suitable for workshop participants who finish early or want to explore more advanced features:

### a. **Store and Visualize Search History**
- Allow users to save each search in an open source database (such as SQLite or PostgreSQL).
- Display a table or chart showing AQI trends for the cities previously searched.

### b. **Favorite Locations**
- Let users mark locations as favorites and quickly re-check AQI.
- Store favorites in the database and display them on a dashboard.

### c. **Compare Multiple Cities**
- Enable users to enter and compare AQI data for two or more cities side-by-side.
- Visualize differences using charts or color-coded cards.

### d. **Map Integration**
- Show searched or favorite locations on a map (e.g., using Leaflet.js or Google Maps API).
- Display AQI as colored pins or heatmaps.

### e. **Mobile Responsiveness & Accessibility**
- Improve the user interface for mobile devices.
- Add accessibility features such as keyboard navigation and ARIA labels.

### f. **Health Recommendations**
- Display contextual health guidance based on AQI levels (e.g., "Unhealthy for Sensitive Groups").
- Optionally, link to local government or WHO recommendations.

### g. **Localization & Internationalization**
- Support multiple languages for the app interface.
- Allow users to choose their preferred language and units (e.g., µg/m³ vs. ppm).

### h. **Offline Support**
- Allow users to view recent AQI results offline using service workers or local storage.

### i. **User Accounts (Advanced)**
- Add optional user login so people can save their history and favorites across devices (using an open source authentication solution).

---

### How to Use These Prompts

1. **Start with the first prompt** to scaffold your web app.
2. **Use the second prompt** to add core AQI functionality.
3. **Optionally, use the third and fourth prompts** to add tests and CI.
4. **Explore further extensions** as time allows or for more advanced workshop sessions.

These prompts are intentionally open-ended so Copilot can tailor its output to your chosen tech stack. You can further specify the language or framework in your prompt for more focused results (e.g., "using Python and Flask," "with React," etc.).

Let me know if you want sample outputs for a specific stack!