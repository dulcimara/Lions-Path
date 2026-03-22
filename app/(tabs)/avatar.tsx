import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/colors';
import { useGame } from '@/context/GameContext';
import { LionAvatar } from '@/components/LionAvatar';

export default function AvatarScreen() {
  const insets = useSafeAreaInsets();
  const { userProgress } = useGame();

  if (!userProgress) return null;

  const stages = [
    { stage: 1, name: "Filhote", desc: "O Início da Jornada", levels: "Lv 1-2" },
    { stage: 2, name: "Jovem Leão", desc: "Crescendo na Palavra", levels: "Lv 3-4" },
    { stage: 3, name: "Leão Adolescente", desc: "Firmando os Pés", levels: "Lv 5-6" },
    { stage: 4, name: "Leão Adulto", desc: "Caminhando em Poder", levels: "Lv 7-8" },
    { stage: 5, name: "Leão Mentor", desc: "O Rei do Reino", levels: "Lv 9-10" },
  ];

  const verses = [
    '"Ensina a criança no caminho em que deve andar..." - Provérbios 22:6',
    '"Crescia Jesus em sabedoria, estatura e graça..." - Lucas 2:52',
    '"Ninguém despreze a tua mocidade..." - 1 Timóteo 4:12',
    '"Sede fortes e corajosos..." - Josué 1:9',
    '"O justo é intrépido como o leão." - Provérbios 28:1'
  ];

  const currentVerse = verses[userProgress.avatarStage - 1];

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Leão</Text>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.avatarGlow}>
            <LionAvatar stage={userProgress.avatarStage} size={200} />
          </View>
          
          <Text style={styles.stageName}>{stages[userProgress.avatarStage - 1].name}</Text>
          
          <View style={styles.verseContainer}>
            <Text style={styles.verseText}>{currentVerse}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.xp}</Text>
            <Text style={styles.statLabel}>XP</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.currentStreak}</Text>
            <Text style={styles.statLabel}>Ofensiva</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{userProgress.totalLessons}</Text>
            <Text style={styles.statLabel}>Lições</Text>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Evolução</Text>
          
          <View style={styles.timelineList}>
            {stages.map((s, index) => {
              const isCurrent = s.stage === userProgress.avatarStage;
              const isUnlocked = s.stage <= userProgress.avatarStage;
              const isFuture = s.stage > userProgress.avatarStage;
              
              return (
                <View key={s.stage} style={[
                  styles.timelineItem, 
                  isCurrent && styles.timelineItemCurrent,
                  !isUnlocked && styles.timelineItemLocked
                ]}>
                  <View style={[styles.stageIconContainer, isCurrent && styles.stageIconContainerCurrent]}>
                     {isFuture ? (
                       <Feather name="lock" size={24} color={Colors.warm.lockedText} />
                     ) : (
                       <LionAvatar stage={s.stage as any} size={50} animated={false} />
                     )}
                  </View>
                  
                  <View style={styles.stageInfo}>
                    <Text style={[styles.stageItemName, isCurrent && styles.textGold, isFuture && { color: Colors.warm.lockedText }]}>{s.name}</Text>
                    <Text style={[styles.stageItemLevels, isFuture && { color: Colors.warm.lockedText }]}>{s.levels}</Text>
                  </View>
                  
                  {isUnlocked ? (
                    <Feather name="check" size={24} color={Colors.warm.success} />
                  ) : (
                    <Feather name="lock" size={24} color={Colors.warm.lockedText} />
                  )}
                </View>
              );
            })}
          </View>
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: Colors.warm.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm.border,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 28,
    color: Colors.warm.textDark,
  },
  scrollContent: {
    paddingTop: 24,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarGlow: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.warm.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 6,
    borderColor: Colors.warm.gold,
  },
  stageName: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 32,
    color: Colors.warm.textDark,
    marginBottom: 16,
  },
  verseContainer: {
    paddingHorizontal: 32,
  },
  verseText: {
    fontFamily: 'Inter_500Medium',
    fontStyle: 'italic',
    fontSize: 16,
    color: Colors.warm.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  statCard: {
    backgroundColor: Colors.warm.surface,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    width: '23%',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180, 100, 20, 0.08)' } as any,
      default: { elevation: 3, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }
    }),
    borderWidth: 1,
    borderColor: Colors.warm.border,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.warm.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.warm.textMedium,
  },
  timelineContainer: {
    paddingHorizontal: 20,
  },
  timelineTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.warm.textDark,
    marginBottom: 16,
  },
  timelineList: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warm.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.warm.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180, 100, 20, 0.05)' } as any,
      default: { elevation: 2, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 }
    }),
  },
  timelineItemCurrent: {
    backgroundColor: Colors.warm.surfaceWarm,
    borderColor: Colors.warm.primary,
    borderWidth: 2,
  },
  timelineItemLocked: {
    backgroundColor: Colors.warm.surfaceWarm,
    opacity: 0.7,
  },
  stageIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.warm.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    overflow: 'hidden',
  },
  stageIconContainerCurrent: {
    backgroundColor: Colors.warm.primary,
  },
  stageInfo: {
    flex: 1,
  },
  stageItemName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.warm.textDark,
    marginBottom: 4,
  },
  stageItemLevels: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.warm.textMedium,
  },
  textGold: {
    color: Colors.warm.primaryDark,
  }
});