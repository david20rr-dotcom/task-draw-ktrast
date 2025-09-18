
import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '../components/Icon';

export default function MainScreen() {
  const router = useRouter();

  const handleOrganizerPress = () => {
    console.log('Navigating to organizer screen');
    router.push('/organizer');
  };

  const handleParticipantPress = () => {
    console.log('Navigating to participant screen');
    router.push('/participant');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.centerContent}>
        <View style={styles.header}>
          <Icon name="gift-outline" size={64} color={colors.primary} />
          <Text style={commonStyles.title}>Task Draw</Text>
          <Text style={[commonStyles.text, styles.subtitle]}>
            Create unique tasks and let participants draw them randomly
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.roleButton, styles.organizerButton]}
            onPress={handleOrganizerPress}
          >
            <Icon name="create-outline" size={32} color={colors.background} />
            <Text style={styles.roleButtonText}>I&apos;m an Organizer</Text>
            <Text style={styles.roleButtonSubtext}>Create and manage tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, styles.participantButton]}
            onPress={handleParticipantPress}
          >
            <Icon name="hand-left-outline" size={32} color={colors.background} />
            <Text style={styles.roleButtonText}>I&apos;m a Participant</Text>
            <Text style={styles.roleButtonSubtext}>Draw a task to complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  roleButton: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  organizerButton: {
    backgroundColor: colors.primary,
  },
  participantButton: {
    backgroundColor: colors.accent,
  },
  roleButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.background,
    marginTop: 12,
    marginBottom: 4,
  },
  roleButtonSubtext: {
    fontSize: 14,
    color: colors.background + 'CC',
    textAlign: 'center',
  },
});
