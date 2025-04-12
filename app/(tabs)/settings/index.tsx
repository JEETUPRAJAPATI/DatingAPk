import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Palette, Settings2, Info, FileText, Shield, Trash2, Apple as Apps, Star, LogOut, Crown } from 'lucide-react-native';

interface SettingItem {
  icon: JSX.Element;
  title: string;
  route?: string;
  action?: () => void;
  color?: string;
}

export default function SettingsScreen() {
  const handleLogout = () => {
    // Implement logout logic
    router.replace('/');
  };

  const settings: SettingItem[] = [
    {
      icon: <Crown size={24} color="#FF00FF" />,
      title: 'Upgrade Subscription',
      route: '../profile',
      color: '#FF00FF'
    },
    {
      icon: <Palette size={24} color="#00FFFF" />,
      title: 'Change Theme',
      route: 'theme'
    },
    {
      icon: <Settings2 size={24} color="#39FF14" />,
      title: 'Discovery Settings',
      route: 'discovery'
    },
    {
      icon: <Info size={24} color="#FF69B4" />,
      title: 'About Us',
      route: 'about'
    },
    {
      icon: <FileText size={24} color="#4169E1" />,
      title: 'Terms of Use',
      route: 'terms'
    },
    {
      icon: <Shield size={24} color="#9370DB" />,
      title: 'Privacy Policy',
      route: 'privacy'
    },
    {
      icon: <Trash2 size={24} color="#FF4500" />,
      title: 'Delete Account',
      route: 'delete-account'
    },
    {
      icon: <Apps size={24} color="#32CD32" />,
      title: 'More Apps',
      route: 'more-apps'
    },
    {
      icon: <Star size={24} color="#FFD700" />,
      title: 'Rate App',
      route: 'rate'
    },
    {
      icon: <LogOut size={24} color="#FF6B6B" />,
      title: 'Logout',
      action: handleLogout
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
});