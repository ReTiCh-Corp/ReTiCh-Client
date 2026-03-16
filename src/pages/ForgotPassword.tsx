import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // await authApi.forgotPassword(email);

      void email;

      setIsSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-white px-6 py-8 sm:px-8">
      <div className="mb-12">
        <Link
          to="/login"
          className="font-display text-xl font-bold text-radish-600"
        >
          ReTiCh
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
        {isSubmitted ? (
          <div>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-radish-50">
              <svg
                className="h-7 w-7 text-radish-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                role="img"
                aria-label="Email icon"
              >
                <title>Email</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900">
              Check your inbox
            </h1>
            <p className="mt-2 text-base text-gray-400">
              We sent a reset link to{' '}
              <span className="font-semibold text-gray-600">{email}</span>.
              Check your email and follow the instructions.
            </p>
            <Link
              to="/login"
              className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-radish-600 py-3.5 text-base font-bold text-white transition-all duration-150 hover:bg-radish-700 active:scale-[0.98]"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-gray-900">
                Forgot password?
              </h1>
              <p className="mt-2 text-base text-gray-400">
                No worries, we&apos;ll send you a reset link.
              </p>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full rounded-xl border-none bg-gray-100 px-4 py-3.5 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-radish-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-radish-600 py-3.5 text-base font-bold text-white transition-all duration-150 hover:bg-radish-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <p className="pb-4 pt-8 text-center text-sm text-gray-500">
        Remember your password?{' '}
        <Link to="/login" className="font-bold text-gray-900 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}

export default ForgotPassword;
