type ErrorMessagesProps = {
  error: {code: string};
  setErrorMessage: (message: string) => void;
};

export const errorMessages = ({error, setErrorMessage}: ErrorMessagesProps) => {
  switch (error.code) {
    case 'auth/invalid-email':
      setErrorMessage(
        ...
      );
      break;
    case 'auth/email-already-in-use':
      setErrorMessage(
        '...
      );
      break;
    case 'auth/user-not-found':
      setErrorMessage('...');
      break;
    case 'auth/wrong-password':
      setErrorMessage('...');
      break;
    case 'auth/weak-password':
      setErrorMessage(
        '...',
      );
      break;
   ...
      break;
  }
};
