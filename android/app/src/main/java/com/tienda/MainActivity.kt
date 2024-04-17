package com.tienda


import android.view.KeyEvent
import com.github.kevinejohn.keyevent.KeyEventModule

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "Tienda"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

      
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        KeyEventModule.getInstance().onKeyDownEvent(keyCode, event)
        super.onKeyDown(keyCode, event)
        return true
    }

    override fun onKeyUp(keyCode: Int, event: KeyEvent?): Boolean {
        KeyEventModule.getInstance().onKeyUpEvent(keyCode, event)
        super.onKeyUp(keyCode, event)
        return true
    }

    override fun onKeyMultiple(keyCode: Int, repeatCount: Int, event: KeyEvent?): Boolean {
        KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event)
        super.onKeyMultiple(keyCode, repeatCount, event)
        return true
    }

}
