import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Updates from 'expo-updates';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleReload = async () => {
    try {
      await Updates.reloadAsync();
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.card}>
            <Text style={styles.emoji}>⚠️</Text>
            <Text style={styles.title}>Something went wrong</Text>
            <Text style={styles.message}>
              An unexpected error occurred. Please try restarting the app.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorText}>{this.state.error.message}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={this.handleReload}>
              <Text style={styles.buttonText}>Restart App</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FE',
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: '#0A0E5E', marginBottom: 8, textAlign: 'center' },
  message: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  errorText: { fontSize: 11, color: '#E53E3E', marginBottom: 16, textAlign: 'center', fontFamily: 'monospace' },
  button: { backgroundColor: '#0A0E5E', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 14, marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
});
