import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

class NoticeListScreen extends Component {
  state = {
    loading: true,
    notices: [],
    categories: ["공지사항"],
    selectedCategory: null,
  };

  componentDidMount() {
    this.fetchNotices();
  }

  fetchNotices = async () => {
    try {
      const response = await fetch("https://api.example.com/notices");

      const json = await response.json();

      this.setState({ notices: json.data.notice, loading: false });
    } catch (e) {
      console.warn("공지사항 불러오기 실패", e);

      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, notices, selectedCategory } = this.state;

    const filtered = selectedCategory
      ? notices.filter((n) => n.Category === selectedCategory)
      : notices;

    return (
      <View style={styles.container}>
        <ScrollView horizontal style={styles.categoryScroll}>
          {this.state.categories.map((cat, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categorySelected,
              ]}
              onPress={() =>
                this.setState({
                  selectedCategory: selectedCategory === cat ? null : cat,
                })
              }
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : filtered.length === 0 ? (
          <Text style={styles.empty}>공지사항이 없습니다.</Text>
        ) : (
          filtered.map((notice, idx) => (
            <TouchableOpacity key={idx} style={styles.item}>
              <Text style={styles.title}>{notice.Title}</Text>
              <Text style={styles.date}>
                {notice.RegDatetime?.slice(0, 10)}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  }
}

export default NoticeListScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  categoryScroll: { marginBottom: 10 },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  categorySelected: { backgroundColor: "#000", borderColor: "#000" },
  categoryText: { fontSize: 13 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 14, fontWeight: "500" },
  date: { fontSize: 12, color: "#888" },
  empty: { textAlign: "center", marginTop: 50 },
});
