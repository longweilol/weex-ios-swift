//
//  Foundation+Extension.swift
//  News
//
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import UIKit
import Darwin


extension String {
    /// 计算文本的高度
    func textHeight(fontSize: CGFloat, width: CGFloat) -> CGFloat {
        return self.boundingRect(with: CGSize(width: width, height: CGFloat(MAXFLOAT)), options: .usesLineFragmentOrigin, attributes: [.font: UIFont.systemFont(ofSize: fontSize)], context: nil).size.height
    }
    
    func textWidth(font:UIFont) -> CGFloat{
        return  NSString(string: self).size(withAttributes: [NSAttributedString.Key.font: font]).width
    }
    
   

    /// 截取字符串
    ///
    /// - Parameter index: 截取从index位开始之前的字符串
    /// - Returns: 返回一个新的字符串
    func mySubString(to index: Int) -> String {
        return String(self[..<self.index(self.startIndex, offsetBy: index)])
    }
    /// 截取字符串
    ///
    /// - Parameter index: 截取从index位开始到末尾的字符串
    /// - Returns: 返回一个新的字符串
    func mySubString(from index: Int) -> String {
        return String(self[self.index(self.startIndex, offsetBy: index)...])
    }
    
    func securityHref() ->String {
         return self.replacingOccurrences(of: "http:", with: "https:");
    }
    func stringToTimeStamp()->Int {
        
        let dfmatter = DateFormatter()
        dfmatter.dateFormat="yyyy-MM-dd HH:mm:ss"
        let date = dfmatter.date(from: self)
        
        let dateStamp:TimeInterval = date!.timeIntervalSince1970
        
        let dateSt:Int = Int(dateStamp)
        return dateSt
        
    }
}

extension TimeInterval {
    // 把秒数转换成时间的字符串
    func convertString() -> String {
        // 把获取到的秒数转换成具体的时间
        let createDate = Date(timeIntervalSince1970: self)
        // 获取当前日历
        let calender = Calendar.current
        // 获取日期的年份
        let comps = calender.dateComponents([.year, .month, .day, .hour, .minute, .second], from: createDate, to: Date())
        // 日期格式
        let formatter = DateFormatter()
        // 判断当前日期是否为今年
        guard createDate.isThisYear() else {
            formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
            return formatter.string(from: createDate)
        }
        // 是否是前天
        if createDate.isBeforeYesterday() {
            formatter.dateFormat = "前天 HH:mm"
            return formatter.string(from: createDate)
        } else if createDate.isToday() || createDate.isYesterday() {
            // 判断是否是今天或者昨天
            if comps.hour! >= 1 {
                return String(format: "%d小时前", comps.hour!)
            } else if comps.minute! >= 1 {
                return String(format: "%d分钟前", comps.minute!)
            } else {
                return "刚刚"
            }
        } else {
            formatter.dateFormat = "MM-dd HH:mm"
            return formatter.string(from: createDate)
        }
    }
}

extension Int {


    func convertString() -> String {
        guard self >= 10000 else {
            return String(describing: self)
        }
        return String(format: "%.1f万", Float(self) / 10000.0)
    }
    
    /// 将秒数转成字符串
    func convertVideoDuration() -> String {
        // 格式化时间
        if self == 0 { return "00:00" }
        let hour = self / 3600
        let minute = (self / 60) % 60
        let second = self % 60
        if hour > 0 { return String(format: "%02d:%02d:%02d", hour, minute, second) }
        return String(format: "%02d:%02d", minute, second)
    }
    
    func convertDateTime(format:String="yyyy-MM-dd HH:mm:ss") ->String{
        
        let timeInterval:TimeInterval = TimeInterval(self)
        let date = Date(timeIntervalSince1970: timeInterval)
        
        //格式话输出
        let dformatter = DateFormatter()
        dformatter.dateFormat = format
        return dformatter.string(from: date)
    }
    
    func convertHeaderDateTime() ->String{
        
        let timeInterval:TimeInterval = TimeInterval(self)
        let date = Date(timeIntervalSince1970: timeInterval)
        var format = "yyyy/MM/dd"
        if date.isToday() {
            format = "今天 MM/dd"
        }else if date.isYesterday() {
            format = "昨天 MM/dd"
        }
        //格式话输出
        let dformatter = DateFormatter()
        dformatter.dateFormat = format
        return dformatter.string(from: date)
    }
    
}

extension Date {
    
    /// 判断当前日期是否为今年
    func isThisYear() -> Bool {
        // 获取当前日历
        let calender = Calendar.current
        // 获取日期的年份
        let yearComps = calender.component(.year, from: self)
        // 获取现在的年份
        let nowComps = calender.component(.year, from: Date())
        
        return yearComps == nowComps
    }
    
    /// 是否是昨天
    func isYesterday() -> Bool {
        // 获取当前日历
        let calender = Calendar.current
        // 获取日期的年份
        let comps = calender.dateComponents([.year, .month, .day], from: self, to: Date())
        // 根据头条显示时间 ，我觉得可能有问题 如果comps.day == 0 显示相同，如果是 comps.day == 1 显示时间不同
        // 但是 comps.day == 1 才是昨天 comps.day == 2 是前天
//        return comps.year == 0 && comps.month == 0 && comps.day == 1
        return comps.year == 0 && comps.month == 0 && comps.day == 0
    }
    
    /// 是否是前天
    func isBeforeYesterday() -> Bool {
        // 获取当前日历
        let calender = Calendar.current
        // 获取日期的年份
        let comps = calender.dateComponents([.year, .month, .day], from: self, to: Date())
        //
//        return comps.year == 0 && comps.month == 0 && comps.day == 2
        return comps.year == 0 && comps.month == 0 && comps.day == 1
    }
    
    /// 判断是否是今天
    func isToday() -> Bool {
        // 日期格式化
        let formatter = DateFormatter()
        // 设置日期格式
        formatter.dateFormat = "yyyy-MM-dd"
        
        let dateStr = formatter.string(from: self)
        let nowStr = formatter.string(from: Date())
        return dateStr == nowStr
    }
    
    func convertDateTime(format:String="yyyy-MM-dd HH:mm:ss") ->String{
        //格式话输出
        let dformatter = DateFormatter()
        dformatter.dateFormat = format
        return dformatter.string(from: self)
    }
    
}

extension Double{
    
    func roundTo(places:Int) -> Double {
        
        let divisor = pow(10.0, Double(places))
        
        return (self * divisor).rounded() / divisor
        
    }
    
    func percent()->String{
        
//        let number = NSNumber(value: self)
//        //百分数形式
//        let numberPercentStyleStr = NumberFormatter.localizedString(from: number, number: .percent)
//        return numberPercentStyleStr
        
        
        let percentFormatter = NumberFormatter()
        percentFormatter.numberStyle = NumberFormatter.Style.percent
        percentFormatter.multiplier = 1
        //设置最小小数点后的位数
        percentFormatter.minimumFractionDigits = 1
        //设置最大小数点后的位数
        percentFormatter.maximumFractionDigits = 2
        
      
        let myString1 = percentFormatter.string(for: self*100)
        //let myString1 = percentFormatter.string(from: NSNumber(value: myDouble1)) // also works
//        print(String(reflecting: myString1)) // Optional("8.0%")
        
        return myString1!
    }

    
    
    func toFixed(n:Int = 2)->String{
        
        let numberFormatter = NumberFormatter()
        //设置number显示样式
        numberFormatter.numberStyle = .decimal
        //设置填充位置
        numberFormatter.paddingPosition = .afterSuffix
        
        numberFormatter.minimumFractionDigits = n
        
        numberFormatter.maximumFractionDigits = n
        let number = NSNumber(value: self)
        return numberFormatter.string(from: number)!
    }
    
    func toDynamicFixed(n:Int = 2)->String{
        
        let numberFormatter = NumberFormatter()
        //设置number显示样式
        numberFormatter.numberStyle = .decimal
        //设置填充位置
        numberFormatter.paddingPosition = .afterSuffix
        
        numberFormatter.minimumFractionDigits=n
        numberFormatter.usesGroupingSeparator = false
        
        if self < 0.01 {
            numberFormatter.maximumFractionDigits=6
        }
        else if self < 100 {
            numberFormatter.maximumFractionDigits=4
        }else{
            numberFormatter.maximumFractionDigits=2
        }
        let number = NSNumber(value: self)
        return numberFormatter.string(from: number)!
    }

    
    func short(n:Int=2)  -> String{
        

        let data = self
        
        if data < 0{
            return "--"
        }
        if data==0 {
            return "0.00"
        }
        let k = 10000.0 // or 1024
        let sizes:[String] = ["", "万", "亿","万亿"]
        let  i = floor(log(data) / log(k))
        
        var res = ""
      
        if (i < 0) {
            res =  self.toFixed(n: n);
        }
        else if (i > 2) {
            let strData = (data / pow(k, 2)).toFixed(n:n);
            res = strData + " " + sizes[2];
        }else{
            let strData = (data / pow(k, i)).toFixed(n:n);
            res = strData + " " + sizes[Int.init(i)];
        }
        
        
        return  res
        
    }
    
}
//为 uiview 扩展添加边框功能
extension UIView {
    
    //画线
    private func drawBorder(rect:CGRect,color:UIColor){
        let line = UIBezierPath(rect: rect)
        let lineShape = CAShapeLayer()
        lineShape.path = line.cgPath
        lineShape.fillColor = color.cgColor
        self.layer.addSublayer(lineShape)
    }
    
    //设置右边框
    public func rightBorder(size:CGFloat,width:CGFloat,height:CGFloat,borderColor:UIColor){
        let rect = CGRect(x: 0, y: width - size, width: size, height: height)
        drawBorder(rect: rect, color: borderColor)
    }
    //设置左边框
    public func leftBorder(size:CGFloat,height:CGFloat,borderColor:UIColor){
        let rect = CGRect(x: 0, y: 0, width: size, height: height)
        drawBorder(rect: rect, color: borderColor)
    }
    
    //设置上边框
    public func topBorder(size:CGFloat,width:CGFloat,borderColor:UIColor){
        let rect = CGRect(x: 0, y: 0, width: width, height: size)
        drawBorder(rect: rect, color: borderColor)
    }
    
    //设置底边框
    public func buttomBorder(size:CGFloat,width:CGFloat,height:CGFloat,borderColor:UIColor){
        let rect = CGRect(x: 0, y: height-size, width: width, height: size)
        drawBorder(rect: rect, color: borderColor)
    }
}
extension UIImage{
    func reSizeImage(toSize: CGSize) -> UIImage {
        UIGraphicsBeginImageContext(CGSize(width: toSize.width, height: toSize.height))
        self.draw(in: CGRect(x: 0, y: 0, width: toSize.width, height: toSize.height))
        let reSizeImage = UIGraphicsGetImageFromCurrentImageContext()
        UIGraphicsEndImageContext()
        return reSizeImage!
    }
}
extension String {
    func ga_widthForComment(fontSize: CGFloat, height: CGFloat = 15) -> CGFloat {
        let font = UIFont.systemFont(ofSize: fontSize)
        let rect = NSString(string: self).boundingRect(with: CGSize(width: CGFloat(MAXFLOAT), height: height), options: .usesLineFragmentOrigin, attributes: [.font: font], context: nil)
        return ceil(rect.width)
    }
    
    func ga_heightForComment(fontSize: CGFloat, width: CGFloat) -> CGFloat {
        let font = UIFont.systemFont(ofSize: fontSize)
        let rect = NSString(string: self).boundingRect(with: CGSize(width: width, height: CGFloat(MAXFLOAT)), options: .usesLineFragmentOrigin, attributes: [.font: font], context: nil)
        return ceil(rect.height)
    }
    
    func ga_heightForComment(fontSize: CGFloat, width: CGFloat, maxHeight: CGFloat) -> CGFloat {
        let font = UIFont.systemFont(ofSize: fontSize)
        let rect = NSString(string: self).boundingRect(with: CGSize(width: width, height: CGFloat(MAXFLOAT)), options: .usesLineFragmentOrigin, attributes: [.font: font], context: nil)
        return ceil(rect.height)>maxHeight ? maxHeight : ceil(rect.height)
    }
}
