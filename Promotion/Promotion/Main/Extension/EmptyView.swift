//
//  EmptyView.swift
//
//  Created by macbook on 2019/4/18.
//  Copyright © 2019 fby. All rights reserved.
//

import UIKit

private let marginX:CGFloat = 14
private let paddingY:CGFloat = 20

class EmptyView: UIView {
    
    lazy var noDataImageView: UIImageView = {
        // imageView
        let noDataImageView = UIImageView.init()

        return noDataImageView
    }()
    
    lazy var infoLabel: UILabel = {
        // label
        let infoLabel = UILabel.init()
        infoLabel.textAlignment = .center
        infoLabel.textColor = .black
        infoLabel.font = UIFont.systemFont(ofSize: 14)
        return infoLabel
    }()
    
    lazy var refreshBtn:UIButton = {
        
        let btn = UIButton()
        btn.layer.cornerRadius = 3
        btn.clipsToBounds = true
        btn.backgroundColor = navBgColor
        btn.titleLabel?.font = UIFont.systemFont(ofSize: 14)
        return btn
        
    }()
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.setupUI()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension EmptyView {
    
    func setupUI() {
 
    }
    
}

extension EmptyView {
    

    func setEmpty(title:String) -> () {
        self.setEmpty(image: nil , title: title)
        
    }
    
    

    func setEmpty(image:UIImage) -> () {
        self.setEmpty(image: image)
    }
    
    

    func setEmpty(image:UIImage?,title:String = "") -> () {
        if let img = image {
            noDataImageView.isHidden = false
            noDataImageView.image = img
        }else {
            noDataImageView.isHidden = true
        }
        
        if !title.isEmpty {
            infoLabel.isHidden = false
            infoLabel.text = title
        }else {
            infoLabel.isHidden = true
        }
    }
    
    func setEmptyBtn(image:UIImage?,title:String = "") ->(){
    
        if !title.isEmpty {
            refreshBtn.isHidden = false
            refreshBtn.setTitleColor(.black, for: .normal)
            refreshBtn.setTitle(title, for: .normal)
            refreshBtn.setImage(image, for: .normal)
        }else {
            refreshBtn.isHidden = true
        }
       
    }
}
