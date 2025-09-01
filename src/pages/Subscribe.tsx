import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Subscribe() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to pricing page
    navigate('/pricing', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to pricing...</p>
      </div>
    </div>
  );
}
