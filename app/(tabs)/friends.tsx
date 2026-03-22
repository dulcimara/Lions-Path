import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

import Colors from '@/constants/colors';
import { useGame } from '@/context/GameContext';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Débora',      level: 12, gold: 3420, streak: 21, avatarColor: '#F5A623' },
  { rank: 2, name: 'Samuel',      level: 10, gold: 2890, streak: 14, avatarColor: '#7B68EE' },
  { rank: 3, name: 'Raquel',      level: 9,  gold: 2650, streak: 9,  avatarColor: '#50C878' },
  { rank: 4, name: 'Elias',       level: 8,  gold: 2100, streak: 7,  avatarColor: '#FF6B6B' },
  { rank: 5, name: 'Miriã',       level: 7,  gold: 1870, streak: 5,  avatarColor: '#4EC9B0' },
  { rank: 6, name: 'Josué',       level: 6,  gold: 1540, streak: 12, avatarColor: '#CE9178' },
  { rank: 7, name: 'Rebeca',      level: 5,  gold: 1200, streak: 3,  avatarColor: '#D4A0FF' },
  { rank: 8, name: 'Zaqueu',      level: 4,  gold: 980,  streak: 2,  avatarColor: '#85C1E9' },
  { rank: 9, name: 'Ester',       level: 3,  gold: 650,  streak: 4,  avatarColor: '#F1948A' },
  { rank: 10, name: 'Você',       level: 1,  gold: 0,    streak: 0,  avatarColor: Colors.warm.primary, isMe: true },
];

const RANK_COLORS = ['#F5C842', '#C0C0C0', '#CD7F32'];
const RANK_LABELS = ['Ouro', 'Prata', 'Bronze'];

export default function FriendsScreen() {
  const insets = useSafeAreaInsets();
  const { userProgress } = useGame();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Classificação</Text>
        <Text style={styles.headerSub}>Liga Semanal</Text>
      </View>

      {/* Top 3 podium */}
      <View style={styles.podium}>
        {[MOCK_LEADERBOARD[1], MOCK_LEADERBOARD[0], MOCK_LEADERBOARD[2]].map((player, i) => {
          const podiumOrder = [1, 0, 2];
          const rank = podiumOrder[i] + 1;
          const height = [80, 110, 60][i];
          return (
            <View key={player.name} style={styles.podiumCol}>
              <View style={[styles.podiumAvatar, { backgroundColor: player.avatarColor }]}>
                <Text style={styles.podiumAvatarText}>{player.name[0]}</Text>
              </View>
              <Text style={styles.podiumName} numberOfLines={1}>{player.name}</Text>
              <View style={[styles.podiumPillar, { height, backgroundColor: RANK_COLORS[podiumOrder[i]] }]}>
                <Ionicons name="trophy" size={22} color="#FFF" />
              </View>
            </View>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_LEADERBOARD.map((player) => {
          const isMe = (player as any).isMe;
          return (
            <View
              key={player.rank}
              style={[styles.playerRow, isMe && styles.playerRowMe]}
            >
              <Text style={[styles.rankNum, player.rank <= 3 && { color: RANK_COLORS[player.rank - 1] }]}>
                {player.rank}
              </Text>

              <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor }]}>
                <Text style={styles.playerAvatarText}>{player.name[0]}</Text>
              </View>

              <View style={styles.playerInfo}>
                <Text style={[styles.playerName, isMe && { color: Colors.warm.primary }]}>
                  {isMe ? `${player.name} (você)` : player.name}
                </Text>
                <View style={styles.playerStats}>
                  <View style={styles.miniStat}>
                    <Feather name="zap" size={12} color={Colors.warm.primary} />
                    <Text style={styles.miniStatText}>{player.streak} dias</Text>
                  </View>
                  <View style={styles.miniStat}>
                    <Ionicons name="star" size={12} color={Colors.warm.goldDark} />
                    <Text style={styles.miniStatText}>Nv {player.level}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.goldBadge}>
                <Ionicons name="logo-bitcoin" size={14} color={Colors.warm.goldDark} />
                <Text style={styles.goldText}>{isMe ? (userProgress?.goldCoins ?? 0) : player.gold}</Text>
              </View>
            </View>
          );
        })}

        {/* Coming soon */}
        <View style={styles.comingSoon}>
          <Feather name="users" size={32} color={Colors.warm.lockedText} />
          <Text style={styles.comingSoonTitle}>Adicionar Amigos</Text>
          <Text style={styles.comingSoonSub}>Em breve você poderá convidar amigos e competir juntos na jornada bíblica</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm.border,
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 26,
    color: Colors.warm.textDark,
  },
  headerSub: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.warm.primary,
    marginTop: 2,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 0,
    gap: 12,
    backgroundColor: Colors.warm.bgDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm.border,
  },
  podiumCol: {
    alignItems: 'center',
    flex: 1,
  },
  podiumAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  podiumAvatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: '#FFF',
  },
  podiumName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: Colors.warm.textDark,
    marginBottom: 6,
    textAlign: 'center',
  },
  podiumPillar: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warm.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.warm.border,
    gap: 12,
  },
  playerRowMe: {
    backgroundColor: Colors.warm.goldLight,
    borderColor: Colors.warm.gold,
    borderWidth: 2,
  },
  rankNum: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: Colors.warm.textMedium,
    width: 28,
    textAlign: 'center',
  },
  playerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  playerAvatarText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#FFF',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.warm.textDark,
  },
  playerStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 3,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  miniStatText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.warm.textMedium,
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warm.goldLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warm.gold,
  },
  goldText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.warm.goldDark,
  },
  comingSoon: {
    alignItems: 'center',
    padding: 32,
    marginTop: 8,
    backgroundColor: Colors.warm.surfaceWarm,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.warm.border,
    borderStyle: 'dashed',
    gap: 10,
  },
  comingSoonTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 18,
    color: Colors.warm.lockedText,
  },
  comingSoonSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.warm.textLight,
    textAlign: 'center',
    lineHeight: 22,
  },
});
