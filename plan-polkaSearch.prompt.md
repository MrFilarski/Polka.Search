## Plan: Polka.Search Spring App

TL;DR: Build a new Spring Boot web application named Polka.Search that delivers a local-search experience for businesses and events using seeded sample data, a location radius search form, and a UI rendered with Thymeleaf.

**Steps**
1. Set up the project skeleton.
   - Create a new Spring Boot project with Web and Thymeleaf dependencies.
   - Add a simple static asset structure for CSS and JS.
2. Define the domain model.
   - Create Java classes for `Business`, `Event`, `Location`, and `SearchResult`.
   - Include fields for name, description, category, date/time, location coordinates, address, and tags.
3. Implement a seeded data service.
   - Build a service that returns an in-memory list of local businesses and events.
   - Make the seed dataset cover multiple categories and nearby locations for a sample city.
4. Add search logic.
   - Implement radius-based location matching using coordinates and distance calculation.
   - Support text filtering over names, descriptions, categories, and tags.
   - Combine business and event results in one unified search response.
5. Build the web UI.
   - Create a main search page with a location input, radius selector, and search button.
   - Show results grouped by type and highlight local businesses and events.
   - Use Thymeleaf templates with a responsive layout.
6. Wire controller and views.
   - Add a Spring MVC controller for the search page and POST/GET search submission.
   - Populate the page with search inputs, results, and summary counts.
7. Validate and refine.
   - Test the application manually by running Spring Boot and searching for local area queries.
   - Confirm the seed data displays correctly and the radius search works.

**Relevant files**
- `src/main/java/.../PolkaSearchApplication.java` — bootstrap the Spring Boot app.
- `src/main/java/.../controller/SearchController.java` — request handling for search pages.
- `src/main/java/.../service/SearchDataService.java` — seeded data provider.
- `src/main/java/.../service/SearchService.java` — filtering and radius matching logic.
- `src/main/java/.../model/Business.java` — business entity.
- `src/main/java/.../model/Event.java` — event entity.
- `src/main/java/.../model/Location.java` — geographic location.
- `src/main/resources/templates/search.html` — main search UI.
- `src/main/resources/static/css/styles.css` — basic styling.

**Verification**
1. Run the Spring Boot app and open the search page.
2. Enter a city or ZIP and radius to confirm results appear.
3. Verify that both local businesses and events show in the results.
4. Confirm the seeded dataset includes multiple sample entries and that search filtering works.

**Decisions**
- The app is a full Spring Boot web application with server-side rendered UI.
- Search uses seeded local data only for the first version.
- Location input will support GPS-style radius searching around coordinates.
- The experience will focus on both local businesses and events in one unified search.

**Further Considerations**
1. If the user wants future expansion, a follow-up step can add persistent storage and external data APIs.
2. Consider whether the location input should also support plain city/ZIP fallback in the first release.
3. If maps are required later, add a map widget and location reverse-geocoding.
