import React, {useEffect} from "react"
import {View, StyleSheet} from "react-native"
import Svg, {Line} from "react-native-svg"
import Animated, {
useSharedValue,
useAnimatedStyle,
withRepeat,
withTiming,
interpolate,
Easing
} from "react-native-reanimated"

const AnimatedLine = Animated.createAnimatedComponent(Line)

export default function BillBuddyLoader(){

const progress = useSharedValue(0)

useEffect(()=>{

progress.value = withRepeat(
withTiming(1,{
duration:2200,
easing:Easing.linear
}),
-1,
false
)

},[])

const glow = useAnimatedStyle(()=>{

const scale = interpolate(progress.value,[0,1],[0.8,1.3])

return{
transform:[{scale}],
opacity:interpolate(progress.value,[0,0.5,1],[0.4,1,0.4])
}

})

const wave1 = useAnimatedStyle(()=>{

const height = interpolate(progress.value,[0,0.5,1],[10,40,10])

return{
height
}

})

const wave2 = useAnimatedStyle(()=>{

const height = interpolate(progress.value,[0,0.5,1],[30,10,30])

return{
height
}

})

return(

<View style={styles.container}>

<Animated.View style={[styles.glow,glow]} />

<View style={styles.waveContainer}>

<Animated.View style={[styles.waveBar,wave1]}/>
<Animated.View style={[styles.waveBar,wave2]}/>
<Animated.View style={[styles.waveBar,wave1]}/>
<Animated.View style={[styles.waveBar,wave2]}/>
<Animated.View style={[styles.waveBar,wave1]}/>

</View>

<Svg width={120} height={60}>

<AnimatedLine
x1="10"
y1="40"
x2="110"
y2="40"
stroke="#2563EB"
strokeWidth="3"
/>

</Svg>

</View>

)

}

const styles = StyleSheet.create({

container:{
width:160,
height:160,
justifyContent:"center",
alignItems:"center"
},

glow:{
position:"absolute",
width:140,
height:140,
borderRadius:100,
backgroundColor:"#2563EB33"
},

waveContainer:{
flexDirection:"row",
alignItems:"flex-end",
marginBottom:20
},

waveBar:{
width:6,
marginHorizontal:3,
borderRadius:4,
backgroundColor:"#2563EB"
}

})