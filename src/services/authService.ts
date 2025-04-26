let sessionData: { token?: string; user?: { name: string; email: string } } = {};

export const login = async (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        sessionData = { token: 'fake-jwt-token', user: { name: 'Admin User', email: 'admin@example.com' } };
        resolve(sessionData);
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};

export const logout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      sessionData = {};
      resolve({ message: 'Logged out successfully' });
    }, 500);
  });
};

export const getSessionData = () => sessionData;
