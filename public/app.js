// Global state
let currentNotes = '';
let apiKey = localStorage.getItem('gemini_api_key') || '';
let currentUser = null;

// Initialize particles
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(99, 102, 241, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s ease-in-out infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        particlesContainer.appendChild(particle);
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/auth/user');
        const data = await response.json();
        
        if (data.authenticated) {
            currentUser = data.user;
            document.getElementById('userInfo').style.display = 'flex';
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('userName').textContent = data.user.name;
            document.getElementById('userPhoto').src = data.user.photo;
        } else {
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('loginBtn').style.display = 'inline-flex';
        }
    } catch (error) {
        console.error('Auth check failed:', error);
    }
}

// Authentication handlers
document.getElementById('loginBtn').addEventListener('click', () => {
    window.location.href = '/auth/google';
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    window.location.href = '/auth/logout';
});

// Settings panel
document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('settingsPanel').classList.add('open');
});

document.getElementById('closeSettings').addEventListener('click', () => {
    document.getElementById('settingsPanel').classList.remove('open');
});

document.getElementById('saveApiKey').addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (key) {
        localStorage.setItem('gemini_api_key', key);
        apiKey = key;
        showToast('API key saved successfully!', 'success');
        document.getElementById('settingsPanel').classList.remove('open');
    } else {
        showToast('Please enter a valid API key', 'error');
    }
});

// Load saved API key
if (apiKey) {
    document.getElementById('apiKeyInput').value = apiKey;
}

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadProgress = document.getElementById('uploadProgress');

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
});

async function handleFileUpload(file) {
    if (!apiKey) {
        showToast('Please set your Gemini API key in settings first', 'error');
        document.getElementById('settingsPanel').classList.add('open');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    uploadProgress.style.display = 'block';
    const progressFill = uploadProgress.querySelector('.progress-fill');
    progressFill.style.width = '0%';

    try {
        // Simulate progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            progressFill.style.width = progress + '%';
            if (progress >= 90) clearInterval(progressInterval);
        }, 200);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        clearInterval(progressInterval);
        progressFill.style.width = '100%';

        const data = await response.json();

        if (data.success) {
            currentNotes = data.text;
            showToast('File uploaded successfully!', 'success');
            document.getElementById('mainContent').style.display = 'block';
            
            // Auto-generate summary
            await generateSummary();
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Error uploading file: ' + error.message, 'error');
    } finally {
        setTimeout(() => {
            uploadProgress.style.display = 'none';
        }, 1000);
    }
}

// Gemini API call
async function callGeminiAPI(prompt) {
    if (!apiKey) {
        throw new Error('API key not set');
    }

    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt, apiKey })
    });

    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.error);
    }

    return data.response;
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active states
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// Generate Summary
async function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    summaryContent.innerHTML = '<div class="skeleton-loader"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';

    try {
        const prompt = `Provide a comprehensive summary of the following notes. Break it down into key points and main concepts:\n\n${currentNotes}`;
        const summary = await callGeminiAPI(prompt);
        summaryContent.innerHTML = `<div style="white-space: pre-wrap;">${summary}</div>`;
    } catch (error) {
        summaryContent.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('Failed to generate summary', 'error');
    }
}

document.getElementById('regenerateSummary').addEventListener('click', generateSummary);

document.getElementById('copySummary').addEventListener('click', () => {
    const text = document.getElementById('summaryContent').innerText;
    navigator.clipboard.writeText(text);
    showToast('Summary copied to clipboard!', 'success');
});

// Generate Questions
document.getElementById('generateQuestions').addEventListener('click', async () => {
    const difficulty = document.getElementById('questionDifficulty').value;
    const questionsContent = document.getElementById('questionsContent');
    
    questionsContent.innerHTML = '<div class="skeleton-loader"><div class="skeleton-line"></div><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';

    try {
        const prompt = `Generate 10 ${difficulty} difficulty questions with detailed answers based on the following notes. Format as:
Q1: [question]
A1: [answer]
Q2: [question]
A2: [answer]
... and so on.

Notes:\n${currentNotes}`;
        
        const response = await callGeminiAPI(prompt);
        const questions = parseQuestions(response);
        displayQuestions(questions);
    } catch (error) {
        questionsContent.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('Failed to generate questions', 'error');
    }
});

function parseQuestions(text) {
    const questions = [];
    const lines = text.split('\n');
    let currentQ = null;
    let currentA = null;

    lines.forEach(line => {
        const qMatch = line.match(/^Q\d+:\s*(.+)/);
        const aMatch = line.match(/^A\d+:\s*(.+)/);

        if (qMatch) {
            if (currentQ && currentA) {
                questions.push({ question: currentQ, answer: currentA });
            }
            currentQ = qMatch[1];
            currentA = null;
        } else if (aMatch) {
            currentA = aMatch[1];
        } else if (currentA && line.trim()) {
            currentA += ' ' + line.trim();
        }
    });

    if (currentQ && currentA) {
        questions.push({ question: currentQ, answer: currentA });
    }

    return questions;
}

function displayQuestions(questions) {
    const container = document.getElementById('questionsContent');
    container.innerHTML = '';

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-item';
        questionDiv.innerHTML = `
            <h4>Q${index + 1}: ${q.question}</h4>
            <div class="answer-toggle" onclick="toggleAnswer(this)">
                <i class="fas fa-chevron-down"></i> Show Answer
            </div>
            <div class="answer-content" style="display: none;">
                ${q.answer}
            </div>
        `;
        container.appendChild(questionDiv);
    });
}

function toggleAnswer(element) {
    const answerContent = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    if (answerContent.style.display === 'none') {
        answerContent.style.display = 'block';
        element.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Answer';
    } else {
        answerContent.style.display = 'none';
        element.innerHTML = '<i class="fas fa-chevron-down"></i> Show Answer';
    }
}

// Generate Flashcards
document.getElementById('generateFlashcards').addEventListener('click', async () => {
    const flashcardsContent = document.getElementById('flashcardsContent');
    flashcardsContent.innerHTML = '<div class="skeleton-loader"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';

    try {
        const prompt = `Generate 15 flashcards from the following notes. Each flashcard should have a concept/term on the front and explanation on the back. Format as:
FRONT: [concept]
BACK: [explanation]
---
(repeat)

Notes:\n${currentNotes}`;
        
        const response = await callGeminiAPI(prompt);
        const flashcards = parseFlashcards(response);
        displayFlashcards(flashcards);
    } catch (error) {
        flashcardsContent.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('Failed to generate flashcards', 'error');
    }
});

function parseFlashcards(text) {
    const cards = [];
    const sections = text.split('---');

    sections.forEach(section => {
        const frontMatch = section.match(/FRONT:\s*(.+)/);
        const backMatch = section.match(/BACK:\s*(.+)/s);

        if (frontMatch && backMatch) {
            cards.push({
                front: frontMatch[1].trim(),
                back: backMatch[1].trim()
            });
        }
    });

    return cards;
}

function displayFlashcards(cards) {
    const container = document.getElementById('flashcardsContent');
    container.innerHTML = '';

    cards.forEach((card, index) => {
        const flashcardDiv = document.createElement('div');
        flashcardDiv.className = 'flashcard';
        flashcardDiv.innerHTML = `
            <div class="flashcard-content front">
                <strong>Card ${index + 1}</strong>
                <h3 style="margin-top: 1rem;">${card.front}</h3>
                <p style="margin-top: 1rem; color: var(--gray);">Click to flip</p>
            </div>
            <div class="flashcard-content back">
                <p>${card.back}</p>
                <p style="margin-top: 1rem; color: var(--gray);">Click to flip back</p>
            </div>
        `;
        
        flashcardDiv.addEventListener('click', () => {
            flashcardDiv.classList.toggle('flipped');
        });
        
        container.appendChild(flashcardDiv);
    });
}

// Viva Practice
let vivaQuestions = [];
let currentVivaIndex = 0;

document.getElementById('startViva').addEventListener('click', async () => {
    const vivaContent = document.getElementById('vivaContent');
    vivaContent.innerHTML = '<div class="skeleton-loader"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';

    try {
        const prompt = `Generate 8 challenging viva/oral exam questions with detailed model answers based on these notes. Format as:
Q1: [question]
A1: [model answer]
Q2: [question]
A2: [model answer]
... and so on.

Notes:\n${currentNotes}`;
        
        const response = await callGeminiAPI(prompt);
        vivaQuestions = parseQuestions(response);
        currentVivaIndex = 0;
        displayVivaQuestion();
    } catch (error) {
        vivaContent.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('Failed to start viva practice', 'error');
    }
});

function displayVivaQuestion() {
    const container = document.getElementById('vivaContent');
    const question = vivaQuestions[currentVivaIndex];
    
    container.innerHTML = `
        <div class="viva-question">
            <h3>Question ${currentVivaIndex + 1} of ${vivaQuestions.length}</h3>
            <p style="font-size: 1.2rem; margin: 1.5rem 0;">${question.question}</p>
            <button class="btn-primary" onclick="showVivaAnswer()">
                <i class="fas fa-eye"></i> Show Model Answer
            </button>
            <div id="vivaAnswerDiv" style="display: none;"></div>
        </div>
        <div class="viva-controls">
            <button class="btn-primary" onclick="previousVivaQuestion()" ${currentVivaIndex === 0 ? 'disabled' : ''}>
                <i class="fas fa-chevron-left"></i> Previous
            </button>
            <button class="btn-primary" onclick="nextVivaQuestion()" ${currentVivaIndex === vivaQuestions.length - 1 ? 'disabled' : ''}>
                Next <i class="fas fa-chevron-right"></i>
            </button>
        </div>
    `;
}

function showVivaAnswer() {
    const answerDiv = document.getElementById('vivaAnswerDiv');
    const question = vivaQuestions[currentVivaIndex];
    answerDiv.innerHTML = `
        <div class="viva-answer">
            <h4><i class="fas fa-check-circle"></i> Model Answer:</h4>
            <p>${question.answer}</p>
        </div>
    `;
    answerDiv.style.display = 'block';
}

function nextVivaQuestion() {
    if (currentVivaIndex < vivaQuestions.length - 1) {
        currentVivaIndex++;
        displayVivaQuestion();
    }
}

function previousVivaQuestion() {
    if (currentVivaIndex > 0) {
        currentVivaIndex--;
        displayVivaQuestion();
    }
}

// Generate Timetable
document.getElementById('generateTimetable').addEventListener('click', async () => {
    const days = document.getElementById('studyDays').value || 7;
    const timetableContent = document.getElementById('timetableContent');
    
    timetableContent.innerHTML = '<div class="skeleton-loader"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';

    try {
        const prompt = `Create a detailed ${days}-day study timetable for the following notes. Include:
- Daily topics to cover
- Specific time allocations
- Revision sessions
- Practice sessions
- Breaks

Format each day as:
DAY X: [Title]
- HH:MM - HH:MM: [Task]
- HH:MM - HH:MM: [Task]
...

Notes:\n${currentNotes}`;
        
        const response = await callGeminiAPI(prompt);
        displayTimetable(response);
    } catch (error) {
        timetableContent.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('Failed to generate timetable', 'error');
    }
});

function displayTimetable(text) {
    const container = document.getElementById('timetableContent');
    const days = text.split(/DAY \d+:/);
    container.innerHTML = '';

    days.forEach((day, index) => {
        if (index === 0) return; // Skip first empty split
        
        const lines = day.trim().split('\n');
        const title = lines[0];
        const tasks = lines.slice(1).filter(l => l.trim());

        const dayDiv = document.createElement('div');
        dayDiv.className = 'timetable-day';
        dayDiv.innerHTML = `
            <h4>Day ${index}: ${title}</h4>
            ${tasks.map(task => {
                const timeMatch = task.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2}):\s*(.+)/);
                if (timeMatch) {
                    return `
                        <div class="timetable-task">
                            <span class="task-time">${timeMatch[1]} - ${timeMatch[2]}</span>
                            <span>${timeMatch[3]}</span>
                        </div>
                    `;
                }
                return `<div class="timetable-task"><span>${task}</span></div>`;
            }).join('')}
        `;
        container.appendChild(dayDiv);
    });
}

// Generate Mind Map
document.getElementById('generateMindmap').addEventListener('click', async () => {
    const mindmapContent = document.getElementById('mindmapContent');
    mindmapContent.innerHTML = '<div class="skeleton-loader"><div class="skeleton-line"></div><div class="skeleton-line"></div></div>';

    try {
        const prompt = `Create a hierarchical mind map structure from the following notes. Identify:
1. Main central topic
2. 3-5 major branches
3. Sub-branches for each major branch
4. Key details under sub-branches

Format as a nested structure.

Notes:\n${currentNotes}`;
        
        const response = await callGeminiAPI(prompt);
        mindmapContent.innerHTML = `<div style="white-space: pre-wrap; line-height: 2;">${response}</div>`;
    } catch (error) {
        mindmapContent.innerHTML = `<p style="color: var(--danger);">Error: ${error.message}</p>`;
        showToast('Failed to generate mind map', 'error');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    checkAuth();
    
    // Check for auth success in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth') === 'success') {
        showToast('Signed in successfully!', 'success');
        window.history.replaceState({}, document.title, '/');
        checkAuth();
    }
});
