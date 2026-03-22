import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';

import Colors from '@/constants/colors';
import { useGame, SHOP_ITEMS, ShopItem } from '@/context/GameContext';
import { LionAvatar } from '@/components/LionAvatar';

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { userProgress, purchaseItem } = useGame();
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [justBought, setJustBought] = useState<string | null>(null);

  if (!userProgress) return null;

  const handleBuy = async () => {
    if (!selectedItem) return;
    const ok = await purchaseItem(selectedItem.id, selectedItem.price);
    if (ok) {
      setJustBought(selectedItem.id);
      setTimeout(() => setJustBought(null), 2000);
    }
    setSelectedItem(null);
  };

  const canAfford = selectedItem ? userProgress.goldCoins >= selectedItem.price : false;
  const alreadyOwned = selectedItem ? userProgress.purchasedItems.includes(selectedItem.id) : false;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, Platform.OS === 'web' ? 67 : 0) },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Loja do Reino</Text>
          <Text style={styles.headerSub}>Adornos para o seu leão</Text>
        </View>
        <View style={styles.walletBadge}>
          <Ionicons name="logo-bitcoin" size={18} color={Colors.warm.goldDark} />
          <Text style={styles.walletText}>{userProgress.goldCoins}</Text>
        </View>
      </View>

      {/* Avatar preview */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarGlowRing}>
          <LionAvatar stage={userProgress.avatarStage} size={110} />
        </View>
        <View style={styles.equippedRow}>
          {userProgress.purchasedItems.length === 0 ? (
            <Text style={styles.equippedEmpty}>Nenhum item equipado ainda</Text>
          ) : (
            userProgress.purchasedItems.slice(0, 4).map((id) => {
              const item = SHOP_ITEMS.find((s) => s.id === id);
              if (!item) return null;
              return (
                <View key={id} style={styles.equippedChip}>
                  {item.iconLib === 'Ionicons' ? (
                    <Ionicons name={item.icon as any} size={14} color={Colors.warm.primary} />
                  ) : (
                    <Feather name={item.icon as any} size={14} color={Colors.warm.primary} />
                  )}
                  <Text style={styles.equippedChipText}>{item.name.split(' ')[0]}</Text>
                </View>
              );
            })
          )}
        </View>
      </View>

      {/* Items grid */}
      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {SHOP_ITEMS.map((item) => {
          const owned = userProgress.purchasedItems.includes(item.id);
          const affordable = userProgress.goldCoins >= item.price;
          const wasJustBought = justBought === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[
                styles.card,
                owned && styles.cardOwned,
                !affordable && !owned && styles.cardLocked,
              ]}
              onPress={() => !owned && setSelectedItem(item)}
              disabled={owned}
            >
              <View style={[styles.iconCircle, { backgroundColor: owned ? Colors.warm.successLight : Colors.warm.goldLight }]}>
                {item.iconLib === 'Ionicons' ? (
                  <Ionicons
                    name={item.icon as any}
                    size={32}
                    color={owned ? Colors.warm.success : affordable ? Colors.warm.goldDark : Colors.warm.lockedText}
                  />
                ) : (
                  <Feather
                    name={item.icon as any}
                    size={28}
                    color={owned ? Colors.warm.success : affordable ? Colors.warm.goldDark : Colors.warm.lockedText}
                  />
                )}
              </View>

              {owned && (
                <View style={styles.ownedBadge}>
                  <Ionicons name="checkmark-circle" size={18} color={Colors.warm.success} />
                </View>
              )}

              <Text style={[styles.itemName, !affordable && !owned && styles.itemNameLocked]}>
                {item.name}
              </Text>
              <Text style={styles.itemSlot}>{item.slot}</Text>
              <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>

              {owned ? (
                <View style={styles.ownedLabel}>
                  <Text style={styles.ownedLabelText}>Equipado</Text>
                </View>
              ) : (
                <View style={[styles.priceRow, !affordable && styles.priceRowLocked]}>
                  <Ionicons
                    name="logo-bitcoin"
                    size={14}
                    color={affordable ? Colors.warm.goldDark : Colors.warm.lockedText}
                  />
                  <Text style={[styles.priceText, !affordable && styles.priceTextLocked]}>
                    {item.price}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Purchase modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {selectedItem && (
              <>
                <View style={[styles.modalIcon, { backgroundColor: Colors.warm.goldLight }]}>
                  {selectedItem.iconLib === 'Ionicons' ? (
                    <Ionicons name={selectedItem.icon as any} size={48} color={Colors.warm.goldDark} />
                  ) : (
                    <Feather name={selectedItem.icon as any} size={44} color={Colors.warm.goldDark} />
                  )}
                </View>
                <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                <Text style={styles.modalDesc}>{selectedItem.description}</Text>

                <View style={styles.modalPriceRow}>
                  <Ionicons name="logo-bitcoin" size={22} color={Colors.warm.goldDark} />
                  <Text style={styles.modalPriceText}>{selectedItem.price} moedas</Text>
                </View>

                {!canAfford && (
                  <Text style={styles.modalInsufficient}>
                    Moedas insuficientes. Complete mais lições para ganhar ouro!
                  </Text>
                )}

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={styles.modalCancelText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBuy, !canAfford && styles.modalBuyDisabled]}
                    onPress={handleBuy}
                    disabled={!canAfford}
                  >
                    <Text style={styles.modalBuyText}>Comprar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm.border,
  },
  headerTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 24,
    color: Colors.warm.textDark,
  },
  headerSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.warm.textMedium,
    marginTop: 2,
  },
  walletBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.warm.goldLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.warm.gold,
  },
  walletText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.warm.goldDark,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.warm.bgDeep,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warm.border,
  },
  avatarGlowRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: Colors.warm.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.warm.gold,
    marginBottom: 12,
  },
  equippedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  equippedEmpty: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.warm.lockedText,
  },
  equippedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warm.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warm.border,
  },
  equippedChipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.warm.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.warm.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.warm.border,
    position: 'relative',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(180,100,20,0.1)' } as any,
      default: { elevation: 3, shadowColor: '#C06A08', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 6 },
    }),
  },
  cardOwned: {
    borderColor: Colors.warm.success,
    backgroundColor: Colors.warm.successLight,
  },
  cardLocked: {
    opacity: 0.7,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ownedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  itemName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.warm.textDark,
    textAlign: 'center',
    marginBottom: 2,
  },
  itemNameLocked: {
    color: Colors.warm.lockedText,
  },
  itemSlot: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.warm.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  itemDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.warm.textMedium,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.warm.goldLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.warm.gold,
  },
  priceRowLocked: {
    backgroundColor: Colors.warm.locked,
    borderColor: Colors.warm.border,
  },
  priceText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: Colors.warm.goldDark,
  },
  priceTextLocked: {
    color: Colors.warm.lockedText,
  },
  ownedLabel: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Colors.warm.successLight,
  },
  ownedLabelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.warm.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: Colors.warm.surface,
    borderRadius: 28,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.warm.gold,
  },
  modalIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: Colors.warm.gold,
  },
  modalTitle: {
    fontFamily: 'Cinzel_700Bold',
    fontSize: 22,
    color: Colors.warm.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
    color: Colors.warm.textMedium,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.warm.goldLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.warm.gold,
    marginBottom: 16,
  },
  modalPriceText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.warm.goldDark,
  },
  modalInsufficient: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.warm.terracotta,
    textAlign: 'center',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: Colors.warm.surfaceWarm,
    borderWidth: 1,
    borderColor: Colors.warm.border,
  },
  modalCancelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.warm.textMedium,
  },
  modalBuy: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: Colors.warm.primary,
  },
  modalBuyDisabled: {
    backgroundColor: Colors.warm.locked,
  },
  modalBuyText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#FFF',
  },
});
