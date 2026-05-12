import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { staffService } from '@/services/staffService';
import { useOwnerStore } from '@/store/useOwnerStore';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0A0E5E" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>{t('staff.title')}</Text>
        <TouchableOpacity onPress={() => setShowAdd(true)}>
          <Ionicons name="add-circle-outline" size={28} color="#0A0E5E" />
        </TouchableOpacity>
      </View>

      {activeLocationName && (
        <Text style={styles.locationLabel}>{activeLocationName}</Text>
      )}

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#0A0E5E" /></View>
      ) : (
        <FlatList
          data={staffList || []}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color="#CBD5E0" />
              <Text style={styles.emptyText}>{t('staff.no_staff')}</Text>
            </View>
          }
          renderItem={({ item }: any) => {
            const name = item.staff?.profile
              ? `${item.staff.profile.firstName || ''} ${item.staff.profile.lastName || ''}`.trim()
              : item.staff?.email || t('staff.unknown');
            return (
              <View style={styles.staffRow}>
                <View style={styles.staffLeft}>
                  <View style={styles.staffIconBox}>
                    <Ionicons name="person-outline" size={20} color="#0A0E5E" />
                  </View>
                  <View>
                    <Text style={styles.staffName}>{name}</Text>
                    <Text style={styles.staffEmail}>{item.staff?.email}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleRemove(item.id, name)}>
                  <Ionicons name="trash-outline" size={20} color="#E53E3E" />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      {/* Add Staff Modal */}
      <Modal visible={showAdd} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('staff.invite')}</Text>
            <Text style={styles.modalSub}>{t('staff.invite_desc')}</Text>
            <View style={{ gap: 12 }}>
              <TextInput
                style={styles.emailInput}
                placeholder={t('staff.invite_name')}
                placeholderTextColor="#94A3B8"
                value={inviteName}
                onChangeText={setInviteName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.emailInput}
                placeholder={t('staff.invite_email')}
                placeholderTextColor="#94A3B8"
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => { setShowAdd(false); setInviteName(''); setInviteEmail(''); }}>
                <Text style={styles.cancelBtnText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addBtn, adding && { opacity: 0.6 }]}
                onPress={handleInvite}
                disabled={adding || !inviteName.trim() || !inviteEmail.trim()}
              >
                {adding ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.addBtnText}>{t('staff.send_invitation')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Link Modal */}
      <Modal visible={!!inviteLink} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{t('staff.invitation_link')}</Text>
            <Text style={styles.modalSub}>
              {t('staff.link_desc')}
            </Text>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 0.5, marginBottom: 6 }}>
              {t('staff.link_production_label')}
            </Text>
            <View style={styles.linkBox}>
              <Text style={styles.linkText} selectable>{inviteLink}</Text>
            </View>

            <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 0.5, marginBottom: 6, marginTop: 12 }}>
              {t('staff.link_expo_label')}
            </Text>
            {expoLink ? (
              <>
                <View style={styles.linkBox}>
                  <Text style={styles.linkText} selectable>{expoLink}</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#94A3B8', marginBottom: 16 }}>
                  {t('staff.link_expo_hint')}
                </Text>
              </>
            ) : (
              <View style={styles.linkBox}>
                <Text style={styles.linkText} selectable>
                  {`exp://TU_IP:8081/--/accept-staff?token=${inviteLink?.split('token=')[1] || 'TOKEN'}`}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.copyBtn}
              onPress={() => {
                if (inviteLink) {
                  Clipboard.setStringAsync(inviteLink);
                  Toast.show({ type: 'success', text1: t('staff.link_copied') });
                }
              }}
            >
              <Ionicons name="copy-outline" size={20} color="white" />
              <Text style={styles.copyBtnText}>{t('staff.copy_link')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeLinkBtn} onPress={() => setInviteLink(null)}>
              <Text style={styles.closeLinkBtnText}>{t('common.done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F9FE' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: '#0A0E5E' },
  locationLabel: { fontSize: 12, fontWeight: '700', color: '#64748B', paddingHorizontal: 20, marginBottom: 10, letterSpacing: 0.5 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 20, paddingBottom: 120 },
  empty: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#94A3B8' },
  staffRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'white', padding: 16, borderRadius: 16, marginBottom: 10,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 5,
  },
  staffLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  staffIconBox: {
    width: 42, height: 42, backgroundColor: '#EEF2FF', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  staffName: { fontSize: 15, fontWeight: '700', color: '#1A202C' },
  staffEmail: { fontSize: 13, color: '#64748B', marginTop: 2 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: 'white', borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40,
  },
  modalHandle: { width: 40, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0A0E5E', marginBottom: 8 },
  modalSub: { fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 20 },
  emailInput: {
    backgroundColor: '#F8F9FB', borderRadius: 14, padding: 16, fontSize: 16,
    color: '#1A202C', borderWidth: 1, borderColor: '#E2E8F0',
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
  addBtn: { flex: 1, padding: 16, borderRadius: 14, backgroundColor: '#0A0E5E', alignItems: 'center' },
  addBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  linkBox: {
    backgroundColor: '#F8F9FB', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16,
  },
  linkText: { fontSize: 13, color: '#0A0E5E', lineHeight: 20 },
  copyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#0A0E5E', padding: 16, borderRadius: 14, gap: 8, marginBottom: 10,
  },
  copyBtnText: { fontSize: 15, fontWeight: '700', color: 'white' },
  closeLinkBtn: { padding: 16, borderRadius: 14, backgroundColor: '#F1F5F9', alignItems: 'center' },
  closeLinkBtnText: { fontSize: 15, fontWeight: '700', color: '#64748B' },
});
