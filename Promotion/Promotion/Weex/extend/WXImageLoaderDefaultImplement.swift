//
//  WXImageLoaderDefaultImplement.swift
//  SwiftWeexSample
//
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import Foundation
import WeexSDK
import Swift
import SDWebImage

class WXImageLoaderDefaultImplement:NSObject, WXImgLoaderProtocol {
    
   
    func downloadImage(withURL url: String!, imageFrame: CGRect, userInfo options: [AnyHashable : Any]! = [:], completed completedBlock: ((UIImage?, Error?, Bool) -> Void)!) -> WXImageOperationProtocol! {
        
        if (url == nil) {
            return nil;
        }
        Log("local:///")
        Log(url)
        //local:///
        if (url.hasPrefix("assets://")) {
            let image = UIImage.init(named: url.mySubString(from: 9))
          
            completedBlock(image, nil, true);
            return WXLocalImageOption()
        }
       
        var temp:String
        if (url.hasPrefix("//")) {
            temp = "https:" + url;
        } else {
            
            temp = url.replacingOccurrences(of: "http:", with: "https:");
        }
        
        
         Log("//temp//" + temp )
        let operation = SDWebImageManager.shared().downloadImage(with: URL.init(string: temp), options: SDWebImageOptions.retryFailed, progress: { (receivedSize:Int, expectedSize:Int) in
            
        }) { (image:UIImage?, error:Error?, cacheType:SDImageCacheType, finished:Bool, imageURL:URL?) in
            if (completedBlock != nil) {
                completedBlock(image, error, finished)
            }
        }
        
        return operation as? WXImageOperationProtocol
    }

}
