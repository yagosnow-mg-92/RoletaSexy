import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Dimensions, ScrollView, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ResultCard({ item, onClose, playerName, mode }) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: height, duration: 300, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onClose);
  };

  if (!item) return null;

  const gradientColors = mode === 'preliminares'
    ? ['#1A0A2E', '#2D1B4E', '#3D1060']
    : ['#0A1A2E', '#1B2D4E', '#102D60'];

  const accentColor = item.cor || '#FF6B9D';

  return (
    <Modal transparent animationType="none" visible={!!item}>
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={styles.overlayTouch} onPress={handleClose} activeOpacity={1} />
      </Animated.View>

      <Animated.View style={[styles.card, { transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient colors={gradientColors} style={styles.cardInner}>

          {/* Header */}
          <View style={[styles.header, { borderBottomColor: accentColor + '40' }]}>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.5)" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Player name */}
            <Text style={styles.playerTag}>
              🎯 Vez de: <Text style={[styles.playerName, { color: accentColor }]}>{playerName}</Text>
            </Text>

            {/* Big emoji */}
            <Animated.View style={[styles.emojiContainer, { transform: [{ scale: scaleAnim }] }]}>
              <View style={[styles.emojiCircle, { borderColor: accentColor, shadowColor: accentColor }]}>
                <Text style={styles.bigEmoji}>{item.emoji}</Text>
              </View>
            </Animated.View>

            {/* Position name */}
            <Text style={[styles.positionName, { color: accentColor }]}>{item.nome}</Text>

            {/* Mode badge */}
            <View style={[styles.modeBadge, { backgroundColor: accentColor + '30', borderColor: accentColor }]}>
              <Text style={[styles.modeBadgeText, { color: accentColor }]}>
                {mode === 'preliminares' ? '💋 PRELIMINAR' : '🔥 POSIÇÃO'}
              </Text>
            </View>

            {/* Description */}
            <View style={styles.descriptionBox}>
              <Text style={styles.descriptionTitle}>📖 Como fazer:</Text>
              <Text style={styles.description}>{item.descricao}</Text>
            </View>

            {/* Instruction highlight */}
            <View style={[styles.instructionBox, { borderLeftColor: accentColor }]}>
              <Text style={styles.instructionLabel}>🎯 Missão:</Text>
              <Text style={styles.instruction}>{item.instrucao}</Text>
            </View>

            {/* Who does it */}
            {item.quem && (
              <View style={styles.quemBox}>
                <Text style={styles.quemText}>
                  {item.quem === 'ele' ? '👨 Ele faz para ela' :
                   item.quem === 'ela' ? '👩 Ela faz para ele' :
                   '👫 Os dois juntos!'}
                </Text>
              </View>
            )}

            {/* Difficulty */}
            {item.dificuldade && (
              <View style={styles.diffContainer}>
                <Text style={styles.diffLabel}>Dificuldade: </Text>
                <Text style={[styles.diffValue, {
                  color: item.dificuldade === 'Fácil' ? '#4CAF50' :
                         item.dificuldade === 'Médio' ? '#FFC107' : '#FF5722'
                }]}>
                  {item.dificuldade === 'Fácil' ? '🟢' : item.dificuldade === 'Médio' ? '🟡' : '🔴'} {item.dificuldade}
                </Text>
              </View>
            )}

            {/* Action button */}
            <TouchableOpacity onPress={handleClose} activeOpacity={0.8} style={styles.actionWrapper}>
              <LinearGradient
                colors={[accentColor, accentColor + 'CC']}
                style={styles.actionButton}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.actionText}>🔥 Vamos lá! 🔥</Text>
              </LinearGradient>
            </TouchableOpacity>

          </ScrollView>
        </LinearGradient>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)' },
  overlayTouch: { flex: 1 },
  card: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    maxHeight: height * 0.85, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.5, shadowRadius: 20,
    elevation: 20,
  },
  cardInner: { flex: 1, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16, borderBottomWidth: 1 },
  closeBtn: { padding: 4 },
  playerTag: { textAlign: 'center', fontSize: 16, color: 'rgba(255,255,255,0.7)', marginTop: 8 },
  playerName: { fontWeight: '900', fontSize: 18 },
  emojiContainer: { alignItems: 'center', marginVertical: 24 },
  emojiCircle: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 3,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 20, elevation: 10,
  },
  bigEmoji: { fontSize: 64 },
  positionName: { fontSize: 28, fontWeight: '900', textAlign: 'center', paddingHorizontal: 20, letterSpacing: 1 },
  modeBadge: {
    alignSelf: 'center', marginTop: 10, paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
  },
  modeBadgeText: { fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  descriptionBox: {
    margin: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
  },
  descriptionTitle: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 8, fontWeight: '700' },
  description: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
  instructionBox: {
    marginHorizontal: 20, marginBottom: 16, padding: 16,
    backgroundColor: 'rgba(255,107,157,0.1)', borderRadius: 12, borderLeftWidth: 4,
  },
  instructionLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 6, fontWeight: '700' },
  instruction: { color: '#FFFFFF', fontSize: 17, fontWeight: '700', lineHeight: 24 },
  quemBox: {
    alignSelf: 'center', marginBottom: 12, paddingHorizontal: 20, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20,
  },
  quemText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  diffContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  diffLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  diffValue: { fontSize: 14, fontWeight: '700' },
  actionWrapper: { marginHorizontal: 20, marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  actionButton: { paddingVertical: 18, alignItems: 'center', borderRadius: 16 },
  actionText: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1 },
});
