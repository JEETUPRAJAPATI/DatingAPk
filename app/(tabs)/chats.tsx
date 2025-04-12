import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Pressable } from 'react-native';
import { MessageCircle, Phone, Video, Smile, Send, Image as ImageIcon, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  viewed: boolean;
  timestamp: string;
  username: string;
}

interface Chat {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  typing: boolean;
}

const stories: Story[] = [
  {
    id: '1',
    userId: '1',
    imageUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    viewed: false,
    timestamp: '2h ago',
    username: 'Emma'
  },
  {
    id: '2',
    userId: '2',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    viewed: false,
    timestamp: '3h ago',
    username: 'Sarah'
  },
  {
    id: '3',
    userId: '3',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
    viewed: true,
    timestamp: '5h ago',
    username: 'Jessica'
  },
];

const chats: Chat[] = [
  {
    id: '1',
    userId: '1',
    name: 'Emma',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop',
    lastMessage: 'Would love to grab coffee sometime! ☕️',
    timestamp: '2m ago',
    unread: 2,
    online: true,
    typing: true,
  },
  {
    id: '2',
    userId: '2',
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop',
    lastMessage: 'That sounds amazing! 😊',
    timestamp: '1h ago',
    unread: 0,
    online: true,
    typing: false,
  },
  {
    id: '3',
    userId: '3',
    name: 'Jessica',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop',
    lastMessage: 'Looking forward to our date!',
    timestamp: '2h ago',
    unread: 1,
    online: false,
    typing: false,
  },
];

export default function ChatsScreen() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState('');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const handleVideoCall = (chat: Chat) => {
    router.push(`/video/${chat.id}`);
  };

  const handleChatOpen = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleSend = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage('');
    }
  };

  if (selectedStory) {
    return (
      <View style={styles.statusContainer}>
        <Image 
          source={{ uri: selectedStory.imageUrl }} 
          style={styles.statusImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', 'transparent', 'rgba(0,0,0,0.5)']}
          style={styles.statusGradient}
        />
        
        <View style={styles.statusHeader}>
          <View style={styles.statusInfo}>
            <Text style={styles.statusUsername}>{selectedStory.username}</Text>
            <Text style={styles.statusTimestamp}>{selectedStory.timestamp}</Text>
          </View>
          <Pressable 
            style={styles.closeStatus}
            onPress={() => setSelectedStory(null)}
          >
            <X size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!selectedChat ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Messages</Text>
            <Text style={styles.subtitle}>Your conversations</Text>
          </View>

          <ScrollView 
            horizontal 
            style={styles.storiesContainer}
            showsHorizontalScrollIndicator={false}
          >
            <Pressable style={styles.addStoryButton}>
              <View style={styles.addStoryIcon}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
              <Text style={styles.addStoryText}>Add Story</Text>
            </Pressable>
            {stories.map((story) => (
              <Pressable 
                key={story.id} 
                style={styles.storyButton}
                onPress={() => setSelectedStory(story)}
              >
                <Image 
                  source={{ uri: story.imageUrl }} 
                  style={[
                    styles.storyImage,
                    story.viewed && styles.storyImageViewed,
                  ]} 
                />
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView style={styles.chatsList}>
            {chats.map((chat) => (
              <View key={chat.id} style={styles.chatItem}>
                <View style={styles.avatarContainer}>
                  <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                  {chat.online && <View style={styles.onlineIndicator} />}
                </View>

                <Pressable 
                  style={styles.chatInfo}
                  onPress={() => handleChatOpen(chat)}
                >
                  <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{chat.name}</Text>
                    <Text style={styles.timestamp}>{chat.timestamp}</Text>
                  </View>

                  <View style={styles.chatPreview}>
                    {chat.typing ? (
                      <Text style={styles.typingIndicator}>typing...</Text>
                    ) : (
                      <Text 
                        style={styles.lastMessage}
                        numberOfLines={1}
                      >
                        {chat.lastMessage}
                      </Text>
                    )}
                    {chat.unread > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{chat.unread}</Text>
                      </View>
                    )}
                  </View>
                </Pressable>

                <View style={styles.chatActions}>
                  <Pressable 
                    style={styles.actionButton}
                    onPress={() => handleVideoCall(chat)}
                  >
                    <Video size={20} color="#FF00FF" />
                  </Pressable>
                  <Pressable 
                    style={styles.actionButton}
                    onPress={() => handleChatOpen(chat)}
                  >
                    <MessageCircle size={20} color="#FF00FF" />
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.chatScreen}>
          <View style={styles.chatHeader}>
            <Pressable 
              style={styles.backButton}
              onPress={() => setSelectedChat(null)}
            >
              <Text style={styles.backButtonText}>←</Text>
            </Pressable>

            <Image source={{ uri: selectedChat.avatar }} style={styles.chatAvatar} />
            
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderName}>{selectedChat.name}</Text>
              {selectedChat.online && (
                <Text style={styles.onlineStatus}>Online</Text>
              )}
            </View>

            <View style={styles.chatActions}>
              <Pressable style={styles.actionButton}>
                <Phone size={24} color="#FF00FF" />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Video size={24} color="#FF00FF" />
              </Pressable>
            </View>
          </View>

          <ScrollView style={styles.messagesContainer}>
            {/* Messages will be rendered here */}
          </ScrollView>

          <View style={styles.inputContainer}>
            <Pressable style={styles.mediaButton}>
              <ImageIcon size={24} color="#FF00FF" />
            </Pressable>
            
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#666"
              multiline
            />

            <Pressable style={styles.emojiButton}>
              <Smile size={24} color="#FF00FF" />
            </Pressable>

            <Pressable 
              style={[styles.sendButton, !message && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!message}
            >
              <Send size={24} color={message ? '#000' : '#666'} />
            </Pressable>
          </View>
        </View>
      )}
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
  subtitle: {
    fontFamily: 'Rajdhani',
    fontSize: 18,
    color: '#00FFFF',
    marginTop: 4,
  },
  storiesContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  addStoryButton: {
    alignItems: 'center',
    marginRight: 16,
  },
  addStoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FF00FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  plusIcon: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 32,
    color: '#FF00FF',
  },
  addStoryText: {
    fontFamily: 'Rajdhani',
    fontSize: 12,
    color: '#FF00FF',
  },
  storyButton: {
    marginRight: 16,
  },
  storyImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#FF00FF',
  },
  storyImageViewed: {
    borderColor: '#666',
  },
  chatsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 0, 255, 0.2)',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
  chatInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },
  timestamp: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#666',
  },
  chatPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#CCC',
    flex: 1,
  },
  typingIndicator: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FF00FF',
    fontStyle: 'italic',
  },
  unreadBadge: {
    backgroundColor: '#FF00FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 12,
    color: '#000',
  },
  chatScreen: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 0, 255, 0.2)',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 24,
    color: '#FF00FF',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeaderName: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFF',
  },
  onlineStatus: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#39FF14',
  },
  chatActions: {
    flexDirection: 'row',
    gap: 8,
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
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 0, 255, 0.2)',
    gap: 12,
  },
  mediaButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: '#FFF',
    fontFamily: 'Rajdhani',
    fontSize: 16,
  },
  emojiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
  },
  statusContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  statusImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  statusHeader: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  statusInfo: {
    flex: 1,
  },
  statusUsername: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statusTimestamp: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  closeStatus: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});