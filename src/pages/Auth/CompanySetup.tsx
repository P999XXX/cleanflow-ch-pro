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
          <button 
            onClick={() => navigate('/login')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Später vervollständigen
          </button>
        </div>
      </div>
    </div>
  );
}