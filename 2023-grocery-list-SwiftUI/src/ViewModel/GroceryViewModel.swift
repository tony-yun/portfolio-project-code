import Foundation
import SwiftUI
import WidgetKit

class GroceryViewModel: ObservableObject {
    private let sharedDefaults = UserDefaults(suiteName: "group.com.tonyyun.GroceryListWidget")

    @Published var groceryModel: [GroceryModel] {
        didSet {
            if let encoded = try? JSONEncoder().encode(groceryModel) {
                sharedDefaults?.set(encoded, forKey: "GroceryList")
            }
        }
    }
    
    init() {
        if let itemsData = sharedDefaults?.data(forKey: "GroceryList"),
           let decodedItems = try? JSONDecoder().decode([GroceryModel].self, from: itemsData) {
            groceryModel = decodedItems
        } else {
            groceryModel = []
        }
    }
    
    func addItem(_ newItem: GroceryModel) {
        groceryModel.append(newItem)
        if let encoded = try? JSONEncoder().encode(self.groceryModel) {
            sharedDefaults?.set(encoded, forKey: "GroceryList")
        }
        WidgetCenter.shared.reloadTimelines(ofKind: "GroceryListWidget")
    }
    
    func deleteItem(at offsets: IndexSet) {
        groceryModel.remove(atOffsets: offsets)
        if let encoded = try? JSONEncoder().encode(groceryModel) {
            sharedDefaults?.set(encoded, forKey: "GroceryList")
        }
        WidgetCenter.shared.reloadTimelines(ofKind: "GroceryListWidget")
    }

    func removeAllItems() {
        groceryModel.removeAll()
        WidgetCenter.shared.reloadTimelines(ofKind: "GroceryListWidget")
    }
    
    func toggleIsCompleted(for item: GroceryModel) {
        if let index = groceryModel.firstIndex(where: { $0.id == item.id }) {
            groceryModel[index].isCompleted.toggle()
            if let encoded = try? JSONEncoder().encode(groceryModel) {
                sharedDefaults?.set(encoded, forKey: "GroceryList")
            }
        }
        WidgetCenter.shared.reloadTimelines(ofKind: "GroceryListWidget")
    }

    
    func sortByCategory() {
        let groupedItems = Dictionary(grouping: groceryModel, by: { $0.categoryModel.rawValue })
        let sortedKeys = groupedItems.keys.sorted {
            (groupedItems[$0]?.count ?? 0) > (groupedItems[$1]?.count ?? 0)
        }
        groceryModel = sortedKeys.flatMap { key in
            groupedItems[key] ?? []
        }
        if let encoded = try? JSONEncoder().encode(groceryModel) {
            sharedDefaults?.set(encoded, forKey: "GroceryList")
        }
        WidgetCenter.shared.reloadTimelines(ofKind: "GroceryListWidget")
    }

    
    func itemCount(for category: CategoryModel) -> Int {
        groceryModel.filter { $0.categoryModel == category }.count
    }
}
