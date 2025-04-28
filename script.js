//JAVASCRIPT FOR SCHEDULE GENERATOR PAGE

// Creates a schedule list in the #scheduleList element
// Create schedule list
function createSchedule(schedule) {
  const scheduleList = document.getElementById('scheduleList');
  scheduleList.innerHTML = '';

  schedule.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${item.course} - ${item.professor}</strong><br>
      ${item.days} • ${item.time}<br>
      📍 ${item.location}<br>
      <button class="save-btn">Save</button>
    `;
    li.querySelector('.save-btn').addEventListener('click', () => {
      saveClass(item);
    });

    scheduleList.appendChild(li);
  });
}

// Sidebar toggle logic
// Sidebar and toggle button
// Sidebar toggle logic
const sidebar = document.getElementById('savedSidebar');
const toggleBtn = document.getElementById('toggleSavedBtn');

// Toggle sidebar open/close
toggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  
  // Update arrow direction
  if (sidebar.classList.contains('open')) {
    toggleBtn.textContent = '◀';
    toggleBtn.style.right = '300px'; // Move with sidebar
  } else {
    toggleBtn.textContent = '▶';
    toggleBtn.style.right = '0';
  }
});

// Save a clicked class into sidebar
function saveClass(item) {
  const savedList = document.getElementById('savedList');
  const savedItem = document.createElement('li');
  savedItem.innerHTML = `
    <strong>${item.course} - ${item.professor}</strong><br>
    ${item.days} • ${item.time}<br>
    📍 ${item.location}
  `;

  // Create a Trash button inside the function
  const removeBtn = document.createElement('button'); // <-- correct: 'button'
  removeBtn.innerHTML = '🗑️'; // Trash icon
  removeBtn.style.marginLeft = '10px';
  removeBtn.style.backgroundColor = 'transparent';
  removeBtn.style.border = 'none';
  removeBtn.style.color = '#ff4d4d';
  removeBtn.style.fontSize = '20px';
  removeBtn.style.cursor = 'pointer';
  removeBtn.style.verticalAlign = 'middle';

  // When clicked, remove this <li> from the saved list
  removeBtn.onclick = () => {
    savedList.removeChild(savedItem);
  };

  savedItem.appendChild(removeBtn); // attach the trash button to the list item
  savedList.appendChild(savedItem); // add the list item to the sidebar
}


// Hardcoded example schedule for demo
const mockSchedule = [
      { course: 'MATH 2413', days: 'MWF', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300', professor: 'Dr. White' },
      { course: 'ENGL 1213', days: 'MWF', time: '11:00AM - 11:50AM', location: 'Dale Hall 101', professor: 'Dr. Smith' },
      { course: 'CS 3203', days: 'T/TH', time: '2:00PM - 3:15PM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
      { course: 'HIST 1483', days: 'T/TH', time: '1:00PM - 2:15PM', location: 'Gould Hall 101', professor: 'Dr. Johnson' },
      { course: 'CHEM 1314', days: 'MWF', time: '10:00AM - 10:50AM', location: 'Physical Science Center 101', professor: 'Dr. Lee' },
    ];

// When the "Generate Schedule" button is clicked:
document.getElementById('generateBtn').addEventListener('click', () => {
  const input = document.getElementById('preferences').value; // Get user input

  // CWE-1287: Improper Validation of Specified Type of Input Fix
  document.getElementById('suggestion').textContent = `Suggested based on: "${input}"`; 
  /* 
  Vulnerability (CWE-1287): Improper Validation of Specified Type of Input
  Issue: Using innerHTML to set user input can lead to Cross-Site Scripting (XSS) attacks.
  Example: If the user input is not properly sanitized, it can allow malicious scripts to be executed in the browser.
  Example: <script>alert('x')</script> would be executed if innerHTML is used.
  Impact: This can lead to data theft, session hijacking, or other malicious activities.
  Mitigation: Use textContent instead of innerHTML to set the content of the element.
  textContent sets the text content of the element, escaping any HTML tags.
  This prevents the execution of any scripts or HTML tags.
  */

  //TO-DO: backend logic, use user input to prompt AI to generate a schedule
  //const generatedSchedule = [];
  //createSchedule(generatedSchedule);

  //For demo, we can use hardcoded example?
  createSchedule(mockSchedule); 
});

// FAQ modal functionality
const modal = document.getElementById('faqModal'); // The modal container
const btn = document.getElementById('faqBtn');     // Button that opens the modal
const span = document.getElementsByClassName('close')[0]; // The <span> (×) to close modal

// Show modal when FAQ button is clicked
btn.onclick = () => modal.style.display = 'block';

// Hide modal when × is clicked
span.onclick = () => modal.style.display = 'none';

// Hide modal when clicking outside the modal content
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = 'none';
};
