// Schedule Viewer Unit Tests
function runScheduleTests(schedule) {
    // Object to track test results
    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    // Helper function for assertions
    function assert(condition, testName) {
        testResults.total++;
        if (condition) {
            console.log(`✅ PASS: ${testName}`);
            testResults.passed++;
        } else {
            console.error(`❌ FAIL: ${testName}`);
            testResults.failed++;
        }
    }

    // Test Cases
    // -------------------------

    console.log("Starting Schedule Data Tests");

    // Test 1: Check that schedule has exactly 5 classes
    assert(schedule.length === 5, "Schedule has 5 classes");

    // Test 2: Check that each class has all required fields
    const requiredFields = ['course', 'days', 'time', 'location', 'professor'];

    schedule.forEach((item, index) => {
        requiredFields.forEach(field => {
            assert(
                item.hasOwnProperty(field),
                `Class #${index + 1} has property "${field}"`
            );
        });
    });

    // Test 3: Check that each field is a string
    schedule.forEach((item, index) => {
        requiredFields.forEach(field => {
            assert(
                typeof item[field] === 'string',
                `Class #${index + 1} field "${field}" is a string`
            );
        });
    });

    // Print Test Summary
    // -------------------------
    console.log("\n--- Test Summary ---");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);

    return testResults;
}

if (typeof module !== 'undefined' && module.exports) {
    // Export the function for use in other modules
    module.exports = runScheduleTests;
}


// Valid schedule for testing
const mockSchedule = [
    { course: 'MATH 2413', days: 'MWF', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300', professor: 'Dr. White' },
    { course: 'ENGL 1213', days: 'MWF', time: '11:00AM - 11:50AM', location: 'Dale Hall 101', professor: 'Dr. Smith' },
    { course: 'CS 3203', days: 'T/TH', time: '2:00PM - 3:15PM', location: 'Gallogly Hall 127', professor: 'Dr. Abdulhak' },
    { course: 'HIST 1483', days: 'T/TH', time: '1:00PM - 2:15PM', location: 'Gould Hall 101', professor: 'Dr. Johnson' },
    { course: 'CHEM 1314', days: 'MWF', time: '10:00AM - 10:50AM', location: 'Physical Science Center 101', professor: 'Dr. Lee' },
];

//Invalid schedule for testing
const invalidSchedule = [
    { course: 'MATH 2413', days: 'MWF', time: '9:00AM - 9:50AM', location: 'Felgar Hall 300' }, // Missing professor
    { course: 1213, days: 'MWF', time: '11:00AM - 11:50AM', location: 'Dale Hall 101', professor:'Dr. Johnson' }, // Invalid course type
    { course: 'CS 3203', days: 'T/TH', location: 'Gallogly Hall 127', professor: 'Dr. Smith' }, // Missing time
]; // Incorrect length


// Run tests on valid schedule
runScheduleTests(mockSchedule);
// Run tests on invalid schedule
runScheduleTests(invalidSchedule);
// Export the function for use in other modules
