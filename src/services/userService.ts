export const editUserProfile = async (name: string, email: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Profile updated successfully', user: { name, email } });
    }, 1000);
  });
};
