package com.ncncnative

import android.app.Application
import android.database.CursorWindow
import androidx.appcompat.app.AppCompatDelegate
import androidx.multidex.MultiDexApplication
import android.util.Log

import co.ab180.airbridge.reactnative.AirbridgeRN
import com.bugsnag.android.Bugsnag
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
import com.microsoft.codepush.react.CodePush
import com.zoyi.channel.plugin.android.ChannelIO

class MainApplication : MultiDexApplication(), ReactApplication {
    override val reactNativeHost: ReactNativeHost = object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> = PackageList(this).packages.apply {
            add(AndroidNativePackage())
            add(RNAdPopcornRewardPackage())
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED

        override fun getJSBundleFile(): String? = CodePush.getJSBundleFile()
    }

    override val reactHost: ReactHost
        get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

    override fun onCreate() {
        super.onCreate()

        ChannelIO.initialize(this)
        Bugsnag.start(this)
        SoLoader.init(this,  /* native exopackage */false)
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            // If you opted-in for the New Architecture, we load the native entry point for this app.
            load()
        }

        // react-native-async-storage
        // Row too big to fit into CursorWindow requiredPos=0, totalRows=1 에러
        // CursorWindow size 2MB -> 100MB
        try {
            val field = CursorWindow::class.java.getDeclaredField("sCursorWindowSize")
            field.isAccessible = true
            field[null] = 100 * 1024 * 1024 // 100MB
        } catch (e: Exception) {
            if (BuildConfig.DEBUG) {
                e.printStackTrace()
            }
        }

        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
        AirbridgeRN.init(this, "ncnc", "a155353786bd4849b61d9deb4352c065")
    }
}