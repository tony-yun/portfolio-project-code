//
//  GroceryModel.swift
//  GroceryList
//
//  Created by Yun Tae Woong on 11/13/23.
//

import Foundation

struct GroceryModel: Identifiable, Codable, Hashable {
    var id: UUID
    var name: String
    var isCompleted: Bool
    var categoryModel: CategoryModel

    init(id: UUID = UUID(), name: String, categoryModel: CategoryModel, isCompleted: Bool = false) {
        self.id = id
        self.name = name
        self.categoryModel = categoryModel
        self.isCompleted = isCompleted
    }

    private enum CodingKeys: String, CodingKey {
        case id, name, isCompleted, categoryModel
    }
}
