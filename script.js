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

    function init() {
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        renderProjects();
        renderTasks();
        updateStats();

        
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('task-due-date').min = today;
    }

    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    
    addTaskBtn.addEventListener('click', () => {
        taskModal.style.display = 'flex';
        document.getElementById('task-title').focus();
    });

    statsBtn.addEventListener('click', () => {
        updateStats();
        statsModal.style.display = 'flex';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            taskModal.style.display = 'none';
            statsModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.style.display = 'none';
        }
        if (e.target === statsModal) {
            statsModal.style.display = 'none';
        }
    });

   
    taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const project = document.getElementById('task-project').value;
    const important = document.getElementById('task-important').checked;
    
    const newTask = {
        id: Date.now().toString(),
        title,
        description,
        dueDate,
        priority,
        project,
        important,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    taskForm.reset();
    taskModal.style.display = 'none';
});
