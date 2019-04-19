//
//  Constant.swift
//  Created by fby on 2019/4/18.
//

import Foundation

// 屏幕的宽度
let screenWidth = UIScreen.main.bounds.width
// 屏幕的高度
let screenHeight = UIScreen.main.bounds.height
// 适配齐刘海屏幕
let isIPhoneX: Bool = ( screenHeight == 812 || screenHeight == 896 ) ? true : false
let navHeight :CGFloat = isIPhoneX ? 88 : 64
let statusHeight:CGFloat = isIPhoneX ? 44 : 20
let tabbarHeight :CGFloat = 49
let bottomHeight : CGFloat = isIPhoneX ? 34 : 0
let screenViewHeight = screenHeight - navHeight - bottomHeight
let screenViewHeightWithTabBar = screenHeight - navHeight - bottomHeight - tabbarHeight
//server
let BASE_URL = "https://www.xxx.com/web"
//weex
//本地js调用地址
let WeexBundleFolder = String(format: "file://%@/dist/", Bundle.main.bundlePath)
//远程js调用地址
//let WeexBundleFolder = "http://192.168.6.48:8080/dist/"
//color
let navBgColor = UIColor.withHex(hexString: "#0056d3")

