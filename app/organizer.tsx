
import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { commonStyles, colors } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import Icon from '../components/Icon';
import Button from '../components/Button';

export default function OrganizerScreen() {
  const router = useRouter();
  const {
    currentTaskList,
    createTaskList,
    addTask,
    removeTask,
    getAvailableTasksCount,
    getAssignedTasksCount,
  } = useTasks();

  const [listTitle, setListTitle] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [showCreateList, setShowCreateList] = useState(true);

  const handleCreateList = () => {
    if (!listTitle.trim()) {
      Alert.alert('Error', 'Please enter a list title');
      return;
    }

    console.log('Creating task list with title:', listTitle);
    createTaskList(listTitle.trim(), listDescription.trim(), organizerEmail.trim());
    setShowCreateList(false);
    
    // Clear form
    setListTitle('');
    setListDescription('');
    setOrganizerEmail('');
  };

  const handleAddTask = () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    console.log('Adding task:', taskTitle);
    addTask(taskTitle.trim(), taskDescription.trim());
    
    // Clear form
    setTaskTitle('');
    setTaskDescription('');
  };

  const handleRemoveTask = (taskId: string) => {
    Alert.alert(
      'Remove Task',
      'Are you sure you want to remove this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeTask(taskId) },
      ]
    );
  };

  const handleGenerateLink = () => {
    if (!currentTaskList || currentTaskList.tasks.length === 0) {
      Alert.alert('Error', 'Please add at least one task before generating the link');
      return;
    }

    // In a real app, this would generate a unique link
    const link = `${window.location.origin}/participant?listId=${currentTaskList.id}`;
    
    Alert.alert(
      'Participant Link Generated',
      `Share this link with participants:\n\n${link}`,
      [
        { text: 'Copy Link', onPress: () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(link);
          }
        }},
        { text: 'OK' },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  if (showCreateList || !currentTaskList) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Icon name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={commonStyles.title}>Create Task List</Text>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={commonStyles.section}>
              <Text style={styles.label}>List Title *</Text>
              <TextInput
                style={commonStyles.input}
                value={listTitle}
                onChangeText={setListTitle}
                placeholder="Enter list title (e.g., Secret Santa Tasks)"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={commonStyles.section}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[commonStyles.input, styles.textArea]}
                value={listDescription}
                onChangeText={setListDescription}
                placeholder="Describe what this task list is for..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={commonStyles.section}>
              <Text style={styles.label}>Your Email (Optional)</Text>
              <TextInput
                style={commonStyles.input}
                value={organizerEmail}
                onChangeText={setOrganizerEmail}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Button
              text="Create List"
              onPress={handleCreateList}
              style={styles.createButton}
              textStyle={styles.createButtonText}
            />
          </ScrollView>
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
          <View style={styles.headerContent}>
            <Text style={commonStyles.subtitle}>{currentTaskList.title}</Text>
            {currentTaskList.description && (
              <Text style={commonStyles.textSecondary}>{currentTaskList.description}</Text>
            )}
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getAvailableTasksCount()}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getAssignedTasksCount()}</Text>
            <Text style={styles.statLabel}>Assigned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentTaskList.tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={commonStyles.section}>
            <Text style={styles.sectionTitle}>Add New Task</Text>
            <TextInput
              style={commonStyles.input}
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholder="Task title *"
              placeholderTextColor={colors.textSecondary}
            />
            <TextInput
              style={[commonStyles.input, styles.textArea]}
              value={taskDescription}
              onChangeText={setTaskDescription}
              placeholder="Task description (optional)"
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={2}
            />
            <Button
              text="Add Task"
              onPress={handleAddTask}
              style={styles.addButton}
              textStyle={styles.addButtonText}
            />
          </View>

          <View style={commonStyles.section}>
            <View style={commonStyles.row}>
              <Text style={styles.sectionTitle}>Tasks ({currentTaskList.tasks.length})</Text>
              <TouchableOpacity style={styles.linkButton} onPress={handleGenerateLink}>
                <Icon name="link-outline" size={20} color={colors.primary} />
                <Text style={styles.linkButtonText}>Generate Link</Text>
              </TouchableOpacity>
            </View>
            
            {currentTaskList.tasks.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="list-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No tasks yet</Text>
                <Text style={commonStyles.textSecondary}>Add your first task above</Text>
              </View>
            ) : (
              currentTaskList.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onRemove={handleRemoveTask}
                  showRemoveButton={!task.isAssigned}
                />
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  createButton: {
    backgroundColor: colors.primary,
    marginTop: 20,
  },
  createButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.backgroundAlt,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: colors.accent,
    marginTop: 8,
  },
  addButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  linkButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 4,
  },
});
