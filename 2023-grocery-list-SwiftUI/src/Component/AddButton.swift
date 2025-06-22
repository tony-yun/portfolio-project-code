import Foundation
import SwiftUI

extension View {
    public func addButton(perform action: @escaping () -> Void) -> some View {
        ZStack {
            self
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Button(action: {
                        action()
                    }, label: {
                        Image(systemName: "plus.circle.fill")
                            .padding()
                            .font(.system(size: 50))
                    })
                }
            }
        }
    }
}
