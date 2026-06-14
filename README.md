# Polka.Search

A modern Spring Boot web application for searching local businesses and events near you, with an elegant glassmorphic UI design and dark/light theme support.

## Features

✨ **Local Business & Event Search**
- Search for restaurants, events, shops, and more
- Filter by location (latitude/longitude) and radius
- Real-time search results in a responsive grid layout

🎨 **Modern UI Design**
- Glassmorphic effect with transparent panels
- Dark theme (default) with light theme toggle
- Red accent colors with smooth transitions
- Responsive design (desktop, tablet, mobile)

🌐 **Internationalization (i18n)**
- English (EN)
- Polish (PL)
- Ukrainian (UK)
- Language switching via `?lang=en|pl|uk` parameter

📰 **Latest Business Updates**
- Social media-style feed of business updates
- Deals, events, and news from local businesses
- Like counters and timestamps

⚡ **Development Ready**
- Spring Boot DevTools for hot-reload
- VS Code integration with launch config
- Maven build with Java 25 support

## Requirements

- **Java 25+** (LTS)
- **Maven 3.9+**
- **Spring Boot 3.2.0**

## Installation & Running

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/polka-search.git
cd polka-search
```

### 2. Build the Project
```powershell
$env:JAVA_HOME='C:\Users\fkonr\AppData\Local\jdks\jdk-25.0.2'
mvn clean compile
```

### 3. Run the Application

**Option A: Using VS Code Task (Recommended)**
- Press `Ctrl+Shift+B` to run the default "Spring Boot Run" task
- App starts at `http://localhost:8080`

**Option B: Using Maven Command**
```powershell
$env:JAVA_HOME='C:\Users\fkonr\AppData\Local\jdks\jdk-25.0.2'
mvn spring-boot:run
```

**Option C: Run JAR Directly**
```bash
mvn clean package -DskipTests
java -jar target/polka-search-0.0.1-SNAPSHOT.jar
```

### 4. Access the App
Open your browser: **http://localhost:8080**

## Project Structure

```
polka-search/
├── src/
│   ├── main/
│   │   ├── java/com/polka/search/
│   │   │   ├── PolkaSearchApplication.java      # Spring Boot entry point
│   │   │   ├── controller/
│   │   │   │   └── SearchController.java        # Search & updates handler
│   │   │   ├── model/
│   │   │   │   ├── Business.java
│   │   │   │   ├── Event.java
│   │   │   │   ├── Location.java
│   │   │   │   ├── SearchCriteria.java
│   │   │   │   ├── SearchResult.java
│   │   │   │   └── BusinessUpdate.java          # Social media updates
│   │   │   ├── service/
│   │   │   │   ├── SearchDataService.java
│   │   │   │   └── SearchService.java
│   │   │   └── config/
│   │   │       └── LocaleConfig.java            # i18n configuration
│   │   └── resources/
│   │       ├── application.properties            # Server config + DevTools
│   │       ├── messages*.properties              # i18n bundles (EN/PL/UK)
│   │       ├── static/
│   │       │   ├── css/styles.css               # Glassmorphic styling
│   │       │   └── js/theme-i18n.js             # Theme & i18n logic
│   │       └── templates/
│   │           └── search.html                   # Thymeleaf template
│   └── test/
├── .vscode/
│   ├── launch.json                               # Java debug config
│   ├── tasks.json                                # VS Code tasks
│   └── extensions.json                           # Recommended extensions
├── .gitignore
├── pom.xml                                       # Maven config (Java 25)
└── README.md
```

## Configuration

### Java Version
Default is **Java 25**. Edit `pom.xml` to change:
```xml
<java.version>25</java.version>
<maven.compiler.source>25</maven.compiler.source>
<maven.compiler.target>25</maven.compiler.target>
```

### Application Properties
Edit `src/main/resources/application.properties`:
```properties
server.port=8080
spring.thymeleaf.cache=false
spring.devtools.restart.enabled=true
spring.devtools.livereload.enabled=true
```

### i18n Languages
Add new language bundle:
1. Create `src/main/resources/messages_XX.properties` (where XX is language code)
2. Add translations for all keys in `messages.properties`
3. Language switching works via `?lang=XX` parameter

## Theme Toggle

- **Dark theme** is default (frosted glass effect over dark background)
- Click **Theme** button to toggle to **Light theme** (frosted glass over light background)
- Preference stored in browser's localStorage

## VS Code Integration

### Recommended Extensions
- **Extension Pack for Java** (Red Hat)
- **Spring Boot Extension Pack** (Pivotal)
- **Prettier** (Code formatter)

### Debug the App
1. Press `F5` to launch the app with debugger
2. Breakpoints, variable inspection, and stepping work normally
3. DevTools hot-reload restarts the app on resource changes

## Troubleshooting

### JAVA_HOME Not Set
If you get "JAVA_HOME is not defined" error:
```powershell
$env:JAVA_HOME='C:\Users\fkonr\AppData\Local\jdks\jdk-25.0.2'
mvn spring-boot:run
```

### Port 8080 Already in Use
Change the port in `application.properties`:
```properties
server.port=8081
```

### DevTools Not Working
Ensure `spring-boot-devtools` is in dependencies and `spring.devtools.restart.enabled=true` is set.

## API Endpoints

- **GET** `/` — Main search page with business results and latest updates
- **GET** `/?lang=en|pl|uk` — Change language
- **GET** `/?latitude=52.23&longitude=21.01&radius=10` — Search by coordinates

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created with ❤️ for local business discovery

---

**Questions?** Check the [Issues](https://github.com/yourusername/polka-search/issues) or create a new one!
