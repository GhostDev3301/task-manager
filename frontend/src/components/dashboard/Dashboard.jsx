import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { FiCalendar, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [teamTasks, setTeamTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [tasksRes, meetingsRes, teamTasksRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/meetings'),
        axios.get('http://localhost:5000/api/team-tasks')
      ]);
      
      setTasks(tasksRes.data);
      setMeetings(meetingsRes.data);
      setTeamTasks(teamTasksRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekRange = () => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    return { start, end };
  };

  const filterThisWeek = (items, dateField) => {
    const { start, end } = getWeekRange();
    return items.filter(item => 
      isWithinInterval(new Date(item[dateField]), { start, end })
    );
  };

  const countByStatus = (items, statusField) => {
    return items.reduce((acc, item) => {
      acc[item[statusField]] = (acc[item[statusField]] || 0) + 1;
      return acc;
    }, {});
  };

  const upcomingDeadlines = [...tasks, ...teamTasks]
    .filter(item => new Date(item.endDate) > new Date())
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5);

  const weekTasks = filterThisWeek(tasks, 'startDate');
  const weekMeetings = filterThisWeek(meetings, 'date');
  const taskStatusCount = countByStatus(tasks, 'status');
  const teamTaskStatusCount = countByStatus(teamTasks, 'status');

  if (loading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <FiCalendar className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Tareas esta semana</p>
              <p className="text-2xl font-bold">{weekTasks.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Tareas completadas</p>
              <p className="text-2xl font-bold">{taskStatusCount.completed || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full mr-4">
              <FiClock className="text-yellow-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Reuniones esta semana</p>
              <p className="text-2xl font-bold">{weekMeetings.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full mr-4">
              <FiAlertTriangle className="text-red-500 text-xl" />
            </div>
            <div>
              <p className="text-gray-500">Tareas pendientes</p>
              <p className="text-2xl font-bold">{taskStatusCount.pending || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Próximos vencimientos</h2>
          <div className="space-y-3">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item) => (
                <div key={item._id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.title}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(item.endDate), 'dd/MM/yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{item.description}</p>
                  {item.assignedTo && (
                    <p className="text-xs text-gray-500">
                      Asignada a: {item.assignedTo.name}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay vencimientos próximos</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Próximas reuniones</h2>
          <div className="space-y-3">
            {weekMeetings.length > 0 ? (
              weekMeetings.map((meeting) => (
                <div key={meeting._id} className="border-b pb-3 last:border-b-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{meeting.title}</h3>
                    <span className="text-sm text-gray-500">
                      {format(new Date(meeting.date), 'dd/MM/yyyy')} a las {meeting.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{meeting.description}</p>
                  {meeting.googleCalendarEventId && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                      Sincronizado con Google
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay reuniones esta semana</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

/*

import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { FiCalendar, FiCheckCircle, FiClock, FiAlertTriangle, FiChevronRight } from 'react-icons/fi';
import { getDashboardData } from '../../mocks/dashboardMock';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setTasks(data.tasks || []);
      setMeetings(data.meetings || []);
      setStats(data.stats || {});
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekRange = () => {
    const now = new Date();
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    return { start, end };
  };

  const filterThisWeek = (items, dateField) => {
    const { start, end } = getWeekRange();
    return items.filter(item =>
      isWithinInterval(new Date(item[dateField]), { start, end })
    );
  };

  const countByStatus = (items, statusField) => {
    return items.reduce((acc, item) => {
      acc[item[statusField]] = (acc[item[statusField]] || 0) + 1;
      return acc;
    }, {});
  };

  const weekTasks = filterThisWeek(tasks, 'startDate');
  const weekMeetings = filterThisWeek(meetings, 'date');
  const taskStatusCount = countByStatus(tasks, 'status');

  const upcomingDeadlines = tasks
    .filter(item => new Date(item.endDate) > new Date())
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 5);

  // Calcula el porcentaje de tareas completadas
  const totalTasks = tasks.length;
  const completedTasks = taskStatusCount.completed || 0;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  if (loading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-800">Dashboard</h1>
      
      {/* Estadísticas principales */ /*}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-blue-500 text-white rounded-full shadow">
            <FiCalendar className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-600 font-medium">Tareas esta semana</p>
            <p className="text-3xl font-bold">{weekTasks.length}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-50 p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-green-500 text-white rounded-full shadow">
            <FiCheckCircle className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-600 font-medium">Tareas completadas</p>
            <p className="text-3xl font-bold">{completedTasks}</p>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="text-xs text-green-700">{completionRate}% completadas</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-yellow-400 text-white rounded-full shadow">
            <FiClock className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-600 font-medium">Reuniones esta semana</p>
            <p className="text-3xl font-bold">{weekMeetings.length}</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-50 p-5 rounded-xl shadow flex items-center gap-4">
          <div className="p-3 bg-red-500 text-white rounded-full shadow">
            <FiAlertTriangle className="text-2xl" />
          </div>
          <div>
            <p className="text-gray-600 font-medium">Tareas pendientes</p>
            <p className="text-3xl font-bold">{taskStatusCount.pending || 0}</p>
          </div>
        </div>
      </div>

      {/* Próximos vencimientos y reuniones */ /*}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">Vencimientos</span>
            <h2 className="text-xl font-bold text-gray-800">Próximos vencimientos</h2>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <h3 className="font-semibold text-gray-700">{item.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {format(new Date(item.endDate), 'dd/MM/yyyy')}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay vencimientos próximos</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center mb-4">
            <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold mr-2">Reuniones</span>
            <h2 className="text-xl font-bold text-gray-800">Próximas reuniones</h2>
          </div>
          <div className="space-y-4">
            {weekMeetings.length > 0 ? (
              weekMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                  <div>
                    <h3 className="font-semibold text-gray-700">{meeting.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{meeting.description}</p>
                    {meeting.googleCalendar && (
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">
                        Sincronizado con Google
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                      {format(new Date(meeting.date), 'dd/MM/yyyy')} {meeting.time && `a las ${meeting.time}`}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay reuniones esta semana</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; */