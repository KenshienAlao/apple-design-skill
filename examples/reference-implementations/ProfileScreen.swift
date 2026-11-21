import SwiftUI

// Reference implementation: iOS-style profile screen.
// Uses system colors, standard controls, safe-area-aware layout, and one accent.

@main
struct ProfileReferenceApp: App {
    var body: some Scene {
        WindowGroup {
            ProfileScreen()
        }
    }
}

struct ProfileScreen: View {
    @State private var displayName = "Nathan"
    @State private var twoFactorEnabled = true
    @State private var isEditingName = false
    @State private var draftName = "Nathan"
    @State private var showingDeleteConfirmation = false
    @State private var saveStatus: SaveStatus = .saved
    @FocusState private var nameFieldFocused: Bool

    private let selectionFeedback = UISelectionFeedbackGenerator()
    private let impactFeedback = UIImpactFeedbackGenerator(style: .medium)

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    profileSummary

                    section("Account") {
                        row(title: "Display Name", value: displayName) {
                            editName
                        }

                        toggleRow(
                            title: "Two-Factor Authentication",
                            subtitle: "Adds a second step when signing in.",
                            isOn: $twoFactorEnabled
                        )
                    }

                    section("Session") {
                        row(title: "Save Status", value: saveStatus.label) {}
                    }

                    section("Danger Zone") {
                        Button(role: .destructive) {
                            impactFeedback.impactOccurred()
                            showingDeleteConfirmation = true
                        } label: {
                            Text("Delete Account")
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel("Delete Account")
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .frame(maxWidth: 720, alignment: .leading)
            }
            .background(Color(uiColor: .systemBackground))
            .navigationTitle("Profile")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Edit") {
                        draftName = displayName
                        nameFieldFocused = false
                        isEditingName = true
                    }
                }
            }
            .sheet(isPresented: $isEditingName) {
                editSheet
                    .presentationDetents([.medium])
                    .presentationDragIndicator(.visible)
                    .interactiveDismissDisabled(draftName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
            .alert("Delete Account?", isPresented: $showingDeleteConfirmation) {
                Button("Cancel", role: .cancel) {}
                Button("Delete Account", role: .destructive) {
                    saveStatus = .failed("Delete action not available in reference build")
                }
            } message: {
                Text("This removes your account and all associated data. This action cannot be undone.")
            }
        }
    }

    private var profileSummary: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Profile")
                .font(.system(size: 34, weight: .regular))
                .accessibilityAddTraits(.isHeader)

            Text("Manage how your account appears and how you sign in.")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.top, 4)
    }

    private var editName: some View {
        Button {
            draftName = displayName
            isEditingName = true
        } label: {
            HStack {
                Spacer()
                Text("Edit")
                    .foregroundStyle(Color.accentColor)
            }
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
        .frame(minHeight: 44)
        .accessibilityLabel("Edit Display Name")
    }

    private var editSheet: some View {
        NavigationStack {
            Form {
                Section("Display Name") {
                    TextField("Display Name", text: $draftName)
                        .textInputAutocapitalization(.words)
                        .focused($nameFieldFocused)
                        .onAppear {
                            DispatchQueue.main.asyncAfter(deadline: .now() + 0.35) {
                                nameFieldFocused = true
                            }
                        }

                    Text("This appears on your profile and in shared projects.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Edit Name")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") {
                        nameFieldFocused = false
                        isEditingName = false
                    }
                }

                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        let trimmed = draftName.trimmingCharacters(in: .whitespacesAndNewlines)
                        guard !trimmed.isEmpty else { return }
                        displayName = trimmed
                        saveStatus = .saved
                        selectionFeedback.selectionChanged()
                        nameFieldFocused = false
                        isEditingName = false
                    }
                    .disabled(draftName.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }

    @ViewBuilder
    private func section<Content: View>(_ title: String, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.footnote)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
                .accessibilityAddTraits(.isHeader)

            VStack(spacing: 0) {
                content()
            }
            .background(Color(uiColor: .secondarySystemBackground))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    @ViewBuilder
    private func row(title: String, value: String, action: () -> Void) -> some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.headline)
                Text(value)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer()
            Button(action: action) {
                Text("Edit")
                    .foregroundStyle(Color.accentColor)
            }
            .buttonStyle(.plain)
            .frame(minHeight: 44)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(minHeight: 56)
    }

    @ViewBuilder
    private func toggleRow(title: String, subtitle: String, isOn: Binding<Bool>) -> some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.headline)
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
            Spacer()
            Toggle(isOn: isOn) {
                EmptyView()
            }
            .labelsHidden()
            .onChange(of: isOn.wrappedValue) { _, _ in
                impactFeedback.impactOccurred()
            }
            .accessibilityLabel(title)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .frame(minHeight: 56)
    }
}

enum SaveStatus {
    case saved
    case failed(String)

    var label: String {
        switch self {
        case .saved:
            return "Saved"
        case .failed(let message):
            return message
        }
    }
}
