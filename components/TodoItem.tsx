import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { ActivityIndicator, Animated, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (id: string, newText: string) => Promise<boolean>;
  loading?: boolean;
}

export default function TodoItem({ id, text, completed, onToggle, onDelete, onEdit, loading = false }: TodoItemProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(text);
  const [actionLoading, setActionLoading] = React.useState(false);
  
  const slideAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleSave = async () => {
    if (editText.trim()) {
      setActionLoading(true);
      const success = await onEdit(id, editText.trim());
      if (success) {
        setIsEditing(false);
      }
      setActionLoading(false);
    }
  };

  const handleCancel = () => {
    setEditText(text);
    setIsEditing(false);
  };

  const handleToggle = async () => {
    setActionLoading(true);
    await onToggle(id);
    setActionLoading(false);
  };

  const handleDelete = async () => {
    setActionLoading(true);
    
    // Animate deletion
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Wait for animation to complete, then delete
    setTimeout(async () => {
      const success = await onDelete(id);
      setActionLoading(false);
      
      if (!success) {
        // Reset animation if deletion failed
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, 300); // Wait for animation to complete
  };

  // Animate in on mount
  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Remove the isDeleting check - we want to show the item during animation

  return (
    <Animated.View 
      style={[
        {
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim }
          ],
          opacity: actionLoading ? 0.6 : 1,
        }
      ]}
    >
      <ThemedView style={styles.container} lightColor="#fff" darkColor="#fff">
      <TouchableOpacity 
        style={[styles.checkbox, completed && styles.completedCheckbox]} 
        onPress={handleToggle}
        disabled={actionLoading || loading}
      >
        {actionLoading ? (
          <ActivityIndicator size="small" color="#666" />
        ) : (
          <IconSymbol 
            name={completed ? "checkmark.circle.fill" : "circle"} 
            size={24} 
            color={completed ? "#4CAF50" : "#666"} 
          />
        )}
      </TouchableOpacity>
      
      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.editInput}
            value={editText}
            onChangeText={setEditText}
            onSubmitEditing={handleSave}
            autoFocus
            multiline
          />
          <View style={styles.editButtons}>
            <TouchableOpacity 
              onPress={handleSave} 
              style={styles.editButton}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <IconSymbol name="checkmark" size={16} color="#4CAF50" />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleCancel} 
              style={styles.editButton}
              disabled={actionLoading}
            >
              <IconSymbol name="xmark" size={16} color="#F44336" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.textContainer}
          onPress={() => setIsEditing(true)}
        >
          <ThemedText 
            style={[styles.text, completed && styles.completedText]}
            numberOfLines={0}
          >
            {text}
          </ThemedText>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.deleteButton, actionLoading && styles.disabledButton]} 
        onPress={handleDelete}
        disabled={actionLoading || loading}
      >
        {actionLoading ? (
          <ActivityIndicator size="small" color="#F44336" />
        ) : (
          <IconSymbol name="trash" size={20} color="#F44336" />
        )}
      </TouchableOpacity>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  checkbox: {
    marginRight: 16,
    padding: 4,
    borderRadius: 20,
  },
  completedCheckbox: {
    backgroundColor: '#E8F5E8',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
  },
  disabledButton: {
    opacity: 0.5,
  },
  editContainer: {
    flex: 1,
    marginRight: 12,
  },
  editInput: {
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  editButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    minWidth: 36,
    alignItems: 'center',
  },
});
