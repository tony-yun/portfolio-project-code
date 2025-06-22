import {Modal, StyleSheet, View} from 'react-native';
import React from 'react';
import {BLACK, CLOUD_COLOR} from '@/assets/color/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface RefreshCheckModalProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const RefreshCheckModal: React.FC<RefreshCheckModalProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Ionicons name="checkmark-sharp" size={20} color={BLACK} />
        </View>
      </View>
    </Modal>
  );
};

export default RefreshCheckModal;

const styles = StyleSheet.create({
  ...
});
