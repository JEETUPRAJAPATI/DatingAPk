import { View, Text, Pressable, Image, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import StoryViewer from './StoryViewer';
import StoryUploader from './StoryUploader';
import { API_BASE_URL } from '@/app/apiUrl';
import { useUserProfile } from '@/app/context/userContext';
import axios from 'axios';
import mime from 'mime';
import { compatibilityFlags } from 'react-native-screens';

export interface Story {
    id: string;
    imageUrl: string;
    timestamp: string;
    username: string;
    avatarUrl: string;
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


export default function StoryList() {
    const [yourStory, setYourStory] = useState<User | null>(null);
    const [unviewed, setUnviewed] = useState<User[]>([]);
    const [viewed, setViewed] = useState<User[]>([]);
    const [selectedStories, setSelectedStories] = useState<Story[]>([]);
    const [storyViewerVisible, setStoryViewerVisible] = useState(false);
    const [storyUploaderVisible, setStoryUploaderVisible] = useState(false);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const { token, user } = useUserProfile()


    const fetchStories = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/story/list`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("stories res : ", res)
            if (res.data.status) {
                const transform = (storiesData: any[]) =>
                    storiesData.reduce((acc: User[], story) => {
                        const existing = acc.find(u => u.id === story.user.id);
                        const storyObj = {
                            id: story.id,
                            imageUrl: story.media_url,
                            timestamp: story.created_at
                        };

                        if (existing) {
                            existing.stories?.push(storyObj);
                        } else {
                            acc.push({
                                id: story.user.id,
                                name: story.user.name,
                                image: `${story.user.profile}`,
                                lastMessage: '',
                                timestamp: '',
                                unread: 0,
                                online: false,
                                stories: [storyObj]
                            });
                        }

                        return acc;
                    }, []);

                setYourStory(res.data.yourStories.length
                    ? transform(res.data.yourStories)[0]
                    : null
                );

                setUnviewed(transform(res.data.unviewedStories));
                setViewed(transform(res.data.viewedStories));
            }
        } catch (err) {
            console.log("Error fetching stories:", err.message);
        }
    };

    useEffect(() => {
        fetchStories()
    }, [])

    const handleStoryPress = (user: User) => {
        if (user.stories && user.stories.length > 0) {
            const enrichedStories = user.stories?.map(story => ({
                ...story,
                username: user.name,
                avatarUrl: user.image
            })) || [];

            setSelectedStories(enrichedStories);
            setCurrentStoryIndex(0);
            setStoryViewerVisible(true);
        }
        fetchStories();
    };

    const handleStoryUpload = async (image: { uri: string; type: string; fileName: string }) => {
        console.log("handleStoryUpload me image : ", image)
        try {
            const formData = new FormData();

            // Get MIME type using mime lib (optional but safer)
            const mimeType = mime.getType(image.uri) || image.type;

            formData.append('media_type', 'image');

            formData.append('media', {
                uri: image.uri,
                type: mimeType,
                name: image.fileName,
            } as any);

            const response = await axios.post(`${API_BASE_URL}/story/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = response.data;

            if (result.status) {
                console.log('✅ Story uploaded:', result.data);
                setStoryUploaderVisible(false);
                fetchStories();
            } else {
                console.error('❌ Upload failed:', result.message);
            }
        } catch (error) {
            console.error('🚨 Error uploading story:', error.response?.data || error.message);
        }
    };

    console.log("my story : ", yourStory)
    console.log("viewved story : ", viewed)
    console.log("unviewews story : ", unviewed)
    console.log("selected stories : ", selectedStories)

    return (
        <View style={styles.storiesWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
                {/* Your Story (with or without story) */}
                <Pressable
                    onPress={yourStory ? () => handleStoryPress(yourStory) : () => setStoryUploaderVisible(true)}
                    style={styles.storyItemWrapper}
                >
                    <View style={yourStory ? styles.yourStoryWrapper : styles.addOnlyWrapper}>
                        <Image
                            source={{ uri: yourStory?.image || user?.profileImage }}
                            style={styles.storyImage}
                        />
                        <Pressable onPress={() => setStoryUploaderVisible(true)} style={styles.plusIcon}>
                            <Text style={styles.plusText}>+</Text>
                        </Pressable>

                    </View>
                    <Text style={styles.storyLabel}>Your Story</Text>
                </Pressable>

                {/* Unviewed Stories */}
                {unviewed.map(u => (
                    <Pressable key={u.id} style={styles.storyItemWrapper} onPress={() => handleStoryPress(u)}>
                        <View style={styles.unviewedBorder}>
                            <Image source={{ uri: u.image }} style={styles.storyImage} />
                        </View>
                        <Text style={styles.storyLabel}>{u.name}</Text>
                    </Pressable>
                ))}

                {/* Viewed Stories */}
                {viewed.map(u => (
                    <Pressable key={u.id} style={styles.storyItemWrapper} onPress={() => handleStoryPress(u)}>
                        <View style={styles.viewedBorder}>
                            <Image source={{ uri: u.image }} style={styles.storyImage} />
                        </View>
                        <Text style={styles.storyLabel}>{u.name}</Text>
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
    storyItemWrapper: {
        alignItems: 'center',
        marginRight: 12,
    },
    storiesContainer: {
        alignItems: 'center',
    },
    yourStoryWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#03d7fc',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',

    },
    addOnlyWrapper: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#03d7fc',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6faff',
        position: 'relative',
    },
    plusIcon: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#03d7fc',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 1,
    },
    plusText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        lineHeight: 16,
        textAlign: 'center',
    },
    unviewedBorder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: '#ff007f',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    viewedBorder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#aaa',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 35,
    },
    storyLabel: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'center',
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
