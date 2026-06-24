# LOOP Native Bridge Registry

日期：2026-06-24

native bridge 通过 `window.LoopNative` 暴露给 Web app。

## 当前消息

### `ready`

方向：Web 到原生

用途：通知原生外壳 Web app 已加载并识别 native shell。

Payload：

```json
{
  "href": "file:///app/Web/index.html",
  "dataVersion": "20260624-deep-culture-v1"
}
```

原生行为：可以忽略。

### `haptic`

方向：Web 到原生

用途：请求 iOS 轻触感反馈。

Payload：

```json
{}
```

原生行为：触发 `UIImpactFeedbackGenerator(style: .light)`。

## 预留消息

以下消息在阶段 1 只预留，不实现：

- `camera.capture`
- `photo.pick`
- `location.request`
- `share.open`

产品代码不要调用预留消息，直到对应实施计划定义 payload、response event、权限行为、失败行为和验证检查。
