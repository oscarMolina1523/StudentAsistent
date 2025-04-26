export const login = async (username: string, password: string) => {
  // Simulación de una llamada a la API
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        resolve({ token: "fake-jwt-token", user: { username } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 1000);
  });
};
