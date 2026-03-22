import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import Colors from '@/constants/colors';
import { useGame, GENESIS_LESSONS, LESSON_QUIZZES } from '@/context/GameContext';
import { LionAvatar } from '@/components/LionAvatar';

type Phase = 'verse' | 'teaching' | 'quiz' | 'complete';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { completeLesson, userProgress } = useGame();

  const lesson = GENESIS_LESSONS.find((l) => l.id === id);
  const quizData = LESSON_QUIZZES[id as string] || [];

  const [phase, setPhase] = useState<Phase>('verse');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [goldEarned, setGoldEarned] = useState(0);

  const shakeValue = useSharedValue(0);
  const scaleValue = useSharedValue(1);

  if (!lesson || !userProgress) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={{ color: Colors.warm.textDark }}>Lição não encontrada.</Text>
      </View>
    );
  }

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === quizData[currentQuestionIdx].correct;
    if (isCorrect) {
      scaleValue.value = withSequence(withTiming(1.05, { duration: 150 }), withSpring(1));
    } else {
      shakeValue.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
      setLives((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (phase === 'verse') {
      setPhase('teaching');
    } else if (phase === 'teaching') {
      setPhase('quiz');
    } else if (phase === 'quiz') {
      if (lives === 0) {
        router.back();
        return;
      }
      if (currentQuestionIdx < quizData.length - 1) {
        setCurrentQuestionIdx((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        finishLesson();
      }
    } else if (phase === 'complete') {
      router.back();
    }
  };

  const finishLesson = async () => {
    let earned = lesson.goldReward;
    if (lives === 3) earned += 20;
    setGoldEarned(earned);
    await completeLesson(lesson.id, earned);
    setPhase('complete');
  };

  const animatedOptionStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeValue.value }],
  }));

  const animatedCorrectStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Feather name="x" size={28} color={Colors.warm.textMedium} />
        </TouchableOpacity>

        {phase === 'quiz' && (
          <View style={styles.progressContainer}>
            <View style={styles.dotsRow}>
              {quizData.map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    i < currentQuestionIdx
                      ? styles.dotCompleted
                      : i === currentQuestionIdx
                      ? styles.dotCurrent
                      : styles.dotPending,
                  ]}
                />
              ))}
            </View>
            <View style={styles.livesRow}>
              {[1, 2, 3].map((i) => (
                <Ionicons
                  key={i}
                  name={i <= lives ? 'heart' : 'heart-outline'}
                  size={24}
                  color={Colors.warm.terracotta}
                />
              ))}
            </View>
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >
        {phase === 'verse' && (
          <View style={styles.verseCard}>
            <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
            <View style={styles.ornamentLine} />
            <Text style={styles.verseText}>
              "No princípio, criou Deus os céus e a terra. A terra, porém, estava sem forma e vazia;
              havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas."
            </Text>
            <View style={styles.ornamentLine} />
          </View>
        )}

        {phase === 'teaching' && (
          <View style={styles.teachingContainer}>
            <View style={styles.narratorRow}>
              <LionAvatar stage={userProgress.avatarStage} size={80} />
            </View>
            <View style={styles.speechBubble}>
              <Text style={styles.teachingTitle}>O Poder da Criação</Text>
              {[
                'Deus não apenas formou o universo, Ele ordenou o caos. A terra era "sem forma e vazia", mas a Palavra de Deus trouxe estrutura, luz e vida.',
                'Na nossa jornada, enfrentamos momentos de caos. Mas o mesmo Espírito que pairava sobre as águas habita em nós. Pela fé, podemos declarar a Palavra de Deus e ver a ordem divina se estabelecer em nossa vida.',
              ].map((t, i) => (
                <View key={i} style={styles.bulletPoint}>
                  <View style={styles.orangeDot} />
                  <Text style={styles.teachingText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {phase === 'quiz' && (
          <View style={styles.quizContainer}>
            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{quizData[currentQuestionIdx].question}</Text>
            </View>

            <Animated.View style={[styles.optionsContainer, animatedOptionStyle]}>
              {quizData[currentQuestionIdx].options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === quizData[currentQuestionIdx].correct;

                let optionStyle = styles.optionBtn;
                let textStyle = styles.optionText;

                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = styles.optionCorrect;
                    textStyle = styles.optionTextCorrect;
                  } else if (isSelected && !isCorrect) {
                    optionStyle = styles.optionWrong;
                    textStyle = styles.optionTextWrong;
                  } else {
                    optionStyle = styles.optionDimmed;
                  }
                }

                const Wrapper = isAnswered && isCorrect ? Animated.View : View;

                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    onPress={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                  >
                    <Wrapper style={[optionStyle, isAnswered && isCorrect && animatedCorrectStyle]}>
                      <Text style={textStyle}>{opt}</Text>
                      {isAnswered && isCorrect && (
                        <Ionicons name="checkmark-circle" size={28} color={Colors.warm.success} />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <Ionicons name="close-circle" size={28} color={Colors.warm.terracotta} />
                      )}
                    </Wrapper>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>

            {isAnswered && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>
                  {selectedOption === quizData[currentQuestionIdx].correct ? 'Exato!' : 'Quase lá...'}
                </Text>
                <Text style={styles.explanationText}>
                  {quizData[currentQuestionIdx].explanation}
                </Text>
              </View>
            )}
          </View>
        )}

        {phase === 'complete' && (
          <View style={styles.completeCenter}>
            <View style={styles.completeAvatarGlow}>
              <LionAvatar stage={userProgress.avatarStage} size={180} />
            </View>

            <Text style={styles.completeTitle}>Parabéns!</Text>

            <View style={styles.rewardBox}>
              <Ionicons name="logo-bitcoin" size={36} color={Colors.warm.goldDark} />
              <Text style={styles.rewardValue}>+{goldEarned}</Text>
              <Text style={styles.rewardLabel}>moedas de ouro</Text>
            </View>

            {lives === 3 && (
              <View style={styles.perfectBadge}>
                <Ionicons name="star" size={18} color={Colors.warm.goldDark} />
                <Text style={styles.perfectText}>Perfeito! Bônus de 20 moedas</Text>
              </View>
            )}

            <View style={styles.progressBarWrapper}>
              <Text style={styles.progressText}>Rumo ao próximo nível</Text>
              <View style={styles.progressBarBackground}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        100,
                        (userProgress.goldCoins / userProgress.goldToNextLevel) * 100
                      )}%`,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            phase === 'quiz' && !isAnswered && styles.primaryButtonDisabled,
          ]}
          disabled={phase === 'quiz' && !isAnswered}
          onPress={handleNext}
        >
          <Text style={styles.primaryButtonText}>
            {phase === 'verse'
              ? 'Próximo'
              : phase === 'teaching'
              ? 'Começar Quiz'
              : phase === 'quiz' && isAnswered
              ? 'Continuar'
              : phase === 'complete'
              ? 'Continuar'
              : 'Avançar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warm.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 60,
  },
  closeBtn: { padding: 8, marginLeft: -8 },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  dotsRow: { flexDirection: 'row', gap: 8 },
  dot: { height: 12, borderRadius: 6 },
  dotCompleted: { width: 24, backgroundColor: Colors.warm.primary },
  dotCurrent: { width: 24, backgroundColor: Colors.warm.primaryLight },
  dotPending: { width: 12, backgroundColor: Colors.warm.border },
  livesRow: { flexDirection: 'row', gap: 4 },
  content: { paddingHorizontal: 24, paddingTop: 24 },
  verseCard: {
    backgroundColor: Colors.warm.surfaceWarm,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.warm.borderStrong,
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(180,100,20,0.12)' } as any,
      default: { elevation: 6, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12 },
    }),
  },
  lessonSubtitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.warm.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ornamentLine: { width: 80, height: 2, backgroundColor: Colors.warm.borderStrong, marginVertical: 24 },
  verseText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 22,
    color: Colors.warm.textDark,
    textAlign: 'center',
    lineHeight: 34,
  },
  teachingContainer: { width: '100%' },
  narratorRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: -20, zIndex: 2, paddingRight: 20 },
  speechBubble: {
    backgroundColor: Colors.warm.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: Colors.warm.borderStrong,
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(180,100,20,0.1)' } as any,
      default: { elevation: 4, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    }),
  },
  teachingTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 24, color: Colors.warm.textDark, marginBottom: 20, marginTop: 10 },
  bulletPoint: { flexDirection: 'row', marginBottom: 20 },
  orangeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.warm.primary, marginTop: 10, marginRight: 12 },
  teachingText: { fontFamily: 'Inter_500Medium', fontSize: 17, color: Colors.warm.textMedium, lineHeight: 27, flex: 1 },
  quizContainer: { width: '100%' },
  questionCard: {
    backgroundColor: Colors.warm.surface,
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.warm.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 16px rgba(180,100,20,0.08)' } as any,
      default: { elevation: 4, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
    }),
  },
  questionText: { fontFamily: 'Inter_700Bold', fontSize: 21, color: Colors.warm.textDark, lineHeight: 32, textAlign: 'center' },
  optionsContainer: { gap: 14 },
  optionBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.warm.surface, padding: 18, borderRadius: 18, borderWidth: 2, borderColor: Colors.warm.border,
  },
  optionCorrect: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.warm.successLight, padding: 18, borderRadius: 18, borderWidth: 2, borderColor: Colors.warm.success,
  },
  optionWrong: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.warm.hardBg, padding: 18, borderRadius: 18, borderWidth: 2, borderColor: Colors.warm.terracotta,
  },
  optionDimmed: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.warm.surface, padding: 18, borderRadius: 18, borderWidth: 2, borderColor: Colors.warm.border, opacity: 0.55,
  },
  optionText: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: Colors.warm.textDark, flex: 1 },
  optionTextCorrect: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.warm.success, flex: 1 },
  optionTextWrong: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.warm.terracotta, flex: 1 },
  explanationBox: {
    marginTop: 22,
    backgroundColor: Colors.warm.surfaceWarm,
    padding: 22,
    borderRadius: 18,
    borderLeftWidth: 6,
    borderLeftColor: Colors.warm.primary,
  },
  explanationTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.warm.textDark, marginBottom: 8 },
  explanationText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.warm.textMedium, lineHeight: 23 },
  completeCenter: { alignItems: 'center', paddingTop: 20 },
  completeAvatarGlow: {
    width: 220, height: 220, borderRadius: 110,
    backgroundColor: Colors.warm.goldLight,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 32, borderWidth: 6, borderColor: Colors.warm.gold,
  },
  completeTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 40, color: Colors.warm.primary, marginBottom: 24 },
  rewardBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.warm.goldLight, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: 20, borderWidth: 2, borderColor: Colors.warm.gold, marginBottom: 16,
  },
  rewardValue: { fontFamily: 'Inter_700Bold', fontSize: 44, color: Colors.warm.goldDark },
  rewardLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.warm.goldDark, marginTop: 6 },
  perfectBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.warm.goldLight, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 14, marginBottom: 28,
  },
  perfectText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.warm.goldDark },
  progressBarWrapper: { width: '100%', paddingHorizontal: 20 },
  progressText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.warm.textMedium, marginBottom: 12, textAlign: 'center' },
  progressBarBackground: { height: 20, backgroundColor: Colors.warm.xpBg, borderRadius: 10, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: Colors.warm.xpFill },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingTop: 16,
    backgroundColor: Colors.warm.bg, borderTopWidth: 1, borderTopColor: Colors.warm.border,
  },
  primaryButton: {
    backgroundColor: Colors.warm.primary, paddingVertical: 18, borderRadius: 20, alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(232,130,12,0.3)' } as any,
      default: { elevation: 4, shadowColor: '#E8820C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
    }),
  },
  primaryButtonDisabled: { backgroundColor: Colors.warm.borderStrong, opacity: 0.7, elevation: 0 },
  primaryButtonText: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#FFF', textTransform: 'uppercase', letterSpacing: 1 },
});
