import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated,
  Dimensions, Alert, ScrollView, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import RouletteWheel from '../components/RouletteWheel';
import ResultCard from '../components/ResultCard';
import { PRELIMINARES, POSICOES } from '../data/gameData';

const { width, height } = Dimensions.get('window');

export default function GameScreen({ route, navigation }) {
  const { nomeHomem, nomeMulher } = route.params;

  const [mode, setMode] = useState('preliminares'); // 'preliminares' | 'posicoes'
  const [currentPlayer, setCurrentPlayer] = useState('homem'); // 'homem' | 'mulher'
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [roundCount, setRoundCount] = useState(0);
  const [showModeModal, setShowModeModal] = useState(false);

  const currentData = mode === 'preliminares' ? PRELIMINARES : POSICOES;
  const currentName = currentPlayer === 'homem' ? nomeHomem : nomeMulher;
  const currentEmoji = currentPlayer === 'homem' ? '👨' : '👩';

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spinRoulette = useCallback(() => {
    if (isSpinning) return;

    // Random item selection
    const randomIndex = Math.floor(Math.random() * currentData.length);
    const anglePerItem = 360 / currentData.length;
    // The pointer is at the top (0 deg), we need to spin so item lands at top
    const targetAngle = 360 - (randomIndex * anglePerItem + anglePerItem / 2);

    setRotation(targetAngle % 360);
    setIsSpinning(true);

    // Pulse the button
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    // After spin completes (4 seconds), show result
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(currentData[randomIndex]);
      setShowResult(true);
      setRoundCount(prev => prev + 1);
    }, 4200);
  }, [isSpinning, currentData]);

  const handleCloseResult = () => {
    setShowResult(false);
    // Switch player
    setCurrentPlayer(prev => prev === 'homem' ? 'mulher' : 'homem');
  };

  const handleModeSwitch = (newMode) => {
    setShowModeModal(false);
    if (newMode !== mode) {
      setMode(newMode);
      setCurrentPlayer('homem');
      setRoundCount(0);
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const modeColor = mode === 'preliminares' ? '#FF6B9D' : '#7B61FF';
  const gradientColors = mode === 'preliminares'
    ? ['#0D0D1A', '#1A0A2E', '#2D1050']
    : ['#0A0D1A', '#0A1A2E', '#102850'];

  return (
    <LinearGradient colors={gradientColors} style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🔥 Roleta do Prazer</Text>
          <View style={[styles.modePill, { backgroundColor: modeColor + '30', borderColor: modeColor }]}>
            <Text style={[styles.modePillText, { color: modeColor }]}>
              {mode === 'preliminares' ? '💋 Preliminares' : '🔥 Posições'}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => setShowModeModal(true)} style={styles.switchBtn}>
          <Ionicons name="swap-horizontal" size={22} color={modeColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Round counter */}
        <View style={styles.roundsContainer}>
          <Text style={styles.roundsText}>Rodada #{roundCount + 1}</Text>
          <View style={styles.playerIndicators}>
            <View style={[styles.playerPill, currentPlayer === 'homem' && styles.playerPillActive,
              currentPlayer === 'homem' && { borderColor: modeColor }]}>
              <Text style={styles.playerPillText}>👨 {nomeHomem}</Text>
            </View>
            <Text style={styles.vsText}>vs</Text>
            <View style={[styles.playerPill, currentPlayer === 'mulher' && styles.playerPillActive,
              currentPlayer === 'mulher' && { borderColor: modeColor }]}>
              <Text style={styles.playerPillText}>👩 {nomeMulher}</Text>
            </View>
          </View>
        </View>

        {/* Current player prompt */}
        <Animated.View style={[styles.playerPrompt, { opacity: glowOpacity }]}>
          <Text style={styles.playerPromptEmoji}>{currentEmoji}</Text>
          <Text style={styles.playerPromptText}>
            <Text style={[styles.playerPromptName, { color: modeColor }]}>{currentName}</Text>
            {'\n'}gire a roleta! 🎰
          </Text>
        </Animated.View>

        {/* Roulette wheel */}
        <View style={styles.wheelContainer}>
          <RouletteWheel
            items={currentData}
            isSpinning={isSpinning}
            rotation={rotation}
            mode={mode}
          />
        </View>

        {/* Spin button */}
        <Animated.View style={[styles.spinButtonWrapper, { transform: [{ scale: pulseAnim }] }]}>
          <TouchableOpacity
            onPress={spinRoulette}
            disabled={isSpinning}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={isSpinning
                ? ['#444', '#333']
                : [modeColor, modeColor + 'AA', modeColor]}
              style={styles.spinButton}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            >
              {isSpinning ? (
                <Text style={styles.spinButtonText}>🌀 Girando...</Text>
              ) : (
                <Text style={styles.spinButtonText}>
                  {currentEmoji} {currentName} — Girar! 🎰
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Mode switch hint */}
        <TouchableOpacity onPress={() => setShowModeModal(true)} style={styles.switchHint}>
          <Text style={styles.switchHintText}>
            {mode === 'preliminares'
              ? '🔥 Prontos para as posições? Toque para avançar'
              : '💋 Voltar para as preliminares?'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        {/* Item list preview */}
        <View style={styles.previewSection}>
          <Text style={styles.previewTitle}>
            {mode === 'preliminares' ? '💋' : '🔥'} O que pode sair ({currentData.length} opções):
          </Text>
          <View style={styles.tagsContainer}>
            {currentData.map((item) => (
              <View key={item.id} style={[styles.tag, { backgroundColor: (item.cor || modeColor) + '25', borderColor: (item.cor || modeColor) + '60' }]}>
                <Text style={styles.tagText}>{item.emoji} {item.nome}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Result Modal */}
      {showResult && selectedItem && (
        <ResultCard
          item={selectedItem}
          onClose={handleCloseResult}
          playerName={currentName}
          mode={mode}
        />
      )}

      {/* Mode Switch Modal */}
      <Modal
        transparent
        visible={showModeModal}
        animationType="fade"
        onRequestClose={() => setShowModeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <LinearGradient colors={['#1A0A2E', '#2D1B4E']} style={styles.modalInner}>
              <Text style={styles.modalTitle}>Mudar de Fase</Text>
              <Text style={styles.modalSubtitle}>Escolham onde querem estar:</Text>

              <TouchableOpacity
                onPress={() => handleModeSwitch('preliminares')}
                style={[styles.modalOption, mode === 'preliminares' && styles.modalOptionActive]}
              >
                <LinearGradient
                  colors={['#FF6B9D33', '#FF6B9D11']}
                  style={styles.modalOptionGradient}
                >
                  <Text style={styles.modalOptionEmoji}>💋</Text>
                  <View>
                    <Text style={styles.modalOptionTitle}>Preliminares</Text>
                    <Text style={styles.modalOptionDesc}>Esquentando os motores... {PRELIMINARES.length} atividades</Text>
                  </View>
                  {mode === 'preliminares' && <Ionicons name="checkmark-circle" size={24} color="#FF6B9D" />}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleModeSwitch('posicoes')}
                style={[styles.modalOption, mode === 'posicoes' && styles.modalOptionActive]}
              >
                <LinearGradient
                  colors={['#7B61FF33', '#7B61FF11']}
                  style={styles.modalOptionGradient}
                >
                  <Text style={styles.modalOptionEmoji}>🔥</Text>
                  <View>
                    <Text style={styles.modalOptionTitle}>Posições</Text>
                    <Text style={styles.modalOptionDesc}>Hora da penetração! {POSICOES.length} posições</Text>
                  </View>
                  {mode === 'posicoes' && <Ionicons name="checkmark-circle" size={24} color="#7B61FF" />}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowModeModal(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: 20, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,107,157,0.2)',
  },
  backBtn: { padding: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  modePill: {
    marginTop: 4, paddingHorizontal: 12, paddingVertical: 3,
    borderRadius: 12, borderWidth: 1,
  },
  modePillText: { fontSize: 12, fontWeight: '700' },
  switchBtn: { padding: 8 },
  scroll: { paddingBottom: 40 },
  roundsContainer: { padding: 16, alignItems: 'center' },
  roundsText: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 12 },
  playerIndicators: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playerPill: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  playerPillActive: { backgroundColor: 'rgba(255,107,157,0.15)' },
  playerPillText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  vsText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  playerPrompt: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
  playerPromptEmoji: { fontSize: 36, marginBottom: 6 },
  playerPromptText: { fontSize: 18, color: '#FFFFFF', textAlign: 'center', lineHeight: 28 },
  playerPromptName: { fontWeight: '900', fontSize: 22 },
  wheelContainer: { alignItems: 'center', paddingHorizontal: 10, marginBottom: 20 },
  spinButtonWrapper: { marginHorizontal: 20, borderRadius: 20, overflow: 'hidden', elevation: 10, marginBottom: 12 },
  spinButton: { paddingVertical: 20, alignItems: 'center', borderRadius: 20 },
  spinButtonText: { fontSize: 18, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.5 },
  switchHint: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, gap: 6,
  },
  switchHintText: { color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecorationLine: 'underline' },
  previewSection: { marginTop: 10, paddingHorizontal: 16 },
  previewTitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 10, fontWeight: '700' },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, borderWidth: 1,
  },
  tagText: { color: 'rgba(255,255,255,0.8)', fontSize: 11 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalCard: { borderRadius: 24, overflow: 'hidden' },
  modalInner: { padding: 24 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF', textAlign: 'center', marginBottom: 6 },
  modalSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 24 },
  modalOption: { borderRadius: 16, overflow: 'hidden', marginBottom: 12, borderWidth: 1, borderColor: 'transparent' },
  modalOptionActive: { borderColor: '#FF6B9D' },
  modalOptionGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  modalOptionEmoji: { fontSize: 32 },
  modalOptionTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  modalOptionDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  modalCloseBtn: { paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  modalCloseText: { color: 'rgba(255,255,255,0.4)', fontSize: 16 },
});
