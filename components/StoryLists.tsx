import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { useState } from 'react';
import StoryViewer from './StoryViewer';
import StoryUploader from './StoryUploader';
import { API_BASE_URL } from '@/app/apiUrl';
import { useUserProfile } from '@/app/context/userContext';
import axios from 'axios';
import * as mime from 'mime';

export interface Story {
    id: string;
    imageUrl: string;
    timestamp: string;
}

interface User {
    id: string;
    name: string;
    image: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
    online: boolean;
    typing?: boolean;
    stories?: Story[];
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

export default function StoryList() {
    const [selectedStories, setSelectedStories] = useState<Story[]>([]);
    const [storyViewerVisible, setStoryViewerVisible] = useState(false);
    const [storyUploaderVisible, setStoryUploaderVisible] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const { token } = useUserProfile()

    const handleStoryPress = (user: User) => {
        if (user.stories && user.stories.length > 0) {
            setSelectedStories(user.stories);
            setCurrentStoryIndex(0);
            setStoryViewerVisible(true);
        }
    };

    const handleStoryUpload = async (image: { uri: string; type?: string; fileName?: string }) => {
        try {
            const formData = new FormData();
            formData.append('media_type', 'image');

            formData.append('media', {
                uri: image.uri,
                name: image.fileName || 'story.jpg',
                type: image.type || 'image/jpeg',
            } as any);

            console.log("image : ", image)

            const response = await axios.post(`${API_BASE_URL}/story/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = response.data;

            if (result.status) {
                console.log('✅ Story uploaded:', result.data);
                setStoryUploaderVisible(false);
            } else {
                console.error('❌ Upload failed:', result.message);
            }
        } catch (error) {
            console.error('🚨 Error uploading story:', error.response?.data || error.message);
        }
    };

    return (
        <View style={styles.storiesWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
                <Pressable style={styles.addStoryButton} onPress={() => setStoryUploaderVisible(true)}>
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

            <StoryViewer
                visible={storyViewerVisible}
                onClose={() => setStoryViewerVisible(false)}
                stories={selectedStories}
                currentIndex={currentStoryIndex}
            />

            <StoryUploader
                visible={storyUploaderVisible}
                onClose={() => setStoryUploaderVisible(false)}
                onUpload={handleStoryUpload}
            />
        </View>
    );
}

const styles = StyleSheet.create({
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
        borderWidth: 2,
        borderColor: '#03d7fc',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    addStoryPlus: {
        fontFamily: 'Rajdhani-Bold',
        fontSize: 24,
        color: '#03d7fc',
    },
    addStoryText: {
        fontFamily: 'Rajdhani',
        fontSize: 12,
        color: '#03d7fc',
        marginTop: 4,
    },
    storyItem: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#03d7fc',
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
});
