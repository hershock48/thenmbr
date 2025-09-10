# NMBR Mobile App

The mobile application for the NMBR Platform - Story-Driven Fundraising for Nonprofits.

## Features

- **Dashboard**: Real-time metrics and analytics
- **Marketplace**: Product catalog and storefront management
- **Community**: Member management and referral system
- **Stories**: Story creation and management
- **Revenue**: Revenue tracking and analytics
- **Profile**: User and organization management

## Prerequisites

- Node.js (>= 16)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

## Installation

1. Install dependencies:
```bash
npm install
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

3. Start Metro bundler:
```bash
npm start
```

4. Run on device/simulator:
```bash
# Android
npm run android

# iOS
npm run ios
```

## Project Structure

```
mobile/
├── src/
│   ├── components/          # Reusable UI components
│   ├── screens/            # Screen components
│   │   ├── auth/          # Authentication screens
│   │   ├── dashboard/     # Dashboard screens
│   │   ├── marketplace/   # Marketplace screens
│   │   ├── community/     # Community screens
│   │   ├── stories/       # Story screens
│   │   ├── revenue/       # Revenue screens
│   │   ├── profile/       # Profile screens
│   │   └── settings/      # Settings screens
│   ├── navigation/         # Navigation configuration
│   ├── services/          # API and external services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript type definitions
│   ├── constants/         # App constants
│   └── assets/            # Images, fonts, etc.
├── android/               # Android-specific code
├── ios/                   # iOS-specific code
└── package.json
```

## Key Dependencies

- **React Navigation**: Navigation between screens
- **React Native Paper**: Material Design components
- **React Native Vector Icons**: Icon library
- **React Native Chart Kit**: Charts and graphs
- **React Native Async Storage**: Local data storage
- **React Native Camera**: Camera functionality
- **React Native QR Code**: QR code generation and scanning

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Building for Production

#### Android
```bash
npm run build:android
```

#### iOS
```bash
npm run build:ios
```

## API Integration

The app integrates with the NMBR Platform API for:
- User authentication and management
- Organization data
- Product catalog
- Story management
- Revenue analytics
- Community features

## Configuration

Set up your environment variables in a `.env` file:

```
API_BASE_URL=https://api.nmbr.com/v1
GOOGLE_MAPS_API_KEY=your_google_maps_key
ONESIGNAL_APP_ID=your_onesignal_app_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
