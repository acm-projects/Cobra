import React, { useState, useRef, useEffect } from 'react';
import { Auth } from '../utils/auth';

interface VerificationPageProps {
  onVerificationComplete?: () => void;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ onVerificationComplete }) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [email, setEmail] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Get the email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingVerificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Handle countdown for resend link
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  // Focus the first input on mount
  useEffect(() => {
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (/^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value.slice(0, 1); // Only take the first digit
      setCode(newCode);
      
      // Focus the next input
      if (value && index < 5) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }

      // Check if all inputs are filled to auto-submit
      if (newCode.every(digit => digit) && !newCode.includes('')) {
        handleVerify();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      // Move to previous input when backspace is pressed on an empty input
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      // Move to previous input when left arrow is pressed
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    } else if (e.key === 'ArrowRight' && index < 5) {
      // Move to next input when right arrow is pressed
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    
    // Check if pasted content only contains digits
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split('');
      const newCode = [...code];
      
      // Fill available slots with pasted digits
      digits.forEach((digit, index) => {
        if (index < 6) {
          newCode[index] = digit;
        }
      });
      
      setCode(newCode);
      
      // Focus the appropriate input after paste
      const nextInputIndex = digits.length < 6 ? digits.length : 5;
      const nextInput = inputRefs.current[nextInputIndex];
      if (nextInput) {
        nextInput.focus();
      }

      // Auto-submit if all digits are filled
      if (newCode.every(digit => digit) && !newCode.includes('')) {
        setTimeout(() => handleVerify(), 100);
      }
    }
  };

  const handleVerify = async () => {
    if (code.some(digit => digit === '') || code.length === 0) {
      setError('Please enter your verification code.');
      return;
    }
    
    const verificationString = code.filter(digit => digit !== null).join('');
    
    if (verificationString.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }
    
    try {
      setIsVerifying(true);
      setError('');
      const success = await Auth.verifyEmail(email || '', verificationString);
      
      if (success) {

        // Clear verification flags
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('showVerificationInSidepanel');
        localStorage.removeItem('needsVerification');
        
        // Set verification status to prevent showing verification screen again
        localStorage.setItem('isVerified', 'true'); 
        // Show success message
        setSuccess('Verification successful!');
        
        // Set flag to show loading screen in sidepanel after verification
        localStorage.setItem('showLoadingOnSidepanel', 'true');
        
        // Notify parent that verification is complete
        if (onVerificationComplete) {
          setTimeout(() => onVerificationComplete(), 1500);
        }
      } else {
        setError('Verification failed. Please check your code and try again.');
      }
    } catch (error) {
      setError('An error occurred during verification. Please try again.');
      console.error('Verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdown > 0) return;
    
    try {
      await Auth.resendVerificationCode(email);
      setResendCountdown(60);
      setError('');
    } catch (err) {
      setError('Failed to resend verification code. Please try again.');
      console.error('Resend error:', err);
    }
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="auth-header">
          <img src="images/icon.png" alt="Cobra Logo" className="auth-logo" />
          <h1>Email Verification</h1>
        </div>
        
        <div className="auth-content">
          <p className="auth-description">
            We've sent a 6-digit verification code to{' '}
            <strong>{email || 'your email'}</strong>. Enter the code below to verify your account.
          </p>
          
          <div className="code-input-container">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="code-input"
                value={digit}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                disabled={isVerifying}
                autoComplete="off"
              />
            ))}
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}
          
          <div className="auth-actions">
            <button 
              className="primary-button" 
              onClick={handleVerify} 
              disabled={isVerifying || code.some(digit => digit === '')}
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
            
            <div className="resend-link">
              <span>Didn't receive a code? </span>
              <button 
                className="text-button" 
                onClick={handleResendCode} 
                disabled={resendCountdown > 0}
              >
                {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage; 