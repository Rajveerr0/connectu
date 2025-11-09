import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const useProtectedAction = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (action, redirectPath = '/login') => {
    if (!isAuthenticated) {
      alert('Please login first to access this feature');
      navigate(redirectPath, { 
        state: { from: window.location.pathname } 
      });
      return false;
    }
    return true;
  };

  return { requireAuth };
};

// Hook for checking if user can apply/book/collaborate
export const useApplication = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const canApply = (type) => {
    if (!isAuthenticated) {
      alert('Please login first to access this feature');
      navigate('/login', { 
        state: { from: window.location.pathname } 
      });
      return false;
    }

    // Add role-based restrictions if needed
    switch (type) {
      case 'mentorship':
        // Both students and alumni can book mentorship sessions
        return true;
      case 'entrepreneur':
        // Both students and alumni can collaborate with entrepreneurs
        return true;
      case 'job':
        // Both students and alumni can apply for jobs
        return true;
      default:
        return true;
    }
  };

  return { canApply };
};