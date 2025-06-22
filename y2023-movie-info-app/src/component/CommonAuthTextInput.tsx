import {
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  CLOUD_COLOR,
  YOUTUBE_PLACEHOLDER,
  YOUTUBE_SEARCH,
} from '@/assets/color/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

type CommonAuthTextInputProps = {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  isPassword?: boolean;
  unEditable?: boolean;
} & TextInputProps;

const CommonAuthTextInput: React.FC<CommonAuthTextInputProps> = ({
  value,
  setValue,
  placeholder,
  isPassword,
  unEditable,
  ...textInputProps
}) => {
  const [secureText, setSecureText] = useState(isPassword);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[
          styles.loginTextinput,
          unEditable ? styles.uneditableText : null,
        ]}
        placeholder={placeholder}
        placeholderTextColor={YOUTUBE_PLACEHOLDER}
        value={value}
        onChangeText={setValue}
        secureTextEntry={isPassword ? secureText : false}
        editable={!unEditable}
        {...textInputProps}
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setSecureText(!secureText)}>
          <Ionicons
            name={secureText ? 'eye-off' : 'eye'}
            size={20}
            color={YOUTUBE_PLACEHOLDER}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CommonAuthTextInput;

const styles = StyleSheet.create({
 ...
});
