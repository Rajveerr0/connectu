import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validateName } from '../utils/validation';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setFormData((prev) => ({
        ...prev,
        role: roleParam,
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!validateName(formData.name)) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setAlert({ type: '', message: '' });

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);

      if (result.success) {
        setAlert({ type: 'success', message: '🎉 Account created successfully!' });

        // Auto-hide alert and redirect to the correct dashboard
        setTimeout(() => {
          setAlert({ type: '', message: '' });

          if (result.user?.role === 'Student') navigate('/student/dashboard');
          else if (result.user?.role === 'Alumni') navigate('/alumni/dashboard');
          else if (result.user?.role === 'Admin') navigate('/admin/dashboard');
          else navigate('/');
        }, 2500);
      } else {
        setAlert({ type: 'error', message: result.error || '❌ Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setAlert({ type: 'error', message: '⚠️ An error occurred during registration. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { value: 'Student', label: 'Student', icon: '🎓', description: 'Current student looking for opportunities' },
    { value: 'Alumni', label: 'Alumni', icon: '🌟', description: 'Graduate ready to give back' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join ConnectU</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 relative overflow-hidden">
          {/* Alert Message */}
          {alert.message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium shadow-md border ${
                alert.type === 'success'
                  ? 'bg-green-100 text-green-800 border-green-300'
                  : 'bg-red-100 text-red-800 border-red-300'
              }`}
            >
              {alert.message}
            </motion.div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Create a password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.role ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.icon} {role.label}
                  </option>
                ))}
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}

              {/* Role descriptions */}
              <div className="mt-3 space-y-2">
                {roles.map(
                  (role) =>
                    formData.role === role.value && (
                      <div key={role.value} className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                        <span className="font-medium">
                          {role.icon} {role.label}:
                        </span>{' '}
                        {role.description}
                      </div>
                    )
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Alumni can later register as mentors or entrepreneurs from their dashboard to access additional features.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
              } shadow-md`}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Login here
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700 text-sm">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
