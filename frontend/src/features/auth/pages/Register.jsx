import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent } from '../../../components/ui/card';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullname: '',
    contact: '',
    email: '',
    password: '',
    isSeller: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      isSeller: e.target.checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullname || !formData.email || !formData.password || !formData.contact) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    try {
      await register(formData).unwrap();
      navigate('/login', { replace: true });
    } catch (err) {
      setErrorMsg(err?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Geist']">
      <div className="sm:mx-auto sm:w-full sm:max-w-[400px]">
        <Card className="p-6">
          <div className="mb-8 text-center">
            <h2 className="text-[24px] font-light text-primary mb-1 tracking-tight">Create Account</h2>
            <p className="text-[13px] text-[#666666]">Join the ecosystem.</p>
          </div>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  placeholder="Full Name"
                  required
                  value={formData.fullname}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Contact Number */}
              <div>
                <Input
                  id="contact"
                  name="contact"
                  type="tel"
                  placeholder="Contact Number"
                  required
                  value={formData.contact}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="pr-[40px]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-primary transition-colors flex items-center justify-center h-full focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-[16px] w-[16px]" strokeWidth={2} />
                  ) : (
                    <Eye className="h-[16px] w-[16px]" strokeWidth={2} />
                  )}
                </button>
              </div>

              {/* isSeller Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="isSeller"
                  name="isSeller"
                  checked={formData.isSeller}
                  onChange={handleCheckboxChange}
                  disabled={loading}
                />
                <Label
                  htmlFor="isSeller"
                  className="text-[14px] text-[#666666] cursor-pointer select-none font-normal"
                >
                  Register as a Seller
                </Label>
              </div>

              {/* Error Message */}
              {(errorMsg || error) && (
                <div className="text-[13px] text-[#ffb4ab] bg-[#93000a]/20 border border-[#93000a]/50 p-3 rounded-[6px]">
                  {errorMsg || error?.message || 'Something went wrong'}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full mt-8"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>

            </form>

            <div className="mt-6 text-center pt-6 border-t border-[#1e1e1e]">
              <p className="text-[13px] text-[#555555]">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline underline-offset-4 decoration-[#333333] transition-colors">
                  Login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}