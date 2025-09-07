# Spanish Learning Tracker 🇪🇸📚

Una aplicación completa para rastrear tu progreso de aprendizaje del español / A comprehensive Spanish language learning progress tracker.

> *"El límite de tu lenguaje es el límite de tu mundo."* - Ludwig Wittgenstein

## 🎯 Overview / Descripción

Spanish Learning Tracker is a React Native (Expo) application designed to help Spanish language learners plan, track, and analyze their progress across six core language skills with personalized schedules, motivational elements, and detailed reporting.

La aplicación Spanish Learning Tracker está diseñada para ayudar a estudiantes de español a planificar, rastrear y analizar su progreso en seis habilidades fundamentales del idioma.

## ✨ Features / Características

### 🚀 Core Features
- **3-Step Onboarding Wizard** - Personalized goal setting and schedule planning
- **Six Language Skills Tracking** - Listening, Reading, Writing, Speaking, Fluency, Pronunciation
- **Daily Practice Timer** - Track study sessions with built-in timers for each skill
- **Weekly Schedule Generator** - Automatic personalized study schedule creation
- **Progress Analytics** - Detailed success rate analysis and progress visualization
- **Weekly Review System** - Self-assessment and reflection with motivational feedback
- **Bilingual Interface** - Spanish/English throughout the app
- **Offline Support** - Full functionality without internet connection

### 🎨 User Experience
- **Spanish-Inspired Design** - Warm color palette with cultural elements
- **Motivational Quotes** - Rotating inspirational messages in Spanish with translations
- **Keyboard-Aware Interface** - Smooth input field editing and scrolling
- **Intuitive Navigation** - Clean tab-based structure for easy access

## 🛠 Tech Stack

- **Framework:** React Native with Expo (~53.0.22)
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **State Management:** React Context + useReducer
- **Data Storage:** AsyncStorage (offline-first)
- **Package Manager:** pnpm
- **Code Quality:** oxlint, prettier, husky + lint-staged

## 🏁 Get Started / Comenzar

### Prerequisites / Requisitos
- Node.js (>=14.17)
- pnpm
- Expo CLI
- iOS Simulator / Android Emulator / Expo Go app

### Installation / Instalación

1. **Clone the repository / Clona el repositorio:**
   ```bash
   git clone <repository-url>
   cd language-tracker
   ```

2. **Install dependencies / Instala las dependencias:**
   ```bash
   pnpm install
   ```

3. **Start the development server / Inicia el servidor de desarrollo:**
   ```bash
   pnpm start
   ```

4. **Run on your preferred platform / Ejecuta en tu plataforma preferida:**
   ```bash
   pnpm run ios      # iOS Simulator
   pnpm run android  # Android Emulator  
   pnpm run web      # Web browser
   ```

## 📱 App Structure / Estructura de la App

### Navigation / Navegación
- **🏠 Inicio (Home)** - Welcome screen with daily motivation and quick actions
- **📚 Práctica (Practice)** - Daily tracking with timers for each skill
- **📅 Horario (Schedule)** - Personalized weekly study schedule view
- **📊 Progreso (Progress)** - Analytics dashboard and progress reports

### User Journey / Viaje del Usuario
1. **Onboarding** - Set skill priorities and study schedule
2. **Daily Practice** - Track study sessions with built-in timers
3. **Weekly Review** - Complete self-assessment and reflection
4. **Progress Analysis** - View detailed analytics and success rates

## 📊 Skills Tracked / Habilidades Rastreadas

1. **🎧 Escuchar (Listening)** - Audio comprehension practice
2. **📖 Leer (Reading)** - Text comprehension and vocabulary
3. **✍️ Escribir (Writing)** - Written expression and grammar
4. **🗣 Hablar (Speaking)** - Oral expression and conversation
5. **💬 Fluidez (Fluency)** - Natural language flow and speed
6. **🔊 Pronunciación (Pronunciation)** - Accent and sound accuracy

## 🎯 Key Features Detail

### Onboarding Wizard
- **Step 1:** Skill priority allocation (percentages must total 100%)
- **Step 2:** Schedule planning (days per week + minutes per day)
- **Step 3:** Goal visualization with personalized schedule preview

### Daily Practice Tracking
- Individual timers for each language skill
- Session saving with minimum 1-minute requirement
- Progress visualization against daily goals
- Motivational tips and guidance

### Weekly Review System
- Comprehensive week summary (planned vs. actual)
- Self-assessment questions in both languages
- Mood and satisfaction rating (1-5 stars)
- Success rate analysis per skill

### Data Management
- Complete offline functionality with AsyncStorage
- Automatic success rate calculations
- Weekly progress history
- User profile and preference persistence

## 🔧 Development Scripts

```bash
pnpm start          # Start Expo development server
pnpm run ios        # Run on iOS Simulator
pnpm run android    # Run on Android Emulator
pnpm run web        # Run in web browser
pnpm run lint       # Run oxlint code linting
pnpm run format     # Format code with prettier
pnpm run typecheck  # Run TypeScript type checking
```

## 🎨 Design System

### Colors / Colores
- **Primary Orange:** `#FF8C00` - Main accent and CTAs
- **Warm Brown:** `#D2691E` - Headers and important text
- **Earth Brown:** `#8B4513` - Body text and labels
- **Light Cream:** `#FFF5E6` - Background and containers
- **Success Green:** `#4CAF50` - Completed states and positive feedback
- **Info Blue:** `#2196F3` - Information and secondary actions

### Typography / Tipografía
- Clear, readable fonts optimized for both Spanish and English text
- Hierarchical sizing for headers, body text, and UI elements
- Cultural sensitivity in language presentation

## 📁 Project Structure

```
/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   ├── onboarding.tsx     # Onboarding flow entry
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
│   ├── onboarding/        # Onboarding wizard components
│   ├── practice/          # Daily tracking components
│   ├── review/            # Weekly review components
│   └── schedule/          # Schedule visualization
├── contexts/              # React contexts
│   └── AppContext.tsx     # Global state management
├── data/                  # Static data and constants
│   └── quotes.ts          # Motivational quotes
├── types/                 # TypeScript type definitions
│   └── index.ts           # All app-wide interfaces
├── utils/                 # Utility functions
│   ├── calculations.ts    # Math and date utilities
│   └── storage.ts         # AsyncStorage helpers
└── CLAUDE.md              # Development documentation
```

## 🌟 Motivational Philosophy / Filosofía Motivacional

The app is built around the principle that consistent, small efforts lead to significant language learning progress. Every feature is designed to encourage daily practice while providing meaningful feedback and cultural connection to Spanish-speaking communities.

*La aplicación está construida sobre el principio de que esfuerzos pequeños y consistentes llevan a un progreso significativo en el aprendizaje de idiomas.*

## 🤝 Contributing / Contribuir

This project was developed using Claude Code with a focus on:
- Clean, maintainable TypeScript code
- Comprehensive user experience design
- Cultural sensitivity and bilingual support
- Offline-first architecture
- Performance optimization

## 📄 License

This project is private and proprietary.

---

**¡Buena suerte en tu viaje de aprendizaje del español! 🎉**
**Good luck on your Spanish learning journey! 🎉**