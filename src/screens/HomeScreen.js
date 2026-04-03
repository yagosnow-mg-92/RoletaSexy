import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [nomeHomem, setNomeHomem] = useState('');
  const [nomeMulher, setNomeMulher] = useState('');
  const [errors, setErrors] = useState({});

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleStart = () => {
    const newErrors = {};
    if (!nomeHomem.trim()) newErrors.homem = 'Digite o nome dele!';
    if (!nomeMulher.trim()) newErrors.mulher = 'Digite o nome dela!';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    navigation.navigate('Game', {
      nomeHomem: nomeHomem.trim(),
      nomeMulher: nomeMulher.trim(),
    });
  };

  return (
    <LinearGradient
      colors={['#0D0D1A', '#1A0A2E', '#2D1B4E', '#0D0D1A']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

            {/* Stars decoration */}
            <View style={styles.starsContainer}>
              {['✨', '💫', '⭐', '✨', '💫'].map((star, i) => (
                <Text key={i} style={[styles.star, { left: `${i * 25}%`, top: `${Math.random() * 100}%` }]}>{star}</Text>
              ))}
            </View>

            {/* Logo / Title */}
            <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>🎰</Text>
              </View>
            </Animated.View>

            <Text style={styles.title}>Roleta do{'\n'}Prazer</Text>
            <Text style={styles.subtitle}>❤️ O jogo do casal mais safado ❤️</Text>

            {/* Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  <Text style={styles.labelEmoji}>👨</Text> Nome Dele
                </Text>
                <View style={[styles.inputContainer, errors.homem && styles.inputError]}>
                  <Ionicons name="person" size={20} color="#FF6B9D" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome do homem..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={nomeHomem}
                    onChangeText={(text) => {
                      setNomeHomem(text);
                      if (errors.homem) setErrors({ ...errors, homem: null });
                    }}
                    autoCapitalize="words"
                  />
                </View>
                {errors.homem && <Text style={styles.errorText}>{errors.homem}</Text>}
              </View>

              <View style={styles.heartDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.heartText}>💕</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>
                  <Text style={styles.labelEmoji}>👩</Text> Nome Dela
                </Text>
                <View style={[styles.inputContainer, errors.mulher && styles.inputError]}>
                  <Ionicons name="person" size={20} color="#FF6B9D" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nome da mulher..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={nomeMulher}
                    onChangeText={(text) => {
                      setNomeMulher(text);
                      if (errors.mulher) setErrors({ ...errors, mulher: null });
                    }}
                    autoCapitalize="words"
                  />
                </View>
                {errors.mulher && <Text style={styles.errorText}>{errors.mulher}</Text>}
              </View>
            </View>

            {/* Start Button */}
            <TouchableOpacity onPress={handleStart} activeOpacity={0.8} style={styles.startButtonWrapper}>
              <LinearGradient
                colors={['#FF6B9D', '#FF1493', '#C2185B']}
                style={styles.startButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.startButtonText}>🔥 Começar o Jogo! 🔥</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              🔞 Jogo exclusivo para maiores de 18 anos{'\n'}Para casais que curtem safadeza 😈
            </Text>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: 30, paddingVertical: 50, justifyContent: 'center' },
  starsContainer: { position: 'absolute', width: '100%', height: '100%' },
  star: { position: 'absolute', fontSize: 16, opacity: 0.3 },
  logoContainer: { marginBottom: 20 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,107,157,0.2)',
    borderWidth: 2, borderColor: '#FF6B9D',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: { fontSize: 50 },
  title: {
    fontSize: 48, fontWeight: '900', color: '#FFFFFF', textAlign: 'center',
    textShadowColor: '#FF6B9D', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20,
    letterSpacing: 2, lineHeight: 54,
  },
  subtitle: { fontSize: 16, color: '#FF9CC8', textAlign: 'center', marginTop: 10, marginBottom: 40 },
  formContainer: { width: '100%', marginBottom: 30 },
  inputWrapper: { marginBottom: 10 },
  inputLabel: { fontSize: 16, color: '#FF9CC8', marginBottom: 8, fontWeight: '700' },
  labelEmoji: { fontSize: 18 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,107,157,0.4)',
    paddingHorizontal: 16, paddingVertical: 4,
  },
  inputError: { borderColor: '#FF1744' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 18, color: '#FFFFFF', paddingVertical: 14 },
  errorText: { color: '#FF6B6B', fontSize: 13, marginTop: 4, marginLeft: 8 },
  heartDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,107,157,0.3)' },
  heartText: { marginHorizontal: 12, fontSize: 20 },
  startButtonWrapper: { width: '100%', borderRadius: 20, overflow: 'hidden', elevation: 10, marginBottom: 20 },
  startButton: { paddingVertical: 20, alignItems: 'center', borderRadius: 20 },
  startButtonText: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
  disclaimer: { fontSize: 12, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 20 },
});
