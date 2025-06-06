document.addEventListener('DOMContentLoaded', function() {
    
    const themeToggle = document.getElementById('theme-toggle');
    const statsBtn = document.getElementById('stats-btn');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskModal = document.getElementById('task-modal');
    const statsModal = document.getElementById('stats-modal');
    const taskForm = document.getElementById('task-form');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const tasksContainer = document.getElementById('tasks-container');
    const projectsList = document.getElementById('projects-list');
    const addProjectBtn = document.getElementById('add-project-btn');
    const newProjectInput = document.getElementById('new-project-input');
    const taskProjectSelect = document.getElementById('task-project');
    const taskSearch = document.getElementById('task-search');
    const sortBy = document.getElementById('sort-by');
    const filterBy = document.getElementById('filter-by');
    
    
    const allTasksBtn = document.getElementById('all-tasks');
    const todayTasksBtn = document.getElementById('today-tasks');
    const importantTasksBtn = document.getElementById('important-tasks');
    const completedTasksBtn = document.getElementById('completed-tasks');
    const currentViewElement = document.getElementById('current-view');
    
    
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksStatElement = document.getElementById('completed-tasks-stat');
    const overdueTasksElement = document.getElementById('overdue-tasks');
    const highPriorityTasksElement = document.getElementById('high-priority-tasks');
    const priorityBars = document.querySelectorAll('.chart-bar');

    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let projects = JSON.parse(localStorage.getItem('projects')) || ['Work', 'Personal', 'Shopping'];
    let currentView = 'all';
    let currentProject = null;

   
    init();