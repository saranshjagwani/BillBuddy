import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";


/**
 * BillBuddyLoading
 *
 * Full-screen branded loading screen.
 *
 * Purpose:
 * - Shown during app initialization / auth checks
 * - Reduces perceived waiting time
 * - Reinforces brand identity and voice-first nature
 *
 * This is a single-purpose component and is intentionally
 * NOT broken into smaller reusable parts.
 */
export default function BillBuddyLoading() {
  const { colors } = useTheme();

  /**
   * Entrance animation state
   * - opacity + scale create a soft fade-in
   * - avoids sudden visual jumps on load
   */
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.95));
  const [floatAnim] = useState(new Animated.Value(0));
  const [pulseAnim1] = useState(new Animated.Value(1));
  const [pulseAnim2] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(1));
  const [dot1Anim] = useState(new Animated.Value(0));
  const [dot2Anim] = useState(new Animated.Value(0));
  const [dot3Anim] = useState(new Animated.Value(0));
  const [glowAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    // Trigger fade-in shortly after mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Float animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animations for orbs
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim1, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim1, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim2, {
          toValue: 1.05,
          duration: 1500,
          delay: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim2, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bounce animation for mic badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Loading dots animation
    const createDotAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -10,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
    };

    Animated.parallel([
      createDotAnimation(dot1Anim, 0),
      createDotAnimation(dot2Anim, 200),
      createDotAnimation(dot3Anim, 400),
    ]).start();
  }, []);

  // Microphone Icon Component
  const MicrophoneIcon = () => (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="white">
      <Path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <Path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </Svg>
  );

  return (
    <View style={styles.overlay}>
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Background ambience: soft gradient orbs to reduce perceived wait time */}
      {/* ------------------------------------------------------------------ */}
      <View style={styles.backgroundOrbs}>
        <Animated.View
          style={[
            styles.orb1,
            {
              backgroundColor: colors.notification,
              transform: [{ scale: pulseAnim1 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.orb2,
            {
              backgroundColor: colors.primary,
              transform: [{ scale: pulseAnim2 }],
            },
          ]}
        />
      </View>

      {/* ------------------------------------------------ */}
      {/* Main content container (brand + messaging)      */}
      {/* ------------------------------------------------ */}
      <View style={styles.content}>
        {/* ------------------------------- */}
        {/* Brand focus: logo with glow     */}
        {/* ------------------------------- */}
        <View style={styles.logoSection}>
          <View style={styles.logoWrapper}>
            {/* Soft glow behind logo to add depth */}
            <Animated.View
              style={[
                styles.glow,
                {
                  backgroundColor: "#FFD137",
                  opacity: glowAnim,
                },
              ]}
            />

            {/* Logo container */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  backgroundColor: "#FFD137",
                  transform: [{ translateY: floatAnim }],
                },
              ]}
            >
              <Image
                source={require("../../../assets/BillBuddyLogo2.png")}
                style={styles.logo}
                resizeMode="contain"
              />

              {/* -------------------------------- */}
              {/* Voice-first signal: mic badge   */}
              {/* -------------------------------- */}
              <View style={styles.micBadgeContainer}>
                <View style={styles.micBadge}>
                  {/* Pulse rings to indicate activity */}
                  <Animated.View
                    style={[
                      styles.pulseRing1,
                      {
                        backgroundColor: colors.primary,
                        opacity: 0.4,
                      },
                    ]}
                  />
                  <Animated.View
                    style={[
                      styles.pulseRing2,
                      {
                        backgroundColor: colors.primary,
                        opacity: 0.3,
                      },
                    ]}
                  />

                  {/* Microphone icon */}
                  <Animated.View
                    style={[
                      styles.micIcon,
                      {
                        backgroundColor: colors.primary,
                        transform: [{ scale: bounceAnim }],
                      },
                    ]}
                  >
                    <MicrophoneIcon />
                  </Animated.View>
                </View>
              </View>
            </Animated.View>
          </View>
        </View>

        {/* ------------------------------- */}
        {/* Identity text: name & tagline   */}
        {/* ------------------------------- */}
        <View style={styles.textSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            BillBuddy
          </Text>
          <Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
            AI-Powered Shop Assistant
          </Text>
        </View>

        {/* ------------------------------- */}
        {/* Progress feedback: loading dots */}
        {/* ------------------------------- */}
        <View style={styles.dotsContainer}>
          {[dot1Anim, dot2Anim, dot3Anim].map((anim, index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: colors.primary,
                  transform: [{ translateY: anim }],
                },
              ]}
            />
          ))}
        </View>

        {/* -------------------------------- */}
        {/* Capability hints (feature pills) */}
        {/* -------------------------------- */}
        <View style={styles.pillsContainer}>
          {/* Voice First */}
          <View style={[styles.pill, { borderColor: colors.border }]}>
            <Text style={styles.emoji}>🎤</Text>
            <Text style={[styles.pillText, { color: colors.text }]}>
              Voice First
            </Text>
          </View>

          {/* Real-time Insights */}
          <View style={[styles.pill, { borderColor: colors.border }]}>
            <Text style={styles.emoji}>⚡</Text>
            <Text style={[styles.pillText, { color: colors.text }]}>
              Real-time Insights
            </Text>
          </View>

          {/* Smart AI */}
          <View style={[styles.pill, { borderColor: colors.border }]}>
            <Text style={styles.emoji}>🧠</Text>
            <Text style={[styles.pillText, { color: colors.text }]}>
              Smart AI
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999, // Android
  },
  container: {
    zIndex: 1000,
    elevation: 1000,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  backgroundOrbs: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  orb1: {
    position: "absolute",
    top: "25%",
    left: "25%",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.3,
  },
  orb2: {
    position: "absolute",
    bottom: "25%",
    right: "25%",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.2,
  },
  content: {
    zIndex: 10,
    alignItems: "center",
  },
  logoSection: {
    marginBottom: 24,
  },
  logoWrapper: {
    position: "relative",
  },
  glow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 32,
    opacity: 0.4,
  },
  logoContainer: {
    height: 144,
    width: 144,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  logo: {
    height: 112,
    width: 112,
  },
  micBadgeContainer: {
    position: "absolute",
    bottom: -8,
    right: -8,
  },
  micBadge: {
    position: "relative",
  },
  pulseRing1: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    opacity: 0.4,
  },
  pulseRing2: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    opacity: 0.3,
  },
  micIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  textSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  pillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 18,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
  },
});