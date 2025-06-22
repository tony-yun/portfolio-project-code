import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import RNPickerSelect, {Item} from 'react-native-picker-select';
import {
  CLOUD_COLOR,
  DEEP_DARK,
  YOUTUBE_PLACEHOLDER,
  YOUTUBE_SEARCH,
} from '@/assets/color/colors';
import Entypo from 'react-native-vector-icons/Entypo';

interface CustomSettingProps {
  title: string;
  option: string;
  setOption: (value: string) => void;
  items: Item[];
  placeholder: string;
}

const CustomSettingView: React.FC<CustomSettingProps> = ({
  title,
  option,
  setOption,
  items,
  placeholder,
}) => {
  const selectIcon = () => {
    return <Entypo name="select-arrows" size={24} color="gray" />;
  };

  return (
    <>
      <View style={styles.sortView}>
        <Text style={styles.text}>{title}</Text>
        <RNPickerSelect
          value={option}
          onValueChange={value => setOption(value)}
          items={items}
          style={pickerSelectStyles}
          placeholder={{label: `${placeholder}`}}
          Icon={selectIcon}
        />
      </View>
      <View style={styles.divider} />
    </>
  );
};

export default CustomSettingView;

const styles = StyleSheet.create({
  ...
});

const pickerSelectStyles = {
  inputIOS: {
   ...
  },
  inputAndroid: {
 ...
  },
  iconContainer: {
...
  },
};
