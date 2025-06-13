let mockTasks = [
  {
    id: '1',
    title: 'Tarea individual 1',
    description: 'Descripción de tarea individual',
    startDate: '2023-05-01',
    endDate: '2023-05-10',
    priority: 'medium',
    status: 'pending',
    userId: '1'
  },
  {
    id: '2',
    title: 'Tarea importante',
    description: 'Esta tarea tiene alta prioridad',
    startDate: '2023-05-05',
    endDate: '2023-05-15',
    priority: 'high',
    status: 'in-progress',
    userId: '1'
  }
];

export const getTasks = () => {
  return Promise.resolve(mockTasks);
};

export const createTask = (task) => {
  const newTask = { ...task, id: Date.now().toString() };
  mockTasks.push(newTask);
  return Promise.resolve(newTask);
};

export const updateTask = (id, updates) => {
  mockTasks = mockTasks.map(task => 
    task.id === id ? { ...task, ...updates } : task
  );
  return Promise.resolve({ id, ...updates });
};

export const deleteTask = (id) => {
  mockTasks = mockTasks.filter(task => task.id !== id);
  return Promise.resolve({ success: true });
};