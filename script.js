//JAVASCRIPT FOR SIGN-IN PAGE

// Creates a schedule list in the #scheduleList element
function createSchedule(schedule) {
    const scheduleList = document.getElementById('scheduleList'); // Get the <ul> element
    scheduleList.innerHTML = ''; // Clear previous schedule entries
  
    // Loop through each class in the schedule and add it to the list
    schedule.forEach(item => {
      const li = document.createElement('li'); // Create a new list item
      li.innerHTML = `
        <strong>${item.course} - ${item.professor}</strong><br>
        ${item.days} • ${item.time}<br>
        📍 ${item.location}
      `;
      scheduleList.appendChild(li); // Add the list item to the <ul>
    });
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
    document.getElementById('suggestion').textContent = `Suggested based on: "${input}"`; 

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
