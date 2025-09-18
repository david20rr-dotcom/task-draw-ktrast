
import React, { useState } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types/Task';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function ParticipantScreen() {
  const router = useRouter();
  const { currentTaskList, drawTask, getAvailableTasksCount } = useTasks();
  
  const [participantEmail, setParticipantEmail] = useState('');
  const [drawnTask, setDrawnTask] = useState<Task | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleDrawTask = () => {
    if (!participantEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    if (!currentTaskList || getAvailableTasksCount() === 0) {
      Alert.alert('No Tasks Available', 'There are no more tasks available to draw.');
      return;
    }

    console.log('Drawing task for participant:', participantEmail);
    const task = drawTask(participantEmail.trim());
    
    if (task) {
      setDrawnTask(task);
      setHasDrawn(true);
    } else {
      Alert.alert('Error', 'Unable to draw a task. Please try again.');
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDrawAnother = () => {
    setDrawnTask(null);
    setHasDrawn(false);
    setParticipantEmail('');
  };

  // Mock task list for demo purposes when no current list exists
  const mockTaskList = {
    title: 'Demo Task List',
    description: 'This is a demo. In a real app, you would access this via a shared link.',
    tasks: [
      { id: '1', title: 'Bring snacks for the team', isAssigned: false },
      { id: '2', title: 'Organize team lunch', isAssigned: false },
      { id: '3', title: 'Plan the next meeting', isAssigned: false },
    ]
  };

  const displayTaskList = currentTaskList || mockTaskList;
  const availableCount = currentTaskList ? getAvailableTasksCount() : 3;

  if (hasDrawn && drawnTask) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <View style={styles.resultContainer}>
            <Icon name="gift" size={80} color={colors.success} />
            <Text style={styles.congratsText}>Congratulations!</Text>
            <Text style={styles.yourTaskText}>Your task is:</Text>
            
            <View style={styles.taskResultCard}>
              <Text style={styles.taskResultTitle}>{drawnTask.title}</Text>
              {drawnTask.description && (
                <Text style={styles.taskResultDescription}>{drawnTask.description}</Text>
              )}
            </View>

            <Text style={styles.assignedToText}>
              Assigned to: {drawnTask.assignedTo}
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                text="Draw Another Task"
                onPress={handleDrawAnother}
                style={styles.drawAnotherButton}
                textStyle={styles.drawAnotherButtonText}
              />
              
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={commonStyles.title}>Draw a Task</Text>
        </View>

        <View style={styles.taskListInfo}>
          <Text style={styles.taskListTitle}>{displayTaskList.title}</Text>
          {displayTaskList.description && (
            <Text style={commonStyles.textSecondary}>{displayTaskList.description}</Text>
          )}
          
          <View style={styles.availableTasksContainer}>
            <Icon name="list-outline" size={24} color={colors.primary} />
            <Text style={styles.availableTasksText}>
              {availableCount} task{availableCount !== 1 ? 's' : ''} available
            </Text>
          </View>
        </View>

        <View style={styles.drawSection}>
          <View style={styles.drawContainer}>
            <Icon name="hand-left-outline" size={64} color={colors.primary} />
            <Text style={styles.drawTitle}>Ready to draw?</Text>
            <Text style={commonStyles.textSecondary}>
              Enter your email and draw a random task from the available list
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Your Email Address</Text>
            <TextInput
              style={commonStyles.input}
              value={participantEmail}
              onChangeText={setParticipantEmail}
              placeholder="your.email@example.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Button
              text={availableCount > 0 ? "Draw My Task!" : "No Tasks Available"}
              onPress={handleDrawTask}
              style={[
                styles.drawButton,
                availableCount === 0 && styles.disabledButton
              ]}
              textStyle={styles.drawButtonText}
            />
          </View>
        </View>

        {!currentTaskList && (
          <View style={styles.demoNotice}>
            <Icon name="information-circle-outline" size={20} color={colors.warning} />
            <Text style={styles.demoNoticeText}>
              This is a demo. In a real app, you would access this via a shared link from an organizer.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  taskListInfo: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  taskListTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  availableTasksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
  },
  availableTasksText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  drawSection: {
    flex: 1,
    justifyContent: 'center',
  },
  drawContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  drawTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  drawButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
    paddingVertical: 16,
  },
  drawButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  resultContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  congratsText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.success,
    marginTop: 20,
    marginBottom: 8,
  },
  yourTaskText: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  taskResultCard: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.success,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  taskResultTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  taskResultDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  assignedToText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '500',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 16,
  },
  drawAnotherButton: {
    backgroundColor: colors.accent,
  },
  drawAnotherButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warning + '20',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  demoNoticeText: {
    fontSize: 14,
    color: colors.warning,
    marginLeft: 8,
    flex: 1,
  },
});
