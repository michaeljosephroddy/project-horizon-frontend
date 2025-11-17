import { StyleSheet } from 'react-native';

export const moodTagSelectorStyles = StyleSheet.create({
container: {
    flex: 1,
    // Removed maxHeight and ScrollView - let parent handle scrolling
  },
  categorySection: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 8,
  },
  tagButtonSelected: {
    borderColor: 'transparent',
  },
  tagText: {
    fontSize: 13,
    color: '#333',
  },
  tagTextSelected: {
    color: '#fff',
    fontWeight: '500',
  },
});
