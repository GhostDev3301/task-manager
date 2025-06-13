let mockTeamTasks = [
  {
    id: 't1',
    title: 'Tarea grupal 1',
    description: 'Primera tarea del equipo',
    startDate: '2023-05-01',
    endDate: '2023-05-20',
    status: 'pending',
    assignedTo: { id: '2', name: 'Colega 1' }
  }
];

let mockMembers = [
  { id: '2', name: 'Colega 1', email: 'colega1@example.com' },
  { id: '3', name: 'Colega 2', email: 'colega2@example.com' }
];

export const getTeamTasks = () => {
  return Promise.resolve(mockTeamTasks);
};

/* export const getTeamMembers = () => {
  return Promise.resolve(mockMembers);
}; */

export const getTeamMembers = async () => [
  { id: '1', name: 'Ana Torres' },
  { id: '2', name: 'Luis Pérez' },
  { id: '3', name: 'María Gómez' }
];

export const createTeamTask = (task) => {
  const assignedTo = mockMembers.find(m => m.id === task.assignedTo);
  const newTask = { 
    ...task, 
    id: `t${Date.now()}`,
    assignedTo
  };
  mockTeamTasks.push(newTask);
  return Promise.resolve(newTask);
};

export const updateTeamTaskStatus = (id, status) => {
  mockTeamTasks = mockTeamTasks.map(task => 
    task.id === id ? { ...task, status } : task
  );
  return Promise.resolve({ status });
};

export const getTeamRanking = async () => [
  {
    id: '1',
    name: 'Ana Torres',
    completedTasks: 15,
    efficiency: 0.95
  },
  {
    id: '2',
    name: 'Luis Pérez',
    completedTasks: 12,
    efficiency: 0.85
  },
  {
    id: '3',
    name: 'María Gómez',
    completedTasks: 10,
    efficiency: 0.80
  }
];