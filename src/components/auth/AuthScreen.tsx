import React from 'react';
import { SignIn, SignUp, useSignIn, useSignUp } from '@clerk/clerk-react';
import { useState } from 'react';

const AuthScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">
              Family Finance
            </h1>
            <p className="text-blue-100">
              Manage your family finances together
            </p>
          </div>
        </div>
        
        <div className="p-6">
          {!isSignUp ? (
            <SignIn 
              routing="hash"
              signUpUrl="#/sign-up"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "w-full mb-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3 px-4 flex items-center justify-center space-x-3 transition-colors",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm",
                  formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  formFieldLabel: "block text-sm font-medium text-gray-700 mb-2",
                  formButtonPrimary: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                  footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                  identityPreviewText: "text-gray-600",
                  identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                  formFieldSuccessText: "text-green-600 text-sm mt-1",
                  formFieldErrorText: "text-red-600 text-sm mt-1",
                  alertText: "text-red-600 text-sm",
                  formFieldHintText: "text-gray-500 text-sm mt-1"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  showOptionalFields: false
                }
              }}
              afterSignInUrl="/"
            />
          ) : (
            <SignUp 
              routing="hash"
              signInUrl="#/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 bg-transparent p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "w-full mb-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg py-3 px-4 flex items-center justify-center space-x-3 transition-colors",
                  socialButtonsBlockButtonText: "font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-500 text-sm",
                  formFieldInput: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  formFieldLabel: "block text-sm font-medium text-gray-700 mb-2",
                  formButtonPrimary: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors",
                  footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
                  identityPreviewText: "text-gray-600",
                  identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                  formFieldSuccessText: "text-green-600 text-sm mt-1",
                  formFieldErrorText: "text-red-600 text-sm mt-1",
                  alertText: "text-red-600 text-sm",
                  formFieldHintText: "text-gray-500 text-sm mt-1"
                },
                layout: {
                  socialButtonsPlacement: "top",
                  showOptionalFields: false
                }
              }}
              afterSignUpUrl="/"
            />
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secured by Clerk • Development Mode
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;