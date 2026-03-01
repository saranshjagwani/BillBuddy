import { registerRootComponent } from 'expo';

import App from './src/app/App';

import { firebase } from '@react-native-firebase/app';

if (__DEV__) {
  // @ts-ignore
  global.__FIREBASE_APPCHECK_DEBUG_TOKEN__ = true;
}

appVerificationDisabledForTesting:false;
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
