import bcrypt from 'bcryptjs';

export const users = [
  {
    id: '1',
    email: 'admin@acme.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'John',
    lastName: 'Doe',
    role: 'SuperAdmin',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'manager@acme.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Admin',
    createdAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    email: 'user@acme.com',
    password: bcrypt.hashSync('password123', 10),
    firstName: 'Bob',
    lastName: 'Johnson',
    role: 'User',
    createdAt: '2023-03-10T09:15:00Z',
  },
];