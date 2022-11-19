<h1 align="center">[React Native]wateraiInfo<br/></h1>
<h2 align="center">(iOS & Android)</h2>

<div align="center">
  <br />
  <blockquote><b>The Information App that provide users detected water level.</b></blockquote>
  <pre align="center">App Store: <a href="https://apps.apple.com/kr/app/wateraiinfo/id6444245568">wateraiInfo</a><br/>Google Play Store: <a href="https://play.google.com/store/apps/details?id=com.wateraiinfo">wateraiInfo</a></pre>
</div>

<br/>

<div align="center">
  <img src="READMEimg/appstore.png" width="30%" height="50%">
  <img src="READMEimg/homescreen.PNG" width="30%" height="50%">
  <img src="READMEimg/detailscreen.png" width="30%" height="50%">
  <br />
</div>

<br/>

### Features

* Sign Up, Sign in, Withdrawal, Or view contents in guest mode, jwt token, userAuth.
* Navigation, SplashScreen, AsyncStorage, Axios, Module-resolver, Props, Flatlist, etc.
* User can view the different contents according to usertype.

### Example

```tsx
//App.js
return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <NativeStack.Navigator screenOptions={{headerShown: false}}>
          {loginState.userToken === null ? (
            <NativeStack.Screen name="Stack" component={Stack} />
          ) : (
            <>
              <NativeStack.Screen name="Tab" component={Tab} />
              <NativeStack.Screen name="DetailStack" component={DetailStack} />
            </>
          )}
        </NativeStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
```

### Development Progress

<a href="https://github.com/sponsors/mrousavy">
  <img align="right" width="160" alt="This library helped you? Consider sponsoring!" src=".github/funding-octocat.svg">
</a>

VisionCamera is provided _as is_, I work on it in my free time.

If you're integrating VisionCamera in a production app, consider [funding this project](https://github.com/sponsors/mrousavy) and <a href="mailto:me@mrousavy.com?subject=Adopting VisionCamera at scale">contact me</a> to receive premium enterprise support, help with issues, prioritize bugfixes, request features, help at integrating VisionCamera and/or Frame Processors, and more.

<br />
