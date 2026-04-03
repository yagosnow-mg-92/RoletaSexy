import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Dimensions, Easing } from 'react-native';
import Svg, { G, Path, Text as SvgText, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');
const WHEEL_SIZE = width * 0.85;
const RADIUS = WHEEL_SIZE / 2;
const CENTER = RADIUS;

const COLORS_PRELIM = [
  '#FF6B9D', '#FF4785', '#E91E8C', '#C2185B',
  '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#009688', '#FF5722', '#FFC107', '#8BC34A',
  '#00BCD4', '#FF7043', '#FF1744',
];

const COLORS_POSICAO = [
  '#FF6B9D', '#FF4785', '#E91E8C', '#C2185B',
  '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
  '#009688', '#FF5722', '#FFC107', '#8BC34A',
  '#00BCD4', '#FF7043', '#FF1744', '#E91E8C',
];

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function sectorPath(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y} Z`;
}

export default function RouletteWheel({ items, isSpinning, rotation, mode }) {
  const animatedRotation = useRef(new Animated.Value(0)).current;
  const currentRotation = useRef(0);

  const COLORS = mode === 'preliminares' ? COLORS_PRELIM : COLORS_POSICAO;

  useEffect(() => {
    if (isSpinning) {
      const spins = 5 + Math.random() * 5;
      const totalDeg = spins * 360 + rotation;

      Animated.timing(animatedRotation, {
        toValue: currentRotation.current + totalDeg,
        duration: 4000,
        easing: Easing.bezier(0.17, 0.89, 0.32, 1),
        useNativeDriver: true,
      }).start(() => {
        currentRotation.current = currentRotation.current + totalDeg;
      });
    }
  }, [isSpinning, rotation]);

  const spin = animatedRotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });

  const numItems = items.length;
  const anglePerItem = 360 / numItems;

  const sectors = items.map((item, i) => {
    const startAngle = i * anglePerItem;
    const endAngle = startAngle + anglePerItem;
    const midAngle = startAngle + anglePerItem / 2;
    const textPos = polarToCartesian(CENTER, CENTER, RADIUS * 0.62, midAngle);
    const color = COLORS[i % COLORS.length];
    const darkColor = color + 'CC';

    return {
      path: sectorPath(CENTER, CENTER, RADIUS - 4, startAngle, endAngle),
      textX: textPos.x,
      textY: textPos.y,
      midAngle,
      color: darkColor,
      label: item.emoji || '🔥',
      nome: item.nome,
    };
  });

  return (
    <View style={styles.container}>
      {/* Pointer */}
      <View style={styles.pointer}>
        <View style={styles.pointerTriangle} />
      </View>

      {/* Animated wheel */}
      <Animated.View style={[styles.wheel, { transform: [{ rotate: spin }] }]}>
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          {/* Outer ring */}
          <Circle cx={CENTER} cy={CENTER} r={RADIUS - 1} fill="none" stroke="#FF6B9D" strokeWidth={3} />

          {sectors.map((s, i) => (
            <G key={i}>
              <Path d={s.path} fill={s.color} stroke="rgba(0,0,0,0.4)" strokeWidth={1} />
              <SvgText
                x={s.textX}
                y={s.textY}
                fontSize={numItems > 12 ? 16 : 18}
                textAnchor="middle"
                alignmentBaseline="middle"
                transform={`rotate(${s.midAngle}, ${s.textX}, ${s.textY})`}
                fill="white"
              >
                {s.label}
              </SvgText>
            </G>
          ))}

          {/* Center circle */}
          <Circle cx={CENTER} cy={CENTER} r={32} fill="#1A0A2E" stroke="#FF6B9D" strokeWidth={3} />
          <SvgText x={CENTER} y={CENTER} fontSize={24} textAnchor="middle" alignmentBaseline="middle" fill="white">
            🔥
          </SvgText>
        </Svg>
      </Animated.View>

      {/* Glow effect */}
      <View style={styles.glow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  wheel: { width: WHEEL_SIZE, height: WHEEL_SIZE },
  pointer: {
    position: 'absolute', top: -10, zIndex: 10,
    alignItems: 'center',
  },
  pointerTriangle: {
    width: 0, height: 0,
    borderLeftWidth: 16, borderRightWidth: 16, borderTopWidth: 36,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#FF6B9D',
    shadowColor: '#FF6B9D', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 10,
    elevation: 10,
  },
  glow: {
    position: 'absolute',
    width: WHEEL_SIZE + 30,
    height: WHEEL_SIZE + 30,
    borderRadius: (WHEEL_SIZE + 30) / 2,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'rgba(255,107,157,0.3)',
  },
});
