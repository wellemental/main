MANUALLY LINK PODFILES In XCode, in the project navigator, right click Libraries ➜ Add Files to [your project's name]
Go to node_modules ➜ react-native-config and add ReactNativeConfig.xcodeproj
Expand the ReactNativeConfig.xcodeproj ➜ Products folder
In the project navigator, select your project. Add libReactNativeConfig.a to your project's Build Phases ➜ Link Binary With Libraries
And go the Build Settings tab. Make sure All is toggled on (instead of Basic)
Look for Header Search Paths and add \$(SRCROOT)/../node_modules/react-native-config/ios/\*\* as non-recursive
