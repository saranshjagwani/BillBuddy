import React from 'react'

console.log("HomeScreen rendered");

import { View } from 'react-native';
import { Text } from 'react-native';

const DomeScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>DomeScreen</Text>
    </View>
  )
}

export default DomeScreen