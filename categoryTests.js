// categoryTests.js
function runCategoryTests(schedules) {
    // Test function to validate category management
    const testResults = {
        passed: 0,
        failed: 0,
        total: 0
    };

    // Assert function to check test conditions
    function assert(condition, testName) {
        testResults.total++;
        if (condition) {
            console.log(`✅ PASS: ${testName}`);
            testResults.passed++;
            return true;
        } else {
            console.error(`❌ FAIL: ${testName}`);
            testResults.failed++;
            return false;
        }
    }

    // Mock Category Management Functions
    function createCategory(categoryName) {
        // Trim the category name
        categoryName = categoryName.trim();
        
        // Check if category name is empty or already exists
        if (categoryName === '' || schedules[categoryName]) {
            return false;
        }
        
        // Create the category
        schedules[categoryName] = [];
        return true;
    }

    function deleteCategory(categoryName) {
        // Prevent deleting default categories
        if (categoryName === 'favorites' || categoryName === 'created') {
            return false;
        }
        
        // Check if category exists
        if (!schedules[categoryName]) {
            return false;
        }
        
        // Delete the category
        delete schedules[categoryName];
        return true;
    }

    function editCategory(oldName, newName) {
        // Trim the names
        oldName = oldName.trim();
        newName = newName.trim();
        
        // Check for empty or existing names
        if (newName === '' || schedules[newName] || 
            oldName === 'favorites' || oldName === 'created') {
            return false;
        }
        
        // Perform the edit
        schedules[newName] = schedules[oldName];
        delete schedules[oldName];
        return true;
    }

    // Test Cases
    console.log("Starting Category Management Tests");

    // Initial schedules for testing
    const initialSchedules = {...schedules};

    // Create Category Tests
    assert(createCategory('Monday') === true, "Create new category");
    assert(createCategory('Monday') === false, "Prevent duplicate category");
    assert(createCategory('') === false, "Prevent empty category name");

    // Delete Category Tests
    assert(deleteCategory('Monday') === true, "Delete created category");
    assert(deleteCategory('favorites') === false, "Prevent deleting default category");
    assert(deleteCategory('NonExistentCategory') === false, "Prevent deleting non-existent category");

    // Edit Category Tests
    createCategory('Wednesday');
    assert(editCategory('Wednesday', 'Weekend') === true, "Edit category name");
    assert(editCategory('Weekend', 'favorites') === false, "Prevent editing to default category");
    assert(editCategory('NonExistentCategory', 'NewName') === false, "Prevent editing non-existent category");

    // Print Test Summary
    console.log("\n--- Test Summary ---");
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);

    return testResults;
}

// Export the test function if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = runCategoryTests;
}

runCategoryTests({});
