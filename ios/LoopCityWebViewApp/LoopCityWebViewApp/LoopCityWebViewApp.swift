import SwiftUI

@main
struct LoopCityWebViewApp: App {
    var body: some Scene {
        WindowGroup {
            WebViewScreen()
                .ignoresSafeArea()
                .statusBarHidden(true)
        }
    }
}
