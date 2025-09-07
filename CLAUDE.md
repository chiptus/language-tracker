# Spanish Learning Tracker App - Claude Development Notes

## Project Overview
A comprehensive React Native (Expo) application for tracking Spanish language learning progress across six core skills with personalized schedules and detailed reporting.

## Tech Stack
- **Framework**: React Native with Expo (~53.0.22)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React Context + useReducer
- **Data Storage**: AsyncStorage
- **Charts**: react-native-chart-kit
- **Package Manager**: pnpm
- **Linting**: oxlint
- **Formatting**: prettier
- **Git Hooks**: husky + lint-staged

## Key Features Implemented
1. ✅ Core data models and TypeScript interfaces
2. ✅ Calculation utilities for goals and success rates
3. ✅ Storage utilities for data persistence
4. ✅ App context for state management
5. ✅ Motivational quotes data
6. ✅ User onboarding flow (3-step wizard) with keyboard-aware scrolling
7. ✅ Weekly schedule generator and visualization
8. ✅ Daily tracking interface with timer functionality
9. ✅ Weekly review system with self-assessment
10. ⏳ Comprehensive reporting dashboard

## Project Structure
```
/
├── app/                    # Expo Router screens
├── components/            # Reusable UI components
├── contexts/             # React contexts (AppContext)
├── data/                 # Static data (quotes, constants)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
│   ├── calculations.ts   # Math and date calculations
│   └── storage.ts       # AsyncStorage utilities
└── CLAUDE.md            # This file
```

## Core Skills Tracked
1. Listening
2. Reading  
3. Writing
4. Speaking
5. Fluency
6. Pronunciation

## Development Scripts
- `pnpm start` - Start Expo development server
- `pnpm run android` - Run on Android
- `pnpm run ios` - Run on iOS
- `pnpm run web` - Run on web
- `pnpm run lint` - Run oxlint
- `pnpm run format` - Format code with prettier
- `pnpm run typecheck` - Run TypeScript type checking

## Data Models

### UserProfile
- skillPercentages: Distribution across 6 skills (must total 100%)
- schedule: Days per week + minutes per day
- startDate: When tracking began
- weeklyGoals: Calculated minutes per skill per week

### WeeklyData
- weekNumber: Sequential week number since start
- dateRange: Start and end dates for the week
- dailyPractice: Minutes practiced per skill per day
- weeklyReflection: Self-assessment and mood ratings
- successRates: Actual vs planned practice percentages

### ProgressData
- totalMinutes/Hours: Cumulative practice time
- averageSuccessRate: Success across all weeks
- weeklyHistory: Array of all WeeklyData
- currentMotivation: Current motivation level

## UI Flow
1. **Onboarding**: 3-step wizard for setup
   - Step 1: Skill priority allocation (percentages)
   - Step 2: Schedule planning (days/minutes)
   - Step 3: Goal visualization and confirmation

2. **Daily View**: Track practice sessions
   - Timer functionality
   - Quick skill entry
   - Progress indicators

3. **Weekly Review**: End-of-week assessment
   - Planned vs actual comparison
   - Self-reflection prompts
   - Motivation ratings

4. **Reports**: Comprehensive analytics
   - Charts and visualizations
   - Historical trends
   - Achievement tracking

## Color Scheme (Spanish-Inspired)
- Warm oranges, deep blues, earth greens
- Motivational and culturally appropriate
- High contrast for readability

## Git Hooks Configuration
- Pre-commit: oxlint + prettier formatting
- Automated code quality checks

## Next Development Steps
1. Complete onboarding wizard components
2. Implement daily tracking with timer
3. Build weekly schedule visualization
4. Create comprehensive reporting dashboard
5. Add Spanish-inspired styling
6. Thorough testing and bug fixes

## Notes for Future Development
- All data is stored locally using AsyncStorage
- App supports offline usage
- Motivational quotes rotate for engagement
- Success rates calculated automatically
- Export functionality can be added later
- Multi-language support ready for expansion