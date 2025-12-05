// src/helpers/authhelpers.js
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { notifyError } from '../utils/notify';

export const useProtectedAction = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (action, redirectPath = '/login') => {
    if (!isAuthenticated) {
      notifyError('Please log in to access this feature.');
      navigate(redirectPath, {
        state: { from: window.location.pathname },
      });
      return false;
    }
    return true;
  };

  return { requireAuth };
};

export const useApplication = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const canApply = (type) => {
    if (!isAuthenticated) {
      notifyError('Please log in to access this feature.');
      navigate('/login', {
        state: { from: window.location.pathname },
      });
      return false;
    }

    switch (type) {
      case 'mentorship':
      case 'entrepreneur':
      case 'job':
        return true;
      default:
        return true;
    }
  };

  return { canApply };
};
