//
//  OnboardingModel.swift
//  GroceryList
//
//  Created by Yun Tae Woong on 11/14/23.
//

import Foundation

struct OnboardingModel: Hashable {
    var imageFileName: String
    var title: String
    var subTitle: String
    
    init(imageFileName: String, title: String, subTitle: String) {
        self.imageFileName = imageFileName
        self.title = title
        self.subTitle = subTitle
    }
}
