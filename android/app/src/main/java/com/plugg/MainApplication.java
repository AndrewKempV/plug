package com.plugg;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import me.jhen.devsettings.DevSettingsPackage;
import com.amazonaws.RNAWSCognitoPackage;
import com.proyecto26.inappbrowser.RNInAppBrowserPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.cardio.RNCardIOPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.horcrux.svg.SvgPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.github.reactnativecommunity.location.RNLocationPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.airbnb.android.react.lottie.LottiePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.mapbox.rctmgl.RCTMGLPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() { return BuildConfig.DEBUG; }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFetchBlobPackage(),
            new RNDateTimePickerPackage(),
            new PickerPackage(),
            new DevSettingsPackage(),
            new RNAWSCognitoPackage(),
            new RNInAppBrowserPackage(),
            new RNDeviceInfo(),
            new RNCardIOPackage(),
            new VectorIconsPackage(),
            new SvgPackage(),
            new ReanimatedPackage(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
            new ReactNativePushNotificationPackage(),
            new RNLocationPackage(),
            new SplashScreenReactPackage(),
            new OrientationPackage(),
            new ReactNativeLocalizationPackage(),
            new LottiePackage(),
            new AsyncStoragePackage(),
            new RCTMGLPackage()
            /*
              new RNInAppBrowserPackage(),
            */
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
