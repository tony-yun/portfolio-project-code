import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";

export default class ActionButton extends Component {
  state = { active: false };
  anim = new Animated.Value(0);

  toggle = () => {
    const toValue = this.state.active ? 0 : 1;
    Animated.spring(this.anim, { toValue, useNativeDriver: false }).start();
    this.setState({ active: !this.state.active });
  };

  render() {
    const scale = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });
    const rotate = this.anim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "45deg"],
    });

    return (
      <View style={styles.container}>
        {this.state.active && (
          <TouchableOpacity style={styles.overlay} onPress={this.toggle} />
        )}
        <Animated.View
          style={[styles.button, { transform: [{ scale }, { rotate }] }]}
        >
          <TouchableOpacity onPress={this.toggle}>
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </Animated.View>
        {this.state.active && (
          <View style={styles.actions}>
            {/* 예시 액션 버튼 */}
            <TouchableOpacity style={styles.actionItem}>
              <Text>Action 1</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const SIZE = 56;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: {
    fontSize: 24,
    color: "#fff",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  actions: {
    position: "absolute",
    bottom: SIZE + 20,
    right: 0,
  },
  actionItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    elevation: 3,
  },
});
