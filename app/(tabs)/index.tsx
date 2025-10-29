import ApiStatus from '@/components/ApiStatus';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TodoItem from '@/components/TodoItem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useNotes } from '@/hooks/useNotes';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { notes, loading, error, addNote, updateNote, deleteNote, toggleNote, refreshNotes } = useNotes();
  const [newTodoText, setNewTodoText] = useState('');
  const [showDebug, setShowDebug] = useState(__DEV__);

  const handleAddTodo = async () => {
    if (newTodoText.trim()) {
      const success = await addNote({
        title: newTodoText.trim(),
        content: newTodoText.trim(),
        completed: false,
      });
      
      if (success) {
        setNewTodoText('');
      }
    }
  };

  const handleDeleteTodo = async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Delete Todo',
        'Are you sure you want to delete this todo?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => resolve(false)
          },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: async () => {
              const success = await deleteNote(id);
              resolve(success);
            }
          }
        ]
      );
    });
  };

  const handleEditTodo = async (id: string, newText: string) => {
    return updateNote(id, {
      title: newText,
      content: newText,
    });
  };

  const completedCount = notes.filter(note => note.completed).length;
  const totalCount = notes.length;

  return (
    <ThemedView style={styles.container} lightColor="#f8f9fa" darkColor="#f8f9fa">
      <ApiStatus 
        isConnected={!error}
        lastSync={new Date()}
        onRetry={refreshNotes}
        showDebug={showDebug}
      />
      
      <ThemedView style={styles.header} lightColor="#fff" darkColor="#fff">
        <ThemedView style={styles.titleRow} lightColor="transparent" darkColor="transparent">
          <ThemedText type="title" style={styles.title}>My Todo List</ThemedText>
          {__DEV__ && (
            <TouchableOpacity 
              onPress={() => setShowDebug(!showDebug)}
              style={styles.debugButton}
            >
              <IconSymbol 
                name={showDebug ? "eye.slash" : "eye"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </ThemedView>
        <ThemedText style={styles.subtitle}>
          {totalCount > 0 ? `${completedCount}/${totalCount} completed` : 'No todos yet'}
        </ThemedText>
        {error && (
          <ThemedText style={styles.errorText}>
            Error: {error}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.inputContainer} lightColor="#fff" darkColor="#fff">
        <TextInput
          style={styles.input}
          placeholder="Add a new todo..."
          value={newTodoText}
          onChangeText={setNewTodoText}
          onSubmitEditing={handleAddTodo}
          returnKeyType="done"
          editable={!loading}
        />
        <TouchableOpacity 
          style={[styles.addButton, loading && styles.disabledButton]} 
          onPress={handleAddTodo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <IconSymbol name="plus" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TodoItem
            id={item.id}
            text={item.title}
            completed={item.completed}
            onToggle={toggleNote}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
            loading={loading}
          />
        )}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshNotes}
            colors={['#4CAF50']}
            tintColor="#4CAF50"
          />
        }
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer} lightColor="transparent" darkColor="transparent">
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
              <>
                <IconSymbol name="checklist" size={64} color="#ccc" />
                <ThemedText style={styles.emptyText}>No todos yet</ThemedText>
                <ThemedText style={styles.emptySubtext}>Add your first todo above</ThemedText>
              </>
            )}
          </ThemedView>
        }
      />
      
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  debugButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  input: {
    flex: 1,
    height: 52,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    fontWeight: '500',
  },
  addButton: {
    width: 52,
    height: 52,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
    shadowOpacity: 0,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  list: {
    flex: 1,
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 8,
    color: '#bdc3c7',
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
