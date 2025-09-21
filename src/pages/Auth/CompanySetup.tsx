import { useNavigate } from 'react-router-dom';
import CompanyForm from '@/components/CompanyForm';

export default function CompanySetup() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="w-full max-w-2xl">
        <CompanyForm onSuccess={handleSuccess} />
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Die Firmendatenerfassung ist erforderlich, um CleanFlow.ai nutzen zu können.
          </p>
        </div>
      </div>
    </div>
  );
}