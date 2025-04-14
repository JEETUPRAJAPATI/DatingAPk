import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, MoveVertical as MoreVertical, Share2, Shield, Ban } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

const profiles = {
  '1': {
    name: 'Sarah',
    age: 28,
    location: 'New York, NY',
    distance: '1.4 km',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    about: 'Adventure seeker and coffee enthusiast. Let\'s explore the world together! 🌎✈️ Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    interests: ['Shopping', 'Books', 'Music', 'Singing', 'Dancing', 'Modeling'],
    gallery: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop',
    ]
  },
  // ... add other profiles
};

export default function ViewProfileScreen() {
  const { id } = useLocalSearchParams();
  const [showOptions, setShowOptions] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const profile = profiles[id as keyof typeof profiles];

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image source={{ uri: profile.image }} style={styles.coverImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={styles.headerGradient}
          />
          <View style={styles.headerButtons}>
            <Pressable onPress={() => router.back()} style={styles.iconButton}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable onPress={() => setShowOptions(true)} style={styles.iconButton}>
              <MoreVertical size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>95% Match</Text>
          </View>

          <Text style={styles.name}>{profile.name}, {profile.age}</Text>
          <Text style={styles.location}>{profile.location} • {profile.distance}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.aboutText}>{profile.about}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {profile.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.gallery}>
              {profile.gallery.map((image, index) => (
                <Image key={index} source={{ uri: image }} style={styles.galleryImage} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={showOptions}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsMenu}>
            <Pressable style={styles.optionItem}>
              <Share2 size={24} color="#FF00FF" />
              <Text style={styles.optionText}>Share this Profile</Text>
            </Pressable>

            <Pressable style={styles.optionItem}>
              <Ban size={24} color="#FF00FF" />
              <Text style={styles.optionText}>Block</Text>
            </Pressable>

            <Pressable
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                setShowReportModal(true);
              }}
            >
              <Shield size={24} color="#FF00FF" />
              <Text style={styles.optionText}>Report</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.reportMenu}>
            <Text style={styles.reportTitle}>Report User</Text>
            <Text style={styles.reportSubtitle}>
              Is this person bothering you? Tell us what they did.
            </Text>

            {[
              'Inappropriate Photos',
              'Feels Like Spam',
              'User is underage',
              'Others'
            ].map((reason, index) => (
              <Pressable key={index} style={styles.reportOption}>
                <Text style={styles.reportOptionText}>{reason}</Text>
              </Pressable>
            ))}

            <Pressable
              style={styles.submitButton}
              onPress={() => setShowReportModal(false)}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowReportModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
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
  scrollView: {
    flex: 1,
  },
  header: {
    height: 400,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  headerButtons: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  profileInfo: {
    padding: 20,
    marginTop: -50,
  },
  matchBadge: {
    backgroundColor: '#FF00FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  matchText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 14,
    color: '#000000',
  },
  name: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 28,
    color: '#FF00FF',
    marginBottom: 4,
  },
  location: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#00FFFF',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 20,
    color: '#FF00FF',
    marginBottom: 12,
  },
  aboutText: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  interestText: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#FF00FF',
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryImage: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  optionsMenu: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  optionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
  },
  reportMenu: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  reportTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    textAlign: 'center',
    marginBottom: 8,
  },
  reportSubtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  reportOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,0,255,0.2)',
  },
  reportOptionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FF00FF',
    borderRadius: 20,
    padding: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  submitButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 16,
  },
  cancelButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
    marginTop: 40,
  },
});