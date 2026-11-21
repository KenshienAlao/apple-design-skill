# Apple Native Recipes

Complete SwiftUI and UIKit recipes for the Apple craft lens. Load this when a build needs a native implementation of a rule owned elsewhere in the skill.

Every recipe names the rule it implements. Code here is a starting implementation, not a component library. Add accessibility labels to graphics and names to controls before shipping. For claim strength, use `evidence-apple-style.md`.

## 1. Spring release from a drag

Implements: direct manipulation tracks 1:1; springs resolve release; haptics at commit.

```swift
struct DragCard: View {
    @State private var offset: CGSize = .zero
    @State private var dragStart: CGSize = .zero

    var body: some View {
        RoundedRectangle(cornerRadius: 14)
            .fill(Color(uiColor: .secondarySystemFill))
            .frame(height: 88)
            .offset(offset)
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { value in
                        // 1:1 while the finger moves. No snap here.
                        offset = CGSize(
                            width: dragStart.width + value.translation.width,
                            height: dragStart.height + value.translation.height
                        )
                    }
                    .onEnded { value in
                        dragStart = .zero
                        let pastThreshold = abs(value.translation.width) > 60
                        let fast = abs(value.predictedEndTranslation.width) > 120
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.86)) {
                            offset = (pastThreshold || fast) ? .zero : .zero
                        }
                        if pastThreshold || fast {
                            UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        }
                    }
            )
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("Draggable card")
            .accessibilityHint("Drag sideways, then release.")
    }
}
```

Rule check: one haptic at commit, never per frame. Replace the `.zero` branch with your committed state when the gesture deletes or advances content.

## 2. Matched geometry transition

Implements: depth expresses order; motion is interruptible and reducible.

```swift
struct ExpandingTile: View {
    @Namespace private var namespace
    @State private var expanded = false

    var body: some View {
        VStack(spacing: 16) {
            if expanded {
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color(uiColor: .systemFill))
                    .matchedGeometryEffect(id: "tile", in: namespace)
                    .frame(height: 240)
                    .overlay(Text("Detail").font(.title3))
            } else {
                RoundedRectangle(cornerRadius: 14)
                    .fill(Color(uiColor: .systemFill))
                    .matchedGeometryEffect(id: "tile", in: namespace)
                    .frame(height: 88)
                    .overlay(Text("Summary").font(.headline))
            }
            Button(expanded ? "Collapse" : "Expand") {
                withAnimation(.spring(response: 0.4, dampingFraction: 0.9)) {
                    expanded.toggle()
                }
            }
            .buttonStyle(.borderedProminent)
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.9), value: expanded)
    }
}
```

Rule check: keep Reduce Motion equivalent using `@Environment(\.accessibilityReduceMotion)` and swap the spring for an opacity crossfade when set.

## 3. Scroll-linked read value

Implements: damped scroll read value; native scrolling is authoritative.

```swift
struct ProgressRead: View {
    @State private var progress: Double = 0

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                ForEach(0..<12, id: \.self) { index in
                    Text("Section \(index + 1)")
                        .frame(maxWidth: .infinity, minHeight: 88)
                }
            }
            .background(
                GeometryReader { proxy in
                    Color.clear
                        .preference(
                            key: ScrollOffsetKey.self,
                            value: -proxy.frame(in: .named("scroll")).minY
                        )
                }
            )
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetKey.self) { offset in
            let target = min(max(offset / 900, 0), 1)
            // Damp the read value; never fight the scroll itself.
            progress = progress + (target - progress) * 0.18
        }
        .overlay(alignment: .top) {
            ProgressView(value: progress)
                .padding()
        }
    }
}

struct ScrollOffsetKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}
```

Rule check: mid-scroll values only read geometry; they never call `preventDefault` or replace the scroll view.

## 4. Focus and keyboard shortcuts

Implements: keyboard path exists; focus order matches reading order.

```swift
struct ShortcutActions: View {
    @FocusState private var focused: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            TextField("Search", text: .constant(""))
                .textFieldStyle(.roundedBorder)
                .focused($focused)
            Button("Save") { save() }
                .keyboardShortcut("s", modifiers: .command)
            Button("Cancel") { focused = false }
                .keyboardShortcut(.cancel)
        }
        .onAppear { focused = true }
    }

    private func save() {}
}
```

Rule check: the shortcut duplicates a visible control, never replaces it.

## 5. Dynamic Type and accessibility

Implements: text reflows; graphics named; controls labeled.

```swift
struct AccessibleRow: View {
    @Environment(\.dynamicTypeSize) private var typeSize

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundStyle(Color(uiColor: .systemGreen))
                .accessibilityHidden(true)
            VStack(alignment: .leading) {
                Text("Sync complete")
                    .font(.headline)
                Text("All changes are up to date.")
                    .font(typeSize.isAccessibilitySize ? .body : .subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer(minLength: 0)
        }
        .frame(minHeight: typeSize.isAccessibilitySize ? 60 : 44)
        .accessibilityElement(children: .combine)
    }
}
```

Rule check: the icon is decorative and hidden; the combined element carries the name.

## 6. UIKit sheet with detents

Implements: sheet detents; focus restoration; commit haptics.

```swift
final class DetailPresenter: NSObject, UIAdaptivePresentationControllerDelegate {
    weak var viewController: UIViewController?

    func present(from host: UIViewController) {
        let detail = UIViewController()
        detail.view.backgroundColor = .systemBackground
        detail.modalPresentationStyle = .pageSheet

        if let sheet = detail.sheetPresentationController {
            sheet.detents = [.medium(), .large()]
            sheet.prefersGrabberVisible = true
            sheet.prefersScrollingExpandsWhenScrolledToEdge = true
        }

        detail.presentationController?.delegate = self
        host.present(detail, animated: true) {
            UIAccessibility.post(notification: .screenChanged, argument: detail.view)
        }
        viewController = host
    }

    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
        UIAccessibility.post(notification: .screenChanged, argument: viewController?.view)
    }
}
```

Rule check: focus moves in on presentation and returns on dismissal; no custom back button.

## 7. Reduce Motion branch

Implements: reduced motion resolves to the final state.

```swift
struct MotionAwareBadge: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var appeared = false

    var body: some View {
        Text("Saved")
            .opacity(appeared ? 1 : 0)
            .offset(y: reduceMotion ? 0 : (appeared ? 0 : 8))
            .onAppear {
                if reduceMotion {
                    appeared = true
                } else {
                    withAnimation(.easeOut(duration: 0.25)) { appeared = true }
                }
            }
    }
}
```

Rule check: with Reduce Motion the element is present immediately at its final position.

## 8. Recipe selection table

| Need | Recipe | Rule owner |
|---|---|---|
| drag and release | 1 | `animations-apple-style.md` |
| hierarchy via expansion | 2 | `design-apple-style.md` |
| progress tied to scroll | 3 | `scroll-motion-apple-style.md` |
| keyboard access | 4 | `accessibility-apple-style.md` |
| type and naming | 5 | `accessibility-apple-style.md` |
| focused modal task | 6 | `navigation-models-apple-style.md` |
| reduced motion | 7 | `animations-apple-style.md` |

## QA checklist

- Every graphic named or hidden from VoiceOver.
- Every control has a visible or accessibility label.
- Springs used for release, not for continuous drag.
- One haptic at commit.
- Reduce Motion resolves to a final visible state.
- Native scrolling never intercepted.
- Focus returns after dismissal.

## Related

- `animations-apple-style.md`
- `apple-platform-playbooks-apple-style.md`
- `apple-hig-mapping-apple-style.md`
- `accessibility-apple-style.md`
- `components-apple-style.md`
- `haptics-and-sound-apple-style.md`
