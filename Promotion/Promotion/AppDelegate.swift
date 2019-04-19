//
//  AppDelegate.swift
//  Promotion
//
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import UIKit
import WeexSDK
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?


    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        configWeex()
        initData()
        return true
    }
    func initData(){
        Global.setStatusBarBackgroundColor(color: navBgColor)
        UIApplication.shared.statusBarStyle = UIStatusBarStyle.lightContent
        window = UIWindow.init(frame: UIScreen.main.bounds)
        window?.backgroundColor = UIColor.white
        let mainView:WeexViewController = WeexViewController();
        let nav = UINavigationController.init(rootViewController: mainView)
        //设置weex的main页面为初始页面
        mainView.url = URL.init(string:WeexBundleFolder + "index.js?#/main");
        window?.rootViewController = nav
        window?.makeKeyAndVisible()
    }
    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }


}
// MARK: - 各种配置加载
extension AppDelegate {
    /// 初始化weex配置
    fileprivate func configWeex() {
        WXAppConfiguration.setAppGroup("promotion")
        WXAppConfiguration.setAppName("promotion")
        
        let version = Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString")
        (version as? String).map { WXAppConfiguration.setAppVersion($0) }
        
        WXLog.setLogLevel(WXLogLevel.all)
        
        // register event module
        WXSDKEngine.registerModule("event", with: NSClassFromString("WXEventModule"))
        
        // register extra component
        WXSDKEngine.registerComponent("divExtra", with: NSClassFromString("WXDivExtraComponent"));
        // register handler
        WXSDKEngine.registerHandler(WXImageLoaderDefaultImplement(), with:NSProtocolFromString("WXImgLoaderProtocol"))
        
        //init WeexSDK
        WXSDKEngine.initSDKEnvironment()
        
        WXSDKEngine.registerComponent("map", with: WXMapComponent.self)
    }
}
