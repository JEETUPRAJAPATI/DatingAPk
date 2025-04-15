import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Smile, Image as ImageIcon, X, Paperclip } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from '@/components/EmojiPicker';

interface Message {
  id: string;
  text: string;
  image?: string;
  sender: 'user' | 'other';
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Hey there! How are you?',
    sender: 'other',
    timestamp: '10:30 AM'
  },
  {
    id: '2',
    text: 'I AM doing great! How about you?',
    sender: 'user',
    timestamp: '10:31 AM'
  },
  {
    id: '3',
    text: 'Would love to grab coffee sometime! ☕️',
    sender: 'other',
    timestamp: '10:32 AM'
  }
];

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleAttachment = async (type: 'camera' | 'gallery' | 'document') => {
    setShowAttachments(false);

    if (type === 'gallery') {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const newMessage: Message = {
          id: Date.now().toString(),
          text: '',
          image: result.assets[0].uri,
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, newMessage]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FF00FF" />
        </Pressable>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop' }}
          style={styles.avatar}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>Sarah Parker</Text>
          <Text style={styles.status}>Online</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[
              styles.messageWrapper,
              msg.sender === 'user' ? styles.userMessage : styles.otherMessage
            ]}
          >
            {msg.image ? (
              <Image source={{ uri: msg.image }} style={styles.messageImage} />
            ) : (
              <Text style={styles.messageText}>{msg.text}</Text>
            )}
            <Text style={styles.timestamp}>{msg.timestamp}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Pressable
          style={styles.attachButton}
          onPress={() => setShowAttachments(true)}
        >
          <Paperclip size={24} color="#FF00FF" />
        </Pressable>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#666"
          multiline
        />

        <Pressable
          style={styles.emojiButton}
          onPress={() => setShowEmojiPicker(true)}
        >
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

      <Modal
        visible={showEmojiPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <EmojiPicker onSelect={handleEmojiSelect} onClose={() => setShowEmojiPicker(false)} />
      </Modal>

      <Modal
        visible={showAttachments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachments(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowAttachments(false)}
        >
          <View style={styles.attachmentsMenu}>
            <Text style={styles.attachmentsTitle}>Share Content</Text>

            <Pressable
              style={styles.attachmentOption}
              onPress={() => handleAttachment('camera')}
            >
              <Text style={styles.attachmentText}>Camera</Text>
            </Pressable>

            <Pressable
              style={styles.attachmentOption}
              onPress={() => handleAttachment('gallery')}
            >
              <Text style={styles.attachmentText}>Photo & Video Library</Text>
            </Pressable>

            <Pressable
              style={styles.attachmentOption}
              onPress={() => handleAttachment('document')}
            >
              <Text style={styles.attachmentText}>Document</Text>
            </Pressable>

            <Pressable
              style={styles.cancelButton}
              onPress={() => setShowAttachments(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  status: {
    fontFamily: 'Rajdhani',
    fontSize: 14,
    color: '#39FF14',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageWrapper: {
    maxWidth: '80%',
    marginBottom: 16,
    borderRadius: 16,
    padding: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#FF00FF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 0, 255, 0.2)',
  },
  messageText: {
    fontFamily: 'Rajdhani',
    fontSize: 16,
    color: '#FFFFFF',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  timestamp: {
    fontFamily: 'Rajdhani',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 0, 255, 0.2)',
    gap: 12,
  },
  attachButton: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  attachmentsMenu: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FF00FF',
  },
  attachmentsTitle: {
    fontFamily: 'Orbitron-Bold',
    fontSize: 20,
    color: '#FF00FF',
    marginBottom: 16,
    textAlign: 'center',
  },
  attachmentOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 0, 255, 0.2)',
  },
  attachmentText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 16,
  },
  cancelButtonText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
  },
});