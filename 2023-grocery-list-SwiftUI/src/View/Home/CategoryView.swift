import SwiftUI

struct CategoryView: View {
    @ObservedObject var groceryViewModel: GroceryViewModel

    var body: some View {
        ScrollView {
            ForEach(CategoryModel.allCases.chunked(into: 3), id: \.self) { chunk in
                HStack {
                    ForEach(chunk, id: \.self) { item in
                        NavigationLink(destination: CategoryDetailView(categoryModel: item, groceryViewModel: groceryViewModel)) {
                            CategoryCellView(groceryViewModel: groceryViewModel, categoryModel: item)
                        }
                    }
                }
            }
        }
        .navigationTitle("카테고리 선택")
        .navigationBarTitleDisplayMode(.large)
        .shadow(color: .gray, radius: 2, x: 0, y: 2)
    }
}

// MARK: - 카테고리 셀 뷰
private struct CategoryCellView: View {
    @ObservedObject var groceryViewModel: GroceryViewModel
    private var categoryModel: CategoryModel
    
    fileprivate init(groceryViewModel: GroceryViewModel, categoryModel: CategoryModel) {
        self.groceryViewModel = groceryViewModel
        self.categoryModel = categoryModel
    }

    fileprivate var body: some View {
        VStack {
            ZStack(alignment: .topTrailing) {
                Image(categoryModel.categoryImage)
                    .resizable()
                    .aspectRatio(contentMode: .fit)

                // 배지 추가
                if groceryViewModel.itemCount(for: categoryModel) > 0 {
                    Text("\(groceryViewModel.itemCount(for: categoryModel))")
                        .font(.system(size: 15))
                        .frame(width: 24, height: 24)
                        .background(Color.green.gradient)
                        .foregroundStyle(Color.white)
                        .clipShape(Circle())
                }
            }
            Text(categoryModel.rawValue)
                .frame(maxWidth: .infinity)
                .padding()
                .background(categoryModel.backgroundColor.gradient)
                .cornerRadius(10)
                .foregroundStyle(Color.white)
        }
        .cornerRadius(10)
        .padding(10)
    }
}

// MARK: - 세 개씩 그룹화 함수
private extension Array {
    func chunked(into size: Int) -> [[Element]] {
        stride(from: 0, to: count, by: size).map {
            Array(self[$0 ..< Swift.min($0 + size, count)])
        }
    }
}

struct SecondView_Previews: PreviewProvider {
    static var previews: some View {
        let groceryViewModel = GroceryViewModel()
        CategoryView(groceryViewModel: groceryViewModel)
    }
}
