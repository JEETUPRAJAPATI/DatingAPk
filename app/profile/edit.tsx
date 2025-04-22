import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, MapPin, Plus, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { API_BASE_URL } from '../apiUrl';
import { useUserProfile } from '../context/userContext';
import Toast from 'react-native-toast-message';
const GradientInput = ({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    colors={['#FF00FF', '#8000FF']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.gradientBorder}
  >
    {children}
  </LinearGradient>
);

export default function EditProfileScreen() {
  const { token } = useUserProfile()

  const [profile, setProfile] = useState({
    name: 'Sample User',
    email: 'sampleuser@gmail.com',
    phone: '+91 9512345678',
    gender: 'Female',
    genderPreference: 'Female',
    age: '25',
    birthdate: '1998-04-12',
    height: 170,
    weight: 65,
    skin_color: 'Fair',
    address: '123 Main St, New York, NY',
    category: 'Friendship',
    about: 'Adventurer and dreamer',
    likes: ['Movies', 'Travel'],
    interests: ['Photography', 'Cooking'],
    hobbies: ['Reading', 'Dancing'],
    location: 'South Mumbai',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log('👤 Profile fetched:', data);

        if (res.ok && data.status && data.fullname) {
          setProfile({
            name: data.user.fullname || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            gender: data.user.gender || '',
            genderPreference: data.user.genderPreference || '',
            age: data.user.age?.toString() || '',
            birthdate: data.user.birthdate || '',
            height: data.user.height || 0,
            weight: data.user.weight || 0,
            skin_color: data.user.skin_color || '',
            address: data.user.address || '',
            category: data.user.category || '',
            about: data.user.about || '',
            likes: data.user.likes || [],
            interests: data.user.interests || [],
            hobbies: data.user.hobbies || [],
            location: data.user.location || '',
          });
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Please try again later.',
          position: 'top',
        });
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Make sure `token` is available in your scope
        },
        body: JSON.stringify({
          fullname: profile.name,
          about: profile.about,
          email: profile.email,
          birthdate: profile.birthdate,
          genderPreference: profile.genderPreference,
          height: profile.height,
          weight: profile.weight,
          skin_color: profile.skin_color,
          address: profile.address,
          category: profile.category,
          likes: profile.likes,
          interests: profile.interests,
          hobbies: profile.hobbies,
        }),
      });

      const data = await response.json();
      console.log('🚀 API Response:', data);

      if (response.ok && data.status) {
        Toast.show({
          type: 'success',
          text1: 'Profile Updated',
          text2: 'Your profile has been updated successfully!',
          position: 'top',
        });

        router.back();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: data.message || 'Something went wrong.',
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'Please try again later.',
        position: 'top',
      });
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/profile')} style={styles.backButton}>
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
            <Text style={styles.label}>Full Name</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.name}
                onChangeText={(text) => setProfile({ ...profile, name: text })}
                placeholder="John Doe"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.email}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                keyboardType="email-address"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.phone}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                keyboardType="phone-pad"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Birthdate</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.birthdate}
                onChangeText={(text) => setProfile({ ...profile, birthdate: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Gender</Text>
              <GradientInput>
                <TextInput
                  style={styles.inputInner}
                  value={profile.gender}
                  onChangeText={(text) => setProfile({ ...profile, gender: text })}
                  placeholderTextColor="#666"
                />
              </GradientInput>
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Gender Preference</Text>
              <GradientInput>
                <TextInput
                  style={styles.inputInner}
                  value={profile.genderPreference}
                  onChangeText={(text) => setProfile({ ...profile, genderPreference: text })}
                  placeholderTextColor="#666"
                />
              </GradientInput>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Height (cm)</Text>
              <GradientInput>
                <TextInput
                  style={styles.inputInner}
                  value={String(profile.height)}
                  onChangeText={(text) => setProfile({ ...profile, height: Number(text) })}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
              </GradientInput>
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <GradientInput>
                <TextInput
                  style={styles.inputInner}
                  value={String(profile.weight)}
                  onChangeText={(text) => setProfile({ ...profile, weight: Number(text) })}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                />
              </GradientInput>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Skin Color</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.skin_color}
                onChangeText={(text) => setProfile({ ...profile, skin_color: text })}
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.address}
                onChangeText={(text) => setProfile({ ...profile, address: text })}
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category (e.g., Friendship)</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.category}
                onChangeText={(text) => setProfile({ ...profile, category: text })}
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>About</Text>
            <GradientInput>
              <TextInput
                style={[styles.inputInner, styles.textArea]}
                value={profile.about}
                onChangeText={(text) => setProfile({ ...profile, about: text })}
                multiline
                numberOfLines={4}
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Likes (comma-separated)</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.likes?.join(', ')}
                onChangeText={(text) =>
                  setProfile({ ...profile, likes: text.split(',').map(item => item.trim()) })
                }
                placeholder="Movies, Travel"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Interests</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.interests?.join(', ')}
                onChangeText={(text) =>
                  setProfile({ ...profile, interests: text.split(',').map(item => item.trim()) })
                }
                placeholder="Photography, Cooking"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hobbies</Text>
            <GradientInput>
              <TextInput
                style={styles.inputInner}
                value={profile.hobbies?.join(', ')}
                onChangeText={(text) =>
                  setProfile({ ...profile, hobbies: text.split(',').map(item => item.trim()) })
                }
                placeholder="Reading, Dancing"
                placeholderTextColor="#666"
              />
            </GradientInput>
          </View>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Pressable onPress={handleUpdateProfile} style={styles.updateWrapper}>
          <LinearGradient
            colors={['#FF00FF', '#D000FF', '#8000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.updateButton}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </LinearGradient>
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
    marginBottom: 6,
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

  updateWrapper: {
    width: '100%', // Keeps the button full-width within the footer
  },

  updateButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
    width: '100%', // Ensures the gradient fills the wrapper
  },

  updateButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 24,
    color: '#000',
  },
  gradientBorder: {
    padding: 2, // border thickness
    borderRadius: 24,
    marginBottom: 16,
  },
  inputInner: {
    height: 48,
    backgroundColor: '#000',
    borderRadius: 22,
    paddingHorizontal: 16,
    color: '#FFF',
    fontFamily: 'Rajdhani',
    justifyContent: 'center',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

});