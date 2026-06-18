// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';


export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-[400px] text-center transform hover:scale-105 transition-transform duration-300">
                    <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-500">ProDash</h1>
                    <p className="text-gray-600 mb-8 font-medium">Log in to your vibrant workspace</p>
                    <button onClick={() => setIsLoggedIn(true)} className="w-full bg-gradient-to-r from-indigo-600 to-pink-500 hover:from-indigo-700 hover:to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all">
                        Enter Workspace
                    </button>
                </div>
            </div>
        );
    }

    
    return (
        <BrowserRouter>
            <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
                <Sidebar setIsLoggedIn={setIsLoggedIn} />
               
                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-8">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}


function Sidebar({ setIsLoggedIn }) {
    const location = useLocation(); 

    return (
        <div className="w-64 bg-slate-900 text-white h-screen fixed top-0 left-0 flex flex-col shadow-2xl z-50">
            <div className="p-6">
                <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
                    ProDash.
                </h2>
               
                <nav className="flex flex-col gap-4">
                    <Link to="/" className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${location.pathname === '/' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                        📊 Kanban Board
                    </Link>
                    <Link to="/settings" className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center gap-3 ${location.pathname === '/settings' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg' : 'hover:bg-slate-800 text-slate-400 hover:text-white'}`}>
                        ⚙️ Settings
                    </Link>
                </nav>
            </div>
           
            <div className="mt-auto p-6">
                <button onClick={() => setIsLoggedIn(false)} className="w-full bg-slate-800 hover:bg-red-500 text-slate-300 hover:text-white font-bold py-3 rounded-xl transition-colors shadow-md">
                    Logout
                </button>
            </div>
        </div>
    );
}


function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899']; 

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        const response = await axios.get('http://localhost:5000/api/tasks');
        setTasks(response.data);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.title.trim()) return;
        await axios.post('http://localhost:5000/api/tasks', newTask);
        setNewTask({ title: '', description: '', dueDate: '' });
        fetchTasks();
    };

    const updateStatus = async (id, newStatus) => {
        await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status: newStatus });
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`);
        fetchTasks();
    };

    const completedTasks = tasks.filter(t => t.status === 'Done').length;
    const progressPercentage = tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);
    const chartData = [
        { name: 'To Do', value: tasks.filter(t => t.status === 'To Do').length },
        { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
        { name: 'Done', value: tasks.filter(t => t.status === 'Done').length },
    ];

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-10">
                <h1 className="text-4xl font-extrabold text-slate-900 drop-shadow-sm">Project Overview</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage your workflow and track progress.</p>
            </header>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="col-span-2 p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Total Completion</h2>
                    <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">{progressPercentage}%</p>
                    <div className="w-full bg-slate-100 rounded-full h-4 shadow-inner">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                </div>

                <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-md" />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Colorful Input Form */}
            <form onSubmit={handleAddTask} className="mb-10 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-wrap gap-4 items-center transition-all focus-within:ring-4 focus-within:ring-blue-100">
                <input type="text" placeholder="✨ What are we doing today?" required value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="flex-1 min-w-[200px] bg-slate-50 p-4 rounded-xl text-slate-800 font-semibold focus:outline-none focus:bg-white transition-colors" />
                <input type="text" placeholder="📝 Details..." value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="flex-1 min-w-[200px] bg-slate-50 p-4 rounded-xl text-slate-600 focus:outline-none focus:bg-white transition-colors" />
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} className="bg-slate-50 p-4 rounded-xl text-slate-500 font-medium focus:outline-none cursor-pointer" />
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 transition-all">
                    Create Task
                </button>
            </form>

            {/* Structured Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['To Do', 'In Progress', 'Done'].map(status => (
                    <div key={status} className="bg-slate-100/50 p-6 rounded-3xl border border-slate-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-lg text-slate-700 uppercase tracking-wider">{status}</h3>
                            <span className="bg-white text-blue-600 font-bold px-3 py-1 rounded-full shadow-sm">{tasks.filter(t => t.status === status).length}</span>
                        </div>
                       
                        <div className="space-y-4">
                            {tasks.filter(t => t.status === status).map(task => (
                                <div key={task._id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl border border-slate-100 transform hover:-translate-y-1 transition-all group relative border-l-4 border-l-blue-500">
                                    <button onClick={() => deleteTask(task._id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 p-1.5 rounded-full">
                                        ✖
                                    </button>
                                    <h4 className="font-bold text-slate-900 text-lg mb-2 pr-6">{task.title}</h4>
                                    {task.description && <p className="text-sm text-slate-500 mb-4">{task.description}</p>}
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-xs font-bold text-pink-500 bg-pink-50 px-2.5 py-1 rounded-lg">
                                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Deadline'}
                                        </span>
                                        <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)} className="text-sm font-bold bg-slate-50 text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer outline-none hover:bg-slate-100">
                                            <option value="To Do">To Do</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


function Settings() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-8">Workspace Settings</h1>
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Profile Information</h2>
                <p className="text-slate-600 mb-6">Manage your account settings and preferences here. (This is a second page routed via React Router!)</p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                        <input type="text" disabled value="Admin User" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                        <input type="text" disabled value="Project Manager" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-500 cursor-not-allowed" />
                    </div>
                </div>
            </div>
        </div>
    );
}