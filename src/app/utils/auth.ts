// Authentication utilities using localStorage
export interface User {
  id: string;
  name: string;
  email: string;
  class: string;
  nis: string;
  role: 'student' | 'teacher';
  registeredAt?: string;
}

export const register = (
  name: string,
  email: string,
  password: string,
  classRoom: string,
  nis: string,
  role: 'student' | 'teacher'
): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Check if email already exists
  if (users.some((u: User & { password: string }) => u.email === email)) {
    return false;
  }

  // Check if NIS already exists (only for students)
  if (role === 'student' && users.some((u: User & { password: string }) => u.nis === nis)) {
    return false;
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    class: classRoom,
    nis: role === 'student' ? nis : '', // NIS empty for teachers
    role,
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

export const login = (email: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: User & { password: string }) => u.email === email && u.password === password);

  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};

export const updateUser = (userId: string, updates: Partial<Omit<User, 'id' | 'registeredAt'>>): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u: User & { password: string }) => u.id === userId);

  if (userIndex === -1) {
    return false;
  }

  // Check if email is being changed and already exists
  if (updates.email && updates.email !== users[userIndex].email) {
    if (users.some((u: User & { password: string }, idx: number) => u.email === updates.email && idx !== userIndex)) {
      return false;
    }
  }

  // Check if NIS is being changed and already exists (only for students)
  if (updates.nis && updates.nis !== users[userIndex].nis) {
    if (
      users.some(
        (u: User & { password: string }, idx: number) => u.nis === updates.nis && idx !== userIndex && u.role === 'student'
      )
    ) {
      return false;
    }
  }

  // Update user
  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem('users', JSON.stringify(users));

  // Update current user if it's the same user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const { password: _, ...userWithoutPassword } = users[userIndex];
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  }

  return true;
};

export const getAllStudents = (): User[] => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  return users
    .filter((u: User) => u.role === 'student')
    .map((u: User & { password: string }) => {
      const { password: _, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
};