import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, Modal, TextInput, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Sparkles, Zap, X, Settings, SlidersHorizontal, MapPin, MoveVertical as MoreVertical } from 'lucide-react-native';
import Slider from '@react-native-community/slider';
import { router } from 'expo-router';
import { useFilter } from '../context/filterContext';
import axios from 'axios';
import { API_BASE_URL } from '../apiUrl';
import { useUserProfile } from '../context/userContext';

const SWIPE_THRESHOLD = 100;

interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  image: string;
  location: string;
}

interface FilterState {
  location: string;
  gender: 'female' | 'male' | 'others' | null;
  ageRange: [number, number];
  distance: number;
}

export default function ExploreScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { filters, setFilters, resetFilters } = useFilter();
  const { token } = useUserProfile();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const query = new URLSearchParams({
          age_min: filters.ageRange[0]?.toString() || '18',
          age_max: filters.ageRange[1]?.toString() || '100',
          city: filters.location || '',
        });

        const response = await axios.get(`${API_BASE_URL}/user/matches?${query.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const formatted = response.data.matches.map((m: any) => ({
          id: m.id,
          name: m.name,
          age: m.age,
          bio: m.about,
          image: m.profile_image ||
            (m.i_am === 'Female'
              ? 'https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869123.jpg?semt=ais_hybrid&w=740'
              : 'https://st.depositphotos.com/46542440/55685/i/450/depositphotos_556851336-stock-illustration-square-face-character-stiff-art.jpg'),
          matchPercentage: Math.floor(Math.random() * 21) + 80,
          lastActive: 'Just now',
          location: m.city,
          status: 'online',
        }));

        setProfiles(formatted);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [filters]);

  // Safely check if there are profiles available before accessing `profile`
  const profile = profiles[currentIndex] || {
    id: '',
    name: 'Loading...',
    age: 0,
    bio: 'Loading bio...',
    image: 'https://example.com/loading.jpg', // Placeholder image
    location: 'Loading...',
  };

  const nextProfile = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      translateX.value = 0;
      translateY.value = 0;
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        translateX.value = withSpring(event.translationX > 0 ? 500 : -500);
        runOnJS(nextProfile)();
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-200, 0, 200],
      [-30, 0, 30]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const handleAction = (action: 'spark' | 'vibe' | 'pass') => {
    if (action === 'spark') {
      translateX.value = withSpring(500, {}, () => {
        runOnJS(nextProfile)();
      });
    } else if (action === 'pass') {
      translateX.value = withSpring(-500, {}, () => {
        runOnJS(nextProfile)();
      });
    }
  };

  const handleViewProfile = () => {
    router.push({
      pathname: '/profile/view',
      params: { id: profile.id },
    });
  };

  const handleResetFilters = () => {
    setFilters({
      location: 'New York City',
      gender: null,
      ageRange: [20, 40],
      distance: 25,
    });
  };

  const handleApplyFilters = () => {
    setShowFilter(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.container}>

          <Image
            source={require('../../assets/images/logobg.png')}  // Path to your logo image
            style={styles.logo}
          />
        </View>
        <View style={styles.headerButtons}>
          <Pressable onPress={() => setShowFilter(true)} style={styles.iconButton}>
            <SlidersHorizontal size={24} color="#FF00FF" />
          </Pressable>
          <Pressable onPress={() => router.push('/settings')} style={styles.iconButton}>
            <Settings size={24} color="#FF00FF" />
          </Pressable>
        </View>
      </View>

      <View style={styles.cardContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.card, cardStyle]}>
            <Image source={{ uri: profile.image }} style={styles.image} />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.gradient}
            >
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                <Text style={styles.location}>{profile.location}</Text>
              </View>
            </LinearGradient>

            <Pressable
              style={[styles.bioContainer, expanded && styles.bioExpanded]}
              onPress={() => setExpanded(!expanded)}
            >
              <Text style={styles.bio} numberOfLines={expanded ? undefined : 2}>
                {profile.bio}
              </Text>
            </Pressable>

            <Pressable
              style={styles.optionsButton}
              onPress={() => handleViewProfile()}
            >
              <MoreVertical size={24} color="#FF00FF" />
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.actionButton, styles.passButton]}
          onPress={() => handleAction('pass')}
        >
          <X size={32} color="#FF00FF" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.vibeButton]}
          onPress={() => handleAction('vibe')}
        >
          <Zap size={32} color="#00FFFF" />
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.sparkButton]}
          onPress={() => handleAction('spark')}
        >
          <Sparkles size={32} color="#39FF14" />
        </Pressable>
      </View>

      <Modal
        visible={showOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptions(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowOptions(false)}
        >
          <View style={styles.optionsMenu}>
            <Pressable
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                handleViewProfile();
              }}
            >
              <Text style={styles.optionText}>View Profile</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <Modal
        visible={showFilter}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowFilter(false)}
        >
          <Pressable
            style={styles.filterContainer}
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filters</Text>
              <Pressable
                style={styles.closeButton}
                onPress={() => setShowFilter(false)}
              >
                <X size={24} color="#FF00FF" />
              </Pressable>
            </View>

            <ScrollView style={styles.filterContent} showsVerticalScrollIndicator={false}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Location</Text>
                <View style={styles.locationInput}>
                  <MapPin size={20} color="#FF00FF" />
                  <TextInput
                    style={styles.locationInputText}
                    value={filters.location}
                    onChangeText={(text) => setFilters({ ...filters, location: text })}
                    placeholder="Enter location"
                    placeholderTextColor="rgba(255, 0, 255, 0.5)"
                    underlineColorAndroid="transparent"
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Gender</Text>
                <View style={styles.genderButtons}>
                  {(['female', 'male', 'others'] as const).map((gender) => (
                    <Pressable
                      key={gender}
                      style={[
                        styles.genderButton,
                        filters.gender === gender && styles.genderButtonActive,
                      ]}
                      onPress={() => setFilters({ ...filters, gender })}
                    >
                      <Text style={[
                        styles.genderButtonText,
                        filters.gender === gender && styles.genderButtonTextActive,
                      ]}>
                        {gender.charAt(0).toUpperCase() + gender.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Age Range</Text>
                <Text style={styles.rangeText}>
                  {filters.ageRange[0]} - {filters.ageRange[1]} years
                </Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={18}
                    maximumValue={60}
                    value={filters.ageRange[0]}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      ageRange: [Math.round(value), filters.ageRange[1]]
                    })}
                    minimumTrackTintColor="#FF00FF"
                    maximumTrackTintColor="rgba(255, 0, 255, 0.2)"
                    thumbTintColor="#FF00FF"
                  />
                  <Slider
                    style={styles.slider}
                    minimumValue={18}
                    maximumValue={60}
                    value={filters.ageRange[1]}
                    onValueChange={(value) => setFilters({
                      ...filters,
                      ageRange: [filters.ageRange[0], Math.round(value)]
                    })}
                    minimumTrackTintColor="#FF00FF"
                    maximumTrackTintColor="rgba(255, 0, 255, 0.2)"
                    thumbTintColor="#FF00FF"
                  />
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Distance (km)</Text>
                <Text style={styles.rangeText}>{filters.distance} km</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={100}
                  value={filters.distance}
                  onValueChange={(value) => setFilters({
                    ...filters,
                    distance: Math.round(value)
                  })}
                  minimumTrackTintColor="#FF00FF"
                  maximumTrackTintColor="rgba(255, 0, 255, 0.2)"
                  thumbTintColor="#FF00FF"
                />
              </View>

              <View style={styles.filterActions}>
                <Pressable
                  style={styles.resetButton}
                  onPress={handleResetFilters}
                >
                  <Text style={styles.resetButtonText}>Reset</Text>
                </Pressable>

                <Pressable onPress={handleApplyFilters} style={styles.pressableWrapper}>
                  <LinearGradient
                    colors={['#FF00FF', '#D000FF', '#8000FF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.applyButton}
                  >
                    <Text style={styles.applyButtonText}>Apply Filter</Text>
                  </LinearGradient>
                </Pressable>

              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  title: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 32,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#03d7fc',
    shadowColor: '#03d7fc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'flex-end',
    padding: 20,
  },
  profileInfo: {
    marginBottom: 70,
  },
  name: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  location: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    textShadowColor: '#00FFFF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  bioContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#FF00FF',
  },
  bioExpanded: {
    height: '50%',
  },
  bio: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  passButton: {
    borderColor: '#FF00FF',
    shadowColor: '#FF00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  vibeButton: {
    borderColor: '#00FFFF',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  sparkButton: {
    borderColor: '#39FF14',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  filterContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    // borderColor: '#FF00FF',
    borderColor: '#03d7fc',
    maxHeight: '90%',
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 0, 255, 0.2)',
  },
  filterTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 24,
    color: '#FF00FF',
    textShadowColor: '#FF00FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  filterContent: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    marginBottom: 12,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF00FF',
    gap: 8,
  },
  locationInputText: {
    flex: 1,
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF00FF',
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: '#FF00FF',
  },
  genderButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
  },
  genderButtonTextActive: {
    color: '#000000',
  },
  rangeText: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sliderContainer: {
    gap: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FF00FF',
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#FF00FF',
  },
  pressableWrapper: {
    flex: 1, // or use width: '100%' if you don't want it to expand unnecessarily
  },

  applyButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // make sure gradient fills the wrapper
  },

  applyButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 16,
    color: '#000000',
  },

  optionsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  optionsMenu: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF00FF',
    width: '80%',
    padding: 16,
  },
  optionItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,0,255,0.2)',
  },
  optionText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
  },
});