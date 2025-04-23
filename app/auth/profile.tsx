import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useUserProfile } from '../context/userContext';
import { API_BASE_URL } from '../apiUrl';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileData {
  fullName: string;
  email: string;
  bio: string;
  interests: string;
  hobbies: string;
  height: string;
  weight: string;
  skinColor: string;
  address: string;
  age: string;
  likes: string;
  category: string;
}


export default function ProfileScreen() {
  const { updateProfile, profile: contextProfile, token } = useUserProfile();

  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    bio: '',
    interests: '',
    hobbies: '',
    height: '',
    weight: '',
    skinColor: '',
    address: '',
    age: '',
    likes: '',
    category: '',
  });


  const isValid = () => {
    return (
      profile.fullName.trim() !== '' &&
      profile.email.trim() !== '' &&
      profile.bio.trim() !== ''
    );
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = async () => {
    if (isValid()) {
      const cleanedProfile = {
        // Context-based fields
        fullname: profile.fullName.trim(),
        email: profile.email.trim(),
        i_am: contextProfile.i_am || '',
        interested_in: contextProfile.interested_in?.[0] || '',

        // UI-based fields
        about: profile.bio.trim(),
        interests: profile.interests
          ? profile.interests.split(',').map((i) => i.trim())
          : [],
        hobbies: profile.hobbies
          ? profile.hobbies.split(',').map((h) => h.trim())
          : [],
        skin_color: profile.skinColor.trim(),
        height: Number(profile.height) || 0,
        weight: Number(profile.weight) || 0,
        address: profile.address.trim(),
        age: Number(profile.age) || 0,
        likes: profile.likes
          ? profile.likes.split(',').map((l) => l.trim())
          : [],
        category: profile.category.trim() || 'Friendship',
      };

      updateProfile(cleanedProfile); // optional: if needed globally

      try {
        const res = await fetch(`${API_BASE_URL}/user/profile/setup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedProfile),
        });

        const data = await res.json();

        console.log('🚀 API Response:', data);

        if (data.status) {
          Toast.show({
            type: 'success',
            text1: 'Profile Created',
            text2: 'Welcome aboard!',
            position: 'top',
          });

          router.push('/auth/notifications');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Setup Failed',
            text2: data.errors?.[0]?.message || 'Something went wrong.',
            position: 'top',
          });
        }
      } catch (error) {
        console.error('Setup error:', error);
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Please try again later.',
          position: 'top',
        });
      }

      console.log('✅ Final Payload Sent:', cleanedProfile);
    }
  };


  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft size={24} color="#FF00FF" />
      </Pressable>

      <Text style={styles.title}>Create Your Profile</Text>
      <Text style={styles.subtitle}>Tell us about yourself</Text>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>

        {/** Full Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name*</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={styles.input}
                value={profile.fullName}
                onChangeText={(text) => handleChange('fullName', text)}
                placeholderTextColor="#666"
                placeholder="e.g. John Doe"
              />
            </View>
          </LinearGradient>
        </View>

        {/** Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email*</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
                placeholder="e.g. farhan@gmail.com"
              />
            </View>
          </LinearGradient>
        </View>

        {/** About You */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>About You*</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.bio}
                onChangeText={(text) => handleChange('bio', text)}
                multiline
                numberOfLines={4}
                placeholderTextColor="#666"
                placeholder="e.g. I am a software engineer..."
              />
            </View>
          </LinearGradient>
        </View>

        {/** Interests */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Interests</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={styles.input}
                value={profile.interests}
                onChangeText={(text) => handleChange('interests', text)}
                placeholderTextColor="#666"
                placeholder="e.g. abc"
              />
            </View>
          </LinearGradient>
        </View>

        {/** Hobbies */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hobbies</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={styles.input}
                value={profile.hobbies}
                onChangeText={(text) => handleChange('hobbies', text)}
                placeholderTextColor="#666"
                placeholder="e.g. abc"
              />
            </View>
          </LinearGradient>
        </View>

        {/** Height & Weight */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Height</Text>
            <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
              <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
                <TextInput
                  style={styles.input}
                  value={profile.height}
                  onChangeText={(text) => handleChange('height', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                  placeholder="e.g. 180cm"
                />
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Weight</Text>
            <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
              <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
                <TextInput
                  style={styles.input}
                  value={profile.weight}
                  onChangeText={(text) => handleChange('weight', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                  placeholder="e.g. 66kg"
                />
              </View>
            </LinearGradient>
          </View>
        </View>

        {/** Skin Color */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Skin Color</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={styles.input}
                value={profile.skinColor}
                onChangeText={(text) => handleChange('skinColor', text)}
                placeholderTextColor="#666"
                placeholder="e.g. white, brown, black"
              />
            </View>
          </LinearGradient>
        </View>

        {/** Age & Category */}
        <View style={styles.row}>
          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Age</Text>
            <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
              <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
                <TextInput
                  style={styles.input}
                  value={profile.age}
                  onChangeText={(text) => handleChange('age', text)}
                  keyboardType="numeric"
                  placeholderTextColor="#666"
                  placeholder="e.g. 25"
                />
              </View>
            </LinearGradient>
          </View>

          <View style={[styles.inputContainer, styles.halfWidth]}>
            <Text style={styles.label}>Category</Text>
            <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
              <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
                <TextInput
                  style={styles.input}
                  value={profile.category}
                  onChangeText={(text) => handleChange('category', text)}
                  placeholderTextColor="#666"
                  placeholder="e.g. Friendship, Dating"
                />
              </View>
            </LinearGradient>
          </View>
        </View>

        {/** Likes */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Likes</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={styles.input}
                value={profile.likes}
                onChangeText={(text) => handleChange('likes', text)}
                placeholder="e.g. Gym, Travel, Music"
                placeholderTextColor="#666"
              />
            </View>
          </LinearGradient>
        </View>

        {/** Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <LinearGradient colors={['#FF00FF', '#8000FF']} style={styles.inputGradient}>
            <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.address}
                onChangeText={(text) => handleChange('address', text)}
                multiline
                numberOfLines={3}
                placeholderTextColor="#666"
                placeholder='e.g. 123 Main St, City, Country'
              />
            </View>
          </LinearGradient>
        </View>

        <Pressable
          onPress={handleContinue}
          disabled={!isValid()}
          style={{
            width: '100%',
            opacity: !isValid() ? 0.5 : 1,
          }}
        >
          <LinearGradient
            colors={['#FF00FF', '#D000FF', '#8000FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              height: 48,
              borderRadius: 24,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#FF00FF',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
              elevation: 5,
              width: '100%',
            }}
          >
            <Text style={{
              fontFamily: 'Rajdhani-SemiBold',
              fontSize: 18,
              color: '#000000',
            }}>
              Continue
            </Text>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 24,
  },
  backButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 28,
    color: '#FF00FF',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginBottom: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#FF00FF',
    borderRadius: 12,
    color: '#fff',
    fontFamily: 'Rajdhani',
    fontSize: 16,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  inputGradient: {
    borderRadius: 12,
    padding: 2,
  },

  row: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  button: {
    width: '100%',
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
    marginVertical: 24,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#000000',
  },
});
