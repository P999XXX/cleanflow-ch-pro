import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const AGB = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Allgemeine Geschäftsbedingungen (AGB)</CardTitle>
            <p className="text-muted-foreground">Stand: September 2024</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Geltungsbereich</h2>
              <p className="text-muted-foreground">
                Diese Allgemeinen Geschäftsbedingungen gelten für alle Leistungen von CleanFlow.ai, 
                einer Software-as-a-Service (SaaS) Plattform für Reinigungsunternehmen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Vertragsgegenstand</h2>
              <p className="text-muted-foreground">
                CleanFlow.ai stellt eine webbasierte Softwarelösung zur Verwaltung von Reinigungsunternehmen zur Verfügung. 
                Die Plattform umfasst Funktionen zur Kunden-, Mitarbeiter-, Projekt- und Auftragsverwaltung.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Registrierung und Nutzerkonto</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>• Die Registrierung erfordert wahrheitsgemäße Angaben</p>
                <p>• Jeder Nutzer ist für die Sicherheit seines Kontos verantwortlich</p>
                <p>• Die Weitergabe von Zugangsdaten ist nicht gestattet</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Leistungsumfang</h2>
              <p className="text-muted-foreground">
                Der Funktionsumfang der Software wird in der jeweiligen Produktbeschreibung definiert. 
                Änderungen und Erweiterungen behalten wir uns vor.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Datenschutz</h2>
              <p className="text-muted-foreground">
                Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung 
                und den geltenden schweizerischen Datenschutzbestimmungen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Haftung</h2>
              <p className="text-muted-foreground">
                Die Haftung von CleanFlow.ai ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. 
                Eine Haftung für mittelbare Schäden wird ausgeschlossen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Anwendbares Recht</h2>
              <p className="text-muted-foreground">
                Es gilt schweizerisches Recht. Gerichtsstand ist der Sitz von CleanFlow.ai.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Kontakt</h2>
              <p className="text-muted-foreground">
                Bei Fragen zu diesen AGB wenden Sie sich bitte an: support@cleanflow.ai
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AGB;