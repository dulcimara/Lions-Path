import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/colors';
import { useGame, GENESIS_LESSONS } from '@/context/GameContext';

export default function LessonsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isLessonCompleted, userProgress } = useGame();

  if (!userProgress) return null;

  const currentLevelIndex = userProgress.completedLessons.length;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Feather name="book" size={28} color={Colors.warm.primary} />
          <Text style={styles.title}>Lições</Text>
        </View>
        <View style={styles.eraBadge}>
          <Text style={styles.eraBadgeText}>Era das Origens</Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.listContainer}>
          {GENESIS_LESSONS.map((lesson, index) => {
            const completed = isLessonCompleted(lesson.id);
            const isLocked = index > currentLevelIndex;

            return (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonCard,
                  completed ? styles.cardCompleted : isLocked ? styles.cardLocked : styles.cardAvailable
                ]}
                disabled={isLocked}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              >
                <View style={styles.cardLeft}>
                  <View style={[
                    styles.numberCircle,
                    completed ? { backgroundColor: Colors.warm.success } : 
                    isLocked ? { backgroundColor: Colors.warm.locked } : 
                    { backgroundColor: Colors.warm.primary }
                  ]}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                </View>
                
                <View style={styles.cardMiddle}>
                  <Text style={[styles.lessonTitle, isLocked && { color: Colors.warm.lockedText }]}>{lesson.title}</Text>
                  <Text style={[styles.lessonSubtitle, isLocked && { color: Colors.warm.lockedText }]}>{lesson.subtitle}</Text>
                  <View style={[
                    styles.difficultyBadge,
                    { backgroundColor: lesson.difficulty === 'Fácil' ? Colors.warm.easyBg : lesson.difficulty === 'Médio' ? Colors.warm.mediumBg : Colors.warm.hardBg }
                  ]}>
                    <Text style={[
                      styles.difficultyText,
                      { color: lesson.difficulty === 'Fácil' ? Colors.warm.easy : lesson.difficulty === 'Médio' ? Colors.warm.medium : Colors.warm.hard }
                    ]}>{lesson.difficulty}</Text>
                  </View>
                </View>

                <View style={styles.cardRight}>
                  {completed ? (
                    <Ionicons name="checkmark-circle" size={32} color={Colors.warm.success} />
                  ) : isLocked ? (
                    <Feather name="lock" size={24} color={Colors.warm.lockedText} />
                  ) : (
                    <View style={styles.xpBadge}>
                      <Ionicons name="star" size={12} color={Colors.warm.goldDark} />
                      <Text style={styles.xpText}>{lesson.xpReward}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warm.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.warm.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 28,
    color: Colors.warm.textDark,
  },
  eraBadge: {
    backgroundColor: Colors.warm.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  eraBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#FFF',
  },
  scrollContent: {
    paddingTop: 24,
  },
  listContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  lessonCard: {
    flexDirection: 'row',
    backgroundColor: Colors.warm.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180, 100, 20, 0.08)' } as any,
      default: { elevation: 3, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }
    }),
    borderLeftWidth: 6,
  },
  cardAvailable: {
    borderLeftColor: Colors.warm.primary,
  },
  cardCompleted: {
    borderLeftColor: Colors.warm.success,
  },
  cardLocked: {
    borderLeftColor: Colors.warm.locked,
    backgroundColor: Colors.warm.surfaceWarm,
    elevation: 0,
    shadowOpacity: 0,
  },
  cardLeft: {
    marginRight: 16,
  },
  numberCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#FFF',
    fontFamily: 'Cinzel_700Bold',
    fontSize: 20,
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
  },
  lessonTitle: {
    color: Colors.warm.textDark,
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    marginBottom: 4,
  },
  lessonSubtitle: {
    color: Colors.warm.textMedium,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  difficultyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingLeft: 16,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warm.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  xpText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.warm.textDark,
  },
});