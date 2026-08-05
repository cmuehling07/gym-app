/* Starting state code, start*/

// Initializing the data structures, especially for first time use of app. Will be overwritten if data is present.
let exerciseData = {} 
let mAndEScreenData = { 
    muscleGroups: {}
};

// Creates the starting state of the screens in the application, triggered on loading of the DOM
document.addEventListener('DOMContentLoaded', () => {

    // Loading and overwriting existing data
    exerciseDataSave=loadData('exerciseData');
    mAndEScreenDataSave=loadData('mAndEScreenData');
    if (Object.keys(exerciseDataSave ?? {}).length > 0) {
        exerciseData = exerciseDataSave;
    }
    if (Object.keys(mAndEScreenDataSave?.muscleGroups ?? {}).length > 0) {
        mAndEScreenData = mAndEScreenDataSave;
    }

    /* Starting state, home screen, start */
    // Directing the user to appropriate screens off home buttons
    document.getElementById('navMusclesButton').addEventListener('click', () => {
        showScreen('Muscles');
    })
    document.getElementById('startWorkoutButton').addEventListener('click', () => {
        showScreen('startWorkoutScreen');
    })
    /* Starting state, home screen, end */

    /* Starting state, muscle screen, start */
    // Creating the "add muscle group" button that adds muscle groups to muscle group screen
    document.getElementById('addMuscleGroupButtonContainer').appendChild(createAddButton('addMuscleGroup'));
    document.getElementById('addMuscleGroup').addEventListener('click', ()=>{
        // Clears any existing directions to add muscle groups
        if (document.getElementById('addMuscleGroupsDirections')) {
            document.getElementById('addMuscleGroupsDirections').remove()
        }
        if (document.getElementById('addMuscleGroupsDirectionsIcon')) {
            document.getElementById('addMuscleGroupsDirectionsIcon').remove()
        }
        // Facilitates adding new muscle groups
        addModeMuscles()
    });
    // Create button that takes you back to home, also coding for what happens if you click it with an ongoing form open (closes it and returns to starting state) 
    createButtonB2Home('navButtonMuscles', 'Muscles');
    document.getElementById('Muscles'+'B2Home').addEventListener('click',()=>{
        if (document.getElementById("addMuscleGroupForm")) {
            //Assumes existence of Complete button if there is the existence of form; attribute to nature of linked deployment in addMode
            document.getElementById('addMuscleGroupForm').remove();
            document.getElementById('completeMuscleButton').remove();
            document.getElementById('addMuscleGroupButtonContainer').appendChild(createAddButton('addMuscleGroup'));
            document.getElementById('addMuscleGroup').addEventListener('click', addModeMuscles);
            // Will put directions back on if no muscle groups are on screen
            addMuscleGroupsDirections();
        }
    })
    /* Starting state, muscle screen, end */

    /* Starting state, start workout screen, start */
    // Create the button that takes you to the exercise list screen to add exercises to "start workout"
    document.getElementById('startWorkoutAddExercisesButtonContainer').appendChild(createAddButton('startWorkoutAddExercisesButton'))
    document.getElementById('startWorkoutAddExercisesButton').addEventListener('click', ()=>{
        showScreen('exerciseListScreen')
    })
    // Creates the 'save workout' button and 'back to home' button
    document.getElementById('navButtonsStartWorkout').appendChild(createSaveWorkoutButton())
    createButtonB2Home('navButtonsStartWorkout', 'startWorkoutScreen');
    // Directions will be added to startWorkoutScreen on first loading of DOM, all else directions on this screen are appended after other buttons/actions are taken
    startWorkoutDirections()
    // Processes the information in reps and weight fields when 'save workout' is pressed; designed for when the user has input some muscles and exercises later on 
    document.getElementById('startWorkoutSaveButton').addEventListener('click', () => {
        const primary=document.getElementById("startWorkoutExercisesContainer")
        // A loop that goes through each exercise container (which contains the buttons and reps/weight fields for each exercise)
        Array.from(primary.children).forEach(exerciseContainer => {
            // Pulls out variables which have been intentionally placed in the dataset
            const exerciseName=exerciseContainer.dataset.exerciseName
            const muscleGroupName=exerciseContainer.dataset.muscleGroupName
            // Initialize the array we will store the reps/weight data in, for each exercise; also includes date
            const exerciseDataInput=[]
            const now=new Date()
            const year=now.getFullYear()
            const month=now.getMonth()
            const day=now.getDate() 
            const dateString=`${month+1}-${day}-${year}`
            exerciseDataInput.push(dateString)
            // Each row of reps and weight fields are within a container. This loops through each form container (each set of reps and weight)
            document.getElementById(exerciseName+"startWorkoutRepsAndWeightInputContainer").querySelectorAll("div").forEach((formContainer) => {
                // Creates an empty variable for reps and weight
                let reps=""
                let weight=""
                // Checks each element in the form container, which can be either a label or input field. Will only want input fields
                formContainer.querySelectorAll("*").forEach((formElement)=>{
                    // If the element is an input field, and it corresponds to reps, and it has a value, assign that value to the reps variable. 
                    if (formElement.tagName==="INPUT" && formElement.name==="Reps" && formElement.value.trim()!=='') {
                        reps=formElement.value.trim()
                    }
                    // Same idea as reps, but for weight
                    if (formElement.tagName==="INPUT" && formElement.name==="Weight" && formElement.value.trim()!=='') {
                        weight=formElement.value.trim()
                    }
                })
                // Taking both reps and weight, if we overwrote a value for both, create a string of blank x blank, otherwise push "N/A"
                if (reps!=='' && weight!=='') {
                    set=reps+"x"+weight
                    exerciseDataInput.push(set)
                } else {
                    exerciseDataInput.push("N/A")
                }
                // Then loop back up to check the next container of reps and weight
            })
            // After every reps and weight container has been checked, and every string pushed into exerciseDataInput, store the data at the FRONT of the array, so render function places it first
            exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'RandW'].unshift(exerciseDataInput)
            saveData('exerciseData', exerciseData);
            // Update the table on the exercise data screen immediately
            renderTable(exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'RandW'],exerciseName,exerciseName+"DataTable")
        })
        // All of this has been happening of the click of the "save workout" button. Now we return to the home screen.
        showScreen("home")
        // Clear the start workout screen after saving the workout. We are done with it.
        document.getElementById("startWorkoutExercisesContainer").querySelectorAll('*').forEach(element=>element.remove())
        // Re-append the start workout directions (screen should be empty now, so function should correctly add directions)
        startWorkoutDirections()
    })
    /* Starting state, start workout screen, end */

    /* Starting state, exercise list screen, start */
    createButtonB2StartWorkout('navButtonsExerciseList', 'exerciseListScreen');
    /* Starting state, exercise list screen, end */

    // Master render that puts all the muscle group buttons, exercise buttons, data screens, and more on the DOM, using the mAndEScreenData object
    // Called at the end because it references some initial state features, so we wait for all initial state features to be set before calling it
    render();
    // Called after render to add directions to the muscle screen; called after to allow for muscle groups to be created from stored data, which would mean directions aren't required
    addMuscleGroupsDirections()
});

// Like mentioned above, this is the master render for the page that happens on initial load
function render() {
    renderMuscleGroups();
    renderStartWorkoutExerciseListScreen();
}
/* Starting state code, end */

/* Supporting render functions, start */
function renderMuscleGroups() { // Responsible for rendering muscle groups on muscle screen, and creating associate screens with each (by calling other functions)
    // Creates an array list of each 'key' (muscle group name) to be looped through
    Object.keys(mAndEScreenData.muscleGroups).forEach(muscleGroupSingular => {
        const muscleGroupName = mAndEScreenData.muscleGroups[muscleGroupSingular].name;
        // Create the button for each muscle group on the muscle group screen
        createMuscleButtonDelete('muscleNameButtons', muscleGroupName+'MuscleButtonModifiedDelete', muscleGroupName);
        // Code for action of delete button, including warning text
        document.getElementById(muscleGroupName+'MuscleButtonDelete').addEventListener('click', () => {
            const warningText=document.createElement('p'); /* creates text for warning */
            warningText.textContent='Are you sure you want to delete this muscle group? This action cannot be undone.';
            const warningTextContainer=document.createElement('div'); /* creates container for warning and buttons */
            warningTextContainer.id=muscleGroupName+'MuscleButtonDeleteWarning';
            warningTextContainer.classList.add('warningTextContainer')
            warningTextContainer.appendChild(warningText); /* append warning text */
            const confirmDeleteButton=createButton(muscleGroupName+'MuscleButtonConfirmDelete', 'Confirm');
            warningTextContainer.appendChild(confirmDeleteButton); /* append confirm delete button */
            const cancelDeleteButton=createButton(muscleGroupName+'MuscleButtonCancelDelete', 'Cancel');
            warningTextContainer.appendChild(cancelDeleteButton); /*append cancel delete button */
            document.getElementById('muscleNameButtons').insertBefore(warningTextContainer, 
                document.getElementById(muscleGroupName+'MuscleButtonModifiedDelete').nextElementSibling); /*append warning container below the muscle group button */
            document.getElementById(muscleGroupName+'MuscleButtonConfirmDelete').addEventListener('click', () => { /*if confirm is clicked*/
                document.getElementById(muscleGroupName+'MuscleButtonModifiedDelete').remove();
                document.getElementById(muscleGroupName+'MuscleButtonDeleteWarning').remove();
                // Temporarily store the exercises that are about to be deleted, for purposes of deleting their exercise data screens
                const persistingExercises = mAndEScreenData.muscleGroups[muscleGroupName].exercises;
                // Delete the muscle group from both data structures
                delete mAndEScreenData.muscleGroups[muscleGroupName];
                saveData('mAndEScreenData', mAndEScreenData);
                delete exerciseData[muscleGroupName];
                saveData('exerciseData', exerciseData);
                // Delete the muscle group's screen with its list of exercises
                if (document.getElementById(muscleGroupName+'Screen')) {
                    document.getElementById(muscleGroupName+'Screen').remove();
                }
                // Delete each data screen for each exercise associated with the muscle group
                persistingExercises.forEach(exercise => {
                    if (document.getElementById(exercise+'ExerciseDataScreen')) {
                        document.getElementById(exercise+'ExerciseDataScreen').remove();
                    }
                });
                // Wipe and re-render the exercise list for the 'start workout' screen so that, even before we reload the page, we won't be trying to record data for exercises that have been removed
                wipeExerciseList();
                renderStartWorkoutExerciseListScreen();
                // Put directions back on if this deletion resulted in there being no muscle groups left on screen
                addMuscleGroupsDirections();
            });
            document.getElementById(muscleGroupName+'MuscleButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(muscleGroupName+'MuscleButtonDeleteWarning').remove();
            });
        });
        // For each muscle group (remember, we're still within the forEach loop), check if a screen has already been made, and then create one
        // On initial rendering, no screens should exist. But, when new muscle groups are added, and we re-render the muscle group page after additions, we need
        // to check for existing screen so we don't create duplicates
        if (!document.getElementById(muscleGroupName+'Screen')) {
            renderMuscleScreen(muscleGroupName)
        }
        document.getElementById(muscleGroupName+'MuscleButton').addEventListener('click', () => {
            showScreen(muscleGroupName+'Screen');
        });
    });
}

function renderMuscleScreen(muscleGroupName) {
    // Create the muscle screen, including its header
    const muscleScreen=document.createElement('div');
    muscleScreen.id=muscleGroupName+'Screen';
    muscleScreen.classList.add('screen');
    muscleScreen.innerHTML=
        `<div class="header">
            <h1>${muscleGroupName}</h1>
        </div>`;
    document.body.appendChild(muscleScreen);
    // Create the exercise buttons container
    const exerciseButtons=document.createElement('div');
    exerciseButtons.id=muscleGroupName+'ExerciseButtons';
    exerciseButtons.classList.add('exerciseButtons');
    document.getElementById(muscleScreen.id).appendChild(exerciseButtons);
    // Create the 'add exercise' container, as well as the 'add exercise' button. 
    const AddCompleteButtonContainer = document.createElement('div');
    AddCompleteButtonContainer.id = muscleGroupName+'AddCompleteButtonContainer';
    AddCompleteButtonContainer.classList.add('addCompleteButtonContainer')
    document.getElementById(muscleScreen.id).appendChild(AddCompleteButtonContainer);
    document.getElementById(muscleGroupName+'AddCompleteButtonContainer').appendChild(createAddButton(muscleGroupName+'AddExercise'));
    document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', () => {
        addModeExercises(muscleGroupName)
    });
    // Create the nav button container, which has the 'back to...' buttons
     const navButtons = document.createElement('div')
    document.getElementById(muscleScreen.id).appendChild(navButtons);
    navButtons.id=muscleGroupName+'NavButtons';
    navButtons.classList.add('navButtons');
    // Create the back to muscles button in the nav button container; also code for deleting an active form if clicked
    createButtonB2Muscles(muscleGroupName + 'NavButtons', muscleGroupName);
        document.getElementById(muscleGroupName+'B2Muscles').addEventListener('click',()=>{
            // Checks just for the existence of the form, but will remove form and button (because they're deployment is linked)
            if (document.getElementById(muscleGroupName+"AddExerciseForm")) {
                document.getElementById(muscleGroupName+'CompleteExercise').remove()
                document.getElementById(muscleGroupName+'AddExerciseForm').remove();
                // Puts back in the 'add exercise' button and directions as needed
                document.getElementById(muscleGroupName+'AddCompleteButtonContainer').appendChild(createAddButton(muscleGroupName+'AddExercise'));
                document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', () => addModeExercises(muscleGroupName));
                addExercisesDirections(muscleGroupName);
            }
        })
    // Create the back to home button, code for deleting an active form if clicked
    createButtonB2Home(muscleGroupName + 'NavButtons', muscleGroupName); /* creates and appends the back to home button*/
        document.getElementById(muscleGroupName+'B2Home').addEventListener('click',()=>{
            // Same thing as above, just now for the B2Home instead of B2Muscles
            if (document.getElementById(muscleGroupName+"AddExerciseForm")) {
                    document.getElementById(muscleGroupName+'CompleteExercise').remove()
                    document.getElementById(muscleGroupName+'AddExerciseForm').remove();
                    document.getElementById(muscleGroupName+'AddCompleteButtonContainer').appendChild(createAddButton(muscleGroupName+'AddExercise'));
                    document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', () => addModeExercises(muscleGroupName));
                    addExercisesDirections(muscleGroupName);
                }
            })
    // Will put all exercise buttons on the page by iterating through exercises in stored data
    mAndEScreenData.muscleGroups[muscleGroupName].exercises.forEach(exerciseName => {
        // Creates each exercise button, including delete button
        createExerciseButtonDelete(muscleGroupName+'ExerciseButtons', exerciseName+'ExerciseButtonModifiedDelete', exerciseName);
        // Codes for delete button in each exercise button/delete set
        document.getElementById(exerciseName+'ExerciseButtonDelete').addEventListener('click', () => {
            const warningText=document.createElement('p'); /* creates text for warning */
            warningText.textContent="Are you sure you want to delete this exercise and it's associated data? This action cannot be undone.";
            const warningTextContainer=document.createElement('div'); /* creates container for warning and buttons */
            warningTextContainer.id=exerciseName+'ExerciseButtonDeleteWarning';
            warningTextContainer.classList.add('warningTextContainer');
            warningTextContainer.appendChild(warningText); /* append warning text */
            const confirmDeleteButton=createButton(exerciseName+'ExerciseButtonConfirmDelete', 'Confirm');
            warningTextContainer.appendChild(confirmDeleteButton); /* append confirm delete button */
            const cancelDeleteButton=createButton(exerciseName+'ExerciseButtonCancelDelete', 'Cancel');
            warningTextContainer.appendChild(cancelDeleteButton); /*append cancel delete button */
            document.getElementById(muscleGroupName+'ExerciseButtons').insertBefore(warningTextContainer, 
                document.getElementById(exerciseName+'ExerciseButtonModifiedDelete').nextElementSibling); /*append warning container below the exercise button */
            document.getElementById(exerciseName+'ExerciseButtonConfirmDelete').addEventListener('click', () => { /*if confirm is clicked*/
                document.getElementById(exerciseName+'ExerciseButtonModifiedDelete').remove();
                document.getElementById(exerciseName+'ExerciseButtonDeleteWarning').remove();
                // Removes exercise name from its array in mAndEScreenData
                mAndEScreenData.muscleGroups[muscleGroupName].exercises.splice(mAndEScreenData.muscleGroups[muscleGroupName].exercises.indexOf(exerciseName), 1);
                saveData('mAndEScreenData', mAndEScreenData);
                // Removes the exercise data (likes rep and weight) from exerciseData
                delete exerciseData[muscleGroupName][exerciseName+"Data"];
                saveData('exerciseData', exerciseData);
                // Will remove the exercise data screen if it exists (which it should, but nice to check)
                if (document.getElementById(exerciseName+'ExerciseDataScreen')) {
                    document.getElementById(exerciseName+'ExerciseDataScreen').remove();
                }
                // Wipe and update exercise list accordingly (don't want stale exercises on the list that don't exist)
                wipeExerciseList();
                renderStartWorkoutExerciseListScreen();
                addExercisesDirections(muscleGroupName)
            });
            document.getElementById(exerciseName+'ExerciseButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(exerciseName+'ExerciseButtonDeleteWarning').remove();
            });
            // Render the data screen associated with each exercise, for EXISTING SCREENS in data
        });
        // Now, we're back into the loop (above was the delete features). This will create a screen if it doesn't already exist.
        // Data screen might already exist if renderMuscleScreen is being called at a time after first-open, such as after an exercise has been added on a muscle screen (refer to completeModeExercises)
        if (!document.getElementById(`${exerciseName}ExerciseDataScreen`)) {
            renderExerciseDataScreen(exerciseName, muscleGroupName);
        }
        // Show data screen for each exercise if button for exercise is clicked
        document.getElementById(exerciseName+'ExerciseButton').addEventListener('click', () => {
            showScreen(exerciseName+'ExerciseDataScreen');
        }); 
    });
    // Gives chance to add directions; directions will only be created if the above loop didn't add any buttons, such as at first opening of app
    addExercisesDirections(muscleGroupName)
}

function renderExerciseDataScreen(exerciseName, muscleGroupName) {
    // The actual rendering of the table is tied to the renderTable function
    // If no data exists for exercise, just the header is rendered by renderTable
    // If data exists, the full table is rendered by renderTable
    // In both situations, renderTable is calling the same data location, there just are different amounts of data to render.

    // Create the screen that will contain the data, notes form, buttons, and more
    const exerciseDataScreen = document.createElement('div');
    exerciseDataScreen.id = exerciseName + 'ExerciseDataScreen';
    exerciseDataScreen.classList.add('screen');
    exerciseDataScreen.innerHTML =
        `<div class="header">
            <h1>${exerciseName}</h1>
        </div>`;
    document.body.appendChild(exerciseDataScreen);
    // Create the table that data will append to
    const table = document.createElement('div');
    table.id = exerciseName + 'DataTable';
    table.classList.add('grid-table');
    exerciseDataScreen.appendChild(table);
    // Render table data onto table
    renderTable(exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'RandW'],exerciseName,exerciseName+"DataTable");
    // The following section, until nav container, codes for the notes section of the data screen
    // Create the notes container
    const notesContainer = document.createElement('div');
    notesContainer.id = exerciseName + 'ExerciseDataNotesContainer';
    notesContainer.classList.add('notesContainer');
    exerciseDataScreen.appendChild(notesContainer);
    // Create the label for the text area, which will read 'Notes:'
    const textAreaTitle = document.createElement('label');
    textAreaTitle.id = exerciseName + 'ExerciseDataNotesTextAreaTitle';
    textAreaTitle.classList.add('notesTextAreaTitle');
    textAreaTitle.textContent = 'Notes:';
    notesContainer.appendChild(textAreaTitle);
    // Create the text area
    const textArea = document.createElement('textarea');
    textArea.id = exerciseName + 'ExerciseDataNotesTextArea';
    textArea.classList.add('notesTextArea');
    textArea.placeholder = 'Enter your notes here...';
    textArea.value = exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'Notes'];
    notesContainer.appendChild(textArea);
    // Create the container for the save button and its acknowledgement text
    const saveButtonContainer = document.createElement('div');
    saveButtonContainer.id = exerciseName + 'ExerciseDataNotesSaveButtonContainer';
    saveButtonContainer.classList.add('exerciseDataSaveButtonContainer');
    notesContainer.appendChild(saveButtonContainer);
    // Create the save button
    const saveButton = createSaveNotesButton(exerciseName + 'ExerciseDataNotesSaveButton');
    saveButtonContainer.appendChild(saveButton);
    // Create the acknowledgement text
    const acknowledgementText = document.createElement('span');
    acknowledgementText.id = exerciseName + 'ExerciseDataNotesAcknowledgementText';
    acknowledgementText.classList.add('exerciseDataAcknowledgementText');
    acknowledgementText.textContent = 'Saved...';
    saveButtonContainer.appendChild(acknowledgementText);
    // Create a variable that will store the timeout applied to the acknowledgement text
    let savedTimer;
    // When the save button is clicked, pull the value from the text area, and overwrite the notes section of the exercise in exerciseData
    saveButton.onclick = function() {
        const notes = textArea.value;
        exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'Notes'] = notes;
        // Update the notes button on the 'start workout' screen, if it exists, so that the red dot appears/disappears to reflect the existence/absence of text in the text area
        manageDot(exerciseName, muscleGroupName);
        saveData('exerciseData', exerciseData);
        // Clear any existing timeout on the acknowledgement text; meaning the 1.5 seconds is always from the most recent click, and .active doesn't get removed from previous clicks that are expiring
        clearTimeout(savedTimer);
        // Initially make the button visible by adding active; visibility controlled in CSS
        acknowledgementText.classList.add('active');
        // Set a timeout to remove the active class after 1.5 seconds; also saving the timeout in the savedTimer variable
        savedTimer = setTimeout(() => {
            acknowledgementText.classList.remove('active');
        }, 1500);
    };
    // Creates a nav button container
    const navButtonContainer = document.createElement('div');
    navButtonContainer.id = exerciseName + 'NavButtonContainer';
    navButtonContainer.classList.add('navButtons');
    exerciseDataScreen.appendChild(navButtonContainer);
    // Creates a button back to exercises
    createButtonB2Exercises(navButtonContainer.id, exerciseDataScreen.id, muscleGroupName);
    // Creates a button back to build workout
    createButtonB2StartWorkout(navButtonContainer.id, exerciseDataScreen.id);
}

function renderStartWorkoutExerciseListScreen() {
    // The following lines of code are likely redundant due to the sortMandEScreenData function, but it has been left in to ensure any
    // potential unforseen issues with the wider order of operations doesn't cause unsorted data to be rendered
    const muscleGroupsUnsorted = mAndEScreenData.muscleGroups
    const muscleGroupsSorted = Object.fromEntries(
        Object.entries(muscleGroupsUnsorted).sort(([a], [b]) => a.localeCompare(b))
    )
    Object.keys(muscleGroupsSorted).forEach(muscleGroupSingular => { // For each muscle group in the sorted list
        const muscleGroupName=mAndEScreenData.muscleGroups[muscleGroupSingular].name
        // Create the container for the exercises in this muscle group
        const muscleExerciseContainer = document.createElement("div")
        muscleExerciseContainer.id=muscleGroupName+'ExerciseListExercisesContainer'
        muscleExerciseContainer.innerHTML=`<h3>${muscleGroupName} Exercises</h3>`
        document.getElementById('exerciseListButtonsContainer').appendChild(muscleExerciseContainer)
        // May be redundant like above, but has been left in to account for any potential issues with the order of operations that leaves data unsorted
        const exercisesSorted = mAndEScreenData.muscleGroups[muscleGroupName].exercises.slice().sort((a, b) => a.localeCompare(b));
        // For each exercise listed under the sorted collection, add the exercise buttons to the muscle container
        exercisesSorted.forEach(exercise => {
            const exerciseName=exercise;
            // Creates the container and appends to appropriate muscle container
            const exerciseListSingularExerciseContainer = document.createElement("div")
            exerciseListSingularExerciseContainer.id=exerciseName+'ExerciseListSingularExerciseContainer';
            document.getElementById(muscleGroupName+'ExerciseListExercisesContainer').appendChild(exerciseListSingularExerciseContainer);
            // Create the button for the exercise in the EXERCISE LIST
            const button = createELExerciseButton(exerciseName);
            document.getElementById(exerciseName+'ExerciseListSingularExerciseContainer').appendChild(button);
            // Hard-bakes the exercise name into the BUTTON so it can be programmatically pulled later
            button.dataset.exercise=exerciseName;
            // Hard-bakes the muscle group name into the CONTAINER so it can be programmatically pulled later
            exerciseListSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
            // From here on, this is controlling how the exercise is added to the workout
            document.getElementById(exerciseName+'ExerciseListExerciseButton').addEventListener('click', () => {
                // Create and append container that will go on the BUILD WORKOUT screen
                if (!document.getElementById(exerciseName+'startWorkoutSingularExerciseContainer')) {
                    const startWorkoutSingularExerciseContainer=document.createElement('div');
                    startWorkoutSingularExerciseContainer.id=exerciseName+'startWorkoutSingularExerciseContainer';
                    // Hard-bake the exerciseName and muscleGroupName into the container
                    startWorkoutSingularExerciseContainer.dataset.exerciseName=exerciseName
                    startWorkoutSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
                    document.getElementById('startWorkoutExercisesContainer').appendChild(startWorkoutSingularExerciseContainer);
                    // Create button, with delete, that you click to add exercise to active workout
                    createSWExerciseButtonDelete(exerciseName+'startWorkoutSingularExerciseContainer', exerciseName+'startWorkoutExerciseButtonModifiedDelete', exerciseName);
                    document.getElementById(exerciseName+'startWorkoutSingularExerciseContainer').classList.add('startWorkoutSingularExerciseContainer')
                    // When delete button is pressed, exercise container gets deleted
                    document.getElementById(exerciseName+"SWExerciseButtonDelete").addEventListener('click', () => {
                        document.getElementById(exerciseName+"startWorkoutSingularExerciseContainer").remove()
                        startWorkoutDirections()
                    })                
                    // Creates and adds stats button to same container as the exercise button and its delete button
                    document.getElementById(exerciseName+'startWorkoutExerciseButtonModifiedDelete').appendChild(createStatsButton(exerciseName+'startWorkoutExerciseButtonStats'))
                    document.getElementById(exerciseName+'startWorkoutExerciseButtonStats').addEventListener('click', () =>{
                        showScreen(exerciseName+'ExerciseDataScreen')
                    })
                    // Creates and adds the "notes" button to the same container as the exercise button and its delete button
                    document.getElementById(exerciseName+'startWorkoutExerciseButtonModifiedDelete').appendChild(createNotesButton(exerciseName+'startWorkoutExerciseButtonNotes'));
                    document.getElementById(exerciseName+'startWorkoutExerciseButtonNotes').addEventListener('click', () => {
                        showScreen(exerciseName+'ExerciseDataScreen')
                    })
                    // Will add/remove a dot the notes button depending on if notes exist for the exercise
                    manageDot(exerciseName, muscleGroupName);
                    // Creates the container for the reps and weight input
                    // Also adds the reps and weight input fields w/ the createRepsAndWeightInput function
                    const repsAndWeightInputContainer=document.createElement('div');
                    repsAndWeightInputContainer.id=exerciseName+'startWorkoutRepsAndWeightInputContainer';
                    startWorkoutSingularExerciseContainer.appendChild(repsAndWeightInputContainer);
                    repsAndWeightInputContainer.appendChild(createRepsAndWeightInput());
                    // Creates the container for the "add set" button
                    const addSetButtonContainer=document.createElement('div');
                    addSetButtonContainer.classList.add('addSetButtonContainer')
                    startWorkoutSingularExerciseContainer.appendChild(addSetButtonContainer);
                    // Creates the button for the "add set" button
                    const addSetButton=document.createElement('button');
                    addSetButton.classList.add('addSetButton')
                    addSetButton.textContent='Add Set';
                    addSetButtonContainer.appendChild(addSetButton)
                    // When "add set" button is clicked, a new input field is appended to the container
                    addSetButton.addEventListener('click', () => {
                        repsAndWeightInputContainer.appendChild(createRepsAndWeightInput());
                    });
                }
                // After clicking to add the exercise, we will evaluate if directions are needed. Since an exercise has been added, the start workout screen now has content, so directions should be deleted through the function
                startWorkoutDirections()
                // When exercise list button is pressed, you should go the build workout screen
                showScreen('startWorkoutScreen');                                
            });
        });
    });
}
/* Supporting render functions, end */

/* General functions start */
function showScreen(screenId) {
    const screens=document.querySelectorAll('.screen');

    /*Turn off all screens*/
    screens.forEach(screen => {
        screen.classList.remove('active');
    })

    /*Turn on the screen corresponding to the ID entered*/
    document.getElementById(screenId).classList.add('active');
}
function createForm(formName,labelName,text) { // Creates a form with a label and input field
    const form = document.createElement('form');
    form.id=formName
    if (text==='') { // This "if" allows us to create an unlabeled form, like we do for adding muscles and exercises
        form.innerHTML=
        `<input type="text" id="${labelName}" name="${labelName}"><br>`
    }
    else {
    form.innerHTML=
        `<label for="${labelName}">${text}</label><br>
         <input type="text" id="${labelName}" name="${labelName}"><br>`

    }
    return form;
};
function createRepsAndWeightInput() { // Creates the reps and weight input fields
    const lineContainer=document.createElement('div');
    lineContainer.classList.add('form-row-RW');
    lineContainer.innerHTML=
        `<label for="Reps" >Reps:</label>
         <input type="text" name="Reps">
         <label for="Weight" >Weight:</label>
         <input type="text" name="Weight">`;
    // Creating the 'X' button that eliminates a set
    // The button will be added to the container and will remove the container (which is the 'set' of reps and weight) when clicked
    const button = document.createElement('button');
    const span = document.createElement('span');
    span.classList.add('RandWDeleteButtonIcon');
    span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M368 368 144 144M368 144 144 368" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="64px"/></svg>'
    button.appendChild(span);
    button.classList.add('RandWDeleteButton');
    lineContainer.appendChild(button);
    button.addEventListener('click', () => {
        lineContainer.remove();
    });
    return lineContainer;
}
function saveData(objectKeyName, objectData) {
    /* Save data to local storage */
    localStorage.setItem(objectKeyName, JSON.stringify(objectData));
}
function loadData(objectKeyName) {
    /* Load data from local storage */
    const data = localStorage.getItem(objectKeyName);
    return data ? JSON.parse(data) : null;
}
function wipeExerciseList() {
    document.getElementById('exerciseListButtonsContainer').innerHTML = '';
}
function startWorkoutDirections() { // Will add or remove directions for the start workout screen
    // Runs if there are no exercises on the 'start workout' screen, and no directions currently exist
    if (document.getElementById('startWorkoutExercisesContainer').children.length === 0 && !document.getElementById('startWorkoutDirections')) {
        const span = document.createElement('span')
        span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M244 400 100 256l144-144M120 256h292" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48px"/></svg>'
        span.classList.add('startWorkoutDirectionsIcon')
        span.id = 'startWorkoutDirectionsIcon'
        document.getElementById('startWorkoutAddExercisesButtonContainer').appendChild(span)
        const directions=document.createElement('p')
        directions.id = 'startWorkoutDirections'
        directions.textContent='Click "Plus" to Add Exercises'
        document.getElementById('startWorkoutAddExercisesButtonContainer').appendChild(directions)
    }
    // Will remove directions if exercises are on the 'start workout' screen, and directions currently exist
    if (document.getElementById('startWorkoutExercisesContainer').children.length !== 0 && document.getElementById('startWorkoutDirections')) {
        document.getElementById('startWorkoutDirections').remove()
        document.getElementById('startWorkoutDirectionsIcon').remove()
    }
}
function addMuscleGroupsDirections() { // Will add or remove directions for the main 'add muscle groups' screen
    // Adds directions if there are no muscle groups on the 'Muscles' screen, no directions currently exist, and no form is currently displayed (which implies an active operation, and no need for directions)
    if (document.getElementById('muscleNameButtons').children.length === 0 && !document.getElementById('addMuscleGroupsDirections') && !document.getElementById('addMuscleGroupForm')) {
        const span = document.createElement('span')
        span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M244 400 100 256l144-144M120 256h292" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48px"/></svg>'
        span.classList.add('addMuscleGroupsDirectionsIcon')
        span.id = 'addMuscleGroupsDirectionsIcon'
        document.getElementById('addMuscleGroupButtonContainer').appendChild(span)
        const directions = document.createElement('p')
        directions.id = 'addMuscleGroupsDirections'
        directions.textContent='Click "Plus" to Add Muscle Groups'
        document.getElementById('addMuscleGroupButtonContainer').appendChild(directions)
    }
    // Removes directions if there are muscle groups on the 'Muscles' screen and directions currently exist
    if (document.getElementById('muscleNameButtons').children.length !== 0 && document.getElementById('addMuscleGroupsDirections')) {
        document.getElementById('addMuscleGroupsDirections').remove()
        document.getElementById('addMuscleGroupsDirectionsIcon').remove()
    }
}
function addExercisesDirections(muscleGroupName) { // Will add or remove directions for the each muscle group screen
    // Adds directions if there are no exercises for the muscle group, no directions currently exist, and no form is currently displayed
    if (document.getElementById(muscleGroupName+'ExerciseButtons').children.length === 0 && !document.getElementById(muscleGroupName+'addExercisesDirections') && !document.getElementById(muscleGroupName+'AddExerciseForm')) {
        const span = document.createElement('span')
        span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M244 400 100 256l144-144M120 256h292" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="48px"/></svg>'
        span.classList.add('addExercisesDirectionsIcon')
        span.id = muscleGroupName+'addExercisesDirectionsIcon'
        document.getElementById(muscleGroupName+'AddCompleteButtonContainer').appendChild(span)
        const directions=document.createElement('p')
        directions.id = muscleGroupName+'addExercisesDirections'
        directions.classList.add('addExercisesDirections')
        directions.textContent='Click "Plus" to Add Exercises'
        document.getElementById(muscleGroupName+'AddCompleteButtonContainer').appendChild(directions)
    }
    // Removes directions if there are exercises for the muscle group and directions currently exist
    if (document.getElementById(muscleGroupName+'ExerciseButtons').children.length !== 0 && document.getElementById(muscleGroupName+'addExercisesDirections')) {
        document.getElementById(muscleGroupName+'addExercisesDirections').remove()
        document.getElementById(muscleGroupName+'addExercisesDirectionsIcon').remove()
    }
}
function manageDot (exerciseName, muscleGroupName) { // Will update the "active" class for the span controlling the dot on the notes button
    const dotSpan = document.getElementById(exerciseName+'startWorkoutExerciseButtonNotesDot');
    if (dotSpan) { // If the dot span exists (meaning, the notes button exists; meaning, there is an active exercise on the start workout screen we can edit)
        dotSpan.classList.remove('active'); // Remove the dot to begin with
        if (exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'Notes']!=='') { // Then re-add it only if there are notes
            dotSpan.classList.add('active');
        }
        // Otherwise, dot doesn't appear on the notes button, meaning notes are empty
    }
}
function sortMAndEScreenData() { // Sorts the muscle groups and exercises within mAndEScreenData alphabetically
    const muscleGroupsUnsorted = mAndEScreenData.muscleGroups
    // Sorts case independent for both muscle groups and exercises, and overwrites the original data structures to reflect the sorted order
    const muscleGroupsSorted = Object.fromEntries(
        Object.entries(muscleGroupsUnsorted).sort(([a], [b]) => a.localeCompare(b))
    )
    mAndEScreenData.muscleGroups = muscleGroupsSorted;
    Object.keys(muscleGroupsSorted).forEach(muscleGroupSingular => {
        const muscleGroupName=mAndEScreenData.muscleGroups[muscleGroupSingular].name
        const exercisesSorted = mAndEScreenData.muscleGroups[muscleGroupName].exercises.slice().sort((a, b) => a.localeCompare(b));
        mAndEScreenData.muscleGroups[muscleGroupName].exercises = exercisesSorted;
    })
}

/* General functions end */

/* Button functions start */
// Largely too archaic, except for when used for delete warning
function createButton(name, text) { /*Name and text should be written as strings*/
    const button=document.createElement('button');
    button.id=name;
    button.textContent=text;
    return button;
}

// Nav Buttons, start
function createButtonB2Home(parentContainerName, pageName) { /*Name and text should be written as strings*/
    const button=document.createElement('button');
    button.id = pageName+'B2Home';
    button.classList.add('navButton');
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('navButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M249.38 336 170 256l79.38-80M181.03 256H342" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Back to Home';
    textSpan.classList.add('navButtonText');
    button.appendChild(textSpan);
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2Home').addEventListener('click', () => {
        showScreen('home');
    })
}

function createButtonB2Muscles(parentContainerName, pageName) { /*Name and text should be written as strings*/
    const button=document.createElement('button');
    button.id = pageName+'B2Muscles';
    button.classList.add('navButton');
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('navButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M249.38 336 170 256l79.38-80M181.03 256H342" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Back to Muscles';
    textSpan.classList.add('navButtonText');
    button.appendChild(textSpan);
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2Muscles').addEventListener('click', () => {
        showScreen('Muscles');
    })
}

function createButtonB2Exercises(parentContainerName, pageName, muscleGroupName) { /*Name and text should be written as strings*/
    const button=document.createElement('button');
    button.id = pageName+'B2Exercises';
    button.classList.add('navButton');
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('navButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M249.38 336 170 256l79.38-80M181.03 256H342" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.id = pageName+'B2ExercisesText';
    textSpan.textContent = 'Back to Exercises';
    textSpan.classList.add('navButtonText');
    button.appendChild(textSpan);
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2Exercises').addEventListener('click', () => {
        showScreen(muscleGroupName+'Screen');
    })
}

function createButtonB2StartWorkout(parentContainerName, pageName) { /*Name and text should be written as strings*/
    const button=document.createElement('button');
    button.id = pageName+'B2StartWorkout';
    button.classList.add('navButton');
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('navButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M249.38 336 170 256l79.38-80M181.03 256H342" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192Z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.id = pageName+'B2StartWorkoutText';
    textSpan.textContent = 'Back to Start Workout';
    textSpan.classList.add('navButtonText');
    button.appendChild(textSpan);
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2StartWorkout').addEventListener('click', () => {
        startWorkoutDirections()
        showScreen('startWorkoutScreen');
    })
}
// Nav Buttons, end

// Object Buttons, start
function createMuscleButton(muscleGroupName) {
    const button = document.createElement('button');
    button.classList.add('muscleButton');
    button.id = muscleGroupName + 'MuscleButton';
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('muscleButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon muscleButtons"><circle cx="256" cy="56" r="40" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32"/><path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M204.23 274.44c2.9-18.06 4.2-35.52-.5-47.59-4-10.38-12.7-16.19-23.2-20.15L88 176.76c-12-4-23.21-10.7-24-23.94-1-17 14-28 29-24 0 0 88 31.14 163 31.14s162-31 162-31c18-5 30 9 30 23.79 0 14.21-11 19.21-24 23.94l-88 31.91c-8 3-21 9-26 18.18-6 10.75-5 29.53-2.1 47.59l5.9 29.63 37.41 163.9c2.8 13.15-6.3 25.44-19.4 27.74S308 489 304.12 476.28l-37.56-115.93q-2.71-8.34-4.8-16.87L256 320l-5.3 21.65q-2.52 10.35-5.8 20.48L208 476.18c-4 12.85-14.5 21.75-27.6 19.46s-22.4-15.59-19.46-27.74l37.39-163.83Z"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = muscleGroupName;
    textSpan.classList.add('muscleButtonText');
    button.appendChild(textSpan);
    return button;
}

function createExerciseButton(exerciseName) {
    const button = document.createElement('button');
    button.classList.add('exerciseButton');
    button.id = exerciseName + 'ExerciseButton';
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('exerciseButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M48 256h416" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="32" height="256" x="384" y="128" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="32" height="256" x="96" y="128" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="16" height="128" x="32" y="192" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="16" height="128" x="464" y="192" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = exerciseName;
    textSpan.classList.add('exerciseButtonText');
    button.appendChild(textSpan);
    return button;
}

function createSWExerciseButton(exerciseName) { // Specifically for the start workout screen, changes classList for CSS
    const button = document.createElement('button');
    button.classList.add('exerciseButton');
    button.id = exerciseName + 'SWExerciseButton';
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('exerciseButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M48 256h416" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="32" height="256" x="384" y="128" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="32" height="256" x="96" y="128" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="16" height="128" x="32" y="192" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="16" height="128" x="464" y="192" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = exerciseName;
    textSpan.classList.add('exerciseButtonText');
    button.appendChild(textSpan);
    return button;    
}

function createELExerciseButton(exerciseName) { // Specifically for the exercise list, changes classList for CSS
    const button = document.createElement('button');
    button.classList.add('exerciseButton')
    button.id = exerciseName + 'ExerciseListExerciseButton'
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('exerciseButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M48 256h416" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="32" height="256" x="384" y="128" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="32" height="256" x="96" y="128" rx="16" ry="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="16" height="128" x="32" y="192" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><rect width="16" height="128" x="464" y="192" rx="8" ry="8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = exerciseName;
    textSpan.classList.add('exerciseButtonText');
    button.appendChild(textSpan);
    return button;    
}

function createMuscleButtonDelete(parentContainerName, containerName, muscleGroupName) { 
    const div=document.createElement('div');
    div.id=containerName;
    div.classList.add('buttonModifiers');
    div.appendChild(createMuscleButton(muscleGroupName));
    div.appendChild(createDeleteButton(muscleGroupName+'MuscleButtonDelete', 'muscleButtons'));
    document.getElementById(parentContainerName).appendChild(div);
}

function createExerciseButtonDelete(parentContainerName, containerName, exerciseName) { 
    const div=document.createElement('div');
    div.id=containerName;
    div.classList.add('buttonModifiers');
    div.appendChild(createExerciseButton(exerciseName));
    div.appendChild(createDeleteButton(exerciseName+'ExerciseButtonDelete', 'exerciseButtons'));
    document.getElementById(parentContainerName).appendChild(div);
}

function createSWExerciseButtonDelete(parentContainerName, containerName, exerciseName) { // Specifically for the start workout screen, changes classList for CSS
    const div=document.createElement('div');
    div.id=containerName;
    div.classList.add('buttonModifiers');
    div.appendChild(createSWExerciseButton(exerciseName));
    div.appendChild(createDeleteButton(exerciseName+'SWExerciseButtonDelete', 'SWButtons'));
    document.getElementById(parentContainerName).appendChild(div);
}
// Object Buttons, end

// Action Buttons, start
function createDeleteButton(buttonName, buttonAssociation) {
    const button = document.createElement('button');
    button.id = buttonName;
    const span = document.createElement('span');
    span.classList.add('deleteButtonIcon');
    span.classList.add('deleteButtonIcon'+buttonAssociation);
    span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="m112 112 20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><path d="M80 112h352" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32px"/><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(span);
    button.classList.add('deleteButton');
    button.classList.add('deleteButton'+buttonAssociation);
    return button;
}

function createAddButton (buttonName) {
    const button = document.createElement('button');
    button.classList.add('addButton');
    button.id = buttonName;
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('addButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M256 112v288M400 256H112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    return button;
}

function createCompleteButton(buttonName, buttonLabel) {
    const button = document.createElement('button');
    button.classList.add('completeButton');
    button.id = buttonName;
    const textSpan = document.createElement('span');
    textSpan.classList.add('completeButtonText');
    textSpan.textContent = buttonLabel;
    button.appendChild(textSpan);
    return button;
}

function createSaveWorkoutButton() {
    const button = document.createElement('button');
    button.classList.add('saveWorkoutButton');
    button.id = 'startWorkoutSaveButton';
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('saveWorkoutButtonIcon');
    iconSpan.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon saveWorkoutButtonSVG"><path d="M352 48H160a48 48 0 0 0-48 48v368l144-128 144 128V96a48 48 0 0 0-48-48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Save Workout';
    textSpan.classList.add('saveWorkoutButtonText');
    button.appendChild(textSpan);
    return button;
}

function createStatsButton(buttonName) {
    const button = document.createElement('button');
    button.classList.add('statsButton');
    button.id = buttonName;
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('statsButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="M32 160v296a8 8 0 0 0 8 8h136V160a16 16 0 0 0-16-16H48a16 16 0 0 0-16 16M320 48H192a16 16 0 0 0-16 16v400h160V64a16 16 0 0 0-16-16M464 208H352a16 16 0 0 0-16 16v240h136a8 8 0 0 0 8-8V224a16 16 0 0 0-16-16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    return button;
}

function createNotesButton(buttonName) {
    const button = document.createElement('button');
    button.classList.add('notesButton');
    button.id = buttonName;
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('notesButtonIcon');
    iconSpan.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><rect width="320" height="416" x="96" y="48" rx="48" ry="48" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32px"/><path d="M176 128h160M176 208h160M176 288h80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const dotSpan = document.createElement('span');
    dotSpan.id = buttonName + 'Dot';
    dotSpan.classList.add('notesButtonDot');
    button.appendChild(dotSpan);
    return button;
}

function createSaveNotesButton(buttonName) {
    const button = document.createElement('button');
    button.classList.add('saveNotesButton');
    button.id = buttonName;
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('saveNotesButtonIcon');
    iconSpan.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon saveNotesButtonSVG"><path d="M352 48H160a48 48 0 0 0-48 48v368l144-128 144 128V96a48 48 0 0 0-48-48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
    button.appendChild(iconSpan);
    const textSpan = document.createElement('span');
    textSpan.textContent = 'Save Notes';
    textSpan.classList.add('saveNotesButtonText');
    button.appendChild(textSpan);
    return button;
}
// Action Buttons, end

/*Button functions end*/

/*Create screen functions start*/

function renderTable(dataArray, exerciseName, tableName) { // Renders table based on data in exerciseData
    // dataArray should be of the form exerciseData.exerciseName to access the array
    document.getElementById(exerciseName+'DataTable').innerHTML=""

    let colCount=colCountCounter(dataArray)

    headerRow=document.createElement("div");
    headerRow.className="grid-row";

    if (colCount>0) {colCount=colCount}
    else {colCount=4}

    // Set this property so it can be read in CSS
    headerRow.style.setProperty("--cols",colCount)

    headerRowNames=[]
    headerRowNames.push("Date")
    for (let i=2; i<=colCount; i++) {
        headerRowNames.push(`Set ${i-1}`)
    }

    headerRowNames.forEach(headerName => {
        const headerCell=document.createElement("div");
        headerCell.className="grid-cell-header"
        headerCell.textContent=headerName;
        headerRow.appendChild(headerCell)
    })

    const deleteHeaderCell=document.createElement("div");
    deleteHeaderCell.textContent="Del.";
    deleteHeaderCell.className="grid-cell-header";
    deleteHeaderCell.style.borderRight = "none";
    headerRow.appendChild(deleteHeaderCell)

    table=document.getElementById(tableName)
    table.appendChild(headerRow)

    dataArray.forEach((rowData,rowIndex) => {
        const row=document.createElement("div");
        row.className="grid-row";
        row.style.setProperty("--cols",colCount)
        rowData.forEach(cellData => {
            const cell=document.createElement("div");
            cell.className="grid-cell"
            cell.textContent=cellData;
            row.appendChild(cell)
        })
        const rowDataLength=rowData?.length || 0
        if (rowDataLength<colCount) {
           const extraCells=colCount-rowDataLength
           for (let i=0; i<extraCells; i++) {
                const cell=document.createElement("div");
                cell.className="grid-cell"
                cell.textContent="N/A"
                row.appendChild(cell) 
           } 
        }

        const deleteCell=document.createElement("div");
        deleteCell.className="grid-cell";
        deleteCell.style.borderRight = "none";

        const button = document.createElement('button');
        const span = document.createElement('span');
        span.classList.add('deleteButtonIcon');
        span.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="ionicon"><path d="m112 112 20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/><path d="M80 112h352" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32px"/><path d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40M256 176v224M184 176l8 224M328 176l-8 224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32px"/></svg>'
        button.appendChild(span);
        button.classList.add('deleteButton');
        button.onclick=()=>{
        dataArray.splice(rowIndex,1);
        saveData('exerciseData', exerciseData);
        renderTable(dataArray, exerciseName, tableName);
        }
        
        deleteCell.appendChild(button);
        row.appendChild(deleteCell);
        table.appendChild(row);
        
    }) 
}

function colCountCounter(dataArray) { // Counts the number of columns needed for the grid based on the longest row
    let counter=0
    dataArray.forEach(rowInfo => {
        const rowLength = rowInfo?.length || 0
        if (rowLength>counter) {counter=rowLength}
    })
    return counter
}
/*Create screen functions end*/

/*Add button functions start*/

function completeModeMuscles() { /*Click complete button => back to add mode, create muscle group button, create delete button*/
    // Pull muscle group name from form
    const muscleGroupName=document.getElementById('addMuscleGroupName')?.value;
    if(muscleGroupName?.trim() !== '' && !document.getElementById(muscleGroupName+'MuscleButton')) { /*If input is not empty, muscle doesn't already exist, create*/
        // Create muscle group object for mAndE and for exerciseData
        const muscleGroupObject={name: muscleGroupName, exercises: []}
        mAndEScreenData.muscleGroups[muscleGroupName] = muscleGroupObject;
        // Sorts the muscle groups now that we've added a new one
        sortMAndEScreenData();
        saveData('mAndEScreenData',mAndEScreenData);
        exerciseData[muscleGroupName]={}
        saveData('exerciseData', exerciseData);
        // Wipes the muscle group buttons so we can re-render with renderMuscleGroups
        document.getElementById('muscleNameButtons').innerHTML = '';
        renderMuscleGroups();
        // Re-renders the exercise list
        wipeExerciseList();
        renderStartWorkoutExerciseListScreen();
    }
    // Changes the complete button back to its add button
    document.getElementById('addMuscleGroupForm').remove();
    document.getElementById('completeMuscleButton').remove()
    document.getElementById('addMuscleGroupButtonContainer').appendChild(createAddButton('addMuscleGroup'));
    document.getElementById('addMuscleGroup').addEventListener('click', addModeMuscles)
    addMuscleGroupsDirections()
}

function completeModeExercises(muscleGroupName) { /*Click complete button => back to add mode, create exercise button, create delete button*/
    const exerciseName=document.getElementById(muscleGroupName+'AddExerciseName').value;
    if(exerciseName.trim() !== '' && !document.getElementById(exerciseName+'ExerciseButton')) { /*If input is not empty, exercise doesn't already exist, create*/
        // Pushes exercise to the exercise section of the muscle group, only creates a list of names in the array
        mAndEScreenData.muscleGroups[muscleGroupName].exercises.push(exerciseName);
        // Sorts the exercises alphabetically
        sortMAndEScreenData();
        saveData('mAndEScreenData', mAndEScreenData);
        // Creates the exercise data object, as well as the structures for notes and reps/weight
        exerciseData[muscleGroupName][exerciseName+"Data"]={}
        exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'Notes'] = '';
        exerciseData[muscleGroupName][exerciseName+"Data"][exerciseName+'RandW'] = [];
        saveData('exerciseData', exerciseData);
        // Removes the existing muscle group screen so we can re-render with the new list of buttons
        document.getElementById(muscleGroupName+'Screen').remove()
        renderMuscleScreen(muscleGroupName);
        showScreen(muscleGroupName+'Screen');
        // Re-renders the exercise list
        wipeExerciseList()
        renderStartWorkoutExerciseListScreen()
    }
    else { // If input is empty or exercise already exists, we still need to return the complete button to its add function. This isn't necessary if the above is ran and the screen is deleted/re-rendered
        document.getElementById(muscleGroupName+'CompleteExercise').remove()
        document.getElementById(muscleGroupName+'AddExerciseForm').remove();
        document.getElementById(muscleGroupName+'AddCompleteButtonContainer').appendChild(createAddButton(muscleGroupName+'AddExercise'));
        document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', () => addModeExercises(muscleGroupName));
        addExercisesDirections(muscleGroupName)
    }
}

function addModeExercises(muscleGroupName) {
    // Delete add button
    document.getElementById(muscleGroupName+'AddExercise').remove();
    // Add the complete button and the form
    const completeButton = createCompleteButton(muscleGroupName+'CompleteExercise', 'Add');
    document.getElementById(muscleGroupName+'Screen').insertBefore(completeButton, document.getElementById(muscleGroupName+'NavButtons'));
    document.getElementById(muscleGroupName+'Screen').insertBefore(createForm(muscleGroupName+'AddExerciseForm',muscleGroupName+'AddExerciseName',''), 
        document.getElementById(muscleGroupName+'CompleteExercise'));
    document.getElementById(muscleGroupName+'AddExerciseName').placeholder = 'Enter exercise name...';
    document.getElementById(muscleGroupName+'AddExerciseName').classList.add('exerciseInput');
    // Adds listener to complete button
    document.getElementById(muscleGroupName+'CompleteExercise').addEventListener('click', () => completeModeExercises(muscleGroupName));
    // When we go into add mode and have an active form, we don't want directions displayed, so delete them if they exist
    if (document.getElementById(muscleGroupName+'addExercisesDirections')) {
        document.getElementById(muscleGroupName+'addExercisesDirections').remove()
    }
    if (document.getElementById(muscleGroupName+'addExercisesDirectionsIcon')) {
        document.getElementById(muscleGroupName+'addExercisesDirectionsIcon').remove()
    }
}

function addModeMuscles() {
    // Delete the add button
    document.getElementById('addMuscleGroup').remove();
    // Add the complete button and the form
    const completeButton = createCompleteButton('completeMuscleButton', 'Add');
    document.getElementById('Muscles').insertBefore(completeButton, document.getElementById('navButtonMuscles'));
    document.getElementById('Muscles').insertBefore(createForm('addMuscleGroupForm', 'addMuscleGroupName', ''), document.getElementById('completeMuscleButton'));
    document.getElementById('addMuscleGroupName').placeholder = 'Enter muscle group name...';
    document.getElementById('addMuscleGroupName').classList.add('muscleGroupInput');
    // Adds listener to complete button
    document.getElementById('completeMuscleButton').addEventListener('click', completeModeMuscles);
    // When we go into add mode and have an active form, we don't want directions displayed, so delete them if they exist
    if (document.getElementById('addMuscleGroupsDirections')) {
        document.getElementById('addMuscleGroupsDirections').remove()
    }
    if (document.getElementById('addMuscleGroupsDirectionsIcon')) {
        document.getElementById('addMuscleGroupsDirectionsIcon').remove()
    }
}

/*Add button functions end*/

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}
