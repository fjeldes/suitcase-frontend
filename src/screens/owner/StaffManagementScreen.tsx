import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { staffService } from '@/services/staffService';
import { useOwnerStore } from '@/store/useOwnerStore';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';

export default function StaffManagementScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { colors } = useTheme();
  const { activeLocationId, activeLocationName } = useOwnerStore();
  const [showAdd, setShowAdd] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [adding, setAdding] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const expoLink = useMemo(() => {
    if (!inviteLink) return null;
    const manifest = (Constants as any).manifest || Constants.expoConfig || {};
    const hostUri = manifest.hostUri || manifest.hostUrl || (Constants as any).expoGoConfig?.hostUri;
    if (!hostUri) return null;
    const path = inviteLink.replace('luggageapp://', '');
    return `exp://${hostUri}/--/${path}`;
  }, [inviteLink]);

  const { data: staffList, isLoading } = useQuery({
    queryKey: ['staff', activeLocationId],
    queryFn: () => staffService.getByLocation(activeLocationId!),
    enabled: !!activeLocationId,
  });

  const handleInvite = async () => {
    if (!inviteName.trim() || !inviteEmail.trim() || !activeLocationId) return;
    setAdding(true);
    try {
      const result = await staffService.invite(activeLocationId, inviteName.trim(), inviteEmail.trim());
      await queryClient.invalidateQueries({ queryKey: ['staff', activeLocationId] });
      setShowAdd(false);
      setInviteName('');
      setInviteEmail('');
      if (result.link) {
        setInviteLink(result.link);
      }
      Toast.show({ type: 'success', text1: t('staff.invitation_sent'), text2: t('staff.invitation_email_hint', { name: inviteName }) });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: t('common.error'), text2: e?.response?.data?.message || t('staff.invitation_failed') });
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = (assignmentId: string, name: string) => {
    Alert.alert(t('staff.remove_staff'), t('staff.remove_confirm', { name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await staffService.removeStaff(assignmentId);
            await queryClient.invalidateQueries({ queryKey: ['staff', activeLocationId] });
            Toast.show({ type: 'success', text1: t('staff.removed_success') });
          } catch {
            Toast.show({ type: 'error', text1: t('staff.remove_failed') });
          }
        },
      },
    ]);
  };

  const s = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.iconColor} />
        </TouchableOpacity>
        <Text style={s.topBarTitle}>{t('staff.title')}</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)}>
          <Ionicons name="add-circle-outline" size={28} color={colors.iconColor} />
        </TouchableOpacity>
      </View>

      {activeLocationName && (
        <Text style={s.locationLabel}>{activeLocationName}</Text>
      )}

      {isLoading ? (
        <View style={s.center}><ActivityIndicator size="large" color={colors.iconColor} /></View>
      ) : (
        <FlatList
          data={staffList || []}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={s.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={s.empty}>
              <Ionicons name="people-outline" size={48} color={colors.iconMuted} />
              <Text style={s.emptyText}>{t('staff.no_staff')}</Text>
            </View>
          }
          renderItem={({ item }: any) => {
            const name = item.staff?.profile
              ? `${item.staff.profile.firstName || ''} ${item.staff.profile.lastName || ''}`.trim()
              : item.staff?.email || t('staff.unknown');
            return (
              <View style={s.staffRow}>
                <View style={s.staffLeft}>
                  <View style={s.staffIconBox}>
                    <Ionicons name="person-outline" size={20} color={colors.iconColor} />
                  </View>
                  <View>
                    <Text style={s.staffName}>{name}</Text>
                    <Text style={s.staffEmail}>{item.staff?.email}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleRemove(item.id, name)}>
                  <Ionicons name="trash-outline" size={20} color={colors.dotRed} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <Modal visible={showAdd} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => { setShowAdd(false); setInviteName(''); setInviteEmail(''); }} />
            <View style={s.modalContent}>
              <View style={s.modalHandle} />
              <Text style={s.modalTitle}>{t('staff.invite')}</Text>
              <Text style={s.modalSub}>{t('staff.invite_desc')}</Text>
              <View style={{ gap: 12 }}>
                <TextInput
                  style={s.emailInput}
                  placeholder={t('staff.invite_name')}
                  placeholderTextColor={colors.iconMuted}
                  value={inviteName}
                  onChangeText={setInviteName}
                  autoCapitalize="words"
                />
                <TextInput
                  style={s.emailInput}
                  placeholder={t('staff.invite_email')}
                  placeholderTextColor={colors.iconMuted}
                  value={inviteEmail}
                  onChangeText={setInviteEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={s.modalButtons}>
                <TouchableOpacity style={s.cancelBtn} onPress={() => { setShowAdd(false); setInviteName(''); setInviteEmail(''); }}>
                  <Text style={s.cancelBtnText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.addBtn, adding && { opacity: 0.6 }]}
                  onPress={handleInvite}
                  disabled={adding || !inviteName.trim() || !inviteEmail.trim()}
                >
                  {adding ? <ActivityIndicator color="white" size="small" /> : <Text style={s.addBtnText}>{t('staff.send_invitation')}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={!!inviteLink} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={s.modalOverlay}>
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setInviteLink(null)} />
            <View style={s.modalContent}>
              <View style={s.modalHandle} />
              <Text style={s.modalTitle}>{t('staff.invitation_link')}</Text>
              <Text style={s.modalSub}>
                {t('staff.link_desc')}
              </Text>

              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 6 }}>
                {t('staff.link_production_label')}
              </Text>
              <View style={s.linkBox}>
                <Text style={s.linkText} selectable>{inviteLink}</Text>
              </View>

              <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.5, marginBottom: 6, marginTop: 12 }}>
                {t('staff.link_expo_label')}
              </Text>
              {expoLink ? (
                <>
                  <View style={s.linkBox}>
                    <Text style={s.linkText} selectable>{expoLink}</Text>
                  </View>
                  <Text style={{ fontSize: 12, color: colors.iconMuted, marginBottom: 16 }}>
                    {t('staff.link_expo_hint')}
                  </Text>
                </>
              ) : (
                <View style={s.linkBox}>
                  <Text style={s.linkText} selectable>
                    {`exp://TU_IP:8081/--/accept-staff?token=${inviteLink?.split('token=')[1] || 'TOKEN'}`}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={s.copyBtn}
                onPress={() => {
                  if (inviteLink) {
                    Clipboard.setStringAsync(inviteLink);
                    Toast.show({ type: 'success', text1: t('staff.link_copied') });
                  }
                }}
              >
                <Ionicons name="copy-outline" size={20} color="white" />
                <Text style={s.copyBtnText}>{t('staff.copy_link')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.closeLinkBtn} onPress={() => setInviteLink(null)}>
                <Text style={s.closeLinkBtnText}>{t('common.done')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surfaceCardLow },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  locationLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted, paddingHorizontal: 20, marginBottom: 10, letterSpacing: 0.5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, paddingBottom: 120 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: colors.iconMuted },
  staffRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: colors.surfaceCard, padding: 16, borderRadius: 16, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5,
  },
  staffLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  staffIconBox: {
    width: 42, height: 42, backgroundColor: colors.tabBarActiveBg, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  staffName: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },
  staffEmail: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.surfaceModal, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
  },
  modalHandle: { width: 40, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 8 },
  modalSub: { fontSize: 14, color: colors.textMuted, marginBottom: 20, lineHeight: 20 },
  emailInput: {
    backgroundColor: colors.surfaceLight, borderRadius: 14, padding: 16, fontSize: 16,
    color: colors.textPrimary, borderWidth: 1, borderColor: colors.border,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
  addBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center' },
  addBtnText: { fontSize: 15, fontWeight: '700', color: colors.textInverse },
  linkBox: {
    backgroundColor: colors.surfaceLight, borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.border, marginBottom: 16,
  },
  linkText: { fontSize: 13, color: colors.primary, lineHeight: 20 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, padding: 16, borderRadius: 14, gap: 8, marginBottom: 10,
  },
  copyBtnText: { fontSize: 15, fontWeight: '700', color: colors.textInverse },
  closeLinkBtn: { padding: 16, borderRadius: 14, backgroundColor: colors.surfaceLight, alignItems: 'center' },
  closeLinkBtnText: { fontSize: 15, fontWeight: '700', color: colors.textMuted },
})
