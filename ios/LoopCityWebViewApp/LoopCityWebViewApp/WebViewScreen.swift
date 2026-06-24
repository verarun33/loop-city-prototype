import SwiftUI
import WebKit

struct WebViewScreen: UIViewRepresentable {
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.allowsInlineMediaPlayback = true
        configuration.preferences.javaScriptCanOpenWindowsAutomatically = true
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        let userContentController = WKUserContentController()
        userContentController.addUserScript(Coordinator.nativeBootstrapScript)
        userContentController.add(context.coordinator, name: "loopNative")
        configuration.userContentController = userContentController

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = true
        webView.isOpaque = false
        webView.backgroundColor = .clear
        webView.scrollView.backgroundColor = .clear
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.bounces = false

        loadLocalPrototype(in: webView)
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}

    private func loadLocalPrototype(in webView: WKWebView) {
        guard
            let webDirectory = Bundle.main.resourceURL?.appendingPathComponent("Web", isDirectory: true),
            let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web")
        else {
            webView.loadHTMLString(
                """
                <html><body style="font: -apple-system-body; padding: 24px;">
                LOOP web assets are missing from the app bundle.
                </body></html>
                """,
                baseURL: nil
            )
            return
        }

        webView.loadFileURL(indexURL, allowingReadAccessTo: webDirectory)
    }

    @MainActor
    final class Coordinator: NSObject, WKNavigationDelegate, WKUIDelegate, WKScriptMessageHandler {
        static let nativeBootstrapScript = WKUserScript(
            source: """
            (() => {
              if (window.LoopNative) return;
              const bridge = Object.freeze({
                platform: "ios",
                shellVersion: "0.1",
                post(name, payload = {}) {
                  window.webkit.messageHandlers.loopNative.postMessage({ name, payload });
                }
              });
              Object.defineProperty(window, "LoopNative", {
                value: bridge,
                configurable: false,
                enumerable: true,
                writable: false
              });
              window.dispatchEvent(new CustomEvent("loopnative:ready", { detail: bridge }));
            })();
            """,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: true
        )

        func webView(
            _ webView: WKWebView,
            createWebViewWith configuration: WKWebViewConfiguration,
            for navigationAction: WKNavigationAction,
            windowFeatures: WKWindowFeatures
        ) -> WKWebView? {
            if navigationAction.targetFrame == nil {
                webView.load(navigationAction.request)
            }
            return nil
        }

        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping @MainActor @Sendable (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }

            let scheme = url.scheme ?? ""
            if url.isFileURL || ["about", "data", "blob"].contains(scheme) {
                decisionHandler(.allow)
                return
            }

            if scheme == "https" || scheme == "http" {
                decisionHandler(.allow)
                return
            }

            UIApplication.shared.open(url)
            decisionHandler(.cancel)
        }

        func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
            guard
                message.name == "loopNative",
                let body = message.body as? [String: Any],
                let name = body["name"] as? String
            else {
                return
            }

            if name == "haptic" {
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }
        }
    }
}
