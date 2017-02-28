# Cue App

## Getting Up and Running
To install all dependencies, run:
```
npm install
```

To run ios app:
```
react-native run-ios
```

To run android app:
```
react-native run-android
```

## Running the iOS App Locally
To build the iOS app locally, you must first download the Facebook SDK to your
local machine:

1. Download the Facebook SDK from https://developers.facebook.com/docs/ios/getting-started/
2. Extract the zip to `~/Documents/FacebookSDK`. You must extract the zip to
this path!

To run the iOS app on a physical device, you must also ensure that a valid
Team is selected in Xcode for both the `Cue` and `CueTests` targets.

## Troubleshooting

> Could not connect to development server

In a separate terminal window run:
```
react-native start
```
