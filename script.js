// Wait for the HTML document to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

    // Get references to the HTML elements we need to interact with
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const todoList = document.getElementById('todo-list');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const remainingTasksElement = document.getElementById('remaining-tasks');
  
    // Listen for the form submission event
    taskForm.addEventListener('submit', function(event) {
      // Prevent the default form behavior (which is to reload the page)
      event.preventDefault();
  
      // Get the text from the input box and remove any extra whitespace
      const taskText = taskInput.value.trim();
  
      // If the input is not empty, add the task
      if (taskText !== '') {
        addTask(taskText);
        // Clear the input box for the next task
        taskInput.value = '';
        // Add visual feedback
        showSuccessAnimation();
      }
    });

    // Add visual feedback for successful task addition
    function showSuccessAnimation() {
      const button = taskForm.querySelector('button');
      const originalText = button.textContent;
      button.textContent = '✓ Added!';
      button.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
      }, 1000);
    }
  
    // This function creates and adds a new task to the list
    function addTask(text) {
      // Show empty state if this is the first task
      const emptyState = todoList.querySelector('.empty-state');
      if (emptyState) {
        emptyState.remove();
      }

      // 1. Create a new list item element
      const listItem = document.createElement('li');
  
      // 2. Create a checkbox for task completion
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.addEventListener('change', function() {
        toggleTaskCompletion(listItem, this.checked);
      });

      // 3. Create a span to hold the task text
      const taskSpan = document.createElement('span');
      taskSpan.className = 'task-text';
      taskSpan.textContent = text;
  
      // 4. Create a delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function() {
        removeTaskWithAnimation(listItem);
      });
  
      // 5. Assemble the list item
      listItem.appendChild(checkbox);
      listItem.appendChild(taskSpan);
      listItem.appendChild(deleteButton);
  
      // 6. Add the fully assembled list item to the main list
      todoList.appendChild(listItem);

      // 7. Add focus to the input for next task
      taskInput.focus();
      
      // 8. Update stats
      updateStats();
    }

    // Toggle task completion with visual feedback
    function toggleTaskCompletion(listItem, isCompleted) {
      const taskText = listItem.querySelector('.task-text');
      const checkbox = listItem.querySelector('.task-checkbox');
      
      if (isCompleted) {
        taskText.classList.add('completed');
        listItem.style.opacity = '0.7';
        listItem.style.transform = 'scale(0.98)';
        
        // Add completion animation
        setTimeout(() => {
          listItem.style.transform = 'scale(1)';
        }, 200);
      } else {
        taskText.classList.remove('completed');
        listItem.style.opacity = '1';
        listItem.style.transform = 'scale(1)';
      }
      
      // Update stats after completion change
      updateStats();
    }

    // Remove task with smooth animation
    function removeTaskWithAnimation(listItem) {
      // Add removal animation
      listItem.style.transform = 'translateX(100%)';
      listItem.style.opacity = '0';
      
      setTimeout(() => {
        todoList.removeChild(listItem);
        
        // Show empty state if no tasks remain
        if (todoList.children.length === 0) {
          showEmptyState();
        }
        
        // Update stats after removal
        updateStats();
      }, 300);
    }

    // Show empty state when no tasks exist
    function showEmptyState() {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = 'No tasks yet. Add one above!';
      todoList.appendChild(emptyState);
    }

    // Initialize empty state
    showEmptyState();

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(event) {
      // Ctrl/Cmd + Enter to add task
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        taskForm.dispatchEvent(new Event('submit'));
      }
      
      // Escape to clear input
      if (event.key === 'Escape') {
        taskInput.value = '';
        taskInput.blur();
      }
    });

    // Add input validation and character counter
    taskInput.addEventListener('input', function() {
      const maxLength = 100;
      const currentLength = this.value.length;
      
      if (currentLength > maxLength) {
        this.value = this.value.substring(0, maxLength);
      }
    });

    // Update statistics display
    function updateStats() {
      const tasks = todoList.querySelectorAll('li');
      const completedTasks = todoList.querySelectorAll('li .task-checkbox:checked');
      const totalTasks = tasks.length;
      const completedCount = completedTasks.length;
      const remainingCount = totalTasks - completedCount;

      // Animate number changes
      animateNumber(totalTasksElement, totalTasks);
      animateNumber(completedTasksElement, completedCount);
      animateNumber(remainingTasksElement, remainingCount);
    }

    // Animate number changes for visual feedback
    function animateNumber(element, targetNumber) {
      const currentNumber = parseInt(element.textContent) || 0;
      const increment = targetNumber > currentNumber ? 1 : -1;
      
      if (currentNumber === targetNumber) return;
      
      const timer = setInterval(() => {
        const newNumber = parseInt(element.textContent) + increment;
        element.textContent = newNumber;
        
        if (newNumber === targetNumber) {
          clearInterval(timer);
        }
      }, 50);
    }
  });