/**
 * API Status Component
 * Shows connection status and debug information
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ApiStatusProps {
  isConnected: boolean;
  lastSync?: Date;
  onRetry?: () => void;
  showDebug?: boolean;
}

export default function ApiStatus({ 
  isConnected, 
  lastSync, 
  onRetry, 
  showDebug = false 
}: ApiStatusProps) {
  if (!showDebug) return null;

  return (
    <ThemedView style={styles.container} lightColor="#fff" darkColor="#fff">
      <ThemedView style={styles.statusRow} lightColor="transparent" darkColor="transparent">
        <IconSymbol 
          name={isConnected ? "wifi" : "wifi.slash"} 
          size={16} 
          color={isConnected ? "#4CAF50" : "#F44336"} 
        />
        <ThemedText style={[
          styles.statusText,
          { color: isConnected ? "#4CAF50" : "#F44336" }
        ]}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </ThemedText>
        
        {onRetry && !isConnected && (
          <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <IconSymbol name="arrow.clockwise" size={14} color="#4CAF50" />
          </TouchableOpacity>
        )}
      </ThemedView>
      
      {lastSync && (
        <ThemedText style={styles.syncText}>
          Last sync: {lastSync.toLocaleTimeString()}
        </ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  retryButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  syncText: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 2,
  },
});
