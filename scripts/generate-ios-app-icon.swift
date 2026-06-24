import CoreGraphics
import Foundation
import ImageIO

let iconSize = 1024
let bytesPerPixel = 4
let bytesPerRow = iconSize * bytesPerPixel
let bitmapInfo = CGImageAlphaInfo.noneSkipLast.rawValue | CGBitmapInfo.byteOrder32Big.rawValue
var pixels = [UInt8](repeating: 0, count: iconSize * iconSize * bytesPerPixel)

func color(_ hex: Int, alpha: CGFloat = 1) -> CGColor {
    let red = CGFloat((hex >> 16) & 0xff) / 255
    let green = CGFloat((hex >> 8) & 0xff) / 255
    let blue = CGFloat(hex & 0xff) / 255
    return CGColor(red: red, green: green, blue: blue, alpha: alpha)
}

func roundedPath(_ rect: CGRect, radius: CGFloat) -> CGPath {
    CGPath(roundedRect: rect, cornerWidth: radius, cornerHeight: radius, transform: nil)
}

func fillRounded(_ context: CGContext, _ rect: CGRect, radius: CGFloat, fill: CGColor) {
    context.addPath(roundedPath(rect, radius: radius))
    context.setFillColor(fill)
    context.fillPath()
}

func strokeRounded(_ context: CGContext, _ rect: CGRect, radius: CGFloat, stroke: CGColor, width: CGFloat) {
    context.addPath(roundedPath(rect, radius: radius))
    context.setStrokeColor(stroke)
    context.setLineWidth(width)
    context.strokePath()
}

guard let context = CGContext(
    data: &pixels,
    width: iconSize,
    height: iconSize,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: CGColorSpaceCreateDeviceRGB(),
    bitmapInfo: bitmapInfo
) else {
    fatalError("Could not create icon bitmap context.")
}

context.interpolationQuality = .high
context.setAllowsAntialiasing(true)
context.setShouldAntialias(true)

// Draw in a top-left coordinate space.
context.translateBy(x: 0, y: CGFloat(iconSize))
context.scaleBy(x: 1, y: -1)

let bounds = CGRect(x: 0, y: 0, width: iconSize, height: iconSize)
let cream = color(0xfbf6e8)
let paper = color(0xfffdf6)
let ink = color(0x20242b)
let blue = color(0x2547d0)
let orange = color(0xf26d21)
let softLine = color(0xd9dde6)

if let gradient = CGGradient(
    colorsSpace: CGColorSpaceCreateDeviceRGB(),
    colors: [cream, color(0xf2f4fb), color(0xfffdf6)] as CFArray,
    locations: [0, 0.62, 1]
) {
    context.drawLinearGradient(
        gradient,
        start: CGPoint(x: 0, y: 0),
        end: CGPoint(x: iconSize, y: iconSize),
        options: []
    )
}

// Subtle city-loop trace behind the mark.
context.saveGState()
context.setLineCap(.round)
context.setLineJoin(.round)
context.setStrokeColor(color(0x2547d0, alpha: 0.12))
context.setLineWidth(34)
context.move(to: CGPoint(x: -40, y: 780))
context.addCurve(to: CGPoint(x: 1064, y: 250), control1: CGPoint(x: 270, y: 600), control2: CGPoint(x: 725, y: 480))
context.strokePath()

context.setStrokeColor(color(0xf26d21, alpha: 0.12))
context.setLineWidth(26)
context.move(to: CGPoint(x: 92, y: 910))
context.addCurve(to: CGPoint(x: 940, y: 80), control1: CGPoint(x: 320, y: 612), control2: CGPoint(x: 690, y: 360))
context.strokePath()
context.restoreGState()

// Center mark, matching the LOOP city-tape identity used in the web prototype.
context.saveGState()
context.translateBy(x: 512, y: 524)
context.rotate(by: -4 * .pi / 180)

let card = CGRect(x: -326, y: -258, width: 652, height: 516)
context.setShadow(offset: CGSize(width: 24, height: 28), blur: 0, color: color(0x20242b, alpha: 0.09))
fillRounded(context, card, radius: 78, fill: paper)
context.setShadow(offset: .zero, blur: 0, color: nil)
strokeRounded(context, card, radius: 78, stroke: ink, width: 34)

fillRounded(context, CGRect(x: -214, y: -158, width: 428, height: 42), radius: 4, fill: color(0x20242b, alpha: 0.62))
fillRounded(context, CGRect(x: -218, y: 52, width: 250, height: 92), radius: 2, fill: blue)
fillRounded(context, CGRect(x: 70, y: 52, width: 154, height: 92), radius: 2, fill: orange)
fillRounded(context, CGRect(x: -34, y: 22, width: 104, height: 104), radius: 2, fill: ink)

context.setStrokeColor(softLine)
context.setLineWidth(10)
context.move(to: CGPoint(x: -224, y: -32))
context.addLine(to: CGPoint(x: 224, y: -32))
context.strokePath()

context.restoreGState()

guard let image = context.makeImage() else {
    fatalError("Could not create icon image.")
}

let root = URL(fileURLWithPath: FileManager.default.currentDirectoryPath, isDirectory: true)
let exportURL = root.appendingPathComponent("assets/loop-city-app-icon-1024.png")
let xcodeURL = root.appendingPathComponent("ios/LoopCityWebViewApp/LoopCityWebViewApp/Assets.xcassets/AppIcon.appiconset/loop-city-app-icon-1024.png")

func writePNG(_ image: CGImage, to url: URL) throws {
    try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
    guard let destination = CGImageDestinationCreateWithURL(url as CFURL, "public.png" as CFString, 1, nil) else {
        throw NSError(domain: "LoopCityIcon", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not create PNG destination."])
    }
    CGImageDestinationAddImage(destination, image, nil)
    if !CGImageDestinationFinalize(destination) {
        throw NSError(domain: "LoopCityIcon", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not finalize PNG."])
    }
}

try writePNG(image, to: exportURL)
try writePNG(image, to: xcodeURL)

print("Wrote \(exportURL.path)")
print("Wrote \(xcodeURL.path)")
