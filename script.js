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
    toggleBtn.textContent = '▶';
    toggleBtn.style.right = '330px'; // Move with sidebar
  } else {
    toggleBtn.textContent = '◀';
    toggleBtn.style.right = '0';
  }
});
//◀ ▶
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

    //Plan B- Hardcoded Backup Schedules 
    //If user prefers morning classes, use this schedule
    const morningSchedule = [
      {course: 'MATH 2413', days: 'MWF', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300', professor: 'Dr. White' },
      { course: 'ENGL 1213', days: 'MWF', time: '10:00AM - 10:50AM', location: 'Dale Hall 101', professor: 'Dr. Smith' },
      { course: 'CS 3203', days: 'T/TH', time: '10:00AM - 10:15AM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
      { course: 'HIST 1483', days: 'T/TH', time: '10:30AM - 11:45AM', location: 'Gould Hall 101', professor: 'Dr. Johnson' },
      { course: 'CHEM 1314', days: 'MWF', time: '11:00AM - 11:50AM', location: 'Physical Science Center 101', professor: 'Dr. Lee' }
    ];

    //If user prefers afternoon classes, use this schedule
    const afternoonSchedule = [
      { course: 'MATH 2413', days: 'MWF', time: '1:00PM - 1:50PM', location: 'Felgar Hall 300', professor: 'Dr. White' },
      { course: 'ENGL 1213', days: 'MWF', time: '2:00PM - 2:50PM', location: 'Dale Hall 101', professor: 'Dr. Smith' },
      { course: 'CS 3203', days: 'T/TH', time: '3:00PM - 4:15PM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
      { course: 'HIST 1483', days: 'T/TH', time: '4:30PM - 5:45PM', location: 'Gould Hall 101', professor: 'Dr. Johnson' },
      { course: 'CHEM 1314', days: 'MWF', time: '6:00PM - 6:50PM', location: 'Physical Science Center 101', professor: 'Dr. Lee' }
    ];

    //If user prefers MWF classes, use this schedule
    const mwfSchedule = [
      { course: 'MATH 2413', days: 'MWF', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300', professor: 'Dr. White' },
      { course: 'ENGL 1213', days: 'MWF', time: '10:00AM - 10:50AM', location: 'Dale Hall 101', professor: 'Dr. Smith' },
      { course: 'CS 3203', days: 'MWF', time: '11:00AM - 11:50AM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
      { course: 'HIST 1483', days: 'MWF', time: '1:00PM - 1:50PM', location: 'Gould Hall 101', professor: 'Dr. Johnson' },
      { course: 'CHEM 1314', days: 'MWF', time: '2:00PM - 2:50PM', location: 'Physical Science Center 101', professor: 'Dr. Lee' }
    ];

    //If user prefers T/TH classes, use this schedule
    const tthSchedule = [
      { course: 'MATH 2413', days: 'T/TH', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300', professor: 'Dr. White' },
      { course: 'ENGL 1213', days: 'T/TH', time: '10:00AM - 10:50AM', location: 'Dale Hall 101', professor: 'Dr. Smith' },
      { course: 'CS 3203', days: 'T/TH', time: '11:00AM - 11:50AM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
      { course: 'HIST 1483', days: 'T/TH', time: '1:00PM - 1:50PM', location: 'Gould Hall 101', professor: 'Dr. Johnson' },
      { course: 'CHEM 1314', days: 'T/TH', time: '2:00PM - 2:50PM', location: 'Physical Science Center 101', professor: 'Dr. Lee' }
    ];

    //If user wants Dr. Abdulhak for every class, use this schedule
    const drAbdulhakSchedule = [
      { course: 'MATH 2413', days: 'MWF', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300', professor: 'Dr. Abdulhak' },
      { course: 'ENGL 1213', days: 'MWF', time: '10:00AM - 10:50AM', location: 'Dale Hall 101', professor: 'Dr. Abdulhak' },
      { course: 'CS 3203', days: 'T/TH', time: '11:00AM - 12:15PM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
      { course: 'HIST 1483', days: 'T/TH', time: '1:00PM - 2:15PM', location: 'Gould Hall 101', professor: 'Dr. Abdulhak' },
      { course: 'CHEM 1314', days: 'MWF', time: '2:30PM - 3:20PM', location: 'Physical Science Center 101', professor: 'Dr. Abdulhak' }
    ];

// When the "Generate Schedule" button is clicked:
document.getElementById('generateBtn').addEventListener('click', () => {
  const input = document.getElementById('preferences').value; // Get user input
  const lowerInput = input.toLowerCase(); // Convert input to lowercase for case-insensitive comparison
  
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

  //For demo, we can use hardcoded example?

  //if user input is any variation of "morning" or "mornings", use morningSchedule
  if (lowerInput.includes('morning') || lowerInput.includes('mornings')) {
    createSchedule(morningSchedule);
  }

  //if user input is any variation of "afternoon" or "afternoons", use afternoonSchedule
  else if (lowerInput.includes('afternoon') || lowerInput.includes('afternoons')) {
    createSchedule(afternoonSchedule);
  }

  //if user input is any variation of "MWF" or "MWF classes", use mwfSchedule
  else if (lowerInput.includes('mwf')) {
    createSchedule(mwfSchedule);
  }

  //if user input is any variation of "T/TH" or "T/TH classes", use tthSchedule
  else if (lowerInput.includes('t/th')) {
    createSchedule(tthSchedule);
  }

  //if user input contains "Abdulhak" or "Mansoor" or "Dr. Abdulhak", use drAbdulhakSchedule
  else if (lowerInput.includes('abdulhak') || lowerInput.includes('mansoor')) {
    createSchedule(drAbdulhakSchedule);
  }

  //if user input is any variation of "random" or "random classes", use randomSchedule
  else {
    createSchedule(mockSchedule); 
  }
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
