import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import axios from "axios";
import DeviceInfo from "react-native-device-info";
import * as Location from "expo-location";
import { activateKeepAwake, deactivateKeepAwake } from "expo-keep-awake";
import { ZoomSlider } from "./component/zoomSlider";
import { CameraSwitchButton } from "./component/cameraSwitch";
import { FlashChangeButton } from "./component/flashButton";
import { LocationButton } from "./component/locationButton";
import { RestartButton } from "./component/restartButton";
import { ZoomUpdateButton } from "./component/zoomUpdateButton";

const App = () => {
  const camera = useRef();
  const [cameraReady, setCameraReady] = useState(false);
  const [ok, setOk] = useState(false);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [zoom, setZoom] = useState(0);
  const [receiveDuration, setReceiveDuration] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [exeEvent, setExeEvent] = useState(null);
  const [inter, setInter] = useState(null);
  const [number, setNumber] = useState(60);
  const [verified, setVerified] = useState(false);
  const [cameraAuthority, setCameraAuthority] = useState(false);
  const [micAuthority, setMicAuthority] = useState(false);
  const [geoAuthority, setGeoAuthority] = useState(false);

  const onCameraReady = () => setCameraReady(true);
  const deviceUniqueId = DeviceInfo.getUniqueIdSync();

  const getPermissions = async () => {
    const { granted } = await Camera.requestCameraPermissionsAsync();
    setOk(granted);
  };
  useEffect(() => {
    getPermissions();
  }, [cameraAuthority]);
  useEffect(() => {
    Camera.requestMicrophonePermissionsAsync();
  }, [micAuthority]);

  useEffect(() => {
    if (!!exeEvent && camera.current && cameraReady) {
      cameraExecuter();
    }
  }, [exeEvent]);

  const cameraExecuter = async () => {
    const video = await camera.current.recordAsync({
      maxDuration: receiveDuration,
      quality: Camera.Constants.VideoQuality["1080p"],
      mute: true,
    });
    let formData = new FormData();
    formData.append("file", {
      props,
    });
    formData.append("deviceUniqueId", deviceUniqueId);
    formData.append("zoom", Math.round(zoom * 100));
    axios
      .post("api", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res?.data?.ok) {
          if (res?.data?.data?.zoom !== zoom) {
            setZoom(res?.data?.data?.zoom * 0.01);
          }
          if (res?.data?.data?.duration !== receiveDuration) {
            setReceiveDuration(res?.data?.data?.duration);
          }
        } else {
          setZoom(0);
          setReceiveDuration(1);
        }
        return;
      })
      .catch((err) => console.log(err));
  };
  const takeVideo = async () => {
    await cameraExecuter();
    const ii = setInterval(() => {
      setExeEvent(new Date());
    }, Number(number) * 1000);
    setInter(ii);
  };

  const RecordingFunc = () => {
    if (isRecording === false) {
      setIsRecording(true);
      takeVideo();
      activateKeepAwake();
    } else {
      setIsRecording(false);
      clearInterval(inter);
      setExeEvent(null);
      deactivateKeepAwake();
    }
  };

  return (
    <>
      {verified === false ? (
        <View>
          {
            (setCameraAuthority(true),
            setMicAuthority(true),
            setGeoAuthority(true))
          }
          {cameraAuthority === true &&
          micAuthority === true &&
          geoAuthority === true
            ? setVerified(true)
            : null}
        </View>
      ) : (
        <Container>
          <Camera
            type={cameraType}
            style={{ flex: 1 }}
            zoom={zoom}
            flashMode={flashMode}
            ref={camera}
            onCameraReady={onCameraReady}
            ratio={"16:9"}
          />

          <LeftButtonRow>
            <FlashChangeButton
              flashMode={flashMode}
              setFlashMode={setFlashMode}
            />
            <CameraSwitchButton
              cameraType={cameraType}
              setCameraType={setCameraType}
            />
            <RestartButton />
            <MainRecording
              onPress={() => {
                RecordingFunc();
              }}
              style={{ borderColor: isRecording ? "red" : "black" }}
            >
              {isRecording ? (
                <StatusText>{`${number}`}</StatusText>
              ) : (
                <StatusText_2>RC</StatusText_2>
              )}
            </MainRecording>
          </LeftButtonRow>
          <ZoomSliderContainer>
            <ZoomSlider setZoom={setZoom} />
          </ZoomSliderContainer>
          <RightButtonRow>
            <ZoomUpdateButton zoom={zoom} deviceUniqueId={deviceUniqueId} />
          </RightButtonRow>
        </Container>
      )}
    </>
  );
};

export default App;

const Container = styled.View`
  flex: 1;
`;
const LeftButtonRow = styled.View`
  position: absolute;
  padding-left: 15px;
  padding-top: 15px;
`;
const RightButtonRow = styled.View`
  flex: 1;
  position: absolute;
  right: 15px;
  top: 15px;
`;
