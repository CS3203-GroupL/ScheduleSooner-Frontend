// JavaScript for ScheduleSooner Dashboard – Final Version with SVG Icons and Dark Hover Styling

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("savedSidebar");
    const scheduleList = sidebar.querySelector("#savedScheduleList");
    const customCategoriesContainer = sidebar.querySelector("#customCategories");
    const toggleSidebarBtn = document.getElementById("toggleSavedBtn");

    let schedules = JSON.parse(localStorage.getItem("schedules")) || {
        favorites: [],
        created: []
    };

    let customCategories = JSON.parse(localStorage.getItem("customCategories")) || [];
    let activeCategory = "created";

    const previewPopup = createPopup("previewPopup");
    document.body.appendChild(previewPopup);

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
        activeCategory = category;
        scheduleList.innerHTML = "";

        if (schedules[category]) {
            schedules[category].forEach((schedule, index) => {
                const div = document.createElement("div");
                div.classList.add("schedule-item");
                div.style.marginBottom = "10px";
                div.innerHTML = `
                    <p class="schedule-name" style="cursor: pointer; text-decoration: underline;">${schedule.name}</p>
                    <button>Edit</button>
                    <button>Delete</button>
                `;

                const [nameEl, editBtn, deleteBtn] = div.children;
                nameEl.addEventListener("click", () => openPreview(schedule.name));
                editBtn.addEventListener("click", () => editSchedule(index, category));
                deleteBtn.addEventListener("click", () => deleteSchedule(index, category));

                scheduleList.appendChild(div);
            });
        }
    }

    function openPreview(title) {
        previewPopup.innerHTML = `
            <h2>${title}</h2>
            <p>(Schedule details can go here later!)</p>
            <button id="closePreviewBtn" style="margin-top:10px;">Close</button>
        `;
        previewPopup.style.display = "block";

        document.getElementById("closePreviewBtn").addEventListener("click", () => {
            previewPopup.style.display = "none";
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

    function renderCategoryHeading(catName) {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "space-between";
        wrapper.style.marginBottom = "8px";
        wrapper.style.padding = "4px 6px";
        wrapper.style.borderRadius = "6px";
        wrapper.style.transition = "background-color 0.2s";

        const heading = document.createElement("h2");
        heading.textContent = catName;
        heading.style.cursor = "pointer";
        heading.style.margin = "0";
        heading.style.fontSize = "16px";
        heading.addEventListener("click", () => displaySchedules(catName));

        const controlsWrapper = document.createElement("div");
        controlsWrapper.style.display = "none";
        controlsWrapper.style.gap = "4px";

        const editBtn = document.createElement("button");
        editBtn.title = "Edit category name";
        editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#666" viewBox="0 0 24 24"><path d="M5 21h14v-2H5v2zm3.293-5.293L17.586 6.414a2 2 0 0 0 0-2.828l-1.172-1.172a2 2 0 0 0-2.828 0L4.293 11.707a1 1 0 0 0-.293.707V17a1 1 0 0 0 1 1h4.586a1 1 0 0 0 .707-.293z"/></svg>`;
        styleIconButton(editBtn);
        editBtn.addEventListener("click", () => {
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
        deleteBtn.title = "Delete category";
        deleteBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#c00" viewBox="0 0 24 24"><path d="M9 3v1H4v2h1v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9zm2 4h2v12h-2V7z"/></svg>`;
        styleIconButton(deleteBtn);
        deleteBtn.addEventListener("click", () => {
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

        wrapper.addEventListener("mouseenter", () => {
            wrapper.style.backgroundColor = "#e0e0e0";
            controlsWrapper.style.display = "flex";
        });
        wrapper.addEventListener("mouseleave", () => {
            wrapper.style.backgroundColor = "transparent";
            controlsWrapper.style.display = "none";
        });

        wrapper.appendChild(heading);
        wrapper.appendChild(controlsWrapper);
        customCategoriesContainer.appendChild(wrapper);
    }

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
            const selectedCategory = document.getElementById("categoryDropdown").value;
    
            if (!scheduleName) {
                alert("Schedule name cannot be empty.");
                return;
            }
    
            const newSchedule = { name: scheduleName };
    
            // Save to "created" (Saved Schedules)
            schedules["created"].push({ ...newSchedule });
    
            // Save to selected category if applicable
            if (selectedCategory && selectedCategory !== "created") {
                if (!schedules[selectedCategory]) {
                    schedules[selectedCategory] = [];
                }
    
                schedules[selectedCategory].push({ ...newSchedule });
    
                // Track custom category if it's new
                if (!["favorites"].includes(selectedCategory) && !customCategories.includes(selectedCategory)) {
                    customCategories.push(selectedCategory);
                    renderCategoryHeading(selectedCategory);
                }
            }
    
            saveToLocalStorage();
            displaySchedules(selectedCategory || "created");
            customPopup.remove();
        });
    });
    
    

    document.getElementById("createCategoryBtn").addEventListener("click", function () {
        const newCategoryName = prompt("Enter a name for the new custom category:");
        if (newCategoryName && newCategoryName.trim() !== "") {
            const lowerCaseName = newCategoryName.trim().toLowerCase();
            if (!customCategories.includes(lowerCaseName)) {
                customCategories.push(lowerCaseName);
                renderCategoryHeading(lowerCaseName);
                saveToLocalStorage();
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
    customCategories.forEach(renderCategoryHeading);
});
