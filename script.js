document.addEventListener("DOMContentLoaded", function () {
    const categoryList = document.getElementById("customCategories");
    const categoryModal = document.getElementById("categoryPopup");
    const categoryInput = document.getElementById("categoryName");
    let editCategoryName = null;
    
    // Make schedules a global variable so it can be accessed by global functions
    window.schedules = {
        favorites: [
            { name: "Schedule 1", img: "thumbnail1.png", details: "Details about Schedule 1" },
            { name: "Schedule 2", img: "thumbnail2.png", details: "Details about Schedule 2" }
        ],
        created: [
            { name: "Schedule A", img: "thumbnail3.png", details: "Details about Schedule A" }
        ]
    };

    let activeCategory = "created";

    // Make these functions global so they can be called from HTML onclick events
    window.displaySchedules = function(category) {
        activeCategory = category;
        const scheduleList = document.getElementById("scheduleList");
        scheduleList.innerHTML = "";

        if (schedules[category]) {
            schedules[category].forEach((schedule, index) => {
                const div = document.createElement("div");
                div.classList.add("schedule-item");
                div.innerHTML = `
                    <img src="${schedule.img}" alt="${schedule.name}" onclick="openPreview('${schedule.name}', '${schedule.img}', '${schedule.details}')">
                    <p class="schedule-name">${schedule.name}</p>
                    <button onclick="editSchedule(${index}, '${category}')">Edit</button>
                    <button onclick="deleteSchedule(${index}, '${category}')">Delete</button>
                `;
                scheduleList.appendChild(div);
            });
        }
    };

    window.openPreview = function(title, imgSrc, details) {
        document.getElementById("previewTitle").innerText = title;
        document.getElementById("previewImage").src = imgSrc;
        document.getElementById("previewDetails").innerText = details;
        document.getElementById("previewPopup").style.display = "block";
    };

    window.closePreview = function() {
        document.getElementById("previewPopup").style.display = "none";
    };

    window.editSchedule = function(index, category) {
        const newName = prompt("Edit schedule name:", schedules[category][index].name);
        if (newName) {
            schedules[category][index].name = newName;
            displaySchedules(activeCategory);
        }
    };

    window.deleteSchedule = function(index, category) {
        if (confirm("Are you sure you want to delete this schedule?")) {
            schedules[category].splice(index, 1);
            displaySchedules(activeCategory);
        }
    };

    document.getElementById("createCategoryBtn").addEventListener("click", function () {
        categoryInput.value = "";
        editCategoryName = null;
        categoryModal.style.display = "block";
    });

    window.closeCategoryPopup = function() {
        categoryModal.style.display = "none";
    };

    document.getElementById("saveCategoryBtn").addEventListener("click", function () {
        const categoryName = categoryInput.value.trim();
        if (categoryName === "") return alert("Category name cannot be empty!");

        if (editCategoryName) {
            schedules[categoryName] = schedules[editCategoryName];
            delete schedules[editCategoryName];
        } else {
            if (!schedules[categoryName]) {
                schedules[categoryName] = [];
            }
        }

        updateCategoryList();
        categoryModal.style.display = "none";
    });

    window.editCategory = function(category) {
        categoryInput.value = category;
        editCategoryName = category;
        categoryModal.style.display = "block";
    };

    window.deleteCategory = function(category) {
        if (confirm(`Are you sure you want to delete the "${category}" category?`)) {
            delete schedules[category];
            updateCategoryList();
        }
    };

    function updateCategoryList() {
        categoryList.innerHTML = "";
        Object.keys(schedules).forEach((category) => {
            if (category !== "favorites" && category !== "created") {
                const div = document.createElement("div");
                div.classList.add("category-item");
                div.innerHTML = `
                    <button class="category-btn" onclick="displaySchedules('${category}')">${category}</button>
                    <button class="edit-btn" onclick="editCategory('${category}')">✏️</button>
                    <button class="delete-btn" onclick="deleteCategory('${category}')">❌</button>
                `;
                categoryList.appendChild(div);
            }
        });
        displaySchedules(activeCategory);
    }

    updateCategoryList();
    displaySchedules("created");
});