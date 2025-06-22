import { API_KEY } from "@/utils/constants";
import { Alert } from "react-native";

export const fetchMovies = async (category: string, sortOption: string) => {
  try {
    let url = `...`;
    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    let sortedData = [...data.results];

    switch (sortOption) {
      case "date_desc":
        sortedData.sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
        );
        break;
      case "date_asc":
        sortedData.sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
        );
        break;
      case "rating":
        sortedData.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "none":
        break;
    }
    return sortedData;
  } catch (error) {
    Alert.alert("데이터를 불러오는 중 오류가 발생했습니다.", error);
    return [];
  }
};

export const fetchSearchMovies = async (query: string, sortOption: string) => {
  try {
    let url = `...`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    let sortedData = [...data.results];

    switch (sortOption) {
      case "date_desc":
        sortedData.sort(
          (a, b) =>
            new Date(b.release_date).getTime() -
            new Date(a.release_date).getTime()
        );
        break;
      case "date_asc":
        sortedData.sort(
          (a, b) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime()
        );
        break;
      case "rating":
        sortedData.sort((a, b) => b.vote_average - a.vote_average);
        break;
      case "none":
        break;
    }
    return sortedData;
  } catch (error) {
    Alert.alert("데이터를 불러오는 중 오류가 발생했습니다.", error);
    return [];
  }
};

export const fetchDetailMovies = async (movieId: number) => {
  let url = `...`;
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  return data;
};

export const fetchfavoriteMovies = async (userFavoriteArray: number[]) => {
  try {
    const fetchPromises = userFavoriteArray.map((movieId) => {
      const url = `...`;
      return fetch(url).then((response) => response.json());
    });
    const results = await Promise.all(fetchPromises);
    return results;
  } catch (error) {
    Alert.alert("영화 정보를 가져오는 데 실패했습니다:", error);
    return [];
  }
};
