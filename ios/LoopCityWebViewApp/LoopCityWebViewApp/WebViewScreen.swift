import PhotosUI
import SwiftUI
import UniformTypeIdentifiers
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
        context.coordinator.attach(webView)
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
        private weak var webView: WKWebView?
        private var activePhotoRequest: NativePhotoRequest?

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

        private struct NativePhotoRequest {
            let requestId: String
            let source: String
            let maxDimension: CGFloat
            let jpegQuality: CGFloat

            init?(payload: [String: Any], source: String) {
                guard let requestId = payload["requestId"] as? String, !requestId.isEmpty else {
                    return nil
                }
                self.requestId = requestId
                self.source = source
                let dimension = payload["maxDimension"] as? Double ?? 1280
                self.maxDimension = CGFloat(min(max(dimension, 320), 2048))
                let quality = payload["jpegQuality"] as? Double ?? 0.78
                self.jpegQuality = CGFloat(min(max(quality, 0.1), 0.95))
            }
        }

        func attach(_ webView: WKWebView) {
            self.webView = webView
        }

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

            let payload = body["payload"] as? [String: Any] ?? [:]

            switch name {
            case "haptic":
                UIImpactFeedbackGenerator(style: .light).impactOccurred()
            case "camera.capture":
                handleCameraCapture(payload: payload)
            case "photo.pick":
                handlePhotoPick(payload: payload)
            default:
                break
            }
        }

        private func handleCameraCapture(payload: [String: Any]) {
            guard let request = NativePhotoRequest(payload: payload, source: "camera") else {
                sendPhotoResult(
                    requestId: payload["requestId"] as? String ?? "",
                    source: "camera",
                    reason: "invalid-payload",
                    message: "拍照请求缺少 requestId"
                )
                return
            }
            guard UIImagePickerController.isSourceTypeAvailable(.camera) else {
                sendPhotoResult(
                    requestId: request.requestId,
                    source: request.source,
                    reason: "unavailable",
                    message: "当前设备无法打开相机"
                )
                return
            }
            activePhotoRequest = request
            let picker = UIImagePickerController()
            picker.sourceType = .camera
            picker.cameraCaptureMode = .photo
            picker.delegate = self
            present(picker)
        }

        private func handlePhotoPick(payload: [String: Any]) {
            guard let request = NativePhotoRequest(payload: payload, source: "upload") else {
                sendPhotoResult(
                    requestId: payload["requestId"] as? String ?? "",
                    source: "upload",
                    reason: "invalid-payload",
                    message: "选图请求缺少 requestId"
                )
                return
            }
            activePhotoRequest = request
            var configuration = PHPickerConfiguration(photoLibrary: .shared())
            configuration.filter = .images
            configuration.selectionLimit = 1
            let picker = PHPickerViewController(configuration: configuration)
            picker.delegate = self
            present(picker)
        }

        private func present(_ viewController: UIViewController) {
            guard let presenter = webView?.window?.rootViewController else {
                sendPhotoResult(
                    requestId: activePhotoRequest?.requestId ?? "",
                    source: activePhotoRequest?.source ?? "camera",
                    reason: "unavailable",
                    message: "无法展示系统照片入口"
                )
                activePhotoRequest = nil
                return
            }
            presenter.present(viewController, animated: true)
        }

        private func sendPhotoResult(requestId: String, source: String, reason: String, message: String) {
            let payload: [String: Any] = [
                "requestId": requestId,
                "source": source,
                "ok": false,
                "reason": reason,
                "message": message
            ]
            dispatchPhotoResult(payload)
        }

        private func sendPhotoResult(request: NativePhotoRequest, image: UIImage) {
            let resized = resizedImage(image, maxDimension: request.maxDimension)
            guard let jpeg = resized.jpegData(compressionQuality: request.jpegQuality) else {
                sendPhotoResult(
                    requestId: request.requestId,
                    source: request.source,
                    reason: "encode-failed",
                    message: "照片编码失败"
                )
                return
            }
            let payload: [String: Any] = [
                "requestId": request.requestId,
                "source": request.source,
                "ok": true,
                "imageDataUrl": "data:image/jpeg;base64,\(jpeg.base64EncodedString())",
                "mimeType": "image/jpeg",
                "width": Int(resized.size.width),
                "height": Int(resized.size.height)
            ]
            dispatchPhotoResult(payload)
        }

        private func resizedImage(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
            let size = image.size
            let longest = max(size.width, size.height)
            guard longest > maxDimension else { return image }
            let scale = maxDimension / longest
            let targetSize = CGSize(width: size.width * scale, height: size.height * scale)
            let renderer = UIGraphicsImageRenderer(size: targetSize)
            return renderer.image { _ in
                image.draw(in: CGRect(origin: .zero, size: targetSize))
            }
        }

        private func dispatchPhotoResult(_ payload: [String: Any]) {
            guard
                let data = try? JSONSerialization.data(withJSONObject: payload),
                let json = String(data: data, encoding: .utf8)
            else {
                return
            }
            let script = "window.dispatchEvent(new CustomEvent('loopnative:photo-result', { detail: \(json) }));"
            webView?.evaluateJavaScript(script)
        }
    }
}

extension WebViewScreen.Coordinator: UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        let request = activePhotoRequest
        activePhotoRequest = nil
        picker.dismiss(animated: true)
        sendPhotoResult(
            requestId: request?.requestId ?? "",
            source: request?.source ?? "camera",
            reason: "cancelled",
            message: "用户取消了拍照"
        )
    }

    func imagePickerController(
        _ picker: UIImagePickerController,
        didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]
    ) {
        let request = activePhotoRequest
        activePhotoRequest = nil
        picker.dismiss(animated: true)
        guard let request, let image = info[.originalImage] as? UIImage else {
            sendPhotoResult(
                requestId: request?.requestId ?? "",
                source: request?.source ?? "camera",
                reason: "unknown",
                message: "没有获得照片"
            )
            return
        }
        sendPhotoResult(request: request, image: image)
    }
}

extension WebViewScreen.Coordinator: PHPickerViewControllerDelegate {
    func picker(_ picker: PHPickerViewController, didFinishPicking results: [PHPickerResult]) {
        let request = activePhotoRequest
        activePhotoRequest = nil
        picker.dismiss(animated: true)
        guard let request else {
            return
        }
        guard let provider = results.first?.itemProvider else {
            sendPhotoResult(
                requestId: request.requestId,
                source: request.source,
                reason: "cancelled",
                message: "用户取消了选图"
            )
            return
        }
        provider.loadDataRepresentation(forTypeIdentifier: UTType.image.identifier) { [weak self] data, _ in
            Task { @MainActor in
                guard let self else { return }
                guard let data, let image = UIImage(data: data) else {
                    self.sendPhotoResult(
                        requestId: request.requestId,
                        source: request.source,
                        reason: "unknown",
                        message: "没有获得照片"
                    )
                    return
                }
                self.sendPhotoResult(request: request, image: image)
            }
        }
    }
}
