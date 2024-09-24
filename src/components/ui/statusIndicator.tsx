import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Check } from 'lucide-react-native';

interface UploadStatusIndicatorProps {
  status: 'idle' | 'started' | 'uploading' | 'processing' | 'completed' | 'error';
}

const UploadStatusIndicator: React.FC<UploadStatusIndicatorProps> = ({ status }) => {
  const getColor = (step: number) => {
    switch (status) {
      case 'idle':
        return step === 1 ? '#22c55e' : '#6b7280';
      case 'uploading':
        return step <= 2 ? '#22c55e' : '#6b7280';
      case 'processing':
        return step <= 3 ? '#22c55e' : '#6b7280';
      case 'completed':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const statusText = ["Started", "Uploading", "Processing", "Completed"];

  return (
    <View style={styles.container}>
      <View style={styles.lineContainer}>
        <View style={styles.line} />
      </View>
      {[1, 2, 3, 4].map((step, index) => (
        <View key={step} style={styles.stepContainer}>
          <View style={[styles.circle, { backgroundColor: getColor(step) }]}>
            {getColor(step) === '#22c55e' && <Check color="#000000" size={16} />}
          </View>
          <Text style={[styles.text, { color: getColor(step) }]}>{statusText[index]}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  lineContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 12,
    alignItems: 'center',
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: '#22c55e',
  },
  stepContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default UploadStatusIndicator;