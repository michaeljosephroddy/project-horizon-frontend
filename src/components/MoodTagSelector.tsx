import React from 'react';
import { moodTagSelectorStyles } from '../styles/moodTagSelectorStyles';
import { MOOD_TAGS, MOOD_TAG_CATEGORIES, MoodTag } from '../utils/moodTags';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

interface MoodTagSelectorProps {
    selectedTagIds: number[];
    onTagToggle: (tagId: number) => void;
}

export const MoodTagSelector: React.FC<MoodTagSelectorProps> = ({
    selectedTagIds,
    onTagToggle,
}) => {
    // Group tags by category
    const groupedTags = MOOD_TAGS.reduce((acc, tag) => {
        if (!acc[tag.category]) {
            acc[tag.category] = [];
        }
        acc[tag.category].push(tag);
        return acc;
    }, {} as { [key: number]: MoodTag[] });

    return (
        <View style={moodTagSelectorStyles.container}>
            {Object.entries(groupedTags).map(([category, tags]) => {
                const categoryId = parseInt(category);
                const categoryInfo = MOOD_TAG_CATEGORIES[categoryId];

                return (
                    <View key={category} style={moodTagSelectorStyles.categorySection}>
                        <Text style={[moodTagSelectorStyles.categoryTitle, { color: categoryInfo.color }]}>
                            {categoryInfo.name}
                        </Text>
                        <View style={moodTagSelectorStyles.tagContainer}>
                            {tags.map((tag) => {
                                const isSelected = selectedTagIds.includes(tag.id);
                                return (
                                    <TouchableOpacity
                                        key={tag.id}
                                        style={[
                                            moodTagSelectorStyles.tagButton,
                                            isSelected && moodTagSelectorStyles.tagButtonSelected,
                                            isSelected && { backgroundColor: MOOD_TAG_CATEGORIES[tag.category].color },
                                        ]}
                                        onPress={() => onTagToggle(tag.id)}
                                    >
                                        <Text
                                            style={[
                                                moodTagSelectorStyles.tagText,
                                                isSelected && moodTagSelectorStyles.tagTextSelected,
                                            ]}
                                        >
                                            {tag.name}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};
