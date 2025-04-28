document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("savedSidebar");
    const savedList = sidebar.querySelector("#savedList");
    const scheduleList = sidebar.querySelector("#savedScheduleList");
    const customCategoriesContainer = sidebar.querySelector("#customCategories");

    window.schedules = {
        favorites: [],
        created: []
    };

    window.customCategories = [];
    let activeCategory = "created";

    const previewPopup = document.createElement("div");
    previewPopup.id = "previewPopup";
    previewPopup.style.display = "none";
    previewPopup.style.position = "fixed";
    previewPopup.style.top = "50%";
    previewPopup.style.left = "50%";
    previewPopup.style.transform = "translate(-50%, -50%)";
    previewPopup.style.backgroundColor = "white";
    previewPopup.style.padding = "20px";
    previewPopup.style.border = "1px solid #ccc";
    previewPopup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    previewPopup.style.zIndex = "1000";
    document.body.appendChild(previewPopup);

    previewPopup.addEventListener("click", function () {
        previewPopup.style.display = "none";
    });

    window.displaySchedules = function (category) {
        activeCategory = category;
        scheduleList.innerHTML = "";

        if (schedules[category]) {
            schedules[category].forEach((schedule, index) => {
                const div = document.createElement("div");
                div.classList.add("schedule-item");
                div.style.marginBottom = "10px";
                div.innerHTML = `
                    <p class="schedule-name" style="cursor: pointer; text-decoration: underline;" onclick="openPreview('${schedule.name}')">${schedule.name}</p>
                    <button onclick="editSchedule(${index}, '${category}')">Edit</button>
                    <button onclick="deleteSchedule(${index}, '${category}')">Delete</button>
                `;
                scheduleList.appendChild(div);
            });
        }
    };

    window.openPreview = function (title) {
        previewPopup.innerHTML = `
            <h2>${title}</h2>
            <p>(Schedule details can go here later!)</p>
            <button onclick="closePreview()" style="margin-top:10px;">Close</button>
        `;
        previewPopup.style.display = "block";
    };

    window.closePreview = function () {
        previewPopup.style.display = "none";
    };

    window.editSchedule = function (index, category) {
        const newName = prompt("Edit schedule name:", schedules[category][index].name);
        if (newName) {
            schedules[category][index].name = newName.trim();
            displaySchedules(activeCategory);
        }
    };

    window.deleteSchedule = function (index, category) {
        if (confirm("Are you sure you want to delete this schedule?")) {
            schedules[category].splice(index, 1);
            displaySchedules(activeCategory);
        }
    };

    // Save a new schedule
    document.getElementById("saveScheduleBtn").addEventListener("click", function () {
        const existingPopup = document.getElementById("customPopup");
        if (existingPopup) {
            existingPopup.remove();
        }

        const customPopup = document.createElement("div");
        customPopup.id = "customPopup";
        customPopup.style.position = "fixed";
        customPopup.style.top = "50%";
        customPopup.style.left = "50%";
        customPopup.style.transform = "translate(-50%, -50%)";
        customPopup.style.backgroundColor = "white";
        customPopup.style.padding = "20px";
        customPopup.style.border = "1px solid #ccc";
        customPopup.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        customPopup.style.zIndex = "1000";

        customPopup.innerHTML = `
            <h2>Enter Schedule Name</h2>
            <input type="text" id="scheduleNameInput" placeholder="Enter schedule name" />
            <p>Add to Category?</p>
            <select id="categoryDropdown">
                <option value="created"></option>
                <option value="favorites">Favorites</option>
                ${customCategories.map(category => `<option value="${category}">${category}</option>`).join('')}
            </select>
            <br><br>
            <button id="saveScheduleInCategoryBtn">Save Schedule</button>
            <button id="closePopupBtn">Cancel</button>
        `;

        document.body.appendChild(customPopup);

        document.getElementById("closePopupBtn").addEventListener("click", function () {
            customPopup.style.display = "none";
        });

        document.getElementById("saveScheduleInCategoryBtn").addEventListener("click", function () {
            const scheduleName = document.getElementById("scheduleNameInput").value.trim();
            const selectedCategory = document.getElementById("categoryDropdown").value;

            if (scheduleName && scheduleName !== "") {
                if (schedules[selectedCategory]) {
                    schedules[selectedCategory].push({ name: scheduleName });

                    // Refresh the relevant category sections
                    displaySchedules('saved');
                    displaySchedules('favorites');
                    displaySchedules(selectedCategory);

                    customPopup.style.display = "none";
                } else {
                    alert("Invalid category selected.");
                }
            } else {
                alert("Schedule name cannot be empty.");
            }
        });
    });

    document.getElementById("createCategoryBtn").addEventListener("click", function () {
        const newCategoryName = prompt("Enter a name for the new custom category:");

        if (newCategoryName && newCategoryName.trim() !== "") {
            const trimmedName = newCategoryName.trim();
            customCategories.push(trimmedName);

            const categoryDropdown = document.getElementById("categoryDropdown");
            const newOption = document.createElement("option");
            newOption.value = trimmedName;
            newOption.textContent = trimmedName;
            categoryDropdown.appendChild(newOption);

            const newHeading = document.createElement("h2");
            newHeading.textContent = trimmedName;
            customCategoriesContainer.appendChild(newHeading);
        } else {
            alert("Category name cannot be empty.");
        }
    });

    displaySchedules("created");
});
