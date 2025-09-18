
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/Task';
import { colors, commonStyles } from '../styles/commonStyles';
import Icon from './Icon';

interface TaskCardProps {
  task: Task;
  onRemove?: (taskId: string) => void;
  showRemoveButton?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onRemove, showRemoveButton = false }) => {
  return (
    <View style={[commonStyles.card, styles.taskCard]}>
      <View style={styles.taskContent}>
        <View style={styles.taskInfo}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.description && (
            <Text style={styles.taskDescription}>{task.description}</Text>
          )}
          {task.isAssigned && task.assignedTo && (
            <Text style={styles.assignedText}>Assigned to: {task.assignedTo}</Text>
          )}
        </View>
        
        <View style={styles.taskActions}>
          <View style={[styles.statusBadge, task.isAssigned ? styles.assignedBadge : styles.availableBadge]}>
            <Text style={[styles.statusText, task.isAssigned ? styles.assignedText : styles.availableText]}>
              {task.isAssigned ? 'Assigned' : 'Available'}
            </Text>
          </View>
          
          {showRemoveButton && onRemove && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => onRemove(task.id)}
            >
              <Icon name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    marginBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  assignedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  taskActions: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  assignedBadge: {
    backgroundColor: colors.success + '20',
  },
  availableBadge: {
    backgroundColor: colors.primary + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  availableText: {
    color: colors.primary,
  },
  removeButton: {
    padding: 4,
  },
});

export default TaskCard;
