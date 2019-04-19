//
//  UIKit+Extension.swift
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import UIKit
import CoreText

protocol StoryboardLoadable {}

extension StoryboardLoadable where Self: UIViewController {
    /// 提供 加载方法
    static func loadStoryboard() -> Self {
        return UIStoryboard(name: "\(self)", bundle: nil).instantiateViewController(withIdentifier: "\(self)") as! Self
    }
}

protocol NibLoadable {}

extension NibLoadable {
    static func loadViewFromNib() -> Self {
        return Bundle.main.loadNibNamed("\(self)", owner: nil, options: nil)?.last as! Self
    }
}

extension UILabel {
    
    /// 设置问答的内容
    func setSeparatedLinesFrom(_ attributedString: NSMutableAttributedString, hasImage: Bool) {
        // 通过 CoreText 创建字体
        let ctFont = CTFontCreateWithName(font.fontName as CFString, font.pointSize, nil)
        // 段落样式
        let paragraphStyle = NSMutableParagraphStyle()
        paragraphStyle.lineSpacing = 5
        // 为富文本添加属性
        attributedString.addAttributes([kCTFontAttributeName as NSAttributedString.Key: ctFont, NSAttributedString.Key.paragraphStyle: paragraphStyle], range: NSRange(location: 0, length: attributedString.length))
        // 通过 CoreText 创建 frameSetter
        let frameSetter = CTFramesetterCreateWithAttributedString(attributedString)
        // 创建路径
        let path = CGMutablePath()
        // 为路径添加一个 frame
        path.addRect(CGRect(x: 0, y: 0, width: width, height: CGFloat(MAXFLOAT)))
        // 通过 CoreText 创建 frame
        let frame = CTFramesetterCreateFrame(frameSetter, CFRange(location: 0, length: attributedString.length), path, nil)
        // 获取当前 frame 中的每一行的内容
        let lines: NSArray = CTFrameGetLines(frame)
        
        let attributedStrings = NSMutableAttributedString()
        // 遍历
        for (index, line) in lines.enumerated() {
            // 将 line 转成 CTLine
            // 获取每一行的范围
            let lineRange = CTLineGetStringRange(line as! CTLine)
            // 将 lineRange 转成 NSRange
            let range = NSRange(location: lineRange.location, length: lineRange.length)
            // 当前的内容
            let currentAttributedString = NSMutableAttributedString(attributedString: attributedString.attributedSubstring(from: range))
            if hasImage { // 如果有图片，就把第四行替换
                if index == 3 && currentAttributedString.length >= 18 {
                    replaceContent(currentAttributedString)
                }
            } else { // 如果没有图片，就把第六行替换
                if index == 5 && currentAttributedString.length >= 18 {
                    replaceContent(currentAttributedString)
                }
            }
            attributedStrings.append(currentAttributedString)
        }
        attributedText = attributedStrings
    }
    
    /// 替换内容
    private func replaceContent(_ currentAttributedString: NSMutableAttributedString) {
        currentAttributedString.replaceCharacters(in: NSRange(location: currentAttributedString.length - 8, length: 8), with: NSAttributedString(string: "...全文\n", attributes: [.foregroundColor: UIColor.blue]))
    }
    
}

extension UIView {
    
    func clearAll(){
        if self.subviews.count > 0 {
            self.subviews.forEach({ $0.removeFromSuperview()});
        }  
    }
    func removeAllChildViewControllers(){
    }
    /// x
    var x: CGFloat {
        get { return frame.origin.x }
        set(newValue) {
            var tempFrame: CGRect = frame
            tempFrame.origin.x    = newValue
            frame                 = tempFrame
        }
    }
    
    /// y
    var y: CGFloat {
        get { return frame.origin.y }
        set(newValue) {
            var tempFrame: CGRect = frame
            tempFrame.origin.y    = newValue
            frame                 = tempFrame
        }
    }
    
    /// height
    var height: CGFloat {
        get { return frame.size.height }
        set(newValue) {
            var tempFrame: CGRect = frame
            tempFrame.size.height = newValue
            frame                 = tempFrame
        }
    }
    
    /// width
    var width: CGFloat {
        get { return frame.size.width }
        set(newValue) {
            var tempFrame: CGRect = frame
            tempFrame.size.width  = newValue
            frame = tempFrame
        }
    }
    
    /// size
    var size: CGSize {
        get { return frame.size }
        set(newValue) {
            var tempFrame: CGRect = frame
            tempFrame.size        = newValue
            frame                 = tempFrame
        }
    }
    
    /// centerX
    var centerX: CGFloat {
        get { return center.x }
        set(newValue) {
            var tempCenter: CGPoint = center
            tempCenter.x            = newValue
            center                  = tempCenter
        }
    }
    
    /// centerY
    var centerY: CGFloat {
        get { return center.y }
        set(newValue) {
            var tempCenter: CGPoint = center
            tempCenter.y            = newValue
            center                  = tempCenter;
        }
    }
    
    
   
}

protocol RegisterCellFromNib {}

extension RegisterCellFromNib {
    
    static var identifier: String { return "\(self)" }
    
    static var nib: UINib? { return UINib(nibName: "\(self)", bundle: nil) }
}

extension UITableView {
    /// 注册 cell 的方法
    func ym_registerCell<T: UITableViewCell>(cell: T.Type) where T: RegisterCellFromNib {
        if let nib = T.nib { register(nib, forCellReuseIdentifier: T.identifier) }
        else { register(cell, forCellReuseIdentifier: T.identifier) }
    }
    
    /// 从缓存池池出队已经存在的 cell
    func ym_dequeueReusableCell<T: UITableViewCell>(indexPath: IndexPath) -> T where T: RegisterCellFromNib {
        return dequeueReusableCell(withIdentifier: T.identifier, for: indexPath) as! T
    }
    
    func viewDisplayWithMsg(message:String , rowCount:Int){
        if (rowCount == 0) {
            // 没有数据的时候，UILabel的显示样式
            let messageLabel = UILabel()
            
            messageLabel.text = message;
//            messageLabel.font = UIFont.preferredFont(forTextStyle: .body)
            messageLabel.font = UIFont.systemFont(ofSize: 14)
            messageLabel.textColor = navBgColor
            messageLabel.textAlignment = .center;
            
            messageLabel.sizeToFit()
            self.backgroundView = messageLabel;
            self.separatorStyle = .none;
        } else {
            self.backgroundView = nil;
            self.separatorStyle = .singleLine;
        }
        
    }
}

extension UICollectionView {
    /// 注册 cell 的方法
    func ym_registerCell<T: UICollectionViewCell>(cell: T.Type) where T: RegisterCellFromNib {
        if let nib = T.nib { register(nib, forCellWithReuseIdentifier: T.identifier) }
        else { register(cell, forCellWithReuseIdentifier: T.identifier) }
    }
    
    /// 从缓存池池出队已经存在的 cell
    func ym_dequeueReusableCell<T: UICollectionViewCell>(indexPath: IndexPath) -> T where T: RegisterCellFromNib {
        return dequeueReusableCell(withReuseIdentifier: T.identifier, for: indexPath) as! T
    }
    
    /// 注册头部
    func ym_registerSupplementaryHeaderView<T: UICollectionReusableView>(reusableView: T.Type) where T: RegisterCellFromNib {
        // T 遵守了 RegisterCellOrNib 协议，所以通过 T 就能取出 identifier 这个属性
        if let nib = T.nib {
            register(nib, forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: T.identifier)
        } else {
            register(reusableView, forSupplementaryViewOfKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: T.identifier)
        }
    }
    
    /// 获取可重用的头部
    func ym_dequeueReusableSupplementaryHeaderView<T: UICollectionReusableView>(indexPath: IndexPath) -> T where T: RegisterCellFromNib {
        return dequeueReusableSupplementaryView(ofKind: UICollectionView.elementKindSectionHeader, withReuseIdentifier: T.identifier, for: indexPath) as! T
    }
}

extension UIImageView {
    /// 设置图片圆角
    func circleImage() {
        /// 建立上下文
        UIGraphicsBeginImageContextWithOptions(self.frame.size, false, 0)
        /// 获取当前上下文
        let ctx = UIGraphicsGetCurrentContext()
        /// 添加一个圆，并裁剪
        ctx?.addEllipse(in: self.bounds)
        ctx?.clip()
        /// 绘制图像
        self.draw(self.bounds)
        /// 获取绘制的图像
        let image = UIGraphicsGetImageFromCurrentImageContext()
        /// 关闭上下文
        UIGraphicsEndImageContext()
        DispatchQueue.global().async {
            self.image = image
        }
    }
    
}

extension UIImage {
    
    convenience init(view: UIView) {
        
        UIGraphicsBeginImageContextWithOptions(view.bounds.size, view.isOpaque, 0.0)
        view.drawHierarchy(in: view.bounds, afterScreenUpdates: false)
        let image = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        self.init(cgImage: (image?.cgImage)!)
        
    }
}

extension UIColor {
    
    //        self.init(red: <#T##CGFloat#>, green: <#T##CGFloat#>, blue: <#T##CGFloat#>, alpha: <#T##CGFloat#>)
//    convenience init(r: CGFloat, g: CGFloat, b: CGFloat, alpha: CGFloat = 1.0) {
//        if #available(iOS 10.0, *) {
//            self.init(displayP3Red: r / 255.0, green: g / 255.0, blue: b / 255.0, alpha: alpha)
//        } else {
//            // Fallback on earlier versions
//        }
//    }
    
//    /// 背景灰色 f8f9f7
//    class func globalBackgroundColor() -> UIColor {
//        return UIColor(r: 248, g: 249, b: 247)
//    }
//
//    /// 背景红色
//    class func globalRedColor() -> UIColor {
//        return UIColor(r: 196, g: 73, b: 67)
//    }
//
//    /// 字体蓝色
//    class func blueFontColor() -> UIColor {
//        return UIColor(r: 72, g: 100, b: 149)
//    }
//
//    /// 背景灰色 132
//    class func grayColor132() -> UIColor {
//        return UIColor(r: 132, g: 132, b: 132)
//    }
//
//    /// 背景灰色 232
//    class func grayColor232() -> UIColor {
//        return UIColor(r: 232, g: 232, b: 232)
//    }
//
//    /// 夜间字体背景灰色 113
//    class func grayColor113() -> UIColor {
//        return UIColor(r: 113, g: 113, b: 113)
//    }
//
//    /// 夜间背景灰色 37
//    class func grayColor37() -> UIColor {
//        return UIColor(r: 37, g: 37, b: 37)
//    }
//
//    /// 灰色 210
//    class func grayColor210() -> UIColor {
//        return UIColor(r: 210, g: 210, b: 210)
//    }
    
    static func withHex(hexString hex: String, alpha:CGFloat = 1) -> UIColor {
        // 去除空格等
        var cString: String = hex.trimmingCharacters(in: NSCharacterSet.whitespacesAndNewlines).uppercased()
        // 去除#
        if (cString.hasPrefix("#")) {
            cString = (cString as NSString).substring(from: 1)
        }
        // 必须为6位
        if (cString.count != 6) {
            return UIColor.gray
        }
        // 红色的色值
        let rString = (cString as NSString).substring(to: 2)
        let gString = ((cString as NSString).substring(from: 2) as NSString).substring(to: 2)
        let bString = ((cString as NSString).substring(from: 4) as NSString).substring(to: 2)
        // 字符串转换
        var r:CUnsignedInt = 0, g:CUnsignedInt = 0, b:CUnsignedInt = 0
        Scanner(string: rString).scanHexInt32(&r)
        Scanner(string: gString).scanHexInt32(&g)
        Scanner(string: bString).scanHexInt32(&b)
        
        return UIColor(red: CGFloat(r) / 255.0, green: CGFloat(g) / 255.0, blue: CGFloat(b) / 255.0, alpha: alpha)
    }
    
    /**
     获取颜色，通过16进制数值
     - parameter hexInt : 16进制数值
     - parameter alpha  : 透明度
     - returns : 颜色
     */
    static func withHex(hexInt hex:Int32, alpha:CGFloat = 1) -> UIColor {
        let r = CGFloat((hex & 0xff0000) >> 16) / 255
        let g = CGFloat((hex & 0xff00) >> 8) / 255
        let b = CGFloat(hex & 0xff) / 255
        return UIColor(red: r, green: g, blue: b, alpha: alpha)
    }
    
}

extension UIButton {
    
    
    struct RuntimeKey {
        static let btnKey = UnsafeRawPointer.init(bitPattern: "BTNKey".hashValue)
    }
}

extension UIScrollView {
    
    func  captureView() -> UIImage {
        let scrollView = self
        let savedContentOffset = scrollView.contentOffset
        let savedFrame = scrollView.frame
     
      

        //            rect.size = scrollView.contentSize
       
        scrollView.contentOffset = CGPoint.zero
//        scrollView.frame = CGRect(x:0, y:0, width: scrollView.contentSize.width, height: scrollView.contentSize.height)
        
        scrollView.frame.size.height = scrollView.contentSize.height
        UIGraphicsBeginImageContextWithOptions(scrollView.size,false,UIScreen.main.scale)
          let context = UIGraphicsGetCurrentContext()
        scrollView.layer.render(in: context!)
      
        let img = UIGraphicsGetImageFromCurrentImageContext();
        
        scrollView.contentOffset = savedContentOffset;
        scrollView.frame = savedFrame;

        UIGraphicsEndImageContext();
        return img!;
        
    }
    
}

extension UINavigationBar {
    
    func hideBottomHairline() {
        let navigationBarImageView = hairlineImageViewInNavigationBar(view: self)
        navigationBarImageView!.isHidden = true
    }
    
    func showBottomHairline() {
        let navigationBarImageView = hairlineImageViewInNavigationBar(view: self)
        navigationBarImageView!.isHidden = false
    }
    
    private func hairlineImageViewInNavigationBar(view: UIView) -> UIImageView? {
        if (view is UIImageView) && view.bounds.height <= 1.0 {
            return (view as! UIImageView)
        }
        
        let subviews = (view.subviews as [UIView])
        for subview: UIView in subviews {
            if let imageView: UIImageView = hairlineImageViewInNavigationBar(view: subview) {
                return imageView
            }
        }
        
        return nil
    }
    
}

extension UITableView {
    
    func autoShowEmptyView(dataSourceCount:Int?){
        self.autoShowEmptyView(title: nil, image: nil, dataSourceCount: dataSourceCount)
    }
    
    func autoShowEmptyView(title:String?,image:UIImage?,dataSourceCount:Int?){
        
        guard let count = dataSourceCount else {
            let empty = EmptyView.init(frame: self.bounds)
            empty.setEmpty(image: image ?? UIImage.init(named: "nodata_nothing") , title: title ?? "暂无此内容")
            self.backgroundView = empty
            return
        }
        
        if count == 0 {
            let empty = EmptyView.init(frame: self.bounds)
            empty.setEmpty(image: image ?? UIImage.init(named: "nodata_nothing") , title: title ?? "暂无此内容")
            self.backgroundView = empty
        } else {
            self.backgroundView = nil
        }
        
    }
    
    func autoShowErrorView(dataSourceCount:Int?){
        self.autoShowErrorView(title: nil, image: nil, dataSourceCount: dataSourceCount)
    }
    
    func autoShowErrorView(title:String?,image:UIImage?,dataSourceCount:Int?){
        
        guard let count = dataSourceCount else {
            let empty = EmptyView.init(frame: self.bounds)
            empty.setEmpty(image: image , title: title!)
            self.backgroundView = empty
            return
        }
        
        if count == 0 {
            let empty = EmptyView.init(frame: self.bounds)
            empty.setEmpty(image: image ?? UIImage.init(named: "error_refresh"))
            empty.setEmptyBtn(image: UIImage.init(named: "error_refresh_icon"),title:title ?? "重新加载")
            empty.refreshBtn.addTarget(self, action: #selector(loadRefresh),for : .touchUpInside)
            self.backgroundView = empty
        } else {
            self.backgroundView = nil
        }
        
    }
    
    @objc func loadRefresh(){

    }
    
}



