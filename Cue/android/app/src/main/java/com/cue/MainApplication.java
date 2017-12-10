package com.cue;

import android.app.Application;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import im.shimo.react.prompt.RNPromptPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.reactnativenavigation.NavigationApplication;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  @Override
  public boolean isDebug() {
    return BuildConfig.DEBUG;
  }

  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
      new MainReactPackage(),
      new RNPromptPackage(),
      new RNDeviceInfo(),
      new LinearGradientPackage(),
      new ReactMaterialKitPackage(),
      new FBSDKPackage(mCallbackManager)
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    AppEventsLogger.activateApp(this);
  }
}
