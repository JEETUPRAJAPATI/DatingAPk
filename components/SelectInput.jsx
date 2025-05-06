import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import GradientInput from './GradientInput'; // ✅ Make sure this works

const SelectInput = ({
  label,
  value,
  onValueChange,
  items,
  placeholder = 'Select an option',
  disabled = false,
  error = null,
  style: customStyle = {},
}) => {
  return (
    <View style={[styles.inputGroup, customStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <GradientInput hasError={!!error} style={styles.gradientInput}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={value}
          disabled={disabled}
          placeholder={{
            label: placeholder,
            value: null,
            color: '#999',
          }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </GradientInput>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    marginBottom: 16,
    minWidth: 150,
  },
  label: {
    fontSize: 14,
    color: '#FF00FF',
    fontFamily: 'Rajdhani-SemiBold',
    marginBottom: 8,
  },
  gradientInput: {
    height: 48,
    // borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    color: '#000',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    color: '#000',
    paddingRight: 30,
  },
  placeholder: {
    color: '#999',
  },
  iconContainer: {
    top: Platform.OS === 'ios' ? 12 : 14,
    right: 12,
  },
});

export default SelectInput;
