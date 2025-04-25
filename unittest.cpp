#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Schedule {
public:
    string name;
    Schedule(const string& n) : name(n) {}
};

class Category {
public:
    string name;
    vector<Schedule> schedules;

    Category(const string& n) : name(n) {}

    void addSchedule(const string& scheduleName) {
        schedules.push_back(Schedule(scheduleName));
    }

    void displaySchedules() {
        cout << "Schedules in Category '" << name << "':\n";
        for (const auto& schedule : schedules) {
            cout << "- " << schedule.name << endl;
        }
    }
};

class CategoryManager {
public:
    vector<Category> categories;

    void createCategory(const string& categoryName) {
        categories.push_back(Category(categoryName));
    }
};
