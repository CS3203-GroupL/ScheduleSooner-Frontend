// Test Script for ScheduleSooner Dashboard
console.log("Starting ScheduleSooner Dashboard Tests...");

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Test 1: Verify localStorage initialization
    console.group("Test 1: localStorage Initialization");
    testLocalStorageInitialization();
    console.groupEnd();

    // Test 2: Verify category creation
    console.group("Test 2: Category Creation");
    testCategoryCreation();
    console.groupEnd();

    // Test 3: Verify schedule creation
    console.group("Test 3: Schedule Creation");
    testScheduleCreation();
    console.groupEnd();

    // Test 4: Verify schedule editing
    console.group("Test 4: Schedule Editing");
    testScheduleEditing();
    console.groupEnd();

    // Test 5: Verify schedule deletion
    console.group("Test 5: Schedule Deletion");
    testScheduleDeletion();
    console.groupEnd();

    // Test 6: Verify category editing
    console.group("Test 6: Category Editing");
    testCategoryEditing();
    console.groupEnd();

    // Test 7: Verify category deletion
    console.group("Test 7: Category Deletion");
    testCategoryDeletion();
    console.groupEnd();

    // Test 8: Verify UI interactions
    console.group("Test 8: UI Interactions");
    testUIInteractions();
    console.groupEnd();

    console.log("All tests completed!");
});

// Helper function to simulate button clicks
function simulateClick(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.click();
        console.log(`Clicked ${elementId}`);
    } else {
        console.error(`Element ${elementId} not found`);
    }
}

// Helper function to simulate input
function simulateInput(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = value;
        console.log(`Set ${elementId} to "${value}"`);
    } else {
        console.error(`Element ${elementId} not found`);
    }
}

// Test 1: Verify localStorage initialization
function testLocalStorageInitialization() {
    console.log("Checking localStorage initialization...");
    
    // Clear localStorage for clean test
    localStorage.clear();
    
    // Test initial state
    const initialSchedules = JSON.parse(localStorage.getItem("schedules"));
    if (!initialSchedules) {
        console.log("✔ localStorage initialized correctly with no existing data");
    } else {
        console.error("✖ localStorage should be empty initially");
    }
    
    // Test after initialization
    simulateClick("toggleSavedBtn"); // This triggers the DOMContentLoaded handler
    const postInitSchedules = JSON.parse(localStorage.getItem("schedules"));
    
    if (postInitSchedules && 
        Array.isArray(postInitSchedules.created) && 
        Array.isArray(postInitSchedules.favorites)) {
        console.log("✔ localStorage initialized with correct structure");
    } else {
        console.error("✖ localStorage not initialized with correct structure");
    }
}

// Test 2: Verify category creation
function testCategoryCreation() {
    console.log("Testing category creation...");
    
    // Test creating a new category
    const testCategoryName = "Test Category " + Date.now();
    window.prompt = () => testCategoryName; // Mock prompt
    
    simulateClick("createCategoryBtn");
    
    // Verify category was created
    const categories = JSON.parse(localStorage.getItem("customCategories"));
    const schedules = JSON.parse(localStorage.getItem("schedules"));
    
    if (categories && categories.includes(testCategoryName.toLowerCase())) {
        console.log("✔ Category added to customCategories");
    } else {
        console.error("✖ Category not added to customCategories");
    }
    
    if (schedules && schedules[testCategoryName.toLowerCase()] && 
        Array.isArray(schedules[testCategoryName.toLowerCase()])) {
        console.log("✔ Category array initialized in schedules");
    } else {
        console.error("✖ Category array not initialized in schedules");
    }
    
    // Verify UI shows the new category
    const categoryElements = document.querySelectorAll(".schedule-category h2");
    const categoryExists = Array.from(categoryElements).some(el => 
        el.textContent.toLowerCase() === testCategoryName.toLowerCase()
    );
    
    if (categoryExists) {
        console.log("✔ New category appears in UI");
    } else {
        console.error("✖ New category doesn't appear in UI");
    }
}

// Test 3: Verify schedule creation
// Test 3: Verify schedule creation
function testScheduleCreation() {
    console.log("Testing schedule creation...");
    
    // First create a test class to add to the schedule
    const testClass = {
        course: "TEST 101",
        professor: "Professor Test",
        days: "MWF",
        time: "10:00 AM - 11:15 AM",
        location: "Test Hall 101"
    };
    
    // Simulate adding the class to the saved list
    const savedList = document.getElementById('savedList');
    if (savedList) {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${testClass.course} - ${testClass.professor}</strong><br>
            ${testClass.days} • ${testClass.time}<br>
            📍 ${testClass.location}
        `;
        savedList.appendChild(li);
        console.log("✔ Test class added to saved list");
    } else {
        console.error("✖ Couldn't find savedList element");
        return;
    }
    
    // Test creating a new schedule
    const testScheduleName = "Test Schedule " + Date.now();
    
    // Mock prompt and other UI interactions
    window.prompt = () => testScheduleName;
    
    // Simulate the save schedule flow
    simulateClick("saveScheduleBtn");
    
    // Wait for the popup to appear (since it's async in the actual code)
    setTimeout(() => {
        simulateInput("scheduleNameInput", testScheduleName);
        simulateClick("saveScheduleInCategoryBtn");
        
        // Verify schedule was created
        const schedules = JSON.parse(localStorage.getItem("schedules"));
        const createdSchedules = schedules.created;
        
        const scheduleExists = createdSchedules.some(s => s.name === testScheduleName);
        
        if (scheduleExists) {
            console.log("✔ Schedule added to created schedules");
            
            // Verify the schedule has our test class
            const newSchedule = createdSchedules.find(s => s.name === testScheduleName);
            if (newSchedule.classes && newSchedule.classes.some(c => c.course === testClass.course)) {
                console.log("✔ Schedule contains the test class");
            } else {
                console.error("✖ Schedule doesn't contain the test class");
            }
        } else {
            console.error("✖ Schedule not added to created schedules");
        }
        
        // Verify UI shows the new schedule
        const scheduleElements = document.querySelectorAll(".schedule-name");
        const uiScheduleExists = Array.from(scheduleElements).some(el => 
            el.textContent === testScheduleName
        );
        
        if (uiScheduleExists) {
            console.log("✔ New schedule appears in UI");
        } else {
            console.error("✖ New schedule doesn't appear in UI");
        }
    }, 100); // Small delay to allow popup to render
}

// Test 4: Verify schedule editing
function testScheduleEditing() {
    console.log("Testing schedule editing...");
    
    // First create a test schedule
    const testScheduleName = "Test Schedule To Edit " + Date.now();
    window.prompt = () => testScheduleName;
    simulateClick("saveScheduleBtn");
    simulateInput("scheduleNameInput", testScheduleName);
    simulateClick("saveScheduleInCategoryBtn");
    
    // Find the schedule in the UI
    const scheduleElements = document.querySelectorAll(".schedule-name");
    const scheduleToEdit = Array.from(scheduleElements).find(el => 
        el.textContent === testScheduleName
    );
    
    if (!scheduleToEdit) {
        console.error("✖ Couldn't find test schedule to edit");
        return;
    }
    
    // Find and click the edit button
    const scheduleItem = scheduleToEdit.closest(".schedule-item");
    const editButton = scheduleItem.querySelector(".schedule-buttons button:first-child");
    
    const newScheduleName = "Edited " + testScheduleName;
    window.prompt = () => newScheduleName; // Mock prompt for edit
    
    editButton.click();
    
    // Verify edit was successful
    const schedules = JSON.parse(localStorage.getItem("schedules"));
    const scheduleExists = schedules.created.some(s => s.name === newScheduleName);
    
    if (scheduleExists) {
        console.log("✔ Schedule edited successfully");
    } else {
        console.error("✖ Schedule not edited");
    }
}

// Test 5: Verify schedule deletion
function testScheduleDeletion() {
    console.log("Testing schedule deletion...");
    
    // First create a test schedule
    const testScheduleName = "Test Schedule To Delete " + Date.now();
    window.prompt = () => testScheduleName;
    simulateClick("saveScheduleBtn");
    simulateInput("scheduleNameInput", testScheduleName);
    simulateClick("saveScheduleInCategoryBtn");
    
    // Find the schedule in the UI
    const scheduleElements = document.querySelectorAll(".schedule-name");
    const scheduleToDelete = Array.from(scheduleElements).find(el => 
        el.textContent === testScheduleName
    );
    
    if (!scheduleToDelete) {
        console.error("✖ Couldn't find test schedule to delete");
        return;
    }
    
    // Mock confirm dialog
    window.confirm = () => true;
    
    // Find and click the delete button
    const scheduleItem = scheduleToDelete.closest(".schedule-item");
    const deleteButton = scheduleItem.querySelector(".schedule-buttons button:last-child");
    deleteButton.click();
    
    // Verify deletion was successful
    const schedules = JSON.parse(localStorage.getItem("schedules"));
    const scheduleExists = schedules.created.some(s => s.name === testScheduleName);
    
    if (!scheduleExists) {
        console.log("✔ Schedule deleted successfully");
    } else {
        console.error("✖ Schedule not deleted");
    }
}

// Test 6: Verify category editing
function testCategoryEditing() {
    console.log("Testing category editing...");
    
    // First create a test category
    const testCategoryName = "Test Category To Edit " + Date.now();
    window.prompt = () => testCategoryName;
    simulateClick("createCategoryBtn");
    
    // Find the category in the UI
    const categoryElements = document.querySelectorAll(".schedule-category h2");
    const categoryToEdit = Array.from(categoryElements).find(el => 
        el.textContent.toLowerCase() === testCategoryName.toLowerCase()
    );
    
    if (!categoryToEdit) {
        console.error("✖ Couldn't find test category to edit");
        return;
    }
    
    // Find and click the edit button
    const categoryWrapper = categoryToEdit.closest(".schedule-category");
    const editButton = categoryWrapper.querySelector("button:first-child");
    
    const newCategoryName = "Edited " + testCategoryName;
    window.prompt = () => newCategoryName; // Mock prompt for edit
    
    editButton.click();
    
    // Verify edit was successful
    const categories = JSON.parse(localStorage.getItem("customCategories"));
    const categoryExists = categories.includes(newCategoryName.toLowerCase());
    
    if (categoryExists) {
        console.log("✔ Category edited successfully");
    } else {
        console.error("✖ Category not edited");
    }
}

// Test 7: Verify category deletion
function testCategoryDeletion() {
    console.log("Testing category deletion...");
    
    // First create a test category
    const testCategoryName = "Test Category To Delete " + Date.now();
    window.prompt = () => testCategoryName;
    simulateClick("createCategoryBtn");
    
    // Find the category in the UI
    const categoryElements = document.querySelectorAll(".schedule-category h2");
    const categoryToDelete = Array.from(categoryElements).find(el => 
        el.textContent.toLowerCase() === testCategoryName.toLowerCase()
    );
    
    if (!categoryToDelete) {
        console.error("✖ Couldn't find test category to delete");
        return;
    }
    
    // Mock confirm dialog
    window.confirm = () => true;
    
    // Find and click the delete button
    const categoryWrapper = categoryToDelete.closest(".schedule-category");
    const deleteButton = categoryWrapper.querySelector("button:last-child");
    deleteButton.click();
    
    // Verify deletion was successful
    const categories = JSON.parse(localStorage.getItem("customCategories"));
    const categoryExists = categories.includes(testCategoryName.toLowerCase());
    
    if (!categoryExists) {
        console.log("✔ Category deleted successfully");
    } else {
        console.error("✖ Category not deleted");
    }
}

// Test 8: Verify UI interactions
function testUIInteractions() {
    console.log("Testing UI interactions...");
    
    // Test sidebar toggle
    const sidebar = document.getElementById("savedSidebar");
    const initialSidebarState = sidebar.classList.contains("hidden");
    
    simulateClick("toggleSavedBtn");
    const afterClickState = sidebar.classList.contains("hidden");
    
    if (initialSidebarState !== afterClickState) {
        console.log("✔ Sidebar toggle works");
    } else {
        console.error("✖ Sidebar toggle not working");
    }
    
    // Test FAQ modal
    const faqModal = document.getElementById("faqModal");
    const initialModalState = window.getComputedStyle(faqModal).display;
    
    simulateClick("faqBtn");
    const afterModalClickState = window.getComputedStyle(faqModal).display;
    
    if (initialModalState === "none" && afterModalClickState !== "none") {
        console.log("✔ FAQ modal opens");
    } else {
        console.error("✖ FAQ modal not opening");
    }
    
    // Close the modal
    const closeButton = faqModal.querySelector(".close");
    closeButton.click();
    const afterCloseState = window.getComputedStyle(faqModal).display;
    
    if (afterCloseState === "none") {
        console.log("✔ FAQ modal closes");
    } else {
        console.error("✖ FAQ modal not closing");
    }
    
    // Test schedule generation
    const initialSuggestion = document.getElementById("suggestion").textContent;
    simulateInput("preferences", "Test preferences");
    simulateClick("generateBtn");
    const afterGenerateSuggestion = document.getElementById("suggestion").textContent;
    
    if (afterGenerateSuggestion !== initialSuggestion) {
        console.log("✔ Schedule generation updates suggestion text");
    } else {
        console.error("✖ Schedule generation not updating suggestion text");
    }
}