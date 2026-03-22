import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

import Colors from '@/constants/colors';
import { useGame, GENESIS_LESSONS } from '@/context/GameContext';
import { LionAvatar } from '@/components/LionAvatar';

const SCREEN_W = Dimensions.get('window').width;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProgress, isLessonCompleted } = useGame();

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 900 }),
        withTiming(1, { duration: 900 })
      ),
      -1,
      true
    );
  }, [pulse]);

  const animatedNodeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  if (!userProgress) return null;

  const currentLevelIndex = userProgress.completedLessons.length;
  const stages = ['Filhote', 'Jovem Leão', 'Leão Adolescente', 'Leão Adulto', 'Leão Mentor'];
  const stageName = stages[userProgress.avatarStage - 1];

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) },
      ]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Shalom!</Text>
          <Text style={styles.username}>Jovem Leão</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.statBadge, { borderColor: Colors.warm.primary }]}>
            <Feather name="zap" size={15} color={Colors.warm.primary} />
            <Text style={[styles.statText, { color: Colors.warm.primary }]}>
              {userProgress.currentStreak}
            </Text>
          </View>
          <View style={[styles.statBadge, { borderColor: Colors.warm.goldDark }]}>
            <Ionicons name="logo-bitcoin" size={15} color={Colors.warm.goldDark} />
            <Text style={[styles.statText, { color: Colors.warm.goldDark }]}>
              {userProgress.goldCoins}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarGlow}>
            <LionAvatar stage={userProgress.avatarStage} size={136} />
          </View>
          <Text style={styles.stageName}>{stageName}</Text>
          <View style={styles.xpRow}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lv {userProgress.level}</Text>
            </View>
            <View style={styles.xpBarBackground}>
              <View
                style={[
                  styles.xpBarFill,
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
          <Text style={styles.xpText}>
            {userProgress.goldCoins} / {userProgress.goldToNextLevel} moedas para o próximo nível
          </Text>
        </View>

        {/* Era Card — sem imagem de fundo */}
        <View style={styles.eraCard}>
          <View style={styles.eraCardInner}>
            <View style={styles.eraDecoLine} />
            <Text style={styles.eraTitle}>Jornada de{'\n'}Gênesis</Text>
            <Text style={styles.eraSubtitle}>Era das Origens</Text>
            <View style={styles.eraDecoLine} />
          </View>
          <View style={styles.eraStatsRow}>
            <View style={styles.eraStat}>
              <Ionicons name="book-outline" size={18} color={Colors.warm.primary} />
              <Text style={styles.eraStatText}>{GENESIS_LESSONS.length} lições</Text>
            </View>
            <View style={styles.eraStatDivider} />
            <View style={styles.eraStat}>
              <Ionicons name="star-outline" size={18} color={Colors.warm.goldDark} />
              <Text style={styles.eraStatText}>{userProgress.completedLessons.length} completas</Text>
            </View>
            <View style={styles.eraStatDivider} />
            <View style={styles.eraStat}>
              <Feather name="award" size={18} color="#8B6A3E" />
              <Text style={styles.eraStatText}>Era I</Text>
            </View>
          </View>
        </View>

        {/* Lesson Path */}
        <View style={styles.pathSection}>
          <View style={styles.pathContainer}>
            {GENESIS_LESSONS.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              const isCurrent = index === currentLevelIndex;
              const isLocked = index > currentLevelIndex;

              return (
                <View key={lesson.id} style={styles.nodeWrapper}>
                  {index > 0 && (
                    <View
                      style={[
                        styles.pathLine,
                        completed || isCurrent ? styles.pathLineActive : styles.pathLineLocked,
                      ]}
                    />
                  )}
                  <View
                    style={[
                      styles.nodeRow,
                      {
                        paddingLeft: index % 2 === 0 ? 0 : 72,
                        paddingRight: index % 2 === 0 ? 72 : 0,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      activeOpacity={0.8}
                      disabled={isLocked}
                      onPress={() => router.push(`/lesson/${lesson.id}`)}
                      style={styles.nodeTouch}
                    >
                      {isCurrent ? (
                        <Animated.View style={[styles.node, styles.currentNode, animatedNodeStyle]}>
                          <Ionicons name="star" size={28} color="#FFF" />
                        </Animated.View>
                      ) : completed ? (
                        <View style={[styles.node, styles.completedNode]}>
                          <Ionicons name="checkmark-done" size={22} color="#FFF" />
                        </View>
                      ) : (
                        <View style={[styles.node, styles.lockedNode]}>
                          <Feather name="lock" size={18} color="#8B6A3E" />
                        </View>
                      )}
                      <View
                        style={[
                          styles.nodeLabel,
                          index % 2 === 0 ? styles.nodeLabelLeft : styles.nodeLabelRight,
                        ]}
                      >
                        <View style={[styles.labelPill, isLocked && styles.labelPillLocked]}>
                          <Text
                            style={[styles.nodeLabelText, isLocked && styles.nodeLabelTextLocked]}
                            numberOfLines={2}
                          >
                            {lesson.title}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.upcomingEraCards}>
            {['Era da Formação', 'Terra Prometida'].map((era) => (
              <View key={era} style={styles.upcomingEra}>
                <Feather name="lock" size={20} color="#8B6A3E" />
                <Text style={styles.upcomingEraTitle}>{era}</Text>
                <Text style={styles.upcomingEraSubtitle}>Em breve</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warm.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.warm.bg,
    zIndex: 10,
  },
  greeting: { color: Colors.warm.textMedium, fontSize: 14, fontFamily: 'Inter_500Medium' },
  username: { color: Colors.warm.textDark, fontSize: 22, fontFamily: 'Inter_700Bold' },
  statsContainer: { flexDirection: 'row', gap: 10 },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warm.surface,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1.5,
  },
  statText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  scrollContent: { paddingTop: 4 },
  heroCard: {
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: Colors.warm.surface,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.warm.border,
    ...Platform.select({
      web: { boxShadow: '0 6px 24px rgba(120,60,10,0.12)' } as any,
      default: { elevation: 6, shadowColor: '#7A3A05', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12 },
    }),
  },
  avatarGlow: {
    width: 156, height: 156, borderRadius: 78,
    backgroundColor: '#FFF0C8', alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: Colors.warm.gold, marginBottom: 14,
  },
  stageName: { fontFamily: 'Cinzel_700Bold', fontSize: 22, color: Colors.warm.textDark, marginBottom: 20 },
  xpRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  levelBadge: {
    backgroundColor: Colors.warm.primary, width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#FFF', flexShrink: 0,
  },
  levelText: { color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 13 },
  xpBarBackground: {
    flex: 1, height: 22, backgroundColor: Colors.warm.xpBg,
    borderRadius: 11, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(212,160,60,0.4)',
  },
  xpBarFill: { height: '100%', backgroundColor: Colors.warm.xpFill, borderRadius: 11 },
  xpText: { color: Colors.warm.textMedium, fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 10, textAlign: 'center' },
  eraCard: {
    marginHorizontal: 20, marginTop: 24, borderRadius: 24,
    backgroundColor: Colors.warm.surface, borderWidth: 2, borderColor: Colors.warm.border, overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 4px 18px rgba(120,60,10,0.10)' } as any,
      default: { elevation: 4, shadowColor: '#7A3A05', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10 },
    }),
  },
  eraCardInner: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 24, gap: 10 },
  eraDecoLine: { width: 48, height: 2, backgroundColor: Colors.warm.gold, borderRadius: 1, opacity: 0.6 },
  eraTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 26, color: Colors.warm.textDark, textAlign: 'center', lineHeight: 34 },
  eraSubtitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.warm.primaryDark, textAlign: 'center', letterSpacing: 2, textTransform: 'uppercase' },
  eraStatsRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.warm.surfaceWarm, borderTopWidth: 1.5, borderTopColor: Colors.warm.border,
    paddingVertical: 14, paddingHorizontal: 20,
  },
  eraStat: { flex: 1, alignItems: 'center', gap: 5 },
  eraStatText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.warm.textMedium },
  eraStatDivider: { width: 1, height: 28, backgroundColor: Colors.warm.border },
  pathSection: { paddingHorizontal: 24, paddingTop: 24 },
  pathContainer: { alignItems: 'center' },
  nodeWrapper: { width: '100%', alignItems: 'center', marginBottom: 10 },
  pathLine: { width: 5, height: 32, marginBottom: 6, borderRadius: 3 },
  pathLineActive: { backgroundColor: Colors.warm.primaryDark },
  pathLineLocked: { backgroundColor: 'rgba(139,106,62,0.35)' },
  nodeRow: { width: '100%', alignItems: 'center' },
  nodeTouch: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  node: {
    width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', borderWidth: 4,
    ...Platform.select({
      web: { boxShadow: '0 4px 14px rgba(120,60,10,0.25)' } as any,
      default: { elevation: 5, shadowColor: '#5C2A00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8 },
    }),
  },
  completedNode: { backgroundColor: Colors.warm.primary, borderColor: '#FFF' },
  currentNode: { backgroundColor: Colors.warm.primaryLight, borderColor: '#FFF', width: 78, height: 78, borderRadius: 39 },
  lockedNode: { backgroundColor: 'rgba(220,195,155,0.9)', borderColor: 'rgba(139,106,62,0.45)' },
  nodeLabel: { position: 'absolute', width: 128 },
  nodeLabelLeft: { right: 84, alignItems: 'flex-end' },
  nodeLabelRight: { left: 84, alignItems: 'flex-start' },
  labelPill: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(212,160,60,0.4)' },
  labelPillLocked: { backgroundColor: 'rgba(220,195,155,0.6)', borderColor: 'rgba(139,106,62,0.25)' },
  nodeLabelText: { color: '#2D1408', fontFamily: 'Inter_700Bold', fontSize: 12, textAlign: 'center' },
  nodeLabelTextLocked: { color: '#8B6A3E' },
  upcomingEraCards: { marginTop: 36, gap: 14, paddingBottom: 8 },
  upcomingEra: {
    alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20,
    backgroundColor: Colors.warm.surfaceWarm, borderRadius: 18, borderWidth: 2, borderColor: Colors.warm.border,
  },
  upcomingEraTitle: { fontFamily: 'Cinzel_700Bold', fontSize: 18, color: Colors.warm.lockedText, marginTop: 10 },
  upcomingEraSubtitle: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.warm.textLight, marginTop: 3 },
});
