import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Image, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Smile, Image as ImageIcon, X, Paperclip } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import EmojiPicker from '@/components/EmojiPicker';
import { API_BASE_URL, SOCKET_BASE_URL } from '../apiUrl';
import { useUserProfile } from '../context/userContext';
import io from 'socket.io-client';


interface Message {
  _id: string;
  message: string;
  image?: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  read: boolean;
}

export default function ChatScreen() {
  const { id: rawId } = useLocalSearchParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { token, user: userProfile } = useUserProfile()
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [typingStatus, setTypingStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<any>(null);

  console.log("online status : ", onlineStatus)

  // Update the useEffect hook for socket events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resUser, resMessages] = await Promise.all([
          fetch(`${API_BASE_URL}/user/details/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch(`${API_BASE_URL}/chat/history/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const [userData, historyData] = await Promise.all([
          resUser.json(),
          resMessages.json(),
        ]);

        setUser(userData?.user);
        setMessages(historyData?.messages);
        console.log("msg history : ", historyData)
        // Mark messages as read when they're initially loaded
        historyData?.messages?.forEach(msg => {
          if (!msg.read && msg?.sender_id !== userProfile?._id) {
            socketRef.current?.emit('messageRead', {
              messageId: msg._id || msg.id,
              readerId: userProfile?._id,
              senderId: msg.sender_id,
            });
          }
        });

      } catch (err) {
        console.error('Failed to load chat data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Connect to the socket server
    socketRef.current = io(SOCKET_BASE_URL);

    // Join the user's personal room
    if (userProfile?._id) {
      socketRef.current.emit('join', userProfile?._id);

    }
    // Request initial online status
    socketRef.current.emit('checkOnlineStatus', id);
    // Online status handlers
    socketRef.current.on('userOnline', (userId) => {
      if (userId === id) {
        setOnlineStatus(true);
      }
    });
    socketRef.current.on('userOffline', (userId) => {
      if (userId === id) {
        setOnlineStatus(false);
      }
    });

    socketRef.current.on('onlineStatusResponse', ({ userId, isOnline }) => {
      if (userId === id) {
        setOnlineStatus(isOnline);
      }
    });

    // Receive messages
    socketRef.current.on('receiveMessage', (newMsg: any) => {
      console.log("new msg : ", newMsg)
      if (!newMsg._id) {
        console.error('Received message without ID:', newMsg);
        return;
      }
      const incomingMessage: Message = {
        _id: newMsg._id,
        message: newMsg.message,
        image: newMsg.file_url,
        sender_id: newMsg.sender_id,
        receiver_id: newMsg.receiver_id,
        timestamp: new Date(newMsg.timestamp).toISOString(),
        read: newMsg.read || false,
      };

      setMessages(prev => [...prev, incomingMessage]);

      // Mark as read if it's our message and we're viewing the chat
      if (incomingMessage.receiver_id === userProfile._id && !incomingMessage.read) {
        console.log("Incoming msg marking:", incomingMessage);
        socketRef.current.emit('messageRead', {
          messageId: incomingMessage._id,
          readerId: userProfile._id,
          senderId: incomingMessage.sender_id     // The original sender's id
        });
      }

      scrollViewRef.current?.scrollToEnd({ animated: true });
    });

    // Handle read status updates
    socketRef.current.on('messageReadUpdate', ({ messageId }) => {
      setMessages(prev =>
        prev.map(msg =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    fetchData();

    return () => {
      socketRef.current.disconnect();
    };
  }, [id, token, userProfile?._id]);


  // Update the messageRead handler to include proper message marking
  const handleMessageRead = (msgId: string, msgSenderId: string) => {
    if (!msgId || !msgSenderId || msgSenderId === userProfile._id) return;
    console.log('Marking message as read:', msgId, msgSenderId);

    if (msgSenderId !== userProfile._id) {

      // Find using _id
      const messageToMark = messages.find(msg => msg._id === msgId);
      if (messageToMark && messageToMark.receiver_id === userProfile._id) {
        setMessages(prev =>
          prev.map(msg =>
            msg._id === msgId ? { ...msg, read: true } : msg
          )
        );

        // Emit to server
        socketRef.current.emit('messageRead', {
          messageId: msgId,
          readerId: userProfile._id,
          senderId: msgSenderId
        });
      }
    }
  };

  const handleSend = async () => {
    if (message.trim()) {
      const tempId = Date.now().toString();

      const newMessage: Message = {
        _id: tempId, // Use _id
        message: message,
        sender_id: userProfile._id,
        receiver_id: id,
        read: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      scrollViewRef.current?.scrollToEnd({ animated: true });

      try {
        const res = await fetch(`${API_BASE_URL}/chat/send`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            receiver_id: id,
            type: 'text',
            message: message,
          }),
        });

        const data = await res.json();

        if (data?.message?._id) {
          setMessages(prev => prev.map(msg =>
            msg._id === tempId ? {
              ...msg,
              _id: data.message._id, // Update to real _id
              read: data.message.read
            } : msg
          ));
        }
      } catch (err) {
        console.error('Failed to send message:', err);
      }
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };


  const handleAttachment = async (type: 'camera' | 'gallery' | 'document') => {
    setShowAttachments(false);
    let result;

    if (type === 'gallery') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    } else if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      const formData = new FormData();
      formData.append('receiver_id', id);
      formData.append('type', 'image');
      formData.append('message', asset.fileName || 'image.jpg');
      formData.append('file', {
        uri: asset.uri,
        name: asset.fileName || 'image.jpg',
        type: asset.type || 'image/jpeg',
      });

      try {
        const response = await fetch(`${API_BASE_URL}/chat/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });

        const data = await response.json();

        if (data?.message?._id) {
          const newMessage: Message = {
            _id: data.message._id,
            message: data.message.message,
            image: data.message.file_url,
            sender_id: data.message.sender_id,
            receiver_id: data.message.receiver_id,
            read: data.message.read,
            timestamp: data.message.timestamp,
          };
          setMessages(prev => [...prev, newMessage]);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      } catch (err) {
        console.error('Failed to send image message:', err);
      }
    }
  };



  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Loading chat...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  console.log("msgs in map : ", messages)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#FF00FF" />
        </Pressable>

        {user.profile_image ? (
          <Image source={{ uri: user.profile_image }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarText}>
              {user.name ? user.name.charAt(0).toUpperCase() : "?"}
            </Text>
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <View style={styles.statusIndicator}>
            <View style={[
              styles.statusDot,
              { backgroundColor: onlineStatus ? '#4CAF50' : '#9E9E9E' }
            ]} />
            <Text style={styles.statusText}>
              {onlineStatus ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        onScroll={({ nativeEvent }) => {
          // Mark messages as read when they become visible
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isNearBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 50;

          if (isNearBottom) {
            messages.forEach(msg => {
              if (!msg.read && msg.sender_id !== userProfile._id && msg.receiver_id === userProfile._id) {
                handleMessageRead(msg._id, msg.sender_id);
              }
            });
          }
        }}
        scrollEventThrottle={400}
      >
        {messages.map((msg) => (

          <View
            key={msg._id}
            style={
              [
                styles.messageWrapper,
                msg.receiver_id === id ? styles.userMessage : styles.otherMessage
              ]}
            onTouchEnd={() => handleMessageRead(msg._id, msg.sender_id)}
          >
            {msg.image ? (
              <Image source={{ uri: user.image }} style={styles.messageImage} />
            ) : (
              <Text style={styles.messageText}>{msg.message}</Text>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.timestamp}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
              {msg?.sender_id === userProfile?._id && (
                <Text style={{ marginLeft: 10, fontSize: 12 }}>
                  {msg?.read ? '✔✔' : '✔'}
                </Text>
              )}
            </View>
          </View>
        ))
        }
      </ScrollView >

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
    </View >
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
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    borderColor: '#FF00FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    color: '#fff', // Text color for the initial
    fontWeight: 'bold',
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
  errorText: {
    fontFamily: 'Rajdhani-SemiBold',
    fontSize: 18,
    color: '#FF00FF',
    textAlign: 'center',
    marginTop: 40,
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
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
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
  statusIndicator: {
    marginTop: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
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