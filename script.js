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

 
    addProjectBtn.addEventListener('click', function() {
        const projectName = newProjectInput.value.trim();
        if (projectName && !projects.includes(projectName)) {
            projects.push(projectName);
            saveProjects();
            renderProjects();
            newProjectInput.value = '';
        }
    });

    newProjectInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addProjectBtn.click();
        }
    });

    
    allTasksBtn.addEventListener('click', function() {
        setActiveView('all', this);
    });

    todayTasksBtn.addEventListener('click', function() {
        setActiveView('today', this);
    });

    importantTasksBtn.addEventListener('click', function() {
        setActiveView('important', this);
    });

    completedTasksBtn.addEventListener('click', function() {
        setActiveView('completed', this);
    });

    
    taskSearch.addEventListener('input', renderTasks);
    sortBy.addEventListener('change', renderTasks);
    filterBy.addEventListener('change', renderTasks);

    function setActiveView(view, button) {
        currentView = view;
        currentProject = null;
        
        
        document.querySelectorAll('.sidebar-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        
        document.querySelectorAll('.projects-list li').forEach(li => {
            li.classList.remove('active');
        });
        
        
        let viewTitle = 'All Tasks';
        switch(view) {
            case 'today':
                viewTitle = 'Today\'s Tasks';
                break;
            case 'important':
                viewTitle = 'Important Tasks';
                break;
            case 'completed':
                viewTitle = 'Completed Tasks';
                break;
        }
        currentViewElement.textContent = viewTitle;
        
        renderTasks();
    }

    function renderProjects() {
        projectsList.innerHTML = '';
        projects.forEach(project => {
            const li = document.createElement('li');
            li.textContent = project;
            li.addEventListener('click', () => {
                currentProject = project;
                currentView = 'project';
                
                
                document.querySelectorAll('.sidebar-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelectorAll('.projects-list li').forEach(item => {
                    item.classList.remove('active');
                });
                li.classList.add('active');
                
                currentViewElement.textContent = `${project} Tasks`;
                renderTasks();
            });
            
            const projectActions = document.createElement('div');
            projectActions.className = 'project-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete project';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Delete project "${project}"? Tasks will be moved to "No Project".`)) {
                    
                    tasks.forEach(task => {
                        if (task.project === project) {
                            task.project = '';
                        }
                    });
                    saveTasks();
                    
                    
                    projects = projects.filter(p => p !== project);
                    saveProjects();
                    renderProjects();
                    
                    
                    if (currentProject === project) {
                        setActiveView('all', allTasksBtn);
                    }
                }
            });
            
            projectActions.appendChild(deleteBtn);
            li.appendChild(projectActions);
            projectsList.appendChild(li);
        });
        
        
        taskProjectSelect.innerHTML = '<option value="">No Project</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project;
            option.textContent = project;
            taskProjectSelect.appendChild(option);
        });
    }

    function renderTasks() {
        tasksContainer.innerHTML = '';
        
        let filteredTasks = [...tasks];
        const searchTerm = taskSearch.value.toLowerCase();
        
        
        if (searchTerm) {
            filteredTasks = filteredTasks.filter(task => 
                task.title.toLowerCase().includes(searchTerm) || 
                task.description.toLowerCase().includes(searchTerm)
            );
        }
        
        
        switch(currentView) {
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                filteredTasks = filteredTasks.filter(task => task.dueDate === today);
                break;
            case 'important':
                filteredTasks = filteredTasks.filter(task => task.important && !task.completed);
                    break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            case 'project':
                filteredTasks = filteredTasks.filter(task => task.project === currentProject);
                break;
            default:
                
                break;
        }
        
        
        const priorityFilter = filterBy.value;
        if (priorityFilter !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
        }
        
        
        const sortField = sortBy.value;
        filteredTasks.sort((a, b) => {
            switch(sortField) {
                case 'dueDate':
                    return new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31');
                case 'priority':
                    const priorityOrder = { high: 1, medium: 2, low: 3 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'creationDate':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'importance':
                    return (b.important ? 1 : 0) - (a.important ? 1 : 0);
                default:
                    return 0;
            }
        });
        
        if (filteredTasks.length === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-tasks"></i>
                <h3>No tasks found</h3>
                <p>${currentView === 'all' ? 'Try adding a new task' : 'No tasks match your criteria'}</p>
            `;
            tasksContainer.appendChild(emptyState);
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.priority}-priority ${task.completed ? 'completed' : ''} ${task.important ? 'important' : ''}`;
            
            const today = new Date().toISOString().split('T')[0];
            const isOverdue = task.dueDate && task.dueDate < today && !task.completed;
            
            taskElement.innerHTML = `
                <div class="task-header-row">
                    <div class="task-title">
                        <input type="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="title-text">${task.title}</span>
                    </div>
                    <div class="task-actions-row">
                        <button class="btn-icon important-btn" title="${task.important ? 'Remove from important' : 'Mark as important'}">
                            <i class="fas fa-star ${task.important ? 'active' : ''}"></i>
                        </button>
                        <button class="btn-icon edit-btn" title="Edit task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-btn" title="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-meta">
                    <div>
                        ${task.dueDate ? `
                            <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
                                <i class="fas fa-calendar-alt"></i>
                                ${formatDate(task.dueDate)} ${isOverdue ? '(Overdue)' : ''}
                            </span>
                        ` : ''}
                    </div>
                    <div class="task-meta-right">
                        ${task.project ? `<span class="task-project">${task.project}</span>` : ''}
                        <span class="task-priority ${task.priority}">
                            <i class="fas fa-circle"></i>
                            ${task.priority}
                        </span>
                    </div>
                </div>
            `;

            
            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                saveTasks();
                renderTasks();
                updateStats();
            });
            
            const importantBtn = taskElement.querySelector('.important-btn');
                  importantBtn.addEventListener('click', () => {
                  task.important = !task.important;
                    saveTasks();
                    renderTasks();
                    updateStats();
            });
            
            const editBtn = taskElement.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                editTask(task);
            });
            
            const deleteBtn = taskElement.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this task?')) {
                    tasks = tasks.filter(t => t.id !== task.id);
                    saveTasks();
                    renderTasks();
                    updateStats();
                }
            });
            
            tasksContainer.appendChild(taskElement);
        });
    }

        function editTask(task) {
    document.getElementById('task-title').value = task.title;
    document.getElementById('task-description').value = task.description || '';
    document.getElementById('task-due-date').value = task.dueDate || '';
    document.getElementById('task-priority').value = task.priority;
    document.getElementById('task-project').value = task.project || '';
    document.getElementById('task-important').checked = task.important;


        const formTitle = taskModal.querySelector('h2');
        formTitle.textContent = 'Edit Task';
        
        const submitBtn = taskForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update Task';
        
        
        const newForm = taskForm.cloneNode(true);
        taskForm.parentNode.replaceChild(newForm, taskForm);
        document.getElementById('task-form').addEventListener('submit', function(e) {
            e.preventDefault();
            task.title = document.getElementById('task-title').value;
            task.description = document.getElementById('task-description').value;
            task.dueDate = document.getElementById('task-due-date').value;
            task.priority = document.getElementById('task-priority').value;
            task.project = document.getElementById('task-project').value;
            
            saveTasks();
            renderTasks();
            updateStats();
            
            
            this.reset();
            taskModal.style.display = 'none';
        });
        
        
        taskModal.style.display = 'flex';
    }

    function updateStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const overdueTasks = tasks.filter(task => {
            const today = new Date().toISOString().split('T')[0];
            return task.dueDate && task.dueDate < today && !task.completed;
        }).length;
        const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

        totalTasksElement.textContent = totalTasks;
        completedTasksStatElement.textContent = `${completedTasks} (${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%)`;
        overdueTasksElement.textContent = overdueTasks;
        highPriorityTasksElement.textContent = highPriorityTasks;
        
        
        const priorityCounts = {
            high: tasks.filter(task => task.priority === 'high').length,
            medium: tasks.filter(task => task.priority === 'medium').length,
            low: tasks.filter(task => task.priority === 'low').length
        };