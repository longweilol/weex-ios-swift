//
//  ViewController.swift
//  SwiftWeexSample
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import UIKit
import WeexSDK

class WeexViewController: UIViewController,UIGestureRecognizerDelegate {
    var instance:WXSDKInstance?;
    var weexView = UIView()
    var contentView = UIView()
    var weexHeight:CGFloat?;
    var top:CGFloat?;
    var url:URL?;
    var options:Dictionary<String, Any>=["1":"1"]
    var wxHeight:CGFloat = screenHeight - bottomHeight
    override func viewDidLoad() {
        super.viewDidLoad()
        self.view.backgroundColor = navBgColor
        contentView.backgroundColor = UIColor.white
        contentView.frame = CGRect(x: 0, y: statusHeight, width: screenWidth, height: screenHeight)
        self.view.addSubview(contentView)
        self.navigationController?.interactivePopGestureRecognizer?.delegate = self
        self.navigationController?.navigationBar.isHidden = true
        render()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    // 当视图将要消失时调用该方法
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
    }
    // 当时图已经消失时调用该方法
    override func viewDidDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
    }
    deinit {
        print(#function)
        
        if instance != nil {
            instance!.destroy()
        }
        self.navigationController?.interactivePopGestureRecognizer?.delegate = nil;
    }
    
    func render(){
        if instance != nil {
            instance!.destroy()
        }
        weak var weakSelf = self;
        instance = WXSDKInstance();
        instance!.viewController = weakSelf
        let width = self.view.frame.size.width
        
        instance!.frame = CGRect(x: 0, y: 0, width: width, height: wxHeight-statusHeight)
        
        instance?.onCreate = {
            (view:UIView?)-> Void in
            weakSelf!.weexView.removeFromSuperview()
            weakSelf!.weexView = view!;
            self.contentView.addSubview((weakSelf?.weexView)!)
            UIAccessibility.post(notification: UIAccessibility.Notification.screenChanged, argument: weakSelf!.weexView)
        }
        
        instance?.onFailed = {
            (error:Error?)-> Void in
            
            print("faild at error: %@", error!)
        }
        
        instance?.renderFinish = {
            (view:UIView?)-> Void in
            print("render finish")
        }
        instance?.updateFinish = {
            (view:UIView?)-> Void in
            print("update finish")
        }
        
        options["bundleUrl"]=url?.absoluteString;
//        options["params"] = ["key1":"value1111","key2":"value222"]
        options["isLogin"] =  UserDefaults.standard.bool(forKey: "login")
        instance!.render(with: url, options: options, data: nil)
        Log(instance)
    }
    override func viewWillAppear(_ animated: Bool) {
       super.viewWillAppear(animated)
       initLogin();
        
    }
    func initLogin(){
        let islogin = UserDefaults.standard.bool(forKey: "login")
        instance!.fireGlobalEvent("login",params: ["ok":islogin])
    }
}

