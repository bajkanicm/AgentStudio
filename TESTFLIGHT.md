# hey247 iOS-App → TestFlight

Die native iOS-App liegt in `ios/` (Capacitor-Shell um die produktive
Web-App). Sie lädt https://agentstudio.tech — **Web-Updates erscheinen
sofort in der App, ohne neues TestFlight-Build.** Ein neues Build braucht
es nur bei Änderungen an der Shell selbst (Icon, Berechtigungen, Domain).

## Einmalig: App in App Store Connect anlegen

1. <https://appstoreconnect.apple.com> → **Apps** → **+** → *Neue App*:
   - Plattform **iOS**, Name **hey247**, Sprache **Deutsch**
   - Bundle-ID **de.hey247.app** (falls nicht in der Liste: Xcode legt sie
     beim ersten Signieren automatisch an, siehe unten — danach hier neu laden)
   - SKU z. B. `hey247-ios`

## Build signieren & hochladen (in Xcode, ~10 Minuten)

```bash
cd /Users/lightsoft/Development/AgentStudio
npx cap open ios
```

1. In Xcode links das Projekt **App** wählen → Target **App** → Tab
   **Signing & Capabilities**:
   - ✅ *Automatically manage signing*
   - **Team**: dein Apple-Developer-Team (flexC GmbH) auswählen.
     Xcode registriert die Bundle-ID `de.hey247.app` dabei automatisch.
2. Oben in der Gerätezeile **Any iOS Device (arm64)** wählen
   (nicht einen Simulator).
3. Menü **Product → Archive**. Nach dem Build öffnet sich der Organizer.
4. **Distribute App** → **TestFlight & App Store** → durchklicken
   (Upload, automatische Signierung). Export-Compliance ist schon in der
   App beantwortet (`ITSAppUsesNonExemptEncryption = false`).
5. Nach 5–15 Min Verarbeitung erscheint das Build in App Store Connect
   unter **TestFlight**.

## Tester einladen

- **Interne Tester** (bis 100, sofort, ohne Review): TestFlight →
  *Interne Tests* → Gruppe anlegen → Apple-IDs der Tester hinzufügen.
- **Externe Tester** (bis 10.000, kurzer Beta-Review durch Apple):
  *Externe Tests* → Gruppe + öffentlicher Einladungslink.

Tester installieren die **TestFlight-App** aus dem App Store und öffnen
deinen Einladungslink — fertig.

## Neue Shell-Version bauen

```bash
npx cap sync ios   # Config/Plugins → Xcode-Projekt
npx cap open ios   # Version/Build-Nr. im Target hochzählen, dann Archive
```

## Hinweise

- Die App hängt `hey247App` an den User-Agent; der Server blendet dafür
  alle Marketing-Seiten aus — die App startet direkt im Login.
  Nach Änderungen an `capacitor.config.ts`: `npx cap sync ios` und neues
  Archive (Build-Nummer erhöhen).

- Kamera/Fotos-Berechtigungen (Lieferschein-Fotos) sind mit deutschen
  Begründungstexten in `ios/App/App/Info.plist` hinterlegt.
- Icon & Splash (Tannengrün/Orange) liegen in `assets/` und werden mit
  `npx @capacitor/assets generate --ios` neu erzeugt.
- Für den App-Store-Release (nach TestFlight) fehlen nur noch:
  Screenshots, Beschreibung, Datenschutz-Angaben (Privacy Nutrition
  Labels) in App Store Connect.
