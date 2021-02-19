package com.wellemental.wellemental;

import android.os.Bundle; // added to resolve build issue
// import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;
import android.content.Intent;
import android.content.res.Configuration;
import com.rnfs.RNFSPackage;

public class MainActivity extends ReactActivity {

  /** Added for react-native-splash-screen configuration */
  @Override
    protected void onCreate(Bundle savedInstanceState) {
      SplashScreen.show(this, R.style.SplashTheme);
      super.onCreate(savedInstanceState);
    }
    
  /** Added for react-native-orientation-locker configuration */
  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    Intent intent = new Intent("onConfigurationChanged");
    intent.putExtra("newConfig", newConfig);
    this.sendBroadcast(intent);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "wellemental";
  }
}
