# 프로젝트 규칙

본 프로젝트는 [Code & Naming Convention](https://www.notion...) 프론트엔드 컨벤션을 준수합니다.

## 0.🚢 컴포넌트

### 0.0 기본 룰

components/ 는 아래 규칙에 따라 운용됩니다.

- components/A: A 스크린에서 사용되는 컴포넌트 모음. 반드시 A 스크린 내에서만 사용되는 컴포넌트로만 구성되어 있음
- components/public/: 특정 스크린에서만 사용되는 것이 아닌 전역적으로 사용될 수 있는 컴포넌트 모음.

### 0.1 Text / TextInput 🚫

니콘내콘 앱은 [fontName](https://...)를 기본 폰트로 사용하고 있습니다.

따라서 기본 설정이 적용된 `NcncText`, `NcncTextInput` 컴포넌트를 <u>**반드시 사용해야 합니다.**</u>

### 0.2 FlatList ⚠️

- 바텀 시트 등 `GestureHandlerRootView` 아래에 위치하는 `FlatList`는 반드시 `react-native-gesture-handler`에서 가져와야 합니다.

```sh
import { FlatList } from 'react-native-gesture-handler'
```

- 스크롤 이벤트 추적 필요 시 `NcncFlatList` 를 사용합니다.

### 0.3 TouchableOpacity 🚫

/public 경로 아래의 `Button`및 `FixedButton` 컴포넌트를 사용해야 합니다. 두 컴포넌트의 차이점은 `FixedButton`안에 기재되어 있습니다.

## 1.🎨 디자인 룰

### 1.1 Skeleton

스켈레톤 색상은 gray200 을 사용합니다.

### 1.2 Icon

svg형식의 아이콘은 `NdsIcon` 컴포넌트를 사용합니다.

## 2.👮🏼‍♂️ 타입

### 2.1 null

null 타입이 포함될 시 `global.types.ts`에 구현된 `Nullable`을 사용해야 합니다.

```sh
# 예시
username: Nullable<string>
```

### 2.2 정규 표현식

`regex` 파일에서 생성 및 재사용합니다.

## 3.⚠ 에러

🚫본 프로젝트에서는 `any`타입의 사용을 금지합니다🚫

### 3.1 에러 로깅

본 프로젝트는 에러 로깅을 위해 [BugSnag](https://app.bugsnag.com...)를 사용하고 있습니다.

따라서 `error-helper.ts`의 `recordLog`및 `recordError`를 사용하여 적절한 위치에서 로깅을 진행해주셔야 합니다.

```sh
# 예시
const onPressUsernameLogin = async () => {
    recordLog('[Login] onPressUsernameLogin') #[파일명] 함수명
    try {
      ...
    } catch (err) {
      ...
      handleError(err, errorMessage) # 유저한테 표시되는 에러 핸들링
      recordError(err, '[Login] onPressUsernameLogin Error') #[파일명] 함수명 Error
    }
}
```

## 4.🛠️ 빌드

### 4.1 iOS Simulator

Apple Silicon 이 탑재된 맥북에서, iOS Simulator의 architecture는 `arm64`입니다.

## 5. 🚥 정책

### 5.1 유저 권한 요청

유저 권한 요청 시 반드시 필수 권한만 요청합니다. (앱 버전 6.5.3 부터 실행)

필수 권한은 아래와 같습니다:

- 사진 및 동영상
- 알림
- 앱 트래킹 (AppTrackingTransparency, iOS Only)

하기 권한이 완전히 제거 되었습니다:

- 위치 권한
