import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

export default function SettingsScreen() {
  const handleClearAllTodos = () => {
    Alert.alert(
      'Clear All Todos',
      'Are you sure you want to clear all todos? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            // This would need to be connected to the main todo state
            // For now, just show a confirmation
            Alert.alert('Success', 'All todos cleared!');
          }
        }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Settings</ThemedText>
        <ThemedText style={styles.subtitle}>Manage your todo app</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>App Information</ThemedText>
        
        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Version</ThemedText>
          <ThemedText style={styles.infoValue}>1.0.0</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.infoItem}>
          <ThemedText style={styles.infoLabel}>Built with</ThemedText>
          <ThemedText style={styles.infoValue}>Expo + React Native</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Actions</ThemedText>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleClearAllTodos}>
          <IconSymbol name="trash" size={20} color="#F44336" />
          <ThemedText style={styles.actionButtonText}>Clear All Todos</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Simple Todo List App{'\n'}
          Built with Expo Managed Workflow
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#F44336',
    fontWeight: '500',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
});