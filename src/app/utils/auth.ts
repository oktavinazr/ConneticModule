export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  gender: 'Laki-laki' | 'Perempuan';
  class: string;
  nis: string;
  role: 'student' | 'admin';
  registeredAt?: string;
}

interface StoredUser extends User {
  password: string;
}

const ADMIN_CREDENTIALS = {
  id: 'admin-root',
  username: 'admin',
  email: 'admin@connetic.local',
  password: 'Admin123',
  name: 'Administrator',
  gender: 'Laki-laki' as const,
  class: '',
  nis: '',
  role: 'admin' as const,
};

export const register = (
  name: string,
  username: string,
  email: string,
  password: string,
  gender: 'Laki-laki' | 'Perempuan',
  classRoom: string,
  nis: string
): boolean => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedNis = nis.trim();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return false;
  }

  if (users.some((u) => u.username.toLowerCase() === normalizedUsername)) {
    return false;
  }

  if (users.some((u) => u.nis === normalizedNis)) {
    return false;
  }

  const newUser: StoredUser = {
    id: Date.now().toString(),
    name: name.trim(),
    username: username.trim(),
    email: normalizedEmail,
    password,
    gender,
    class: classRoom.trim(),
    nis: normalizedNis,
    role: 'student',
    registeredAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return true;
};

export const login = (identifier: string, password: string): User | null => {
  const normalizedIdentifier = identifier.trim().toLowerCase();

  if (
    (normalizedIdentifier === ADMIN_CREDENTIALS.username || normalizedIdentifier === ADMIN_CREDENTIALS.email) &&
    password === ADMIN_CREDENTIALS.password
  ) {
    const adminUser: User = {
      id: ADMIN_CREDENTIALS.id,
      username: ADMIN_CREDENTIALS.username,
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      gender: ADMIN_CREDENTIALS.gender,
      class: '',
      nis: '',
      role: 'admin',
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('currentUser', JSON.stringify(adminUser));
    return adminUser;
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(
    (u) =>
      (u.email.toLowerCase() === normalizedIdentifier || u.username.toLowerCase() === normalizedIdentifier) &&
      u.password === password
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = user;
  localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  return userWithoutPassword;
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

export const updateUser = (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'registeredAt' | 'role'>>
): boolean => {
  if (userId === ADMIN_CREDENTIALS.id) {
    const currentUser = getCurrentUser();
    if (!currentUser) return false;
    localStorage.setItem(
      'currentUser',
      JSON.stringify({
        ...currentUser,
        ...updates,
      })
    );
    return true;
  }

  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return false;
  }

  if (updates.email && updates.email.trim().toLowerCase() !== users[userIndex].email.toLowerCase()) {
    if (users.some((u, idx) => u.email.toLowerCase() === updates.email!.trim().toLowerCase() && idx !== userIndex)) {
      return false;
    }
  }

  if (updates.username && updates.username.trim().toLowerCase() !== users[userIndex].username.toLowerCase()) {
    if (users.some((u, idx) => u.username.toLowerCase() === updates.username!.trim().toLowerCase() && idx !== userIndex)) {
      return false;
    }
  }

  if (updates.nis && updates.nis.trim() !== users[userIndex].nis) {
    if (users.some((u, idx) => u.nis === updates.nis!.trim() && idx !== userIndex)) {
      return false;
    }
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    email: updates.email ? updates.email.trim().toLowerCase() : users[userIndex].email,
    username: updates.username ? updates.username.trim() : users[userIndex].username,
    nis: updates.nis ? updates.nis.trim() : users[userIndex].nis,
  };
  localStorage.setItem('users', JSON.stringify(users));

  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const { password: _password, ...userWithoutPassword } = users[userIndex];
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  }

  return true;
};

export const getAllStudents = (): User[] => {
  const users: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
  return users
    .filter((u) => u.role === 'student')
    .map((u) => {
      const { password: _password, ...userWithoutPassword } = u;
      return userWithoutPassword;
    });
};

export const isAdminUser = (user: User | null): boolean => {
  return user?.role === 'admin';
};

export const getAdminCredentialsHint = () => {
  return {
    username: ADMIN_CREDENTIALS.username,
    password: ADMIN_CREDENTIALS.password,
  };
};
