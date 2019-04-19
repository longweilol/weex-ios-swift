//
//  WXEventModule.swift
//  SwiftWeexSample
//
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import Foundation
import SDWebImage
import SVProgressHUD

public extension WXEventModule {
 
    @objc func openURL(_ url:String,title:String = "" ,model:String = "push") {
        var newUrl:String = url;
        if url.hasPrefix("//") {
            newUrl = String.init(format: "http://%@", url);
        }else if !url.hasPrefix("http") {
            newUrl = (URL.init(string: url, relativeTo: weexInstance.scriptURL)!.absoluteString)
        }else{
            newUrl = String.init(format: WeexBundleFolder, url);
        }
        let controller:WeexViewController = WeexViewController();
        
        controller.url = URL.init(string: newUrl)
        controller.title = title;
        if model == "push" {
            weexInstance.viewController.navigationController?.pushViewController(controller, animated:true)
        }else{
            weexInstance.viewController.navigationController?.present(controller, animated: true, completion: nil)
        }

    }

    @objc func fireNativeGlobalEvent(event:String,callback:WXModuleCallback){
        weexInstance.fireGlobalEvent(event,params: ["eventParam":"eventValue"])
        callback(["ok":true]);
    }
    @objc func isLoginGlobalEvent(_ event:String,isLogin:Bool){
        UserDefaults.standard.set(isLogin, forKey: event)
        NotificationCenter.default.post(name: NSNotification.Name.init(rawValue: "login"), object: "")
    }
  
    @objc  func dismissViewController(_ event:String){
        if (weexInstance.viewController.navigationController == nil) {
            weexInstance.viewController.dismiss(animated: true, completion: nil);
        } else {
           weexInstance.viewController.navigationController?.popViewController(animated: true)
        }
    }

    func shareNativeActivity(url:String,txt:String,img:UIImage?){
        
    }
    @objc func openWebView(_ url:String , title:String){
        let vc=WebViewController()
        vc.url=url
        if let webURL:URL = URL(string: url) {
            UIApplication.shared.openURL(webURL)
        }
      
    }
    @objc func openLocalWebView(_ url:String , title:String){
        let vc=WebViewController()
        vc.url=url
        weexInstance.viewController.navigationController?.present(vc, animated: true, completion: nil)
        
    }
    @objc func openController(_ name:String){
        if let view = swiftClassFromString(className: name) {
            weexInstance.viewController.navigationController?.pushViewController(view, animated: true)
        }
    }
    func swiftClassFromString(className: String) -> UIViewController? {
        return nil;
    }
    
    
}
