import { View, Text, StyleSheet, Pressable, ScrollView, Modal } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { Info, FileText, Shield, Trash2, Star, LogOut } from 'lucide-react-native';

interface SettingItem {
  icon: JSX.Element;
  title: string;
  route?: string;
  action?: () => void;
  color?: string;
}

export default function SettingsScreen() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    setShowLogoutModal(false);
    router.replace('/');
  };

  const settings: SettingItem[] = [
    {
      icon: <Info size={24} color="#FF69B4" />,
      title: 'About Us',
      route: '/settings/about'
    },
    {
      icon: <FileText size={24} color="#4169E1" />,
      title: 'Terms of Use',
      route: '/settings/terms'
    },
    {
      icon: <Shield size={24} color="#9370DB" />,
      title: 'Privacy Policy',
      route: '/settings/privacy'
    },
    {
      icon: <Trash2 size={24} color="#FF4500" />,
      title: 'Delete Account',
      route: '/settings/delete-account'
    },
    {
      icon: <Star size={24} color="#FFD700" />,
      title: 'Rate App',
      route: '/settings/rate'
    },
    {
      icon: <LogOut size={24} color="#FF6B6B" />,
      title: 'Logout',
      action: () => setShowLogoutModal(true)
    }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content}>
        {settings.map((item, index) => (
          <Pressable
            key={index}
            style={[
              styles.settingItem,
              item.color && { borderColor: item.color }
            ]}
            onPress={() => item.action ? item.action() : router.push(item.route!)}
          >
            {item.icon}
            <Text style={[
              styles.settingText,
              item.color && { color: item.color }
            ]}>
              {item.title}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 32,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FF00FF',
    gap: 16,
  },
  settingText: {
    flex: 1,
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 24,
    width: '80%',
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  modalTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  confirmButton: {
    backgroundColor: '#FF00FF',
  },
  cancelButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
  },
  confirmButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#000000',
  },
});