package com.ncncnative;

import android.app.Activity;
import android.view.WindowManager;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

import android.util.Base64;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class AndroidNativeModule extends ReactContextBaseJavaModule {
    private static final String TAG = "AndroidNativeModule";

    private final ReactApplicationContext reactContext;

    AndroidNativeModule(ReactApplicationContext context){
        super(context);
        this.reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "AndroidNative";
    }

    @ReactMethod
    public void goBackground() {
        final Activity currentActivity = this.reactContext.getCurrentActivity();

        if (currentActivity != null) {
            currentActivity.moveTaskToBack(true);
        }
    }

    @ReactMethod
    public void exitApp() {
        android.os.Process.killProcess(android.os.Process.myPid());
    }

    @ReactMethod
    public void setBrightnessAsync(float brightnessValue,Promise promise) {
        final Activity activity = getCurrentActivity();
        if(activity == null) {
            promise.reject("SET_BRIGHTNESS_ERROR", "current activity is null");

            return;
        }

        activity.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                try {
                    WindowManager.LayoutParams lp = activity.getWindow().getAttributes();
                    lp.screenBrightness = brightnessValue;
                    activity.getWindow().setAttributes(lp); // must be done on UI thread
                    promise.resolve(null);
                } catch (Exception e) {
                    promise.reject("SET_BRIGHTNESS_ERROR", "Failed to set the current screen brightness", e);
                }
            }
        });
    }

    @ReactMethod
    public void getBrightness(Promise promise) {
        try {
            int val = Settings.System.getInt(reactContext.getContentResolver(), Settings.System.SCREEN_BRIGHTNESS);
            promise.resolve(val * 1.0f / 255);
        } catch (Settings.SettingNotFoundException e) {
            promise.reject("SET_BRIGHTNESS_ERROR", "Failed to get the current screen brightness", e);
        }
    }

    @ReactMethod
    public void hash(String message, String key, String algorithms, Promise promise) {
        try {
            Mac mac = Mac.getInstance(algorithms);
            SecretKeySpec secretKey = new SecretKeySpec(hexify(key), algorithms);
            mac.init(secretKey);

            byte[] hash = mac.doFinal(message.getBytes());

            StringBuilder stringBuilder = new StringBuilder(hash.length * 2);
            for (byte b: hash) {
                stringBuilder.append(String.format("%02x", b));
            }

            promise.resolve(stringBuilder.toString());
        } catch (Exception e) {
            Log.e("hash", "Error generating hash", e);
            promise.reject("HASH_ERROR", "Error generating hash", e);
        }
    }

    private static byte[] hexify(String hexString) {
        int len = hexString.length();
        byte[] data = new byte[len / 2];
        for (int i = 0; i < len; i += 2) {
            data[i / 2] = (byte) ((Character.digit(hexString.charAt(i), 16) << 4)
                    + Character.digit(hexString.charAt(i+1), 16));
        }
        return data;
    }
}
