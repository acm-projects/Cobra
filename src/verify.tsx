import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth } from './utils/auth';

const VerificationPage: React.FC = () => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(60);
  const [email, setEmail] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null));

  // Get the email from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    
    if (emailParam) {
      setEmail(emailParam);
    } else {
      const storedEmail = localStorage.getItem('pendingVerificationEmail');
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        // Redirect to signup if no email is found
        window.location.href = 'signup.html';
      }
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
    // Explicit null check first as a separate statement
    if (!code) {
      setError('Please enter your verification code.');
      return;
    }
    
    if (code.some(digit => digit === '') || code.length === 0) {
      setError('Please enter your verification code.');
      return;
    }
    
    const verificationString = code.join('');
    
    if (verificationString.length !== 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }
    
    try {
      setIsVerifying(true);
      setError('');
      const success = await Auth.verifyEmail(email, verificationString);
      console.log("recieved this value for success: " + success);
      if (success) {
        localStorage.removeItem('pendingVerificationEmail');
        localStorage.removeItem('needsVerification');
        localStorage.removeItem('showVerificationInSidepanel');
        localStorage.setItem('isVerified', 'true');
      
        // Set flag to show loading screen in sidepanel after verification
        localStorage.setItem('showLoadingOnSidepanel', 'true');
        console.log("showing loading? (verify.tsx): " + localStorage.getItem('showLoadingOnSidepanel'));
        chrome.storage.local.set({showLoadingLoc: true});
        console.log("showing loading? (chrome.storage): " + localStorage.getItem('showLoadingOnSidepanel'));
        // Show success message
        setSuccess('Verification successful! Redirecting...');
        
        // Redirect after a brief delay to show the success message
        setTimeout(() => {
          // In Chrome extension context, try to open the sidepanel
          if (chrome && chrome.tabs && chrome.sidePanel) {
            console.log('Opening sidepanel after verification... ALL IS WELL');
            chrome.sidePanel.setOptions({ path: 'sidepanel.html' });
          } else {
            // Fallback for non-extension contexts or if chrome API is unavailable
            window.location.href = 'sidepanel.html';
          }
        }, 1500);
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
    <div className="auth-container">
      <div className="bg-decoration">
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
        <div className="bg-circle"></div>
      </div>
      
      <div className="auth-card">
        <div className="container-decoration"></div>
        
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
          
          <button 
            className="primary-button full-width" 
            onClick={handleVerify} 
            disabled={isVerifying || code.includes('') || code.length !== 6}
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
          
          <div className="resend-link">
            {resendCountdown > 0 ? (
              <span>Resend code in {resendCountdown}s</span>
            ) : (
              <a href="#" onClick={handleResendCode}>Resend verification code</a>
            )}
          </div>
          
          <div className="auth-footer">
            <a href="signup.html" className="back-link">
              <i className="fas fa-arrow-left"></i> Back to Signup
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<VerificationPage />);
}
