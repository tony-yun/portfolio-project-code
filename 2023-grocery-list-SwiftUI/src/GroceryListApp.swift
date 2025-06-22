//
//  GroceryListApp.swift
//  GroceryList
//
//  Created by Yun Tae Woong on 11/9/23.
//

import SwiftUI

@main
struct GroceryListApp: App {
    @StateObject var onboardingViewModel = OnboardingViewModel()
    
    var body: some Scene {
        WindowGroup {
            if onboardingViewModel.isOnboardingViewShowed {
                OnboardingView(setIsOnboardingViewShowed: onboardingViewModel)
            } else {
                MainListView()
            }
        }
    }
}
