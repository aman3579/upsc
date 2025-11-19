// UPSC Super App - Main Application Logic

// ==================== DATA STRUCTURE & STORAGE ====================

const DB_KEY = 'upsc_super_app_data';

// Default data structure
const defaultData = {
    userProfile: {
        name: '',
        examYear: new Date().getFullYear() + 1,
        optional: '',
        joinDate: new Date().toISOString()
    },
    studyPlans: [],
    currentAffairs: [],
    notes: [],
    syllabusProgress: {
        GS1: {},
        GS2: {},
        GS3: {},
        GS4: {},
        Optional: {}
    },
    mockTests: [],
    answerPractice: [],
    studyStats: {},
    pomodoroSessions: [],
    resources: [],
    pyqAttempts: [],
    settings: {
        pomodoroWork: 25,
        pomodoroBreak: 5,
        dailyGoal: 8
    }
};

// LocalStorage utilities
const Storage = {
    get: () => {
        const data = localStorage.getItem(DB_KEY);
        return data ? JSON.parse(data) : defaultData;
    },
    set: (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },
    update: (key, value) => {
        const data = Storage.get();
        data[key] = value;
        Storage.set(data);
    }
};

// ==================== UTILITY FUNCTIONS ====================

// Format date
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Calculate study streak
function calculateStreak() {
    const data = Storage.get();
    const stats = data.studyStats;
    let streak = 0;
    let currentDate = new Date();

    while (true) {
        const dateKey = currentDate.toISOString().split('T')[0];
        if (stats[dateKey] && stats[dateKey].totalMinutes > 0) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}

// ==================== NAVIGATION & UI ====================

// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
});

// Navigation handling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();

        // Update active state
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Close mobile menu
        document.getElementById('sidebar').classList.remove('active');

        // Load section
        const section = e.currentTarget.dataset.section;
        loadSection(section);
    });
});

// Modal controls
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
});

function showModal(title, content) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    document.getElementById('modalOverlay').classList.add('active');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// ==================== SECTION RENDERING ====================

function loadSection(section) {
    const contentArea = document.getElementById('contentArea');
    contentArea.className = 'fade-in';

    switch (section) {
        case 'dashboard':
            renderDashboard();
            break;
        case 'study-planner':
            renderStudyPlanner();
            break;
        case 'current-affairs':
            renderCurrentAffairs();
            break;
        case 'pyq':
            renderPYQ();
            break;
        case 'mock-tests':
            renderMockTests();
            break;
        case 'notes':
            renderNotes();
            break;
        case 'syllabus':
            renderSyllabus();
            break;
        case 'answer-writing':
            renderAnswerWriting();
            break;
        case 'analytics':
            renderAnalytics();
            break;
        case 'pomodoro':
            renderPomodoro();
            break;
        case 'resources':
            renderResources();
            break;
        case 'optional':
            renderOptional();
            break;
        case 'interview':
            renderInterview();
            break;
        case 'motivation':
            renderMotivation();
            break;
        case 'settings':
            renderSettings();
            break;
        default:
            renderDashboard();
    }
}

// ==================== DASHBOARD ====================

function renderDashboard() {
    const data = Storage.get();
    const streak = calculateStreak();
    const todayStats = data.studyStats[getTodayDate()] || { totalMinutes: 0 };
    const testsCount = data.mockTests.length;
    const notesCount = data.notes.length;

    // Calculate syllabus completion percentage
    let totalTopics = 0;
    let completedTopics = 0;
    Object.values(data.syllabusProgress).forEach(subject => {
        Object.values(subject).forEach(status => {
            totalTopics++;
            if (status === 'completed') completedTopics++;
        });
    });
    const syllabusPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    // Motivational quotes
    const quotes = [
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The best preparation for tomorrow is doing your best today.", author: "H. Jackson Brown Jr." },
        { text: "Believe in yourself. You are braver than you think, more talented than you know, and capable of more than you imagine.", author: "Roy T. Bennett" },
        { text: "Dream big, work hard, stay focused, and surround yourself with good people.", author: "Anonymous" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" }
    ];
    const todayQuote = quotes[new Date().getDate() % quotes.length];

    const content = `
        <div class="content-header">
            <div>
                <h1 class="header-title">Dashboard</h1>
                <p class="text-secondary">Welcome back, ${data.userProfile.name || 'Aspirant'}! Keep pushing forward.</p>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div style="text-align: center; padding: var(--spacing-md);">
                <p style="font-size: var(--font-size-lg); font-style: italic; color: var(--text-primary); margin-bottom: var(--spacing-sm);">
                    "${todayQuote.text}"
                </p>
                <p style="color: var(--text-secondary);">— ${todayQuote.author}</p>
            </div>
        </div>
        
        <div class="grid grid-4 mb-lg">
            <div class="stat-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-value">${streak}</div>
                <div class="stat-label">Day Streak</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">⏱️</div>
                <div class="stat-value">${Math.floor(todayStats.totalMinutes / 60)}h ${todayStats.totalMinutes % 60}m</div>
                <div class="stat-label">Today's Study Time</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📝</div>
                <div class="stat-value">${testsCount}</div>
                <div class="stat-label">Tests Taken</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">✅</div>
                <div class="stat-value">${syllabusPercentage}%</div>
                <div class="stat-label">Syllabus Done</div>
            </div>
        </div>
        
        <div class="grid grid-2">
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Today's Tasks</h3>
                </div>
                <div class="card-body">
                    ${renderTodayTasks()}
                </div>
            </div>
            
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Quick Actions</h3>
                </div>
                <div class="card-body" style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                    <button class="btn btn-primary" onclick="document.querySelector('[data-section=\\'pomodoro\\']').click()">
                        ⏱️ Start Study Session
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('[data-section=\\'mock-tests\\']').click()">
                        📝 Take Mock Test
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('[data-section=\\'answer-writing\\']').click()">
                        ✍️ Practice Answer Writing
                    </button>
                    <button class="btn btn-secondary" onclick="document.querySelector('[data-section=\\'current-affairs\\']').click()">
                        📰 Read Current Affairs
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function renderTodayTasks() {
    const data = Storage.get();
    const today = getTodayDate();
    const todayTasks = data.studyPlans.filter(task => task.date === today);

    if (todayTasks.length === 0) {
        return '<p class="text-secondary">No tasks scheduled for today. Plan your day!</p>';
    }

    return todayTasks.map(task => `
        <div class="flex-between" style="padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-xs);">
            <div>
                <strong>${task.subject}</strong> - ${task.topic}
                <br><small class="text-secondary">${task.duration} mins</small>
            </div>
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTaskCompletion('${task.id}')"
                   style="width: 20px; height: 20px; cursor: pointer;">
        </div>
    `).join('');
}

function toggleTaskCompletion(taskId) {
    const data = Storage.get();
    const task = data.studyPlans.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;

        // Update study stats
        if (task.completed) {
            const dateKey = task.date;
            if (!data.studyStats[dateKey]) {
                data.studyStats[dateKey] = { totalMinutes: 0, bySubject: {} };
            }
            data.studyStats[dateKey].totalMinutes += parseInt(task.duration);
            if (!data.studyStats[dateKey].bySubject[task.subject]) {
                data.studyStats[dateKey].bySubject[task.subject] = 0;
            }
            data.studyStats[dateKey].bySubject[task.subject] += parseInt(task.duration);
        }

        Storage.set(data);
        loadSection('dashboard');
    }
}

// ==================== STUDY PLANNER ====================

function renderStudyPlanner() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Study Planner</h1>
            <button class="btn btn-primary" onclick="showAddTaskModal()">+ Add Task</button>
        </div>
        
        <div class="tabs mb-lg">
            <button class="tab active" onclick="switchPlannerTab('week')">This Week</button>
            <button class="tab" onclick="switchPlannerTab('all')">All Tasks</button>
        </div>
        
        <div id="plannerContent">
            ${renderWeekTasks()}
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function renderWeekTasks() {
    const data = Storage.get();
    const today = new Date();
    const weekTasks = {};

    // Get next 7 days
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateKey = date.toISOString().split('T')[0];
        weekTasks[dateKey] = {
            date: date,
            tasks: data.studyPlans.filter(task => task.date === dateKey)
        };
    }

    return Object.entries(weekTasks).map(([dateKey, dayData]) => {
        const isToday = dateKey === getTodayDate();
        return `
            <div class="glass-card mb-md">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${dayData.date.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                            ${isToday ? '<span class="badge badge-primary" style="margin-left: var(--spacing-sm);">Today</span>' : ''}
                        </h3>
                    </div>
                </div>
                <div class="card-body">
                    ${dayData.tasks.length === 0 ?
                '<p class="text-secondary">No tasks scheduled</p>' :
                dayData.tasks.map(task => `
                            <div class="flex-between subject-${task.subject.toLowerCase().replace(' ', '-')}" 
                                 style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm);">
                                <div style="flex: 1;">
                                    <div class="flex gap-sm" style="align-items: center; margin-bottom: var(--spacing-xs);">
                                        <span class="badge badge-info">${task.subject}</span>
                                        ${task.completed ? '<span class="badge badge-success">✓ Done</span>' : ''}
                                    </div>
                                    <strong>${task.topic}</strong>
                                    <br><small class="text-secondary">Duration: ${task.duration} minutes</small>
                                </div>
                                <div class="flex gap-sm">
                                    <button class="btn btn-icon btn-sm btn-secondary" onclick="deleteTask('${task.id}')">🗑️</button>
                                </div>
                            </div>
                        `).join('')
            }
                </div>
            </div>
        `;
    }).join('');
}

function showAddTaskModal() {
    const modalContent = `
        <form onsubmit="addTask(event)" id="addTaskForm">
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-input" name="date" required min="${getTodayDate()}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Subject</label>
                <select class="form-select" name="subject" required>
                    <option value="">Select Subject</option>
                    <option value="GS1">General Studies 1</option>
                    <option value="GS2">General Studies 2</option>
                    <option value="GS3">General Studies 3</option>
                    <option value="GS4">General Studies 4</option>
                    <option value="Optional">Optional Subject</option>
                    <option value="CSAT">CSAT</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Topic</label>
                <input type="text" class="form-input" name="topic" required placeholder="e.g., Indian Independence Movement">
            </div>
            
            <div class="form-group">
                <label class="form-label">Duration (minutes)</label>
                <input type="number" class="form-input" name="duration" required min="15" step="15" value="60">
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Task</button>
        </form>
    `;

    showModal('Add Study Task', modalContent);
}

function addTask(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Storage.get();

    const task = {
        id: generateId(),
        date: formData.get('date'),
        subject: formData.get('subject'),
        topic: formData.get('topic'),
        duration: formData.get('duration'),
        completed: false,
        createdAt: new Date().toISOString()
    };

    data.studyPlans.push(task);
    Storage.set(data);

    closeModal();
    loadSection('study-planner');
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        const data = Storage.get();
        data.studyPlans = data.studyPlans.filter(t => t.id !== taskId);
        Storage.set(data);
        loadSection('study-planner');
    }
}

function switchPlannerTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const plannerContent = document.getElementById('plannerContent');
    if (tab === 'week') {
        plannerContent.innerHTML = renderWeekTasks();
    } else {
        const data = Storage.get();
        plannerContent.innerHTML = `
            <div class="glass-card">
                ${data.studyPlans.length === 0 ?
                '<p class="text-secondary">No tasks created yet</p>' :
                data.studyPlans.map(task => `
                        <div class="flex-between subject-${task.subject.toLowerCase().replace(' ', '-')}" 
                             style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm);">
                            <div>
                                <span class="badge badge-info">${task.subject}</span>
                                ${task.completed ? '<span class="badge badge-success">✓</span>' : ''}
                                <br><strong>${task.topic}</strong>
                                <br><small class="text-secondary">${formatDate(task.date)} • ${task.duration} mins</small>
                            </div>
                            <button class="btn btn-icon btn-sm btn-secondary" onclick="deleteTask('${task.id}')">🗑️</button>
                        </div>
                    `).join('')
            }
            </div>
        `;
    }
}

// ==================== CURRENT AFFAIRS ====================

function renderCurrentAffairs() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Current Affairs</h1>
            <button class="btn btn-primary" onclick="showAddCurrentAffairModal()">+ Add Entry</button>
        </div>
        
        <div class="grid grid-2">
            ${data.currentAffairs.length === 0 ?
            '<div class="glass-card"><p class="text-secondary">No current affairs entries yet. Start adding daily updates!</p></div>' :
            data.currentAffairs.sort((a, b) => new Date(b.date) - new Date(a.date)).map(affair => `
                    <div class="glass-card">
                        <div class="card-header">
                            <div>
                                <span class="badge badge-primary">${affair.category}</span>
                                <p class="text-secondary" style="margin-top: var(--spacing-xs); font-size: var(--font-size-sm);">
                                    ${formatDate(affair.date)}
                                </p>
                            </div>
                            <button class="btn btn-icon btn-sm btn-secondary" onclick="deleteCurrentAffair('${affair.id}')">🗑️</button>
                        </div>
                        <div class="card-body">
                            <h3 style="margin-bottom: var(--spacing-sm);">${affair.title}</h3>
                            <p style="white-space: pre-wrap; line-height: 1.8;">${affair.content}</p>
                            ${affair.tags && affair.tags.length > 0 ?
                    `<div style="margin-top: var(--spacing-md);">
                                    ${affair.tags.map(tag => `<span class="badge badge-info" style="margin-right: var(--spacing-xs);">${tag}</span>`).join('')}
                                </div>` : ''
                }
                        </div>
                    </div>
                `).join('')
        }
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function showAddCurrentAffairModal() {
    const modalContent = `
        <form onsubmit="addCurrentAffair(event)">
            <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" class="form-input" name="date" required value="${getTodayDate()}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" name="category" required>
                    <option value="">Select Category</option>
                    <option value="National">National</option>
                    <option value="International">International</option>
                    <option value="Economy">Economy</option>
                    <option value="Science & Tech">Science & Technology</option>
                    <option value="Environment">Environment & Ecology</option>
                    <option value="Polity">Polity & Governance</option>
                    <option value="Society">Society & Social Justice</option>
                    <option value="Culture">Art & Culture</option>
                    <option value="Defense">Defense & Security</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" name="title" required placeholder="Brief headline">
            </div>
            
            <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-textarea" name="content" required placeholder="Key points, analysis, and syllabus linkage..." rows="6"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Tags (comma separated)</label>
                <input type="text" class="form-input" name="tags" placeholder="e.g., Budget 2024, GST, Economic Policy">
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Entry</button>
        </form>
    `;

    showModal('Add Current Affairs Entry', modalContent);
}

function addCurrentAffair(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Storage.get();

    const affair = {
        id: generateId(),
        date: formData.get('date'),
        category: formData.get('category'),
        title: formData.get('title'),
        content: formData.get('content'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
        createdAt: new Date().toISOString()
    };

    data.currentAffairs.push(affair);
    Storage.set(data);

    closeModal();
    loadSection('current-affairs');
}

function deleteCurrentAffair(id) {
    if (confirm('Delete this current affair entry?')) {
        const data = Storage.get();
        data.currentAffairs = data.currentAffairs.filter(a => a.id !== id);
        Storage.set(data);
        loadSection('current-affairs');
    }
}

// ==================== PREVIOUS YEAR QUESTIONS ====================

const samplePYQs = [
    {
        id: 'pyq1',
        year: 2023,
        subject: 'GS1',
        question: 'Discuss the significance of the Revolt of 1857 in the context of Indian freedom struggle.',
        type: 'Mains',
        marks: 10
    },
    {
        id: 'pyq2',
        year: 2023,
        subject: 'GS2',
        question: 'What is a "Constitutional Morality"? Examine its relevance in the Indian context.',
        type: 'Mains',
        marks: 10
    },
    {
        id: 'pyq3',
        year: 2022,
        subject: 'GS3',
        question: 'Discuss the impact of climate change on food security in India.',
        type: 'Mains',
        marks: 15
    },
    {
        id: 'pyq4',
        year: 2023,
        subject: 'Prelims',
        question: 'Which of the following is/are the feature(s) of a federal system?',
        options: [
            'Division of powers between the Centre and States',
            'Independent Judiciary',
            'Supremacy of the Constitution',
            'All of the above'
        ],
        correctAnswer: 3,
        type: 'Prelims'
    },
    {
        id: 'pyq5',
        year: 2022,
        subject: 'Prelims',
        question: 'The term "Blue Revolution" is related to:',
        options: [
            'Space technology',
            'Fisheries development',
            'Information technology',
            'Water conservation'
        ],
        correctAnswer: 1,
        type: 'Prelims'
    }
];

function renderPYQ() {
    const content = `
        <div class="content-header">
            <h1 class="header-title">Previous Year Questions</h1>
        </div>
        
        <div class="tabs mb-lg">
            <button class="tab active" onclick="switchPYQTab('mains')">Mains</button>
            <button class="tab" onclick="switchPYQTab('prelims')">Prelims</button>
        </div>
        
        <div id="pyqContent">
            ${renderMainsPYQ()}
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function renderMainsPYQ() {
    const mainsPYQs = samplePYQs.filter(q => q.type === 'Mains');

    return `
        <div class="glass-card">
            <p class="text-secondary mb-md">Practice previous year mains questions to understand exam patterns and improve answer writing.</p>
            ${mainsPYQs.map(pyq => `
                <div class="question-card">
                    <div class="flex-between mb-sm">
                        <div>
                            <span class="badge badge-primary">${pyq.subject}</span>
                            <span class="badge badge-info">${pyq.year}</span>
                            <span class="badge badge-warning">${pyq.marks} marks</span>
                        </div>
                    </div>
                    <div class="question-text">${pyq.question}</div>
                    <button class="btn btn-sm btn-secondary" onclick="practiceMainsAnswer('${pyq.id}')">✍️ Practice Answer</button>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPrelimsPYQ() {
    const prelimsPYQs = samplePYQs.filter(q => q.type === 'Prelims');
    const data = Storage.get();

    return `
        <div class="glass-card">
            <p class="text-secondary mb-md">Test your knowledge with previous year prelims questions.</p>
            ${prelimsPYQs.map(pyq => {
        const attempt = data.pyqAttempts.find(a => a.questionId === pyq.id);
        return `
                    <div class="question-card">
                        <div class="flex-between mb-sm">
                            <div>
                                <span class="badge badge-primary">${pyq.subject}</span>
                                <span class="badge badge-info">${pyq.year}</span>
                            </div>
                            ${attempt ?
                (attempt.selectedAnswer === pyq.correctAnswer ?
                    '<span class="badge badge-success">✓ Correct</span>' :
                    '<span class="badge badge-warning">✗ Incorrect</span>')
                : ''}
                        </div>
                        <div class="question-text mb-md">${pyq.question}</div>
                        <ul class="options">
                            ${pyq.options.map((option, index) => `
                                <li class="option ${attempt && attempt.selectedAnswer === index ? (index === pyq.correctAnswer ? 'correct' : 'incorrect') : ''} ${attempt && index === pyq.correctAnswer ? 'correct' : ''}" 
                                    onclick="${!attempt ? `selectPYQAnswer('${pyq.id}', ${index}, ${pyq.correctAnswer})` : ''}">
                                    ${String.fromCharCode(65 + index)}. ${option}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function switchPYQTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const pyqContent = document.getElementById('pyqContent');
    if (tab === 'mains') {
        pyqContent.innerHTML = renderMainsPYQ();
    } else {
        pyqContent.innerHTML = renderPrelimsPYQ();
    }
}

function selectPYQAnswer(questionId, selectedAnswer, correctAnswer) {
    const data = Storage.get();
    data.pyqAttempts.push({
        questionId,
        selectedAnswer,
        date: new Date().toISOString()
    });
    Storage.set(data);
    loadSection('pyq');
}

function practiceMainsAnswer(questionId) {
    const pyq = samplePYQs.find(q => q.id === questionId);
    const modalContent = `
        <div class="alert alert-info">
            <strong>Question (${pyq.marks} marks):</strong><br>
            ${pyq.question}
        </div>
        <form onsubmit="saveMainsAnswer(event, '${questionId}')">
            <div class="form-group">
                <label class="form-label">Your Answer</label>
                <textarea class="form-textarea" name="answer" rows="10" placeholder="Write your answer here..." required></textarea>
                <small class="text-secondary">Target: ${pyq.marks === 10 ? '150' : '250'} words</small>
            </div>
            <button type="submit" class="btn btn-primary" style="width: 100%;">Save Answer</button>
        </form>
    `;
    showModal('Practice Answer Writing', modalContent);
}

function saveMainsAnswer(e, questionId) {
    e.preventDefault();
    const answer = new FormData(e.target).get('answer');
    const data = Storage.get();

    data.answerPractice.push({
        id: generateId(),
        questionId,
        answer,
        wordCount: answer.split(/\s+/).length,
        date: new Date().toISOString()
    });

    Storage.set(data);
    closeModal();
    alert('Answer saved successfully!');
}

// ==================== MOCK TESTS ====================

function renderMockTests() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Mock Tests</h1>
            <div class="flex gap-sm">
                <button class="btn btn-primary" onclick="startMockTest('prelims')">📝 Start Prelims Test</button>
                <button class="btn btn-primary" onclick="startMockTest('mains')">✍️ Start Mains Test</button>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Test Performance Overview</h3>
            </div>
            <div class="card-body">
                ${data.mockTests.length === 0 ?
            '<p class="text-secondary">No tests taken yet. Start your first mock test!</p>' :
            `<div class="grid grid-3">
                        ${data.mockTests.map(test => `
                            <div class="stat-card">
                                <div class="stat-icon">${test.type === 'prelims' ? '📝' : '✍️'}</div>
                                <div class="stat-value">${test.score}%</div>
                                <div class="stat-label">${test.type} • ${formatDate(test.date)}</div>
                            </div>
                        `).join('')}
                    </div>`
        }
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">Recent Tests</h3>
            </div>
            <div class="card-body">
                ${data.mockTests.length === 0 ?
            '<p class="text-secondary">No test history available</p>' :
            data.mockTests.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map(test => `
                        <div class="flex-between" style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm);">
                            <div>
                                <span class="badge badge-primary">${test.type.toUpperCase()}</span>
                                <br><strong>Score: ${test.score}%</strong>
                                <br><small class="text-secondary">${formatDate(test.date)} • ${test.questionsCount} questions</small>
                            </div>
                            <button class="btn btn-sm btn-secondary" onclick="viewTestDetails('${test.id}')">View Details</button>
                        </div>
                    `).join('')
        }
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function startMockTest(type) {
    if (type === 'prelims') {
        alert('Prelims Mock Test feature coming soon! This will include 100 MCQs with timer and instant evaluation.');
    } else {
        alert('Mains Mock Test feature coming soon! This will include essay writing with word count and time tracking.');
    }

    // Simulate test completion for demo
    const data = Storage.get();
    data.mockTests.push({
        id: generateId(),
        type: type,
        date: new Date().toISOString(),
        score: Math.floor(Math.random() * 30) + 70,
        questionsCount: type === 'prelims' ? 100 : 8
    });
    Storage.set(data);
    loadSection('mock-tests');
}

function viewTestDetails(testId) {
    alert('Test details view coming soon!');
}

// ==================== NOTES & REVISION ====================

function renderNotes() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Notes & Revision</h1>
            <button class="btn btn-primary" onclick="showAddNoteModal()">+ Create Note</button>
        </div>
        
        <div class="grid grid-2">
            ${data.notes.length === 0 ?
            '<div class="glass-card"><p class="text-secondary">No notes yet. Start creating your personal knowledge base!</p></div>' :
            data.notes.sort((a, b) => new Date(b.modified) - new Date(a.modified)).map(note => `
                    <div class="glass-card">
                        <div class="card-header">
                            <div>
                                <span class="badge badge-primary">${note.subject}</span>
                                <h3 class="card-title" style="margin-top: var(--spacing-xs);">${note.topic}</h3>
                                <p class="text-secondary" style="font-size: var(--font-size-sm);">
                                    Modified: ${formatDate(note.modified)}
                                </p>
                            </div>
                            <div class="flex gap-sm">
                                <button class="btn btn-icon btn-sm btn-secondary" onclick="editNote('${note.id}')">✏️</button>
                                <button class="btn btn-icon btn-sm btn-secondary" onclick="deleteNote('${note.id}')">🗑️</button>
                            </div>
                        </div>
                        <div class="card-body">
                            <p style="white-space: pre-wrap; line-height: 1.8;">${note.content.substring(0, 200)}${note.content.length > 200 ? '...' : ''}</p>
                            ${note.tags && note.tags.length > 0 ?
                    `<div style="margin-top: var(--spacing-md);">
                                    ${note.tags.map(tag => `<span class="badge badge-info" style="margin-right: var(--spacing-xs);">${tag}</span>`).join('')}
                                </div>` : ''
                }
                        </div>
                    </div>
                `).join('')
        }
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function showAddNoteModal() {
    const modalContent = `
        <form onsubmit="addNote(event)">
            <div class="form-group">
                <label class="form-label">Subject</label>
                <select class="form-select" name="subject" required>
                    <option value="">Select Subject</option>
                    <option value="GS1">General Studies 1</option>
                    <option value="GS2">General Studies 2</option>
                    <option value="GS3">General Studies 3</option>
                    <option value="GS4">General Studies 4</option>
                    <option value="Optional">Optional Subject</option>
                    <option value="CSAT">CSAT</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Topic</label>
                <input type="text" class="form-input" name="topic" required placeholder="e.g., Fundamental Rights">
            </div>
            
            <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-textarea" name="content" required rows="10" placeholder="Write your notes here..."></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Tags (comma separated)</label>
                <input type="text" class="form-input" name="tags" placeholder="e.g., Constitution, Rights, Articles">
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Create Note</button>
        </form>
    `;

    showModal('Create New Note', modalContent);
}

function addNote(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Storage.get();

    const note = {
        id: generateId(),
        subject: formData.get('subject'),
        topic: formData.get('topic'),
        content: formData.get('content'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
        created: new Date().toISOString(),
        modified: new Date().toISOString()
    };

    data.notes.push(note);
    Storage.set(data);

    closeModal();
    loadSection('notes');
}

function editNote(noteId) {
    const data = Storage.get();
    const note = data.notes.find(n => n.id === noteId);

    const modalContent = `
        <form onsubmit="updateNote(event, '${noteId}')">
            <div class="form-group">
                <label class="form-label">Subject</label>
                <select class="form-select" name="subject" required>
                    <option value="GS1" ${note.subject === 'GS1' ? 'selected' : ''}>General Studies 1</option>
                    <option value="GS2" ${note.subject === 'GS2' ? 'selected' : ''}>General Studies 2</option>
                    <option value="GS3" ${note.subject === 'GS3' ? 'selected' : ''}>General Studies 3</option>
                    <option value="GS4" ${note.subject === 'GS4' ? 'selected' : ''}>General Studies 4</option>
                    <option value="Optional" ${note.subject === 'Optional' ? 'selected' : ''}>Optional Subject</option>
                    <option value="CSAT" ${note.subject === 'CSAT' ? 'selected' : ''}>CSAT</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Topic</label>
                <input type="text" class="form-input" name="topic" required value="${note.topic}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Content</label>
                <textarea class="form-textarea" name="content" required rows="10">${note.content}</textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Tags (comma separated)</label>
                <input type="text" class="form-input" name="tags" value="${note.tags.join(', ')}">
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Update Note</button>
        </form>
    `;

    showModal('Edit Note', modalContent);
}

function updateNote(e, noteId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Storage.get();
    const note = data.notes.find(n => n.id === noteId);

    note.subject = formData.get('subject');
    note.topic = formData.get('topic');
    note.content = formData.get('content');
    note.tags = formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [];
    note.modified = new Date().toISOString();

    Storage.set(data);
    closeModal();
    loadSection('notes');
}

function deleteNote(noteId) {
    if (confirm('Delete this note?')) {
        const data = Storage.get();
        data.notes = data.notes.filter(n => n.id !== noteId);
        Storage.set(data);
        loadSection('notes');
    }
}

// ==================== SYLLABUS TRACKER ====================

const syllabusData = {
    GS1: [
        'Indian Heritage and Culture', 'Modern Indian History', 'Post-independence History',
        'World History', 'Indian Society', 'Geography of India', 'World Geography'
    ],
    GS2: [
        'Indian Constitution', 'Functions and Responsibilities of Union and States',
        'Federal Structure', 'Local Governments', 'Separation of Powers', 'Dispute Redressal',
        'Comparison with other Countries', 'Parliament and State Legislatures', 'Judiciary',
        'Government Policies', 'Social Sector/Services', 'International Relations'
    ],
    GS3: [
        'Indian Economy', 'Economic Development', 'Agriculture', 'Infrastructure',
        'Science and Technology', 'Environment and Biodiversity', 'Disaster Management',
        'Internal Security', 'Cybersecurity'
    ],
    GS4: [
        'Ethics and Human Interface', 'Attitude', 'Aptitude', 'Emotional Intelligence',
        'Contributions of Moral Thinkers', 'Public/Civil Service Values', 'Probity in Governance',
        'Case Studies on Ethics'
    ]
};

function renderSyllabus() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Syllabus Tracker</h1>
        </div>
        
        <div class="tabs mb-lg">
            <button class="tab active" onclick="switchSyllabusTab('GS1')">GS 1</button>
            <button class="tab" onclick="switchSyllabusTab('GS2')">GS 2</button>
            <button class="tab" onclick="switchSyllabusTab('GS3')">GS 3</button>
            <button class="tab" onclick="switchSyllabusTab('GS4')">GS 4</button>
            <button class="tab" onclick="switchSyllabusTab('Optional')">Optional</button>
        </div>
        
        <div id="syllabusContent">
            ${renderSyllabusSubject('GS1', data)}
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function renderSyllabusSubject(subject, data) {
    const topics = syllabusData[subject] || ['Add your optional subject topics in settings'];
    const progress = data.syllabusProgress[subject] || {};

    const completed = Object.values(progress).filter(s => s === 'completed').length;
    const inProgress = Object.values(progress).filter(s => s === 'in-progress').length;
    const notStarted = topics.length - completed - inProgress;

    const percentage = topics.length > 0 ? Math.round((completed / topics.length) * 100) : 0;

    return `
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">${subject} Progress: ${percentage}%</h3>
            </div>
            <div class="card-body">
                <div class="progress-container">
                    <div class="progress-bar success" style="width: ${percentage}%"></div>
                </div>
                <div class="grid grid-3 mt-md">
                    <div class="text-center">
                        <div style="font-size: var(--font-size-2xl); font-weight: 700; color: var(--accent-success);">${completed}</div>
                        <div class="text-secondary">Completed</div>
                    </div>
                    <div class="text-center">
                        <div style="font-size: var(--font-size-2xl); font-weight: 700; color: var(--accent-warning);">${inProgress}</div>
                        <div class="text-secondary">In Progress</div>
                    </div>
                    <div class="text-center">
                        <div style="font-size: var(--font-size-2xl); font-weight: 700; color: var(--text-muted);">${notStarted}</div>
                        <div class="text-secondary">Not Started</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-2">
            ${topics.map((topic, index) => {
        const status = progress[topic] || 'not-started';
        const statusBadge = status === 'completed' ? 'badge-success' :
            status === 'in-progress' ? 'badge-warning' : 'badge-info';
        const statusText = status === 'completed' ? '✓ Completed' :
            status === 'in-progress' ? '⏳ In Progress' : '○ Not Started';

        return `
                    <div class="glass-card">
                        <div class="card-header">
                            <div>
                                <h4>${topic}</h4>
                                <span class="badge ${statusBadge}">${statusText}</span>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="flex gap-sm">
                                <button class="btn btn-sm ${status === 'not-started' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="updateSyllabusStatus('${subject}', '${topic}', 'not-started')">
                                    Not Started
                                </button>
                                <button class="btn btn-sm ${status === 'in-progress' ? 'btn-primary' : 'btn-secondary'}" 
                                        onclick="updateSyllabusStatus('${subject}', '${topic}', 'in-progress')">
                                    In Progress
                                </button>
                                <button class="btn btn-sm ${status === 'completed' ? 'btn-success' : 'btn-secondary'}" 
                                        onclick="updateSyllabusStatus('${subject}', '${topic}', 'completed')">
                                    Completed
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;
}

function switchSyllabusTab(subject) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const data = Storage.get();
    document.getElementById('syllabusContent').innerHTML = renderSyllabusSubject(subject, data);
}

function updateSyllabusStatus(subject, topic, status) {
    const data = Storage.get();
    if (!data.syllabusProgress[subject]) {
        data.syllabusProgress[subject] = {};
    }
    data.syllabusProgress[subject][topic] = status;
    Storage.set(data);

    // Refresh the current subject view
    document.getElementById('syllabusContent').innerHTML = renderSyllabusSubject(subject, data);
}

// ==================== ANSWER WRITING PRACTICE ====================

const answerQuestions = [
    { id: 'aw1', question: 'What is the significance of financial inclusion in achieving sustainable development?', words: 250, minutes: 15 },
    { id: 'aw2', question: 'Discuss the role of technology in improving governance in India.', words: 250, minutes: 15 },
    { id: 'aw3', question: 'Examine the impact of climate change on agriculture in India.', words: 150, minutes: 10 },
    { id: 'aw4', question: 'What are the challenges faced by the Indian judiciary? Suggest measures to address them.', words: 250, minutes: 15 }
];

function renderAnswerWriting() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Answer Writing Practice</h1>
        </div>
        
        <div class="grid grid-2 mb-lg">
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Today's Practice Questions</h3>
                </div>
                <div class="card-body">
                    ${answerQuestions.map(q => `
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm);">
                            <p style="margin-bottom: var(--spacing-sm);"><strong>${q.question}</strong></p>
                            <div class="flex-between">
                                <small class="text-secondary">${q.words} words • ${q.minutes} mins</small>
                                <button class="btn btn-sm btn-primary" onclick="startAnswerWriting('${q.id}')">Start Writing</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Your Practice History</h3>
                </div>
                <div class="card-body">
                    ${data.answerPractice.length === 0 ?
            '<p class="text-secondary">No practice answers yet</p>' :
            data.answerPractice.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(practice => `
                            <div style="padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-xs);">
                                <div class="flex-between">
                                    <div>
                                        <strong>${practice.wordCount} words</strong>
                                        <br><small class="text-secondary">${formatDate(practice.date)}</small>
                                    </div>
                                    <button class="btn btn-sm btn-secondary" onclick="viewAnswer('${practice.id}')">View</button>
                                </div>
                            </div>
                        `).join('')
        }
                </div>
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">Answer Writing Tips</h3>
            </div>
            <div class="card-body">
                <ul style="line-height: 2;">
                    <li>Start with a clear introduction that sets the context</li>
                    <li>Use bullet points or subheadings for better readability</li>
                    <li>Support your arguments with facts, data, and examples</li>
                    <li>Provide a balanced view covering multiple dimensions</li>
                    <li>Conclude with a forward-looking statement or suggestion</li>
                    <li>Practice time management - stick to word limits</li>
                </ul>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function startAnswerWriting(questionId) {
    const question = answerQuestions.find(q => q.id === questionId);
    const modalContent = `
        <div class="alert alert-info">
            <strong>Question:</strong><br>${question.question}
            <br><br><strong>Target:</strong> ${question.words} words in ${question.minutes} minutes
        </div>
        
        <form onsubmit="saveAnswerWriting(event, '${questionId}')">
            <div class="form-group">
                <label class="form-label">Your Answer</label>
                <textarea class="form-textarea" name="answer" id="answerTextarea" rows="12" 
                          placeholder="Start writing your answer..." required></textarea>
                <div class="flex-between mt-sm">
                    <small class="text-secondary" id="wordCounter">Word count: 0</small>
                    <small class="text-secondary" id="timer">Time: 00:00</small>
                </div>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Save Answer</button>
        </form>
    `;

    showModal('Answer Writing Practice', modalContent);

    // Word counter
    document.getElementById('answerTextarea').addEventListener('input', (e) => {
        const words = e.target.value.trim().split(/\s+/).filter(w => w.length > 0).length;
        document.getElementById('wordCounter').textContent = `Word count: ${words}`;
    });

    // Timer
    let seconds = 0;
    const timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent =
            `Time: ${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);

    // Clear timer on modal close
    const originalClose = closeModal;
    window.closeModal = function () {
        clearInterval(timerInterval);
        window.closeModal = originalClose;
        originalClose();
    };
}

function saveAnswerWriting(e, questionId) {
    e.preventDefault();
    const answer = new FormData(e.target).get('answer');
    const data = Storage.get();

    data.answerPractice.push({
        id: generateId(),
        questionId,
        answer,
        wordCount: answer.trim().split(/\s+/).filter(w => w.length > 0).length,
        date: new Date().toISOString()
    });

    Storage.set(data);
    closeModal();
    loadSection('answer-writing');
}

function viewAnswer(practiceId) {
    const data = Storage.get();
    const practice = data.answerPractice.find(p => p.id === practiceId);

    const modalContent = `
        <div class="alert alert-success">
            Word Count: ${practice.wordCount} | Date: ${formatDate(practice.date)}
        </div>
        <div style="white-space: pre-wrap; line-height: 1.8; padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-md);">
            ${practice.answer}
        </div>
    `;

    showModal('Your Answer', modalContent);
}

// ==================== STUDY ANALYTICS ====================

function renderAnalytics() {
    const data = Storage.get();
    const stats = data.studyStats;

    // Calculate weekly stats
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().split('T')[0];
        last7Days.push({
            date: dateKey,
            day: date.toLocaleDateString('en-IN', { weekday: 'short' }),
            minutes: stats[dateKey]?.totalMinutes || 0
        });
    }

    const weekTotal = last7Days.reduce((sum, day) => sum + day.minutes, 0);
    const weekAverage = Math.round(weekTotal / 7);

    // Subject-wise distribution
    const subjectStats = {};
    Object.values(stats).forEach(dayStat => {
        if (dayStat.bySubject) {
            Object.entries(dayStat.bySubject).forEach(([subject, minutes]) => {
                subjectStats[subject] = (subjectStats[subject] || 0) + minutes;
            });
        }
    });

    const maxMinutes = Math.max(...last7Days.map(d => d.minutes), 1);

    const content = `
        <div class="content-header">
            <h1 class="header-title">Study Analytics</h1>
        </div>
        
        <div class="grid grid-4 mb-lg">
            <div class="stat-card">
                <div class="stat-icon">📊</div>
                <div class="stat-value">${Math.floor(weekTotal / 60)}h</div>
                <div class="stat-label">This Week</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📈</div>
                <div class="stat-value">${Math.floor(weekAverage / 60)}h ${weekAverage % 60}m</div>
                <div class="stat-label">Daily Average</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-value">${calculateStreak()}</div>
                <div class="stat-label">Day Streak</div>
            </div>
            
            <div class="stat-card">
                <div class="stat-icon">📚</div>
                <div class="stat-value">${data.notes.length}</div>
                <div class="stat-label">Notes Created</div>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Last 7 Days Study Time</h3>
            </div>
            <div class="card-body">
                <div style="display: flex; align-items: flex-end; gap: var(--spacing-sm); height: 200px;">
                    ${last7Days.map(day => `
                        <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: var(--spacing-xs);">
                            <small class="text-secondary">${Math.floor(day.minutes / 60)}h</small>
                            <div style="width: 100%; background: var(--gradient-primary); border-radius: var(--radius-sm); 
                                        height: ${(day.minutes / maxMinutes) * 150}px; min-height: 2px;">
                            </div>
                            <small class="text-secondary">${day.day}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">Subject-wise Time Distribution</h3>
            </div>
            <div class="card-body">
                ${Object.keys(subjectStats).length === 0 ?
            '<p class="text-secondary">No study data yet</p>' :
            Object.entries(subjectStats).map(([subject, minutes]) => {
                const totalMinutes = Object.values(subjectStats).reduce((a, b) => a + b, 0);
                const percentage = Math.round((minutes / totalMinutes) * 100);
                return `
                            <div style="margin-bottom: var(--spacing-md);">
                                <div class="flex-between mb-sm">
                                    <span><strong>${subject}</strong></span>
                                    <span class="text-secondary">${Math.floor(minutes / 60)}h ${minutes % 60}m (${percentage}%)</span>
                                </div>
                                <div class="progress-container">
                                    <div class="progress-bar" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        `;
            }).join('')
        }
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

// ==================== POMODORO TIMER ====================

let pomodoroInterval = null;
let pomodoroSeconds = 0;
let pomodoroMode = 'work'; // 'work' or 'break'
let pomodoroRunning = false;

function renderPomodoro() {
    const data = Storage.get();
    const settings = data.settings;
    const todaySessions = data.pomodoroSessions.filter(s =>
        s.date.startsWith(getTodayDate())
    );

    const content = `
        <div class="content-header">
            <h1 class="header-title">Pomodoro Timer</h1>
        </div>
        
        <div class="grid grid-2">
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Timer</h3>
                </div>
                <div class="card-body text-center">
                    <div class="timer-display" id="pomodoroDisplay">
                        ${String(settings.pomodoroWork).padStart(2, '0')}:00
                    </div>
                    <p class="text-secondary mb-lg" id="pomodoroMode">Work Session</p>
                    
                    <div class="form-group mb-md">
                        <label class="form-label">Study Subject</label>
                        <select class="form-select" id="pomodoroSubject">
                            <option value="GS1">General Studies 1</option>
                            <option value="GS2">General Studies 2</option>
                            <option value="GS3">General Studies 3</option>
                            <option value="GS4">General Studies 4</option>
                            <option value="Optional">Optional Subject</option>
                            <option value="CSAT">CSAT</option>
                        </select>
                    </div>
                    
                    <div class="flex gap-sm" style="justify-content: center;">
                        <button class="btn btn-primary" id="pomodoroStart" onclick="startPomodoro()">Start</button>
                        <button class="btn btn-secondary hidden" id="pomodoroPause" onclick="pausePomodoro()">Pause</button>
                        <button class="btn btn-secondary" onclick="resetPomodoro()">Reset</button>
                    </div>
                </div>
            </div>
            
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Today's Sessions</h3>
                </div>
                <div class="card-body">
                    <div class="stat-card mb-md">
                        <div class="stat-value">${todaySessions.length}</div>
                        <div class="stat-label">Sessions Completed</div>
                    </div>
                    
                    ${todaySessions.length === 0 ?
            '<p class="text-secondary">No sessions today</p>' :
            todaySessions.reverse().slice(0, 10).map(session => `
                            <div style="padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-xs);">
                                <div class="flex-between">
                                    <span class="badge badge-primary">${session.subject}</span>
                                    <span class="text-secondary">${session.duration} mins</span>
                                </div>
                            </div>
                        `).join('')
        }
                </div>
            </div>
        </div>
        
        <div class="glass-card mt-lg">
            <div class="card-header">
                <h3 class="card-title">Timer Settings</h3>
            </div>
            <div class="card-body">
                <div class="grid grid-2">
                    <div class="form-group">
                        <label class="form-label">Work Duration (minutes)</label>
                        <input type="number" class="form-input" id="workDuration" 
                               value="${settings.pomodoroWork}" min="5" max="60" step="5">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Break Duration (minutes)</label>
                        <input type="number" class="form-input" id="breakDuration" 
                               value="${settings.pomodoroBreak}" min="5" max="30" step="5">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="savePomodoroSettings()">Save Settings</button>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function startPomodoro() {
    if (pomodoroRunning) return;

    const data = Storage.get();
    const settings = data.settings;

    if (pomodoroSeconds === 0) {
        pomodoroSeconds = (pomodoroMode === 'work' ? settings.pomodoroWork : settings.pomodoroBreak) * 60;
    }

    pomodoroRunning = true;
    document.getElementById('pomodoroStart').classList.add('hidden');
    document.getElementById('pomodoroPause').classList.remove('hidden');

    pomodoroInterval = setInterval(() => {
        pomodoroSeconds--;

        const mins = Math.floor(pomodoroSeconds / 60);
        const secs = pomodoroSeconds % 60;
        document.getElementById('pomodoroDisplay').textContent =
            `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

        if (pomodoroSeconds <= 0) {
            clearInterval(pomodoroInterval);
            pomodoroRunning = false;

            if (pomodoroMode === 'work') {
                // Save completed session
                const data = Storage.get();
                const subject = document.getElementById('pomodoroSubject').value;
                const duration = settings.pomodoroWork;

                data.pomodoroSessions.push({
                    date: new Date().toISOString(),
                    subject,
                    duration
                });

                // Update study stats
                const dateKey = getTodayDate();
                if (!data.studyStats[dateKey]) {
                    data.studyStats[dateKey] = { totalMinutes: 0, bySubject: {} };
                }
                data.studyStats[dateKey].totalMinutes += duration;
                if (!data.studyStats[dateKey].bySubject[subject]) {
                    data.studyStats[dateKey].bySubject[subject] = 0;
                }
                data.studyStats[dateKey].bySubject[subject] += duration;

                Storage.set(data);

                alert('Work session complete! Take a break.');
                pomodoroMode = 'break';
                document.getElementById('pomodoroMode').textContent = 'Break Time';
            } else {
                alert('Break complete! Ready for another session?');
                pomodoroMode = 'work';
                document.getElementById('pomodoroMode').textContent = 'Work Session';
            }

            resetPomodoro();
        }
    }, 1000);
}

function pausePomodoro() {
    if (!pomodoroRunning) return;

    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    document.getElementById('pomodoroStart').classList.remove('hidden');
    document.getElementById('pomodoroPause').classList.add('hidden');
}

function resetPomodoro() {
    clearInterval(pomodoroInterval);
    pomodoroRunning = false;
    pomodoroSeconds = 0;

    const data = Storage.get();
    const settings = data.settings;
    const duration = pomodoroMode === 'work' ? settings.pomodoroWork : settings.pomodoroBreak;

    document.getElementById('pomodoroDisplay').textContent = `${String(duration).padStart(2, '0')}:00`;
    document.getElementById('pomodoroStart').classList.remove('hidden');
    document.getElementById('pomodoroPause').classList.add('hidden');
}

function savePomodoroSettings() {
    const data = Storage.get();
    data.settings.pomodoroWork = parseInt(document.getElementById('workDuration').value);
    data.settings.pomodoroBreak = parseInt(document.getElementById('breakDuration').value);
    Storage.set(data);

    alert('Settings saved!');
    resetPomodoro();
}

// ==================== RESOURCES LIBRARY ====================

const defaultResources = [
    { category: 'Books', title: 'Indian Polity by M. Laxmikanth', link: '#', description: 'Comprehensive book on Indian Constitution and Polity' },
    { category: 'Websites', title: 'PIB (Press Information Bureau)', link: 'https://pib.gov.in', description: 'Official government press releases' },
    { category: 'Websites', title: 'Yojana Magazine', link: '#', description: 'Monthly magazine on developmental issues' },
    { category: 'YouTube', title: 'UPSC CSE Lectures', link: '#', description: 'Free video lectures on all subjects' },
    { category: 'Magazines', title: 'The Hindu Newspaper', link: '#', description: 'Best newspaper for current affairs' }
];

function renderResources() {
    const data = Storage.get();
    let resources = data.resources;

    // Initialize with default resources if empty
    if (resources.length === 0) {
        resources = defaultResources.map(r => ({ ...r, id: generateId() }));
        data.resources = resources;
        Storage.set(data);
    }

    const categories = [...new Set(resources.map(r => r.category))];

    const content = `
        <div class="content-header">
            <h1 class="header-title">Resources Library</h1>
            <button class="btn btn-primary" onclick="showAddResourceModal()">+ Add Resource</button>
        </div>
        
        <div class="tabs mb-lg">
            <button class="tab active" onclick="switchResourceTab('all')">All Resources</button>
            ${categories.map(cat => `
                <button class="tab" onclick="switchResourceTab('${cat}')">${cat}</button>
            `).join('')}
        </div>
        
        <div id="resourceContent">
            ${renderResourceList(resources, 'all')}
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function renderResourceList(resources, category) {
    const filtered = category === 'all' ? resources : resources.filter(r => r.category === category);

    return `
        <div class="grid grid-2">
            ${filtered.map(resource => `
                <div class="glass-card">
                    <div class="card-header">
                        <div>
                            <span class="badge badge-primary">${resource.category}</span>
                            <h3 class="card-title" style="margin-top: var(--spacing-xs);">${resource.title}</h3>
                        </div>
                        ${!defaultResources.some(dr => dr.title === resource.title) ?
            `<button class="btn btn-icon btn-sm btn-secondary" onclick="deleteResource('${resource.id}')">🗑️</button>` : ''
        }
                    </div>
                    <div class="card-body">
                        <p class="text-secondary mb-md">${resource.description}</p>
                        ${resource.link !== '#' ?
            `<a href="${resource.link}" target="_blank" class="btn btn-sm btn-primary">Visit Resource →</a>` :
            '<span class="text-secondary">Link not available</span>'
        }
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function switchResourceTab(category) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');

    const data = Storage.get();
    document.getElementById('resourceContent').innerHTML = renderResourceList(data.resources, category);
}

function showAddResourceModal() {
    const modalContent = `
        <form onsubmit="addResource(event)">
            <div class="form-group">
                <label class="form-label">Category</label>
                <select class="form-select" name="category" required>
                    <option value="">Select Category</option>
                    <option value="Books">Books</option>
                    <option value="Websites">Websites</option>
                    <option value="YouTube">YouTube Channels</option>
                    <option value="Magazines">Magazines</option>
                    <option value="Others">Others</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Title</label>
                <input type="text" class="form-input" name="title" required placeholder="Resource name">
            </div>
            
            <div class="form-group">
                <label class="form-label">Link</label>
                <input type="url" class="form-input" name="link" placeholder="https://example.com">
            </div>
            
            <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-textarea" name="description" rows="3" required 
                          placeholder="Brief description of the resource"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Add Resource</button>
        </form>
    `;

    showModal('Add New Resource', modalContent);
}

function addResource(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Storage.get();

    const resource = {
        id: generateId(),
        category: formData.get('category'),
        title: formData.get('title'),
        link: formData.get('link') || '#',
        description: formData.get('description')
    };

    data.resources.push(resource);
    Storage.set(data);

    closeModal();
    loadSection('resources');
}

function deleteResource(resourceId) {
    if (confirm('Delete this resource?')) {
        const data = Storage.get();
        data.resources = data.resources.filter(r => r.id !== resourceId);
        Storage.set(data);
        loadSection('resources');
    }
}

// ==================== OPTIONAL SUBJECTS ====================

function renderOptional() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Optional Subjects</h1>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Your Optional Subject</h3>
            </div>
            <div class="card-body">
                <p><strong>Selected:</strong> ${data.userProfile.optional || 'Not selected yet'}</p>
                <button class="btn btn-secondary mt-sm" onclick="document.querySelector('[data-section=\\'settings\\']').click()">
                    Change Optional Subject
                </button>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Popular Optional Subjects</h3>
            </div>
            <div class="card-body">
                <div class="grid grid-2">
                    ${[
            { name: 'Geography', success: 'High', difficulty: 'Moderate' },
            { name: 'History', success: 'High', difficulty: 'Moderate' },
            { name: 'Public Administration', success: 'Very High', difficulty: 'Low' },
            { name: 'Sociology', success: 'High', difficulty: 'Moderate' },
            { name: 'Political Science', success: 'High', difficulty: 'Moderate' },
            { name: 'Anthropology', success: 'Moderate', difficulty: 'Moderate' }
        ].map(opt => `
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-md);">
                            <h4>${opt.name}</h4>
                            <div class="flex gap-sm mt-sm">
                                <span class="badge badge-success">Success: ${opt.success}</span>
                                <span class="badge badge-info">Difficulty: ${opt.difficulty}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">Tips for Optional Subject</h3>
            </div>
            <div class="card-body">
                <ul style="line-height: 2;">
                    <li>Choose a subject you have interest or background in</li>
                    <li>Consider overlap with GS syllabus for efficiency</li>
                    <li>Check availability of quality study material and coaching</li>
                    <li>Look at previous years' trends and success rates</li>
                    <li>Aim for scoring potential rather than just interest</li>
                    <li>Start preparation early - optional needs consistent effort</li>
                </ul>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

// ==================== INTERVIEW PREPARATION ====================

function renderInterview() {
    const content = `
        <div class="content-header">
            <h1 class="header-title">Interview Preparation</h1>
        </div>
        
        <div class="grid grid-2 mb-lg">
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">DAF Preparation</h3>
                </div>
                <div class="card-body">
                    <p class="text-secondary mb-md">Detailed Application Form (DAF) is the basis of your interview. Be thorough!</p>
                    <ul style="line-height: 2;">
                        <li>Educational background and subjects</li>
                        <li>Work experience details</li>
                        <li>Hobbies and extracurricular activities</li>
                        <li>Home state and district knowledge</li>
                        <li>Optional subject mastery</li>
                    </ul>
                </div>
            </div>
            
            <div class="glass-card">
                <div class="card-header">
                    <h3 class="card-title">Key Focus Areas</h3>
                </div>
                <div class="card-body">
                    <div class="flex gap-sm" style="flex-direction: column;">
                        <span class="badge badge-primary">Current Affairs (National & International)</span>
                        <span class="badge badge-primary">Home State Issues</span>
                        <span class="badge badge-primary">Optional Subject In-depth</span>
                        <span class="badge badge-primary">Hobbies & Interests</span>
                        <span class="badge badge-primary">Ethics & Value-based Questions</span>
                        <span class="badge badge-primary">Career Goals & Vision</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Common Interview Questions</h3>
            </div>
            <div class="card-body">
                ${[
            'Tell us about yourself.',
            'Why do you want to join civil services?',
            'What are the major challenges facing India today?',
            'How would you handle a situation where your senior asks you to do something unethical?',
            'What reforms would you suggest for improving governance in India?',
            'Tell us about your hobbies and how they help you.',
            'What is your opinion on the recent government policy on [current issue]?',
            'How will you balance work and personal life as an IAS officer?'
        ].map((q, i) => `
                    <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-sm); margin-bottom: var(--spacing-sm);">
                        <strong>Q${i + 1}.</strong> ${q}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">Interview Tips</h3>
            </div>
            <div class="card-body">
                <ul style="line-height: 2;">
                    <li>Be honest and authentic - never bluff</li>
                    <li>Stay calm and composed throughout</li>
                    <li>Listen carefully before answering</li>
                    <li>It's okay to say "I don't know" when you genuinely don't</li>
                    <li>Connect answers to your DAF when possible</li>
                    <li>Show balanced thinking and empathy</li>
                    <li>Practice mock interviews multiple times</li>
                    <li>Dress formally and maintain good body language</li>
                </ul>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

// ==================== MOTIVATION HUB ====================

function renderMotivation() {
    const successStories = [
        { name: 'Tina Dabi', rank: 1, year: 2015, quote: 'Consistency and hard work are key. Stay focused on your goal.' },
        { name: 'Kanishak Kataria', rank: 1, year: 2018, quote: 'Discipline and time management made all the difference.' },
        { name: 'Srushti Jayant Deshmukh', rank: 5, year: 2018, quote: 'Believe in yourself and never give up on your dreams.' }
    ];

    const tips = [
        'Create a fixed daily routine and stick to it',
        'Take regular breaks - burnout is real',
        'Stay updated with current affairs daily',
        'Practice answer writing consistently',
        'Join a peer group for motivation and discussion',
        'Don\'t compare your progress with others',
        'Focus on understanding concepts, not just memorizing',
        'Revise regularly - repetition is crucial',
        'Stay physically active and eat healthy',
        'Sleep well - your brain needs rest to consolidate learning'
    ];

    const content = `
        <div class="content-header">
            <h1 class="header-title">Motivation Hub</h1>
        </div>
        
        <div class="glass-card mb-lg" style="background: var(--gradient-primary); padding: var(--spacing-xl); text-align: center;">
            <h2 style="font-size: var(--font-size-3xl); margin-bottom: var(--spacing-md);">
                You've Got This! 💪
            </h2>
            <p style="font-size: var(--font-size-lg);">
                Every expert was once a beginner. Every topper started from zero. Your dedication today is building tomorrow's success.
            </p>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Topper Success Stories</h3>
            </div>
            <div class="card-body">
                <div class="grid grid-3">
                    ${successStories.map(story => `
                        <div style="padding: var(--spacing-md); background: var(--bg-tertiary); border-radius: var(--radius-md); text-align: center;">
                            <div class="stat-value" style="font-size: var(--font-size-2xl);">${story.rank}</div>
                            <div class="stat-label mb-sm">${story.name} (${story.year})</div>
                            <p class="text-secondary" style="font-style: italic; font-size: var(--font-size-sm);">
                                "${story.quote}"
                            </p>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Study Tips & Strategies</h3>
            </div>
            <div class="card-body">
                <div class="grid grid-2">
                    ${tips.map((tip, i) => `
                        <div class="flex gap-sm" style="padding: var(--spacing-sm); background: var(--bg-tertiary); border-radius: var(--radius-sm);">
                            <span style="color: var(--accent-success); font-weight: 700;">${i + 1}.</span>
                            <span>${tip}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">Remember</h3>
            </div>
            <div class="card-body">
                <div class="alert alert-success">
                    <strong>Success is not about being the best, it's about being better than you were yesterday.</strong>
                    <br><br>
                    Track your progress, celebrate small wins, and keep moving forward. The UPSC journey is a marathon, not a sprint.
                    Stay consistent, stay positive, and success will follow! 🎯
                </div>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

// ==================== SETTINGS ====================

function renderSettings() {
    const data = Storage.get();
    const content = `
        <div class="content-header">
            <h1 class="header-title">Settings</h1>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Profile Settings</h3>
            </div>
            <div class="card-body">
                <form onsubmit="saveProfile(event)">
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label class="form-label">Your Name</label>
                            <input type="text" class="form-input" name="name" 
                                   value="${data.userProfile.name}" placeholder="Enter your name">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Target Exam Year</label>
                            <input type="number" class="form-input" name="examYear" 
                                   value="${data.userProfile.examYear}" min="2024" max="2030">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Optional Subject</label>
                            <input type="text" class="form-input" name="optional" 
                                   value="${data.userProfile.optional}" placeholder="e.g., Geography">
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">Daily Study Goal (hours)</label>
                            <input type="number" class="form-input" name="dailyGoal" 
                                   value="${data.settings.dailyGoal}" min="1" max="16">
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary">Save Profile</button>
                </form>
            </div>
        </div>
        
        <div class="glass-card mb-lg">
            <div class="card-header">
                <h3 class="card-title">Data Management</h3>
            </div>
            <div class="card-body">
                <div class="flex gap-sm" style="flex-wrap: wrap;">
                    <button class="btn btn-secondary" onclick="exportData()">📥 Export Data</button>
                    <button class="btn btn-secondary" onclick="document.getElementById('importFile').click()">
                        📤 Import Data
                    </button>
                    <input type="file" id="importFile" style="display: none;" accept=".json" onchange="importData(event)">
                    <button class="btn btn-warning" onclick="resetData()">🔄 Reset All Data</button>
                </div>
                <p class="text-secondary mt-sm" style="font-size: var(--font-size-sm);">
                    Export your data as JSON to backup or transfer to another device. Import to restore from backup.
                </p>
            </div>
        </div>
        
        <div class="glass-card">
            <div class="card-header">
                <h3 class="card-title">About UPSC Super App</h3>
            </div>
            <div class="card-body">
                <p class="text-secondary" style="line-height: 1.8;">
                    <strong>Version:</strong> 1.0.0<br>
                    <strong>Created:</strong> 2024<br><br>
                    
                    This app is designed to help UPSC aspirants organize their preparation effectively.
                    All data is stored locally on your device using browser storage.
                    <br><br>
                    <strong>Features:</strong><br>
                    ✓ Study Planning & Tracking<br>
                    ✓ Current Affairs Management<br>
                    ✓ Mock Tests & PYQ Practice<br>
                    ✓ Notes & Revision System<br>
                    ✓ Syllabus Coverage Tracker<br>
                    ✓ Answer Writing Practice<br>
                    ✓ Study Analytics & Stats<br>
                    ✓ Pomodoro Timer<br>
                    ✓ Resources Library<br>
                    ✓ Interview Preparation<br>
                    ✓ And much more!
                </p>
            </div>
        </div>
    `;

    document.getElementById('contentArea').innerHTML = content;
}

function saveProfile(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Storage.get();

    data.userProfile.name = formData.get('name');
    data.userProfile.examYear = parseInt(formData.get('examYear'));
    data.userProfile.optional = formData.get('optional');
    data.settings.dailyGoal = parseInt(formData.get('dailyGoal'));

    Storage.set(data);
    alert('Profile updated successfully!');
}

function exportData() {
    const data = Storage.get();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `upsc_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.setItem(DB_KEY, JSON.stringify(data));
            alert('Data imported successfully! Refreshing...');
            location.reload();
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}

function resetData() {
    if (confirm('Are you sure you want to reset ALL data? This action cannot be undone!')) {
        if (confirm('FINAL WARNING: All your study data, notes, and progress will be permanently deleted!')) {
            localStorage.removeItem(DB_KEY);
            alert('All data has been reset. Refreshing...');
            location.reload();
        }
    }
}

// ==================== INITIALIZATION ====================

// Load dashboard on startup
document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage if needed
    if (!localStorage.getItem(DB_KEY)) {
        Storage.set(defaultData);
    }

    // Load dashboard
    loadSection('dashboard');
});

