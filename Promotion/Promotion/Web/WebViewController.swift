//
//  WebViewController.swift
//  BB8IOS
//
//  Created by peak on 2018/6/22.
//  Copyright © 2018年 51bb8. All rights reserved.
//

import UIKit
import WebKit
import SVProgressHUD

class WebViewController: UIViewController {
    
    @IBOutlet weak var webView: WebView!
    
    var url:String!
    
    var isCanOpenSafari : Bool = true
    
    var titleStr: String?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.titleStr = self.title
        
        self.automaticallyAdjustsScrollViewInsets = false
        
        
        // 配置webView样式
        var config = WkwebViewConfig()
        config.isShowScrollIndicator = false
        config.isProgressHidden = false
        webView.delegate = self
        
        // 加载普通URL
        webView.webConfig = config
        webView.webloadType(self, .URLString(url: url))
        
        // 加载本地URL
        //        config.scriptMessageHandlerArray = ["valueName"]
        //        webView.webConfig = config
        //        webView.delegate = self
        //        webView.webloadType(self, .HTMLName(name: "test"))
        //
        // POST加载
        //        let mobile = ""
        //        let pop = ""
        //        let auth = ""
        //        let param = ["mobile":"\(mobile)","pop":"\(pop)","auth":"\(auth)"];
        //        webView.webConfig = config
        //        webView.webloadType(self, .POST(url: "http://xxxxx", parameters: param))
        
        
        
        
    }
//    @IBAction func refreshClick(_ sender: UIBarButtonItem) {
//        webView.reload()
//    }
    
    func  initUseragent(){
        //
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated) // 在所有的 viewWill/Did 方法中，调用 super。
        SVProgressHUD.dismiss()
    }
    
    
    func addOpenSafariButton(){
        //TODO
       self.navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Safari", style: .plain, target: self, action: #selector(rightBarButtonItemClicked))
    }
    

    
    @objc func rightBarButtonItemClicked (_ sender: UIBarButtonItem){
        
        if let url = URL(string: self.url) {
            if #available(iOS 10.0, *) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            } else {
                // Fallback on earlier versions
            }
        }
      
    }
    
}

extension WebViewController:WKWebViewDelegate{
    
    func webViewUserContentController(_ scriptMessageHandlerArray: [String], didReceive message: WKScriptMessage) {
        print(message.body)
    }
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("开始加载")
        
        SVProgressHUD.show()
    }
    
}


extension WebViewController: WKNavigationDelegate {
    // 网页加载完成，开始监听内容高度变化,不断更新高度，增大滚动区域
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
       
        SVProgressHUD.dismiss()
    }
}
