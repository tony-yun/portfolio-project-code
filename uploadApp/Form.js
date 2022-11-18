import React, { useEffect, useRef, useState } from "react";
import { Alert, Button, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { Video } from "expo-av";
import { useForm, Controller } from "react-hook-form";
import Input from "../components/Input";
import { useMutation } from "@apollo/client";
import { SEND_VIDEO } from "../queries/info/CreateInfo";
import { ReactNativeFile } from "apollo-upload-client";
import * as mime from "react-native-mime-types";
import AppLoader from "../components/AppLoader";

const UploadForm = ({ route, navigation }) => {
  const video = useRef(null);
  const [realVideo, setRealVideo] = useState();
  const [dataTransferred, setDataTransferred] = useState(false);
  const {
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors, isDirty, isSubmitting, isValid },
  } = useForm({ mode: "onChange" });

  //getVideoFromUrl
  const getFileFromUrl = async () => {
    const file = new ReactNativeFile({
      uri: route?.params?.uri,
      type: mime.lookup(route?.params?.uri) || "video/mp4",
      name: route?.params?.filename,
    });
    setRealVideo(file);
  };

  //useMutation: onCompleted
  const onCreateInfoCompleted = (data) => {
    setDataTransferred(false);
    Alert.alert("text", [
      {
        text: "text",
        onPress: () => {
          /* { ... } */
        },
      },
    ]);
  };

  //useMutation (send to server)
  const [receiveVideo] = useMutation(SEND_VIDEO, {
    onCompleted: onCreateInfoCompleted,
  });

  const onSubmit = () => {
    const { collector, river } = getValues();
    receiveVideo({
      variables: {
        file: realVideo,
        time: String(route?.params?.creationTime),
        width: route?.params?.width,
        height: route?.params?.height,
        collector: collector,
        name: name,
      },
    });
    setDataTransferred(true);
  };

  useEffect(() => {
    if (!!realVideo) {
    }
  }, [realVideo]);

  useEffect(() => {
    getFileFromUrl();
  }, []);

  return (
    <>
      <Container>
        <Top>
          <Video
            ref={video}
            style={{ alignSelf: "center", width: "100%", height: "100%" }}
            source={{
              uri: route?.params?.uri,
            }}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        </Top>

        <Bottom>
          <>
            <Title>영상 정보 미리보기:</Title>
            <View
              style={{
                borderWidth: 3,
                borderColor: "#0984e3",
                borderRadius: 10,
                marginLeft: "3%",
                marginRight: "3%",
              }}
            >
              <Title>text: </Title>
              <Title>text: {route?.params?.duration.toFixed(1)}text</Title>
            </View>
          </>
          <Title>text(필수 입력):</Title>
          <>
            <Controller
              defaultValue=""
              name="collector"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={(text) => onChange(text)}
                  value={value}
                  placeholder="text"
                  error={errors?.collector}
                  errorText={errors?.collector?.message}
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: "text.",
                },
              }}
            />
          </>
          <Title>text(필수 입력):</Title>
          <>
            <Controller
              defaultValue=""
              name="river"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  onChangeText={(text) => onChange(text)}
                  value={value}
                  placeholder="촬영 하천명"
                  error={errors?.river}
                  errorText={errors?.river?.message}
                />
              )}
              rules={{
                required: {
                  value: true,
                  message: "text.",
                },
              }}
            />
          </>
        </Bottom>
        <Button
          title="text"
          onPress={handleSubmit(onSubmit)}
          label="Submit"
          disabled={!isDirty || !isValid}
        />
      </Container>
      {dataTransferred === true ? <AppLoader /> : null}
    </>
  );
};
export default UploadForm;

const Container = styled.View`
  flex: 1;
`;
const Top = styled.View`
  flex: 1;
  background-color: black;
`;
const Bottom = styled.ScrollView`
  flex: 1;
  background-color: bisque;
`;
const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: black;
  margin: 1.5%;
`;
