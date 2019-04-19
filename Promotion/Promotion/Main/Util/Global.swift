//
//  Global.swift
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import UIKit
import SVProgressHUD

class Global: NSObject {
    
    static func getUserColor(increase:Double=1) ->(UIColor){
        var color = navBgColor
        return color
    }
    static func setStatusBarBackgroundColor(color : UIColor) {
        let statusBarWindow : UIView = UIApplication.shared.value(forKey: "statusBarWindow") as! UIView
        let statusBar : UIView = statusBarWindow.value(forKey: "statusBar") as! UIView
        if statusBar.responds(to:#selector(setter: UIView.backgroundColor)) {
            statusBar.backgroundColor = color
        }
    }
   
}
