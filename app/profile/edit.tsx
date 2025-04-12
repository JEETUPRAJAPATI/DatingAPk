import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Plus, ChevronRight } from 'lucide-react-native';

export default function EditProfileScreen() {
  const [profile, setProfile] = useState({
    name: 'Sample User',
    email: 'sampleuser@gmail.com',
    phone: '+91 9512345678',
    gender: 'Female',
    age: '25',
    about: 'Here are many variations of passages\nLorem ipsum text of the printing.',
    interests: 'Shopping, Books, Music, Singing...',
    location: 'South Mumbai',
  });

  const handleUpdateProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.back();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FF00FF" />
        </Pressable>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop' }}
            style={styles.avatar}
          />
          <Pressable style={styles.cameraButton}>
            <Camera size={20} color="#FF00FF" />
          </Pressable>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={profile.email}
              onChangeText={(text) => setProfile({ ...profile, email: text })}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={profile.phone}
              onChangeText={(text) => setProfile({ ...profile, phone: text })}
              keyboardType="phone-pad"
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Gender</Text>
              <Pressable style={styles.selectInput}>
                <Text style={styles.selectText}>{profile.gender}</Text>
                <ChevronRight size={20} color="#FF00FF" />
              </Pressable>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Age</Text>
              <Pressable style={styles.selectInput}>
                <Text style={styles.selectText}>{profile.age}</Text>
                <ChevronRight size={20} color="#FF00FF" />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>About</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={profile.about}
              onChangeText={(text) => setProfile({ ...profile, about: text })}
              multiline
              numberOfLines={4}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interest</Text>
            <TextInput
              style={styles.input}
              value={profile.interests}
              onChangeText={(text) => setProfile({ ...profile, interests: text })}
              placeholderTextColor="#666"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location</Text>
            <Pressable style={styles.locationInput}>
              <MapPin size={20} color="#FF00FF" />
              <Text style={styles.locationText}>{profile.location}</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>My Interest</Text>
          <Pressable style={styles.interestButton}>
            <ChevronRight size={20} color="#FF00FF" />
          </Pressable>

          <Text style={styles.sectionTitle}>Looking For</Text>
          <Pressable style={styles.interestButton}>
            <ChevronRight size={20} color="#FF00FF" />
          </Pressable>

          <View style={styles.photoGrid}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop' }}
              style={styles.photoItem}
            />
            {[...Array(5)].map((_, index) => (
              <Pressable key={index} style={styles.addPhotoButton}>
                <Plus size={32} color="#FF00FF" />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.updateButton} onPress={handleUpdateProfile}>
          <Text style={styles.updateButtonText}>Update</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#000',
    borderWidth: 2,
    borderColor: '#FF00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 14,
    color: '#FF00FF',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 24,
    paddingHorizontal: 16,
    color: '#FFF',
    fontFamily: 'Rajdhani',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  row: {
    flexDirection: 'row',
  },
  selectInput: {
    height: 48,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: '#FFF',
    fontFamily: 'Rajdhani',
  },
  locationInput: {
    height: 48,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 24,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: '#FFF',
    fontFamily: 'Rajdhani',
    flex: 1,
  },
  sectionTitle: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
    marginTop: 16,
    marginBottom: 8,
  },
  interestButton: {
    height: 48,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 24,
    paddingHorizontal: 16,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  photoItem: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  addPhotoButton: {
    width: '31%',
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF00FF',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 40,
  },
  updateButton: {
    height: 56,
    backgroundColor: '#FF00FF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  updateButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000',
  },
});