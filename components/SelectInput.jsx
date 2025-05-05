import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import GradientInput from './GradientInput';

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
      <View style={styles.wrapper}>
        <GradientInput hasError={!!error} style={styles.gradientInput}>
          <View style={styles.innerWrapper}>
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
              style={{
                ...pickerSelectStyles,
                iconContainer: {
                  top: Platform.select({ ios: 18, android: 18 }),
                  right: 12,
                },
              }}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </GradientInput>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1, // <-- Important: flexible width for 2-in-a-row layout
    marginBottom: 16,
    // marginLeft: 12,
    minWidth: 150, // Optional: prevent too small
  },
  label: {
    fontSize: 14,
    color: '#FF00FF',
    fontFamily: 'Rajdhani-SemiBold',
    marginBottom: 8,
  },
  wrapper: {
    position: 'relative',
  },
  gradientInput: {
    height: 48,
    overflow: 'hidden',
  },
  innerWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    backgroundColor: 'transparent',
    height: '100%',
    paddingVertical: 0,
    paddingRight: 36,
    textAlignVertical: 'center',
    borderWidth: 0, // <-- important to remove border
    borderColor: 'transparent', // <-- safe side
    borderBottomWidth: 0, // <-- specially Android case
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
    ...styles.input,
  },
  inputAndroid: {
    ...styles.input,
  },
  placeholder: {
    color: '#999',
  },
  inputWeb: {
    ...styles.input,
    outlineStyle: 'none',
  },
});

export default SelectInput;
