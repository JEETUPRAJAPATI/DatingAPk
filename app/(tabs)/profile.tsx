import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Platform, Pressable, Modal, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Settings, CreditCard as Edit3, MapPin, ChevronRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INTERESTS = [
  { id: 'travel', name: 'Travel ✈️' },
  { id: 'movies', name: 'Movies 🎬' },
  { id: 'art', name: 'Art 🎨' },
  { id: 'technology', name: 'Technology 📱' },
  { id: 'science', name: 'Science 🔬' }
];

const BASICS = [
  { id: 'zodiac', name: 'Zodiac', value: 'Select' },
  { id: 'education', name: 'Education', value: 'Select' },
  { id: 'familyPlans', name: 'Family Plans', value: 'Select' },
  { id: 'covidVaccine', name: 'COVID Vaccine', value: 'Select' },
  { id: 'personalityType', name: 'Personality Type', value: 'Select' },
  { id: 'communicationStyle', name: 'Communication Style', value: 'Select' },
  { id: 'loveStyle', name: 'Love Style', value: 'Select' },
];

const LIFESTYLE = [
  { id: 'pets', name: 'Pets', value: 'Select' },
  { id: 'drinking', name: 'Drinking Habits', value: 'Select' },
  { id: 'smoking', name: 'Smoking Habits', value: 'Select' },
  { id: 'workout', name: 'Workout', value: 'Select' },
  { id: 'diet', name: 'Dietary Preferences', value: 'Select' },
  { id: 'social', name: 'Social Media Presence', value: 'Select' },
  { id: 'sleep', name: 'Sleeping Habits', value: 'Select' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
        
        <Text style={styles.title}>Profile</Text>
        
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => router.push('/subscription')}
        >
          <Text style={styles.upgradeText}>⭐️ UPGRADE</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <Text style={styles.completionTitle}>Complete your profile</Text>
          <TouchableOpacity style={styles.closeButton}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>15%</Text>
          </View>
          <Text style={styles.progressDescription}>
            Complete your profile to experience the best dating experience and better matches!
          </Text>
        </View>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574&auto=format&fit=crop' }}
          style={styles.profileImage}
        />
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => router.push('/edit-profile')}
        >
          <Edit3 size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.name}>Andrew, 27</Text>
        <View style={styles.locationRow}>
          <MapPin size={16} color="#666" />
          <Text style={styles.location}>Less than a kilometer away</Text>
        </View>
        <View style={styles.genderRow}>
          <Text style={styles.gender}>♂️ Man</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interests</Text>
        <View style={styles.interestsContainer}>
          {INTERESTS.map((interest) => (
            <TouchableOpacity 
              key={interest.id}
              style={styles.interestTag}
              onPress={() => router.push('/interests')}
            >
              <Text style={styles.interestText}>{interest.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basics</Text>
        {BASICS.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name}</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{item.value}</Text>
              <ChevronRight size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lifestyle</Text>
        {LIFESTYLE.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}>
            <Text style={styles.menuItemText}>{item.name}</Text>
            <View style={styles.menuItemRight}>
              <Text style={styles.menuItemValue}>{item.value}</Text>
              <ChevronRight size={20} color="#666" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relationship Goals</Text>
        <TouchableOpacity style={styles.goalTag}>
          <Text style={styles.goalText}>Dating 👫</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  upgradeButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  completionCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
  },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  completionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressDescription: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
  profileCard: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    right: '30%',
    bottom: 0,
    backgroundColor: '#8B5CF6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    marginLeft: 4,
    color: '#666',
  },
  genderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gender: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  goalTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  goalText: {
    fontSize: 14,
  },
});