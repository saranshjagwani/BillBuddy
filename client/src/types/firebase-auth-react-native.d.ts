declare module 'firebase/auth/react-native' {
  import { Persistence } from 'firebase/auth';

  // AsyncStorage type is any here to avoid a hard dependency on the
  // exact AsyncStorage type from @react-native-async-storage/async-storage.
  export function getReactNativePersistence(asyncStorage: any): Persistence;
}
