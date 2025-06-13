/* export const mockUsers = [
  {
    id: '1',
    name: 'Usuario 1',
    email: 'bigmon@example.com',
    password: 'demo123'
  },

  {
    id: '2',
    name: 'Usuario',
    email: 'uno@mail.com',
    password: 'uno12345678'
  }
];

export const mockLogin = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      success: true,
      token: 'mock-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
  return {
    success: false,
    error: 'Credenciales inválidas'
  };
};

export const mockRegister = (userData) => {
  return {
    success: true,
    message: 'Usuario registrado exitosamente'
  };
}; */

export const mockUsers = [
  {
    id: '1',
    name: 'Usuario 1',
    email: 'bigmon@example.com',
    password: 'demo123'
  },
  {
    id: '2',
    name: 'Usuario',
    email: 'uno@mail.com',
    password: 'uno12345678'
  }
];

export const mockLogin = (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    return {
      success: true,
      token: 'mock-token',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
  return {
    success: false,
    error: 'Credenciales inválidas'
  };
};

export const mockRegister = (userData) => {
  const { name, email, password } = userData;

  // Validación simple
  if (!name || !email || !password) {
    return {
      success: false,
      error: 'Todos los campos son obligatorios'
    };
  }

  // Verificar si el correo ya existe
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    return {
      success: false,
      error: 'El correo ya está registrado'
    };
  }

  // Agregar nuevo usuario al array
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    password
  };

  mockUsers.push(newUser);

  return {
    success: true,
    message: 'Usuario registrado exitosamente'
  };
};
