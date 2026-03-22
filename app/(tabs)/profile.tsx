import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/colors';
import { useGame, GENESIS_LESSONS } from '@/context/GameContext';
import { LionAvatar } from '@/components/LionAvatar';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userProgress } = useGame();

  if (!userProgress) return null;

  const totalEraLessons = GENESIS_LESSONS.length;
  const completedLessons = userProgress.completedLessons.length;
  const eraProgress = (completedLessons / totalEraLessons) * 100;

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <LionAvatar stage={userProgress.avatarStage} size={80} animated={false} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Minha Jornada</Text>
            <Text style={styles.subtitle}>Jovem Leão</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: Colors.warm.primaryLight + '30' }]}>
              <Ionicons name="flash" size={24} color={Colors.warm.primary} />
            </View>
            <Text style={styles.statValue}>{userProgress.level}</Text>
            <Text style={styles.statLabel}>Nível</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: Colors.warm.gold + '30' }]}>
              <Ionicons name="star" size={24} color={Colors.warm.goldDark} />
            </View>
            <Text style={styles.statValue}>{userProgress.xp}</Text>
            <Text style={styles.statLabel}>XP Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: Colors.warm.terracotta + '30' }]}>
              <Feather name="target" size={24} color={Colors.warm.terracotta} />
            </View>
            <Text style={styles.statValue}>{userProgress.currentStreak}</Text>
            <Text style={styles.statLabel}>Ofensiva</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconWrapper, { backgroundColor: Colors.warm.success + '30' }]}>
              <Ionicons name="diamond" size={24} color={Colors.warm.success} />
            </View>
            <Text style={styles.statValue}>{userProgress.talents}</Text>
            <Text style={styles.statLabel}>Talentos</Text>
          </View>
        </View>

        {/* Current Era Progress */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Progresso da Era</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Era das Origens</Text>
              <Text style={styles.progressCount}>{completedLessons}/{totalEraLessons}</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${eraProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <View style={styles.badgesContainer}>
            <View style={[styles.badgeCard, completedLessons >= 1 ? styles.badgeActive : styles.badgeInactive]}>
              <View style={[styles.badgeIconWrapper, completedLessons >= 1 ? { backgroundColor: Colors.warm.successLight } : {}]}>
                <Ionicons name="leaf" size={32} color={completedLessons >= 1 ? Colors.warm.success : Colors.warm.lockedText} />
              </View>
              <Text style={styles.badgeName}>Criador</Text>
              <Text style={styles.badgeDesc}>Gênesis 1</Text>
            </View>

            <View style={[styles.badgeCard, completedLessons >= 3 ? styles.badgeActive : styles.badgeInactive]}>
              <View style={[styles.badgeIconWrapper, completedLessons >= 3 ? { backgroundColor: Colors.warm.goldLight } : {}]}>
                <Ionicons name="compass" size={32} color={completedLessons >= 3 ? Colors.warm.goldDark : Colors.warm.lockedText} />
              </View>
              <Text style={styles.badgeName}>Explorador</Text>
              <Text style={styles.badgeDesc}>3 Lições</Text>
            </View>

            <View style={[styles.badgeCard, completedLessons >= 10 ? styles.badgeActive : styles.badgeInactive]}>
              <View style={[styles.badgeIconWrapper, completedLessons >= 10 ? { backgroundColor: Colors.warm.primaryLight + '50' } : {}]}>
                <Ionicons name="school" size={32} color={completedLessons >= 10 ? Colors.warm.primary : Colors.warm.lockedText} />
              </View>
              <Text style={styles.badgeName}>Sábio</Text>
              <Text style={styles.badgeDesc}>Era Completa</Text>
            </View>
          </View>
        </View>

        {/* Quote */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteText}>"70% do nosso lucro vai para missões do Reino"</Text>
          <Text style={styles.quoteSub}>Seu aprendizado financia a expansão do Evangelho.</Text>
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: Colors.warm.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: Colors.warm.textMedium,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.warm.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.warm.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180, 100, 20, 0.08)' } as any,
      default: { elevation: 3, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }
    }),
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.warm.textDark,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.warm.textMedium,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.warm.textDark,
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: Colors.warm.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.warm.border,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180, 100, 20, 0.08)' } as any,
      default: { elevation: 3, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }
    }),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.warm.textDark,
  },
  progressCount: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.warm.primary,
  },
  progressBarBackground: {
    height: 16,
    backgroundColor: Colors.warm.xpBg,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.warm.xpFill,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeCard: {
    alignItems: 'center',
    width: '31%',
    backgroundColor: Colors.warm.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180, 100, 20, 0.08)' } as any,
      default: { elevation: 3, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 }
    }),
  },
  badgeActive: {
    borderColor: Colors.warm.borderStrong,
  },
  badgeInactive: {
    borderColor: Colors.warm.border,
    backgroundColor: Colors.warm.surfaceWarm,
    elevation: 0,
    shadowOpacity: 0,
  },
  badgeIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.warm.locked,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  badgeName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.warm.textDark,
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.warm.textMedium,
    textAlign: 'center',
  },
  quoteCard: {
    padding: 24,
    alignItems: 'center',
  },
  quoteText: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 16,
    color: Colors.warm.textMedium,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.warm.textLight,
    textAlign: 'center',
  }
});