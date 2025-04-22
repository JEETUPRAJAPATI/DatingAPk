import { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Search, Video, MessageSquare, Plus } from 'lucide-react-native';
import StoryViewer from '@/components/StoryViewer';
import StoryUploader from '@/components/StoryUploader';

interface User {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  typing?: boolean;
  stories?: Array<{
    id: string;
    imageUrl: string;
    timestamp: string;
  }>;
}

const users: User[] = [
  {
    id: '1',
    name: 'Emma',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    lastMessage: 'typing...',
    timestamp: '2m ago',
    unread: 2,
    online: true,
    typing: true,
    stories: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
        timestamp: '2h ago'
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
        timestamp: '1h ago'
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    lastMessage: 'That sounds amazing! 😊',
    timestamp: '1h ago',
    unread: 0,
    online: true,
    stories: [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
        timestamp: '30m ago'
      }
    ]
  },
  {
    id: '3',
    name: 'Jessica',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop',
    lastMessage: 'Looking forward to our d...',
    timestamp: '2h ago',
    unread: 1,
    online: false
  }
];

export default function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStories, setSelectedStories] = useState<User['stories']>([]);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [storyUploaderVisible, setStoryUploaderVisible] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserPress = (userId: string) => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: userId }
    });
  };

  const handleStoryPress = (user: User) => {
    if (user.stories && user.stories.length > 0) {
      setSelectedStories(user.stories);
      setCurrentStoryIndex(0);
      setStoryViewerVisible(true);
    }
  };

  const handleStoryUpload = (imageUri: string) => {
    // Here you would typically upload the image to your backend
    console.log('Uploading story:', imageUri);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Your conversations</Text>
      </View>

      <View style={styles.storiesWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
          <Pressable
            style={styles.addStoryButton}
            onPress={() => setStoryUploaderVisible(true)}
          >
            <Text style={styles.addStoryPlus}>+</Text>
            <Text style={styles.addStoryText}>Add Story</Text>
          </Pressable>

          {users.map(user => (
            <Pressable
              key={user.id}
              style={styles.storyItem}
              onPress={() => handleStoryPress(user)}
            >
              <Image source={{ uri: user.image }} style={styles.storyImage} />
              {user.stories && user.stories.length > 0 && (
                <View style={styles.storyIndicator} />
              )}
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#FF00FF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.userList}>
        {filteredUsers.map(user => (
          <Pressable
            key={user.id}
            style={styles.userItem}
            onPress={() => handleUserPress(user.id)}
          >
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user.image }} style={styles.avatar} />
              {user.online && <View style={styles.onlineIndicator} />}
            </View>

            <View style={styles.userInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.timestamp}>{user.timestamp}</Text>
              </View>

              <View style={styles.messageRow}>
                <Text
                  style={[
                    styles.lastMessage,
                    user.typing && styles.typingMessage,
                    user.unread > 0 && styles.unreadMessage
                  ]}
                  numberOfLines={1}
                >
                  {user.lastMessage}
                </Text>
                {user.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{user.unread}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.actionButtons}>
              <Pressable style={styles.actionButton}>
                <Video size={20} color="#FF00FF" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <MessageSquare size={20} color="#FF00FF" />
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {selectedStories && (
        <StoryViewer
          visible={storyViewerVisible}
          onClose={() => setStoryViewerVisible(false)}
          stories={selectedStories}
          currentIndex={currentStoryIndex}
        />
      )}

      <StoryUploader
        visible={storyUploaderVisible}
        onClose={() => setStoryUploaderVisible(false)}
        onUpload={handleStoryUpload}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 35,
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
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginTop: 4,
  },
  storiesWrapper: {
    height: 100,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  storiesContainer: {
    alignItems: 'center',
  },
  addStoryButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#FF00FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addStoryPlus: {
    fontFamily: 'Rajdhani-Bold',
    fontSize: 24,
    color: '#FF00FF',
  },
  addStoryText: {
    fontFamily: 'Rajdhani',
    fontSize: 12,
    color: '#FF00FF',
    marginTop: 4,
  },
  storyItem: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FF00FF',
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyIndicator: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 37,
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  searchInput: {
    flex: 1,
    height: 40,
    marginLeft: 8,
    color: '#FFFFFF',
    fontFamily: 'Rajdhani',
  },
  userList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FF00FF',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#39FF14',
    borderWidth: 2,
    borderColor: '#000',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  timestamp: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#666666',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#666666',
    marginRight: 8,
  },
  typingMessage: {
    color: '#FF00FF',
    fontStyle: 'italic',
  },
  unreadMessage: {
    color: '#FFFFFF',
    fontFamily: 'Rajdhani-SemiBold',
  },
  unreadBadge: {
    backgroundColor: '#FF00FF',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  unreadCount: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 14,
    color: '#000000',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
});