import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import GradientInput from './GradientInput';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

interface MultipleSelectProps {
    label: string;
    value: string[];  // Make sure this is an array of string
    onValueChange: (selectedItems: string[]) => void;
    items: { label: string; value: string }[]; // Items to display
    placeholder: string;
}

const MultipleSelectInput: React.FC<MultipleSelectProps> = ({
    label,
    value,
    onValueChange,
    items,
    placeholder
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);


    console.log("intesret value in multip:", value);
    console.log("intesret items in multip:", items);


    // Handle selecting or removing an item
    const handleSelectItem = (itemValue: string) => {
        console.log("Item Value being selected:", itemValue);

        // Find the item in the list
        const item = items.find((i) => i.value === itemValue);
        console.log("Item found:", item);

        if (!item) {
            console.warn("Item not found for value:", itemValue);
            return; // If the item doesn't exist, don't proceed
        }

        // If the item is already selected, remove it
        if (value.includes(itemValue)) {
            const updatedValue = value.filter((val) => val !== itemValue);
            console.log("Updated value after removing:", updatedValue);
            onValueChange(updatedValue);
        } else {
            // If not selected, add it
            const updatedValue = [...new Set([...value, itemValue])]; // Ensure no duplicates
            console.log("Updated value after adding:", updatedValue);
            onValueChange(updatedValue);
        }
    };


    // Filter items based on search query
    const filteredItems = items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.inputGroup}
        >
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={styles.selectedTagsContainer}>
                {value.map((itemValue) => {
                    const item = items.find((i) => i.value === itemValue);
                    if (!item) return null; // If item is not found, skip
                    return (
                        <View key={itemValue} style={styles.tag}>
                            <Text style={styles.tagText}>{item.label}</Text>
                            <TouchableOpacity onPress={() => handleSelectItem(itemValue)}>
                                <Text style={styles.removeTag}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </View>

            <GradientInput style={styles.gradientInput}>
                <TouchableOpacity
                    onPress={() => setIsDropdownVisible(!isDropdownVisible)}
                    style={styles.inputField}
                >
                    <View style={styles.dropdownTrigger}>
                        <Text style={styles.inputText}>
                            {value.length > 0 ? 'Edit Interests' : placeholder}
                        </Text>
                        {isDropdownVisible ? (
                            <ChevronUp size={20} color="#333" />
                        ) : (
                            <ChevronDown size={20} color="#333" />
                        )}
                    </View>
                </TouchableOpacity>
            </GradientInput>

            {isDropdownVisible && (
                <>
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Search..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                    />
                    <FlatList
                        data={filteredItems}
                        keyExtractor={(item) => item.value} // Unique key based on the value
                        style={styles.dropdownList}
                        ListEmptyComponent={
                            <Text style={styles.emptyText}>No options found</Text>
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleSelectItem(item.value)}
                                style={styles.option}
                            >
                                <Text style={styles.optionText}>{item.label}</Text>
                                {value.includes(item.value) && (
                                    <Text style={styles.selectedIndicator}>✔</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    />
                </>
            )}
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#FF00FF',
        fontFamily: 'Rajdhani-SemiBold',
        marginBottom: 8,
    },
    selectedTagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    tag: {
        backgroundColor: '#F0D9FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 6,
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    tagText: {
        fontSize: 13,
        color: '#4B0082',
        fontFamily: 'Rajdhani-Bold',
    },
    removeTag: {
        marginLeft: 8,
        color: '#FF4444',
        fontSize: 16,
        fontWeight: 'bold',
    },
    gradientInput: {
        height: 48,

        overflow: 'hidden',
    },
    inputField: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
        height: '100%',
    },
    dropdownTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },

    inputText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Rajdhani-Regular',
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#FF00FF',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 12,
        marginBottom: 6,
        color: '#333',
        fontFamily: 'Rajdhani-Regular',
    },
    dropdownList: {
        maxHeight: 180,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
    },
    option: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
    optionText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Rajdhani-Regular',
    },
    selectedIndicator: {
        fontSize: 16,
        color: '#28a745',
    },
    emptyText: {
        padding: 14,
        textAlign: 'center',
        color: '#aaa',
        fontFamily: 'Rajdhani-Regular',
    },
});

export default MultipleSelectInput;
