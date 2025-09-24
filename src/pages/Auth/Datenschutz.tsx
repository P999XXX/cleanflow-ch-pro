import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Datenschutz = () => {
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
            <CardTitle className="text-3xl">Datenschutzerklärung</CardTitle>
            <p className="text-muted-foreground">Stand: September 2024</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Verantwortliche Stelle</h2>
              <p className="text-muted-foreground">
                Verantwortlich für die Datenverarbeitung auf dieser Website ist CleanFlow.ai. 
                Kontakt: datenschutz@cleanflow.ai
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
              <div className="space-y-3">
                <h3 className="font-medium">Bei der Registrierung erheben wir:</h3>
                <div className="space-y-1 text-muted-foreground ml-4">
                  <p>• Vor- und Nachname</p>
                  <p>• E-Mail-Adresse</p>
                  <p>• Firmeninformationen</p>
                  <p>• Passwort (verschlüsselt gespeichert)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Zweck der Datenverarbeitung</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>• Bereitstellung und Verwaltung Ihres Benutzerkontos</p>
                <p>• Erbringung der vereinbarten Dienstleistungen</p>
                <p>• Kommunikation bezüglich unserer Services</p>
                <p>• Verbesserung unserer Plattform</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Rechtsgrundlage</h2>
              <p className="text-muted-foreground">
                Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) 
                sowie zur Erfüllung des Vertrags (Art. 6 Abs. 1 lit. b DSGVO).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Datensicherheit</h2>
              <p className="text-muted-foreground">
                Wir verwenden moderne Verschlüsselungstechnologien und Sicherheitsmassnahmen zum Schutz Ihrer Daten. 
                Die Datenübertragung erfolgt über SSL-verschlüsselte Verbindungen.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Cookies und Tracking</h2>
              <p className="text-muted-foreground">
                Wir verwenden technisch notwendige Cookies für die Funktionalität der Plattform. 
                Tracking-Cookies werden nur mit Ihrer ausdrücklichen Zustimmung eingesetzt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Ihre Rechte</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>• Recht auf Auskunft über Ihre gespeicherten Daten</p>
                <p>• Recht auf Berichtigung unrichtiger Daten</p>
                <p>• Recht auf Löschung Ihrer Daten</p>
                <p>• Recht auf Einschränkung der Verarbeitung</p>
                <p>• Recht auf Datenübertragbarkeit</p>
                <p>• Widerspruchsrecht gegen die Verarbeitung</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Speicherdauer</h2>
              <p className="text-muted-foreground">
                Ihre Daten werden solange gespeichert, wie Ihr Benutzerkonto aktiv ist. 
                Nach Löschung des Kontos werden die Daten innerhalb von 30 Tagen vollständig entfernt.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Kontakt</h2>
              <p className="text-muted-foreground">
                Bei Fragen zum Datenschutz wenden Sie sich an: datenschutz@cleanflow.ai
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Datenschutz;