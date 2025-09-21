# CleanFlow.ai - Registrierungs- und Anmeldeprozess Prompt für Knowledge Base

## 🎯 Zweck dieses Prompts
Dieser Prompt definiert den exakten Registrierungs- und Anmeldeprozess für CleanFlow.ai und soll als Referenz für Entwicklung, Support und Benutzerführung dienen.

## 📋 Vollständiger Registrierungsprozess

### Option 1: Email/Passwort Registrierung

**Schritt 1: Registrierungsformular (/register)**
- **Pflichtfelder:**
  - Vorname (first_name) - Mindestens 2 Zeichen
  - Nachname (last_name) - Mindestens 2 Zeichen
  - E-Mail-Adresse - Muss gültig und einzigartig sein
  - Passwort - Mindestens 8 Zeichen, muss Buchstaben + Zahlen + Sonderzeichen enthalten
  - Passwort bestätigen - Muss mit Passwort übereinstimmen
- **Sicherheit:**
  - Passwort-Stärke wird in Echtzeit angezeigt (schwach/mittel/stark)
  - reCAPTCHA v3 wird automatisch ausgeführt nach AGB-Zustimmung
  - AGB und Datenschutzerklärung müssen akzeptiert werden
- **Validierung:**
  - Client-seitige Validierung in Echtzeit
  - Server-seitige Validierung durch Supabase Auth
  - Dubletten-Prüfung der E-Mail-Adresse

**Schritt 2: Account-Erstellung**
- Supabase Auth erstellt Benutzer mit Status "email_not_confirmed"
- Trigger `handle_new_user()` erstellt automatisch Profil-Eintrag in `profiles` Tabelle
- Bestätigungs-E-Mail wird an angegebene Adresse gesendet
- Redirect zu `/company-setup` (auch wenn Route noch nicht existiert)

**Schritt 3: E-Mail-Bestätigung**
- Benutzer klickt Link in E-Mail
- Link führt zu `/verify-email` mit Token-Parameter
- `VerifyEmail.tsx` verarbeitet Token und bestätigt Account
- Bei Erfolg: Automatischer Redirect zu `/einstellungen?setup=true`
- Bei Fehler: Retry-Option oder manuelle Neuversendung

**Schritt 4: Firmen-Setup (Mandatory)**
- URL `/einstellungen?setup=true` öffnet automatisch Firmen-Setup Modal
- **Pflichtfeld:** Firmenname (company name)
- **Optionale Felder:** Adresse, PLZ, Ort, Telefon, E-Mail, Website, Steuernummer, MwSt-Nummer
- Land ist standardmäßig auf "Schweiz" gesetzt
- Nach Speichern wird automatisch `masteradministrator` Rolle zugewiesen
- Redirect zu Dashboard (`/`) nach erfolgreichem Setup

### Option 2: Google OAuth Registrierung

**Schritt 1: Google Sign-Up**
- "Mit Google anmelden" Button auf `/register`
- Redirect zu Google OAuth Consent Screen
- Google OAuth Callback zu `/google-callback`
- Automatische Account-Erstellung mit Google-Profildaten
- `handle_new_user()` Trigger erstellt Profil mit Google-Daten

**Schritt 2: Firmen-Setup**
- Direkt zu `/company-setup` oder `/einstellungen?setup=true`
- Identischer Prozess wie bei Email-Registrierung
- Google-Profildaten (Name, E-Mail) sind bereits vorhanden

## 🔐 Vollständiger Anmeldeprozess

### Option 1: Email/Passwort Anmeldung

**Schritt 1: Login-Formular (/login)**
- **Eingabefelder:**
  - E-Mail-Adresse
  - Passwort mit Sichtbarkeit-Toggle
  - "Angemeldet bleiben" Checkbox
- **Funktionen:**
  - "Passwort vergessen" Link führt zu Reset-Flow
  - Client-seitige Validierung
  - Loading-States während Authentifizierung

**Schritt 2: Authentifizierung**
- Supabase Auth prüft Credentials
- Bei Erfolg: Session wird erstellt und in localStorage gespeichert
- Bei Fehler: Deutsche Fehlermeldung wird angezeigt
- Automatisches Token-Refresh aktiviert

**Schritt 3: Firmen-Daten-Prüfung**
- `useCompanyGuard` Hook prüft Firmendaten-Vollständigkeit
- **Falls Firmendaten vorhanden:** Redirect zu Dashboard (`/`)
- **Falls Firmendaten fehlen:** Zwangs-Redirect zu `/einstellungen`

### Option 2: Google OAuth Anmeldung

**Schritt 1: Google Sign-In**
- "Mit Google anmelden" Button auf `/login`
- Google OAuth Flow
- Automatische Session-Erstellung

**Schritt 2: Firmen-Daten-Prüfung**
- Identisch zu Email-Login
- `useCompanyGuard` prüft Firmendaten-Status

## 🛡️ Sicherheits- und Schutzmaßnahmen

### Passwort-Sicherheit
```
Mindestanforderungen:
- Mindestens 8 Zeichen
- Mindestens 1 Buchstabe (a-z oder A-Z)
- Mindestens 1 Zahl (0-9)
- Mindestens 1 Sonderzeichen (!@#$%^&*(),.?":{}|<>)

Passwort-Stärke Bewertung:
- Schwach: Nur Mindestanforderungen erfüllt
- Mittel: 10+ Zeichen mit gemischten Zeichen
- Stark: 12+ Zeichen mit allen Kategorien
```

### reCAPTCHA Integration
- **Service:** Google reCAPTCHA v3
- **Auslöser:** Automatisch bei AGB-Zustimmung
- **Verifikation:** Server-seitig durch Edge Function `verify-recaptcha`
- **Fehlerbehandlung:** Deutsche Fehlermeldungen bei Verifikation-Fehlern

### Row Level Security (RLS)
```sql
-- Profiles: Benutzer sehen nur eigene Daten
auth.uid() = user_id

-- Companies: Firmeninhaber sehen nur eigene Firma  
auth.uid() = owner_id

-- User_roles: Benutzer sehen nur eigene Rollen
auth.uid() = user_id
```

## 🎯 Benutzerführung und User Experience

### Erstmaliger Benutzer (Happy Path)
```
1. /register → Formular ausfüllen → Registrierung
2. E-Mail-Bestätigung → Link klicken → Account aktiviert
3. /einstellungen?setup=true → Modal öffnet automatisch
4. Firmendaten eingeben → Speichern → Masteradmin-Rolle
5. / (Dashboard) → Vollzugriff auf alle Features
```

### Wiederkehrender Benutzer mit Firmendaten
```
1. /login → Credentials eingeben → Erfolgreich angemeldet
2. useCompanyGuard prüft → Firmendaten vorhanden
3. / (Dashboard) → Direkter Zugriff auf alle Features
```

### Benutzer ohne Firmendaten (Blockierung)
```
1. /login → Erfolgreich angemeldet
2. useCompanyGuard prüft → Keine Firmendaten
3. Zwangs-Redirect zu /einstellungen
4. CompanyProtectionWrapper blockiert andere Routes
5. Setup-Card wird angezeigt → Modal erzwingen
6. Nach Setup → Vollzugriff gewährt
```

## 🚨 Fehlerbehandlung und Recovery

### Authentifizierungs-Fehler
**E-Mail bereits registriert:**
- Fehlermeldung: "Diese E-Mail-Adresse ist bereits registriert"
- Vorschlag: "Zum Anmelden" Link

**Ungültige Anmeldedaten:**
- Fehlermeldung: "E-Mail oder Passwort ungültig"
- Kein Hinweis auf spezifisches Feld (Sicherheit)

**E-Mail nicht bestätigt:**
- Fehlermeldung: "Bitte bestätigen Sie Ihre E-Mail-Adresse"
- "E-Mail erneut senden" Option

### reCAPTCHA Fehler
- Fehlermeldung: "reCAPTCHA-Verifikation fehlgeschlagen"
- Automatischer Retry nach 3 Sekunden
- "Erneut versuchen" Button

### Firmen-Setup Fehler
**Firmendaten-Validation:**
- Firmenname ist Pflichtfeld
- Fehlermeldung bei leerem Namen
- Toast-Benachrichtigung bei Speicher-Fehlern

**RLS Policy Fehler:**
- Automatischer Retry nach 2 Sekunden
- Propagation Wait für neue Firmendaten
- Rollback bei dauerhaften Fehlern

## 🔄 Session Management und Persistenz

### Session-Konfiguration
```javascript
supabase.createClient(url, key, {
  auth: {
    storage: localStorage,           // Persistent storage
    persistSession: true,           // Session überdauert Browser-Restart  
    autoRefreshToken: true,         // Automatische Token-Erneuerung
  }
});
```

### Auth State Management
```javascript
// Zentrale Session-Überwachung
supabase.auth.onAuthStateChange((event, session) => {
  setSession(session);
  setUser(session?.user ?? null);
  
  // Events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED
});
```

### "Angemeldet bleiben" Funktion
- Checkbox auf Login-Seite
- Erweitert Session-Dauer auf 30 Tage
- localStorage behält Tokens bei Browser-Neustart
- Automatische Token-Erneuerung im Hintergrund

## 📱 Multi-Tenancy und Rollen-System

### Automatische Rollen-Zuweisung
```sql
-- Trigger: assign_masteradmin_role()
-- Ausgeführt bei: INSERT ON companies
-- Aktion: Erstellt 'masteradministrator' Rolle für owner_id
```

### Rollen-Hierarchie
```
masteradministrator (Firmeninhaber):
- Vollzugriff auf alle Firmendaten
- Kann andere Benutzer einladen
- Kann Rollen verwalten
- Kann Firmeneinstellungen ändern

administrator:
- Erweiterte Benutzerrechte
- Kann meiste Firmenfunktionen nutzen
- Eingeschränkte Admin-Funktionen

employee (Mitarbeiter):
- Grundlegende Benutzerfunktionen
- Kann eigene Daten bearbeiten
- Kann zugewiesene Aufgaben bearbeiten
```

### Mandantenfähigkeit
- Jede Firma ist vollständig isoliert
- RLS Policies auf Datenbankebene
- Keine Cross-Firma Datenvisibilität
- Owner-basierte Datentrennung

## 🌐 Redirect-URLs und Navigation

### E-Mail Redirect-Konfiguration
```javascript
// Registrierung
emailRedirectTo: `${window.location.origin}/company-setup`

// Google OAuth  
redirectTo: `${window.location.origin}/company-setup`

// E-Mail-Verifizierung
navigate('/einstellungen?setup=true');
```

### Erlaubte Routen ohne Firmendaten
```javascript
const allowedRoutes = [
  '/einstellungen',
  '/profileinstellungen', 
  '/login',
  '/register',
  '/verify-email'
];
```

### Schutz-Logik (CompanyProtectionWrapper)
- Prüft bei jeder Route-Änderung
- Blockiert nicht-erlaubte Routen
- Zeigt Setup-Aufforderung
- Erzwingt Firmendaten-Eingabe

## 🧪 Testing und Entwicklung

### Auto-Confirm für Entwicklung
- E-Mail-Bestätigung in Supabase deaktivieren
- Accounts werden sofort aktiviert
- Schnellerer Testing-Workflow
- Produktions-Umgebung: E-Mail-Bestätigung aktiviert

### Test-Szenarien
1. **Erfolgreiche Registrierung:** Email → Bestätigung → Firmen-Setup → Dashboard
2. **Google OAuth:** Google-Button → OAuth → Firmen-Setup → Dashboard  
3. **Blockierung ohne Firmen:** Login → Zwangs-Redirect → Setup → Freigabe
4. **Fehler-Recovery:** Ungültige Daten → Fehler → Korrektur → Erfolg
5. **Session-Persistenz:** Login → Browser-Neustart → Weiterhin angemeldet

## 📊 Metriken und Monitoring

### Wichtige Auth-Events
- `user_signedup`: Neue Registrierung
- `login`: Erfolgreiche Anmeldung  
- `logout`: Abmeldung
- `token_refreshed`: Automatische Token-Erneuerung
- `user_updated`: Profil-Änderungen

### Firmen-Setup Metriken
- Setup-Completion-Rate
- Zeit von Registrierung bis Setup
- Abbruch-Rate beim Firmen-Setup
- Fehler-Rate bei Firmendaten-Speicherung

## 🎯 Best Practices für Entwicklung

### Authentifizierung implementieren
1. **Immer useAuth Hook verwenden** für Session-Management
2. **Session UND User State** pflegen (nicht nur User)
3. **onAuthStateChange** vor getSession() einrichten
4. **emailRedirectTo** bei signUp IMMER setzen
5. **Deutsche Fehlermeldungen** für alle Auth-Errors
6. **Loading States** für alle async Auth-Operationen

### Firmen-Setup implementieren
1. **useCompanyGuard** für Firmendaten-Prüfung verwenden
2. **CompanyProtectionWrapper** um geschützte Bereiche
3. **RLS Policies** auf allen Firmen-bezogenen Tabellen
4. **Automatic Role Assignment** für neue Firmen
5. **Propagation Wait** nach Firmendaten-Updates

### Security Checklist
- [ ] RLS auf allen Tabellen aktiviert
- [ ] Passwort-Stärke-Validierung implementiert  
- [ ] reCAPTCHA für Registrierung aktiviert
- [ ] E-Mail-Verifikation in Produktion aktiviert
- [ ] Session-Timeouts konfiguriert
- [ ] Sichere Redirect-URLs gesetzt
- [ ] Error Messages geben keine sensiblen Infos preis

## 🔧 Technische Konfiguration

### Environment Variables (automatisch gesetzt)
```bash
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=[anon-key]
VITE_SUPABASE_PROJECT_ID=[project-id]
```

### Supabase Auth Settings
```toml
[auth]
enable_signup = true
enable_confirmations = true  # Produktion: true, Dev: false
password_min_length = 8
password_requirements = ["letters", "digits", "symbols"]

[auth.external.google]
enabled = true
client_id = "[google-client-id]"
secret = "[google-client-secret]"
```

### reCAPTCHA Konfiguration
```javascript
// Secrets in Supabase
RECAPTCHA_SITE_KEY = "[site-key]"
RECAPTCHA_SECRET_KEY = "[secret-key]"  

// Verifikation über Edge Function
POST /functions/v1/verify-recaptcha
Body: { token: "[recaptcha-token]" }
```

---

## 📋 Zusammenfassung für Knowledge Base

**CleanFlow.ai Authentifizierung** ist ein mehrstufiger Prozess:

1. **Registrierung** (Email oder Google) mit Sicherheitsvalidierung
2. **E-Mail-Bestätigung** zur Account-Aktivierung  
3. **Pflichthafter Firmen-Setup** mit automatischer Rollen-Zuweisung
4. **Vollzugriff** auf alle CleanFlow.ai Funktionen

**Sicherheit:** reCAPTCHA, Passwort-Stärke, RLS Policies, Multi-Tenancy
**Benutzerführung:** Automatische Redirects, Zwangs-Setup, Deutsche UI
**Fehlerbehandlung:** Toast-Benachrichtigungen, Retry-Mechanismen, Recovery-Optionen

Dieser Prozess gewährleistet sichere, mandantenfähige Authentifizierung mit optimaler User Experience für Schweizer Reinigungsunternehmen.