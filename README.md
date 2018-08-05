# Contributing

Probably the setup instructions:

- Install Xcode
- Install iOS Simulator (Xcode -> Preferences -> Components)
- Install Cocoapods (``brew install cocoapods``)
- ``cd ios && pod install``
- ``yarn install``
- ``yarn run ios``

Probably gucci.

You can also split up Metro (aka webpack) and simulator:

- ``yarn start`` -- starts metro compiler in the foreground)
- ``react-native run-ios`` - starts the simulator and runs the app

### Data Model

glhf its firestore

```
peated
├── /locations
├── /distilleries
├── /bottles
|   ├── Distillery
├── /checkins
|   ├── Bottle
|   ├── Location
|   ├── User
|   ├── ItemOption
|   └── Build
├── /users
    └── /{userId}
        ├── /users
        └── /friends
```
