// CategoryManagerTests.cpp
#include <cassert>
#include <iostream>
#include "unittest.cpp"

void test_create_category() {
    CategoryManager manager;
    manager.createCategory("Work");
    manager.createCategory("School");
    manager.createCategory("");

    if (manager.categories.size() == 3 &&
        manager.categories[0].name == "Work" &&
        manager.categories[1].name == "School" &&
        manager.categories[2].name == "") {
        std::cout << "Test Passed: Categories created successfully.\n";
        std::cout << "Number of categories: " << manager.categories.size() << "\n";
        std::cout << "Categories: \n";
        for (const auto& category : manager.categories) {
            std::cout << "- " << category.name << "\n";
        }
    } else {
        std::cerr << "Test Failed: Category creation failed.\n";
    }
}

int main() {
    test_create_category();
    return 0;
}
