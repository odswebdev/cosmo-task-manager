   $(document).ready(function() {
            // Инициализация задач из localStorage
            let tasks = JSON.parse(localStorage.getItem('cosmicTasks')) || [];
            
            // Обновление статистики
            function updateStats() {
                const totalTasks = tasks.length;
                const completedTasks = tasks.filter(task => task.completed).length;
                const pendingTasks = totalTasks - completedTasks;
                
                $('#totalTasks').text(totalTasks);
                $('#completedTasks').text(completedTasks);
                $('#pendingTasks').text(pendingTasks);
                $('#footerTotal').text(totalTasks);
                $('#footerCompleted').text(completedTasks);
                
                // Анимация изменения статистики
                $('.stat-value').each(function() {
                    $(this).css('transform', 'scale(1.2)');
                    setTimeout(() => {
                        $(this).css('transform', 'scale(1)');
                    }, 300);
                });
            }
            
            // Показ уведомления
            function showNotification(message) {
                $('#notificationText').text(message);
                $('#notification').addClass('show');
                
                setTimeout(() => {
                    $('#notification').removeClass('show');
                }, 3000);
            }
            
            // Отображение задач
            function renderTasks() {
                const taskList = $('#taskList');
                
                if (tasks.length === 0) {
                    taskList.html(`
                        <div class="empty-state">
                            <i class="fas fa-star"></i>
                            <p>У вас пока нет задач. Добавьте первую!</p>
                        </div>
                    `);
                    return;
                }
                
                taskList.html('');
                
                tasks.forEach((task, index) => {
                    const taskItem = $(`
                        <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                            <span class="task-text">${task.text}</span>
                            <div class="task-actions">
                                <button class="task-btn complete-btn" title="${task.completed ? 'Вернуть в работу' : 'Завершить'}">
                                    <i class="fas fa-${task.completed ? 'redo' : 'check'}"></i>
                                </button>
                                <button class="task-btn delete-btn" title="Удалить">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </li>
                    `);
                    
                    // Анимация добавления задачи
                    taskItem.hide().appendTo(taskList).fadeIn(500);
                    
                    // Эффект при наведении на задачу
                    taskItem.hover(
                        function() {
                            $(this).css('transform', 'translateX(5px)');
                        },
                        function() {
                            if (!$(this).hasClass('completed')) {
                                $(this).css('transform', 'translateX(0)');
                            }
                        }
                    );
                });
                
                // Сохранение в localStorage
                localStorage.setItem('cosmicTasks', JSON.stringify(tasks));
                updateStats();
            }
            
            // Добавление задачи
            $('#taskForm').on('submit', function(e) {
                e.preventDefault();
                
                const taskInput = $('#taskInput');
                const taskText = taskInput.val().trim();
                
                if (taskText === '') {
                    taskInput.addClass('pulse');
                    setTimeout(() => {
                        taskInput.removeClass('pulse');
                    }, 1000);
                    return;
                }
                
                const newTask = {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    created: new Date().toLocaleDateString('ru-RU')
                };
                
                tasks.push(newTask);
                
                // Анимация добавления
                $('#addBtn').css('transform', 'scale(1.2)');
                setTimeout(() => {
                    $('#addBtn').css('transform', 'scale(1)');
                }, 300);
                
                taskInput.val('');
                renderTasks();
                showNotification('Задача добавлена в космический список!');
            });
            
            // Обработка действий с задачей
            $('#taskList').on('click', '.complete-btn', function() {
                const taskItem = $(this).closest('.task-item');
                const taskId = parseInt(taskItem.data('id'));
                
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                if (taskIndex !== -1) {
                    tasks[taskIndex].completed = !tasks[taskIndex].completed;
                    
                    // Анимация изменения статуса
                    if (tasks[taskIndex].completed) {
                        taskItem.addClass('completed');
                        $(this).html('<i class="fas fa-redo"></i>');
                        $(this).attr('title', 'Вернуть в работу');
                        
                        // Эффект "взрыва звезды"
                        taskItem.css('background', 'rgba(255, 152, 0, 0.2)');
                        setTimeout(() => {
                            taskItem.css('background', '');
                        }, 500);
                        
                        showNotification('Задача выполнена! Отличная работа!');
                    } else {
                        taskItem.removeClass('completed');
                        $(this).html('<i class="fas fa-check"></i>');
                        $(this).attr('title', 'Завершить');
                    }
                    
                    // Анимация кнопки
                    $(this).css('transform', 'rotate(360deg)');
                    setTimeout(() => {
                        $(this).css('transform', 'rotate(0)');
                    }, 300);
                    
                    updateStats();
                    localStorage.setItem('cosmicTasks', JSON.stringify(tasks));
                }
            });
            
            // Удаление задачи
            $('#taskList').on('click', '.delete-btn', function() {
                const taskItem = $(this).closest('.task-item');
                const taskId = parseInt(taskItem.data('id'));
                
                // Анимация удаления
                taskItem.animate({
                    opacity: 0,
                    marginLeft: '100px'
                }, 400, function() {
                    tasks = tasks.filter(task => task.id !== taskId);
                    renderTasks();
                    showNotification('Задача удалена в черную дыру!');
                });
            });
            
            // Инициализация с примерами задач, если список пуст
            if (tasks.length === 0) {
                tasks = [
                    { id: 1, text: 'Исследовать новые галактики', completed: false, created: '01.01.2023' },
                    { id: 2, text: 'Заправить космический корабль', completed: true, created: '05.01.2023' },
                    { id: 3, text: 'Связаться с инопланетной цивилизацией', completed: false, created: '10.01.2023' },
                    { id: 4, text: 'Проверить кислородные баллоны', completed: false, created: '12.01.2023' }
                ];
            }
            
            // Первоначальный рендеринг
            renderTasks();
            
            // Анимация звезд на заднем фоне
            function createStars() {
                const body = $('body');
                const starsCount = 50;
                
                for (let i = 0; i < starsCount; i++) {
                    const star = $('<div class="star"></div>');
                    const size = Math.random() * 3 + 1;
                    const posX = Math.random() * 100;
                    const posY = Math.random() * 100;
                    const duration = Math.random() * 10 + 5;
                    
                    star.css({
                        width: size + 'px',
                        height: size + 'px',
                        background: '#fff',
                        borderRadius: '50%',
                        position: 'absolute',
                        left: posX + 'vw',
                        top: posY + 'vh',
                        boxShadow: '0 0 10px #fff',
                        animation: `twinkle ${duration}s infinite alternate`
                    });
                    
                    body.append(star);
                }
            }
            
            // Добавляем CSS для мерцания звезд
            $('head').append(`
                <style>
                    @keyframes twinkle {
                        0% { opacity: 0.2; transform: scale(0.8); }
                        100% { opacity: 1; transform: scale(1.2); }
                    }
                </style>
            `);
            
            // Создаем звезды
            createStars();
            
            // Анимация заголовка
            $('.title').hover(
                function() {
                    $(this).css('text-shadow', '0 0 20px rgba(0, 243, 255, 0.8)');
                },
                function() {
                    $(this).css('text-shadow', '0 0 15px rgba(0, 243, 255, 0.3)');
                }
            );
        });