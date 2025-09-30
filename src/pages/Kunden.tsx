import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Kunden = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    // Redirect to Kontakte page with customer filter
    const params = new URLSearchParams(searchParams);
    params.set("type", "kunde");
    navigate(`/kontakte?${params.toString()}`, { replace: true });
  }, [navigate, searchParams]);
  
  return null;
};

export default Kunden;
