// JavaScript for ScheduleSooner Dashboard – Final Version with CWE 400 Documentation

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("savedSidebar");
    const scheduleList = sidebar.querySelector("#savedScheduleList");
    const customCategoriesContainer = sidebar.querySelector("#customCategories");
    const toggleSidebarBtn = document.getElementById("toggleSavedBtn");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {
        favorites: [],
        created: []
    };

    // Normalize the keys of the schedules object to lowercase
    const normalizedSchedules = {};
    Object.keys(schedules).forEach(key => {
        const lowerKey = key.toLowerCase();
        if (!normalizedSchedules[lowerKey]) {
            normalizedSchedules[lowerKey] = [];
        }
        normalizedSchedules[lowerKey] = normalizedSchedules[lowerKey].concat(schedules[key]);
    });
    schedules = normalizedSchedules;

    let customCategories = JSON.parse(localStorage.getItem("customCategories")) || [];
    let activeCategory = "created";

    const previewPopup = createPopup("previewPopup");
    document.body.appendChild(previewPopup);
//----------------------------------------------------------------------------
    //CWE 400: Resource Consumtion Midigation Functions:

    // Function to check if the schedule is too large in order to reduce resource consumption
    // and prevent performance issues.
    function isScheduleTooLarge(schedule) {
        const jsonStr = JSON.stringify(schedule);
        return jsonStr.length > 1024 * 100; // 100KB max per schedule
    }

    // Function to throttle the execution of a function to prevent excessive resource consumption.
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return func.apply(this, args);
        };
    }

    // Cleans up the preview popup when closed to prevent memory leaks and excessive resource consumption.
    // This function is called when the preview popup is closed.
    function closePreview() {
        previewPopup.style.display = "none";
        // Remove any dynamic listeners
        const closeBtn = document.getElementById("closePreviewBtn");
        if (closeBtn) closeBtn.replaceWith(closeBtn.cloneNode(true));
    }

    // Function to check the storage usage and alert the user if it's too high.
    // This helps in managing the local storage and preventing excessive resource consumption.
    // It checks if the used storage is more than 90% of the maximum allowed size
    function checkStorageUsage() {
        const used = JSON.stringify(localStorage).length;
        const max = 1024 * 1024 * 5; // 5MB
        if (used > max * 0.9) {
            alert("Warning: Storage is almost full. Delete old schedules.");
        }
    }

//---------------------------------------------------------------------------

    function createPopup(id) {
        const popup = document.createElement("div");
        popup.id = id;
        popup.className = "popup-modal";
        Object.assign(popup.style, {
            display: "none",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            border: "1px solid #ccc",
            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            zIndex: "1000",
            borderRadius: "8px",
            minWidth: "300px"
        });
        return popup;
    }

    function saveToLocalStorage() {
        localStorage.setItem("schedules", JSON.stringify(schedules));
        localStorage.setItem("customCategories", JSON.stringify(customCategories));
    }

    function displaySchedules(category) {
        category = category.toLowerCase(); // Normalize case
        activeCategory = category;
        scheduleList.innerHTML = "";  // Clear previous content
    
        // Always render Saved Schedules (even if empty)
        renderCategory("created", "Saved Schedules");
    
        // Always render Favorites (even if empty)
        renderCategory("favorites", "Favorites");
    
        // Render Custom Categories (even if empty)
        customCategories.forEach((catName) => {
            renderCategory(catName, capitalizeFirstLetter(catName));
        });
    }
    
    function renderCategory(categoryKey, headerTitle) {
        const categoryWrapper = document.createElement("div");
        categoryWrapper.classList.add("schedule-category");
    
        // Create category heading with optional edit/delete for custom categories
        const categoryHeaderWrapper = document.createElement("div");
        categoryHeaderWrapper.style.display = "flex";
        categoryHeaderWrapper.style.alignItems = "center";
        categoryHeaderWrapper.style.justifyContent = "space-between";
        categoryHeaderWrapper.style.marginBottom = "6px";
    
        const categoryHeader = document.createElement("h2");
        categoryHeader.textContent = headerTitle;
    
        categoryHeaderWrapper.appendChild(categoryHeader);
    
        if (!["created", "favorites"].includes(categoryKey)) {
            const catBtnWrapper = document.createElement("div");
            catBtnWrapper.style.display = "flex";
            catBtnWrapper.style.gap = "5px";
    
            const editCatBtn = document.createElement("button");
            editCatBtn.textContent = "Edit";
            editCatBtn.style.fontSize = "12px";
            editCatBtn.addEventListener("click", () => {
                const newName = prompt("Rename category:", categoryKey);
                if (newName && newName.trim() !== "") {
                    const newKey = newName.trim().toLowerCase();
                    if (!schedules[newKey]) {
                        schedules[newKey] = schedules[categoryKey];
                        delete schedules[categoryKey];
    
                        const index = customCategories.indexOf(categoryKey);
                        if (index !== -1) {
                            customCategories[index] = newKey;
                        }
    
                        saveToLocalStorage();
                        displaySchedules(activeCategory);
                    } else {
                        alert("A category with that name already exists.");
                    }
                }
            });
    
            const deleteCatBtn = document.createElement("button");
            deleteCatBtn.textContent = "Delete";
            deleteCatBtn.style.fontSize = "12px";
            deleteCatBtn.addEventListener("click", () => {
                if (confirm(`Delete category "${categoryKey}" and all schedules in it?`)) {
                    delete schedules[categoryKey];
                    customCategories = customCategories.filter(c => c !== categoryKey);
                    saveToLocalStorage();
                    displaySchedules(activeCategory);
                }
            });
    
            catBtnWrapper.appendChild(editCatBtn);
            catBtnWrapper.appendChild(deleteCatBtn);
            categoryHeaderWrapper.appendChild(catBtnWrapper);
        }
    
        categoryWrapper.appendChild(categoryHeaderWrapper);
    
        if (schedules[categoryKey] && schedules[categoryKey].length > 0) {
            schedules[categoryKey].forEach((schedule, index) => {
                const div = createScheduleItem(schedule, index, categoryKey);
                categoryWrapper.appendChild(div);
            });
        } else {
            const placeholder = document.createElement("p");
            placeholder.textContent = "No schedules yet.";
            placeholder.style.fontStyle = "italic";
            categoryWrapper.appendChild(placeholder);
        }
    
        scheduleList.appendChild(categoryWrapper);
    }
    
    
    
    function createScheduleItem(schedule, index, category) {
        const div = document.createElement("div");
        div.classList.add("schedule-item");
        
        const nameEl = document.createElement("p");
        nameEl.classList.add("schedule-name");
        nameEl.textContent = schedule.name;
        
        const buttonsDiv = document.createElement("div");
        buttonsDiv.classList.add("schedule-buttons");
        
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            editSchedule(index, category);
        });
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteSchedule(index, category);
        });
        
        buttonsDiv.appendChild(editBtn);
        buttonsDiv.appendChild(deleteBtn);
        
        nameEl.addEventListener("click", () => openPreview(schedule.name));
        
        div.appendChild(nameEl);
        div.appendChild(buttonsDiv);
        
        return div;
    }
    
    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    
    
    
    function openPreview(title) {
        // Find the schedule in all categories
        let scheduleDetails = null;
        for (const category in schedules) {
            const foundSchedule = schedules[category].find(s => s.name === title);
            if (foundSchedule) {
                scheduleDetails = foundSchedule;
                break;
            }
        }
    
        // Create the popup content
        let popupHTML = `
            <div style="max-width: 400px;">
                <h2 style="margin-bottom: 15px;">${title}</h2>
                <div class="schedule-details" style="max-height: 400px; overflow-y: auto;">
        `;
    
        if (scheduleDetails && scheduleDetails.classes) {
            scheduleDetails.classes.forEach(classItem => {
                popupHTML += `
                    <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;">
                        <strong>${classItem.course} - ${classItem.professor}</strong><br>
                        ${classItem.days} • ${classItem.time}<br>
                        📍 ${classItem.location}
                    </div>
                `;
            });
        } else {
            popupHTML += `<p>No class details available for this schedule.</p>`;
        }
    
        popupHTML += `
                </div>
                <button id="closePreviewBtn" 
                        style="margin-top: 15px; padding: 8px 15px; 
                               background: #808080; border: 1px solid #ddd; 
                               border-radius: 4px; cursor: pointer;">
                    Close
                </button>
            </div>
        `;
    
        previewPopup.innerHTML = popupHTML;
        previewPopup.style.display = "block";
    
        document.getElementById('closePreviewBtn').addEventListener('click', () => {
            previewPopup.style.display = 'none';
        });
    }

    function editSchedule(index, category) {
        const newName = prompt("Edit schedule name:", schedules[category][index].name);
        if (newName) {
            schedules[category][index].name = newName.trim();
            saveToLocalStorage();
            displaySchedules(activeCategory);
        }
    }

    function deleteSchedule(index, category) {
        if (confirm("Are you sure you want to delete this schedule?")) {
            schedules[category].splice(index, 1);
            saveToLocalStorage();
            displaySchedules(activeCategory);
        }
    }

    /*function renderCategoryHeading(catName) {
        const wrapper = document.createElement("div");
        wrapper.classList.add("schedule-category");
        
        const heading = document.createElement("h2");
        heading.textContent = capitalizeFirstLetter(catName);
        heading.style.cursor = "pointer";
        
        const controlsWrapper = document.createElement("div");
        controlsWrapper.classList.add("category-controls");
        
        const editBtn = document.createElement("button");
        editBtn.innerHTML = "✏️";
        editBtn.title = "Edit category name";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const newName = prompt("Rename category:", catName);
            if (newName && newName.trim() !== "" && newName !== catName) {
                const newCat = newName.trim().toLowerCase();
                if (customCategories.includes(newCat)) {
                    alert("That category name already exists.");
                    return;
                }
                schedules[newCat] = schedules[catName] || [];
                delete schedules[catName];
                customCategories = customCategories.map(c => (c === catName ? newCat : c));
                saveToLocalStorage();
                customCategoriesContainer.innerHTML = "";
                customCategories.forEach(renderCategoryHeading);
                displaySchedules(newCat);
            }
        });
    
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.title = "Delete category";
        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (confirm(`Delete category "${catName}" and all schedules in it?`)) {
                delete schedules[catName];
                customCategories = customCategories.filter(c => c !== catName);
                saveToLocalStorage();
                customCategoriesContainer.innerHTML = "";
                customCategories.forEach(renderCategoryHeading);
                displaySchedules("created");
            }
        });
    
        controlsWrapper.appendChild(editBtn);
        controlsWrapper.appendChild(deleteBtn);
        
        heading.addEventListener("click", () => displaySchedules(catName));
        
        wrapper.appendChild(heading);
        wrapper.appendChild(controlsWrapper);
        customCategoriesContainer.appendChild(wrapper);
    }
    */
    function styleIconButton(btn) {
        btn.style.background = "none";
        btn.style.border = "none";
        btn.style.cursor = "pointer";
        btn.style.padding = "2px";
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";
    }

    document.getElementById("saveScheduleBtn").addEventListener("click", function () {
        // First collect all the saved classes from the sidebar
        const savedClasses = Array.from(document.getElementById('savedList').children).map(li => {
            const text = li.textContent;
            return {
                course: li.querySelector('strong').textContent.split(' - ')[0],
                professor: li.querySelector('strong').textContent.split(' - ')[1],
                days: text.split('•')[0].split('\n')[1].trim(),
                time: text.split('•')[1].split('📍')[0].trim(),
                location: text.split('📍')[1].trim()
            };
        });
    
        if (savedClasses.length === 0) {
            alert("No classes have been saved to this schedule yet!");
            return;
        }
    
        // Now show the category management popup
        let existingPopup = document.getElementById("customPopup");
        if (existingPopup) existingPopup.remove();
    
        const customPopup = createPopup("customPopup");
        const options = customCategories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
    
        customPopup.innerHTML = `
            <h2>Enter Schedule Name</h2>
            <input type="text" id="scheduleNameInput" placeholder="Enter schedule name" style="width:100%; padding:8px; margin-top:10px;" />
            <p style="margin-top:10px;">Add to Category?</p>
            <select id="categoryDropdown" style="width:100%; padding:6px;">
                <option value="">-- None (just Saved Schedules) --</option>
                <option value="favorites">Favorites</option>
                ${options}
            </select>
            <div style="margin-top:15px; text-align:right;">
                <button id="saveScheduleInCategoryBtn" style="margin-right:10px;">Save</button>
                <button id="closePopupBtn">Cancel</button>
            </div>
        `;
    
        document.body.appendChild(customPopup);
        customPopup.style.display = "block";
    
        document.getElementById("closePopupBtn").addEventListener("click", () => customPopup.remove());
    
        document.getElementById("saveScheduleInCategoryBtn").addEventListener("click", function () {
            const scheduleName = document.getElementById("scheduleNameInput").value.trim();
            const selectedCategory = document.getElementById("categoryDropdown").value.toLowerCase();
    
            if (!scheduleName) {
                alert("Schedule name cannot be empty.");
                return;
            }
    
            const newSchedule = { 
                name: scheduleName,
                classes: savedClasses  // This is where we add the class details
            };
    
            // Save to "created" (Saved Schedules)
            schedules["created"].push(newSchedule);
    
            // Save to selected category if applicable
            if (selectedCategory && selectedCategory !== "created") {
                if (!schedules[selectedCategory]) {
                    schedules[selectedCategory] = [];
                }
    
                schedules[selectedCategory].push(newSchedule);
    
                // Track custom category if it's new
                if (!["favorites"].includes(selectedCategory) && !customCategories.includes(selectedCategory)) {
                    customCategories.push(selectedCategory);
                    renderCategoryHeading(selectedCategory);
                }
            }
    
            saveToLocalStorage();
            displaySchedules(selectedCategory || "created");
            customPopup.remove();
            alert(`Schedule "${scheduleName}" saved successfully!`);
        });
    });
    
    document.getElementById("createCategoryBtn").addEventListener("click", function() {
        const newCategoryName = prompt("Enter a name for the new custom category:");
        if (newCategoryName && newCategoryName.trim() !== "") {
            const lowerCaseName = newCategoryName.trim().toLowerCase();
            if (!customCategories.includes(lowerCaseName)) {
                customCategories.push(lowerCaseName);
                // Initialize an empty array for this category
                schedules[lowerCaseName] = schedules[lowerCaseName] || [];
                
                // Save to storage
                saveToLocalStorage();
                
                // Refresh the display
                displaySchedules(activeCategory); // This will now show the new category
            } else {
                alert("This category already exists.");
            }
        } else {
            alert("Category name cannot be empty.");
        }
    });

    toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("hidden");
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            previewPopup.style.display = "none";
            const customPopup = document.getElementById("customPopup");
            if (customPopup) customPopup.remove();
        }
    });

    // Initial render
    displaySchedules("created");
    //customCategories.forEach(renderCategoryHeading);
});
