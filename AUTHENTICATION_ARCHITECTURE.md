# CleanFlow.ai - Authentifizierungs- und Firmendatenformular Architektur

## 📋 Überblick der aktuellen Architektur

### Authentifizierungs-Flow
```
1. Benutzer-Registrierung (Register.tsx)
   ├── Email/Passwort + Persönliche Daten
   ├── Google OAuth Alternative
   ├── reCAPTCHA Verification
   ├── AGB/Datenschutz Zustimmung
   └── Redirect zu: /company-setup

2. E-Mail-Verifizierung (VerifyEmail.tsx)
   ├── Token-basierte Verifizierung
   ├── Success → Redirect zu: /einstellungen?setup=true
   └── Error → Manueller Retry

3. Firmen-Setup (Mandatory)
   ├── CompanyProtectionWrapper prüft Firmendaten
   ├── Erzwingt Firmendatenformular bei fehlen der Daten
   ├── Blockiert alle Funktionen außer /einstellungen, /profileinstellungen
   └── useCompanyGuard Hook für Datenprüfung
```

### Datenbank-Schema

#### Tabelle: profiles
- `user_id` (UUID, FK zu auth.users)
- `first_name`, `last_name` (aus Registration)
- `phone`, `account_status`, `deleted_at`
- **RLS**: Nur eigene Profile lesbar/bearbeitbar

#### Tabelle: companies
- `owner_id` (UUID, FK zu auth.users)
- `name` (Required), `address`, `postal_code`, `city`
- `phone`, `email`, `website`
- `tax_number`, `vat_number`
- **RLS**: Nur eigene Firmen lesbar/bearbeitbar

#### Tabelle: user_roles
- `user_id`, `company_id`, `role` (app_role enum)
- **Automatik**: Firma-Owner erhält 'masteradministrator' Rolle
- **RLS**: Nur eigene Rollen einsehbar

### Haupt-Komponenten

#### 1. useAuth Hook
**Zweck**: Zentrale Authentifizierungs-Logik
- Session/User State Management
- signUp, signIn, signInWithGoogle, signOut
- Toast-Benachrichtigungen für Auth-Events
- reCAPTCHA Integration für Registrierung

#### 2. CompanyForm Komponente
**Modi**: 
- `isProfile`: Bearbeitungsmodus in Einstellungen
- `isSetupMode`: Erstmaliges Setup nach Registrierung
- `isModal`: Modal-Darstellung mit Overlay

**Props-System**: Sehr flexibel aber komplex
- `onSuccess`, `onClose` Callbacks
- `title` Override für Modal-Titel

#### 3. useCompanyGuard Hook
**Zweck**: Firmendaten-Überprüfung und Routing-Schutz
- `hasCompany`: Boolean Status der Firmendaten
- `needsCompanySetup`: Computed Property für Setup-Bedarf
- `blockAction`: Funktion für Action-Blocking
- Automatische Redirects zu /einstellungen

#### 4. CompanyProtectionWrapper
**Zweck**: App-weiter Schutz vor fehlenden Firmendaten
- Erlaubt nur `/einstellungen`, `/profileinstellungen`
- Zeigt Setup-Card mit Modal-Formular
- Lädt nach erfolgreichem Setup die gesamte App neu

### Redirect- und URL-Struktur

#### E-Mail-Redirects
```javascript
// Registrierung (useAuth.tsx)
emailRedirectTo: `${window.location.origin}/company-setup`

// E-Mail-Verifizierung (VerifyEmail.tsx)  
navigate('/einstellungen?setup=true');

// Google OAuth (useAuth.tsx)
redirectTo: `${window.location.origin}/company-setup`
```

#### Setup-Parameter
- `?setup=true`: Triggert automatisches Firmenformular in Einstellungen
- Einstellungen.tsx erkennt Parameter und öffnet Modal

### RLS (Row Level Security) Policies

#### Companies Table
```sql
-- Benutzer können nur eigene Firma erstellen
INSERT: (auth.uid() = owner_id)

-- Benutzer können nur eigene Firma bearbeiten  
UPDATE: (auth.uid() = owner_id)

-- Benutzer können nur eigene Firma einsehen
SELECT: (auth.uid() = owner_id)
```

#### Automatic Role Assignment
```sql
-- Trigger: assign_masteradmin_role()
-- Wird automatisch ausgeführt beim Erstellen einer Firma
-- Weist dem owner_id die Rolle 'masteradministrator' zu
```

### Benutzerführung (UX Flow)

#### Erstmaliger Benutzer
1. **Registrierung**: /register → Persönliche Daten + Passwort
2. **E-Mail bestätigen**: Link in E-Mail → VerifyEmail.tsx
3. **Redirect**: Automatisch zu /einstellungen?setup=true
4. **Firmen-Setup**: Modal öffnet sich automatisch
5. **Vollzugriff**: Nach Formular-Abschluss alle Features verfügbar

#### Wiederkehrender Benutzer ohne Firmendaten
1. **Login**: /login → Erfolgreich authentifiziert
2. **Redirect-Block**: useCompanyGuard erkennt fehlende Firma
3. **Zwangs-Redirect**: Automatisch zu /einstellungen
4. **Setup-Pflicht**: Firmendaten müssen ausgefüllt werden
5. **Feature-Block**: Alle anderen Funktionen gesperrt

#### Authentifizierter Benutzer mit Firmendaten
1. **Login**: Direkt zu / (Dashboard)
2. **Vollzugriff**: Alle Features verfügbar
3. **Firmendaten**: Editierbar über /einstellungen

### Sicherheits-Features

#### Passwort-Anforderungen
- Mindestens 8 Zeichen
- Buchstaben + Zahlen + Sonderzeichen
- Passwort-Stärke-Anzeige in Echtzeit
- Passwort-Bestätigung erforderlich

#### reCAPTCHA Integration
- Nur bei Akzeptanz der AGB sichtbar
- Erforderlich für Registrierung
- Edge Function Verifikation: `verify-recaptcha`

#### Session Management
- Supabase Auth mit localStorage
- Automatisches Token-Refresh
- Session-State in useAuth Hook
- "Angemeldet bleiben" Option

### Error Handling

#### Authentication Errors
- Toast-Benachrichtigungen für alle Auth-Fehler
- Benutzerfreundliche deutsche Fehlermeldungen
- Retry-Mechanismen für E-Mail-Verifizierung
- Automatische Weiterleitung bei erfolgreichen Aktionen

#### Company Setup Errors
- Validierung der Pflichtfelder (name)
- RLS Policy Fehler-Behandlung
- Propagation Wait-Mechanismus für neue Firmendaten
- Rollback bei fehlgeschlagenen Updates

### Lokalisierung

#### Deutsche Benutzeroberfläche
- Alle Texte, Labels, Fehlermeldungen auf Deutsch
- Schweizer Konventionen (PLZ, Telefon-Format)
- Schweizer Standard-Land ('Schweiz')
- CHF-Währung (implizit)

### Performance Optimierungen

#### Loading States
- Spinner während Auth-Operationen
- Disable-States für Buttons während Requests
- Skeleton Loading für Company-Daten
- Optimistic Updates wo möglich

#### State Management
- Lokaler State für Formulare
- Supabase Realtime für Companies Table (optional)
- React Query Integration (bereit, aber noch nicht vollständig genutzt)
- Effiziente Re-Renders durch präzise Dependencies

## 🔧 Erkannte Probleme der aktuellen Architektur

### 1. Inkonsistente Redirect-URLs
- useAuth: `/company-setup` (existiert nicht)
- VerifyEmail: `/einstellungen?setup=true`
- Unterschiedliche Ziele für gleiche Intention

### 2. Überladene Komponenten
- CompanyForm hat zu viele Modi und Props
- CompanyProtectionWrapper mischt UI und Logik
- useCompanyGuard macht zu viele Seiteneffekte

### 3. Redundante Logik
- Mehrfache Company-Checks an verschiedenen Stellen
- Doppelung von Redirect-Logik
- Inkonsistente Error-Handling Patterns

### 4. Routing-Komplexität
- Setup-Parameter `/einstellungen?setup=true` umständlich
- Fehlende dedizierte Setup-Route
- Verzahnung zwischen verschiedenen Routing-Guards

### 5. UX-Inkonsistenzen
- Manchmal Modal, manchmal Full-Page
- Unterschiedliche Erfolgsmeldungen
- Verwirrende Weiterleitungen

## 🚀 Refactoring-Plan

### Phase 1: Routing-Vereinfachung
1. Einheitliche `/company-setup` Route
2. Direkte Weiterleitung nach E-Mail-Verifizierung
3. Setup-Parameter entfernen

### Phase 2: Komponenten-Aufbau
1. CompanyForm in kleinere Teile aufteilen
2. Dedicated CompanySetup-Page erstellen
3. useCompanyGuard vereinfachen

### Phase 3: State Management
1. Zentrale Company-Context erstellen
2. Lokale States zusammenführen
3. Redundante API-Calls eliminieren

### Phase 4: UX-Verbesserungen
1. Konsistente Erfolgsmeldungen
2. Einheitliche Loading-States
3. Bessere Error-Recovery