/* Starting state variables, start */
const exerciseData = {} //This was created first, so this will have all exercise data, instead of being nested under the exercises in the muscle screen data
const mAndEScreenData = { //Stands for muscle and exercise screens data. Will have the data for the muscle groups on the muscle screen, and each exercise in each muscle group
    muscleGroups: []
}; 
/* Starting state variables, end */

/* Main render function, start*/
//when done with render function, call render here on DOM elements loadup, refer to Chat for memory
function render() { //master render for all stored elements of the app

}
/* Main render function, end */

/* Supporting render functions, start */
function renderMuscleGroups() { // Render the muscle groups
    mAndEScreenData.muscleGroups.forEach(muscleGroup => { //Create and append each muscle group w/ associated features
        const muscleGroupName = muscleGroup.name;
        // Create the button for each muscle group on the muscle group screen
        createButtonDelete('muscleNameButtons', muscleGroupName+'MuscleButtonModifiedDelete', muscleGroupName+'MuscleButton', muscleGroupName.trim());
        // Code for action of delete button, including warning text
        document.getElementById(muscleGroupName+'MuscleButtonDelete').addEventListener('click', () => {
            const warningText=document.createElement('p'); /* creates text for warning */
            warningText.textContent='Are you sure you want to delete this muscle group? This action cannot be undone.';
            const warningTextContainer=document.createElement('div'); /* creates container for warning and buttons */
            warningTextContainer.id=muscleGroupName+'MuscleButtonDeleteWarning';
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
                document.getElementById(muscleExerciseContainer.id).remove()
                // Remove muscle group from data structure, render again (primarily for exercise list to update)
                mAndEScreenData.muscleGroups.splice(mAndEScreenData.muscleGroups.indexOf(muscleGroupName), 1);
                delete exerciseData[muscleGroupName];
                render()                
            });
            document.getElementById(muscleGroupName+'MuscleButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(muscleGroupName+'MuscleButtonDeleteWarning').remove();
            });
        });
        renderMuscleScreen(muscleGroupName)
        document.getElementById(muscleGroupName+'MuscleButton').addEventListener('click', () => {
            showScreen(muscleGroupName+'Screen');
        });
    });
}

function renderMuscleScreen(muscleGroupName) {
    // Create the muscle screen
    const muscleScreen=document.createElement('div');
    muscleScreen.id=muscleGroupName+'Screen';
    muscleScreen.classList.add('screen');
    muscleScreen.innerHTML=
        `<h1>${muscleGroupName}</h1>`;
    document.body.appendChild(muscleScreen);
    // Create the exercise buttons container
    const exerciseButtons=document.createElement('div');
    exerciseButtons.id=muscleGroupName+'ExerciseButtons';
    exerciseButtons.classList.add('exerciseButtons');
    document.getElementById(muscleScreen.id).appendChild(exerciseButtons);
    // Create the add exercise button, associated functions will physically add new button, and update data for future, to be rendered later
    document.getElementById(muscleScreen.id).appendChild(createButton(muscleGroupName+'AddExercise', 'Add Exercise'));
    const completeModeExercisesListener = () => completeModeExercises(muscleGroupName);
    const addModeExercisesListener = () => addMode(muscleGroupName+'Screen', muscleGroupName+'AddExercise', 'Exercise Name', completeModeExercisesListener, addModeExercisesListener);
    // Create the nav button container
     const navButtons = document.createElement('div')
    document.getElementById(muscleScreen.id).appendChild(navButtons);
    navButtons.id=muscleGroupName+'NavButtons';
    navButtons.classList.add('navButtons');
    // Create the back to muscles button, code for deleting an active form if clicked
    createButtonB2Muscles(muscleGroupName + 'NavButtons', muscleGroupName);
        document.getElementById(muscleGroupName+'B2Muscles').addEventListener('click',()=>{
            if (document.getElementById(muscleGroupName+"AddExerciseForm")) {
            //Assumes existence of Complete button if there is the existence of form; attribute to nature of linked deployment in addMode
            document.getElementById(muscleGroupName+"AddExercise").removeEventListener('click', completeModeExercisesListener);
            document.getElementById(muscleGroupName+"AddExercise").textContent='Add';
            document.getElementById(muscleGroupName+"AddExerciseForm").remove();
            document.getElementById(muscleGroupName+"AddExercise").addEventListener('click', addModeExercisesListener);
            }
        })
    // Create the back to home button, code for deleting an active form if clicked
        createButtonB2Home(muscleGroupName + 'NavButtons', muscleGroupName); /* creates and appends the back to home button*/
        document.getElementById(muscleGroupName+'B2Home').addEventListener('click',()=>{
        if (document.getElementById(muscleGroupName+"AddExerciseForm")) {
            //Assumes existence of Complete button if there is the existence of form; attribute to nature of linked deployment in addMode
            document.getElementById(muscleGroupName+"AddExercise").removeEventListener('click', completeModeExercisesListener);
            document.getElementById(muscleGroupName+"AddExercise").textContent='Add';
            document.getElementById(muscleGroupName+"AddExerciseForm").remove();
            document.getElementById(muscleGroupName+"AddExercise").addEventListener('click', addModeExercisesListener);
            }
        })
    // Render exercise buttons from existing data, EXISTING BUTTONS
    mAndEScreenData[muscleGroupName].exercises.forEach(exercise => {
        // Creates each exercise button, including delete button
        createButtonDelete(muscleGroupName+'ExerciseButtons', exerciseName+'ExerciseButtonModifiedDelete', exerciseName+'ExerciseButton', exerciseName.trim());
        // Codes for delete button in each exercise button/delete set
        document.getElementById(exerciseName+'ExerciseButtonDelete').addEventListener('click', () => {
            const warningText=document.createElement('p'); /* creates text for warning */
            warningText.textContent="Are you sure you want to delete this exercise and it's associated data? This action cannot be undone.";
            const warningTextContainer=document.createElement('div'); /* creates container for warning and buttons */
            warningTextContainer.id=exerciseName+'ExerciseButtonDeleteWarning';
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
                /* Insert code here to delete exercise data screen and any attached information in the future, use data-exercise=${exerciseName} to track containers */
            });
            document.getElementById(exerciseName+'ExerciseButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(exerciseName+'ExerciseButtonDeleteWarning').remove();
            });
            // Render the data screen associated with each exercise, for EXISTING SCREENS in data
            if (!document.getElementById(`${exerciseName}ExerciseDataScreen`)) { // Should never have an existing screen when called on page open
                renderExerciseDataScreen(exerciseName, muscleGroupName);
            }
            // Show data screen for each exercise if button for exercise is clicked
            document.getElementById(exerciseName+'ExerciseButton').addEventListener('click', () => {
                showScreen(exerciseName+'ExerciseDataScreen');
            });
        }); 
    });
}

function renderExerciseDataScreen(exerciseName, muscleGroupName) {
    // Create the screen
    const exerciseDataScreen = document.createElement('div');
    exerciseDataScreen.id = exerciseName + 'ExerciseDataScreen';
    exerciseDataScreen.classList.add('screen');
    exerciseDataScreen.innerHTML =
        `<h1>${exerciseName}</h1>`;
    document.body.appendChild(exerciseDataScreen);
    // Create the table that data will append to
    const table = document.createElement('div');
    table.id = exerciseName + 'DataTable';
    table.classList.add('grid-table');
    exerciseDataScreen.appendChild(table);
    // Render table data onto table
    renderTable(exerciseData[muscleGroupName][exerciseName+"Data"],exerciseName,exerciseName+"DataTable");
    // Creates a button back to exercises
    createButtonB2Exercises(exerciseDataScreen.id, exerciseDataScreen.id, muscleGroupName)
    // Creates a button back to build workout
    document.getElementById(exerciseName+"ExerciseDataScreen").appendChild(createButton(exerciseName+'ExerciseDataScreenB2StartWorkout','Back to Build Workout'))
    document.getElementById(exerciseName+'ExerciseDataScreenB2StartWorkout').addEventListener('click',()=>{
        showScreen('startWorkoutScreen')
    })
}

function renderStartWorkoutExerciseListScreen() {
    mAndEScreenData.muscleGroups.forEach(muscleGroupSingular => { // For each muscle group in the data
        muscleGroupName=muscleGroupSingular.name
        // Create the container for the exercises in this muscle group
        const muscleExerciseContainer = document.createElement("div")
        muscleExerciseContainer.id=muscleGroupName+'ExerciseListExercisesContainer'
        muscleExerciseContainer.innerHTML=`<h3>${muscleGroupName} Exercises</h3>`
        document.getElementById('exerciseListButtonsContainer').appendChild(muscleExerciseContainer)
        // For each exercise listed under the muscle group, add the exercise buttons to the muscle container
        mAndEScreenData.muscleGroups[muscleGroupName].exercises.forEach(exercise => {
            exerciseName=exercise;
            // Creates the container and appends to appropriate muscle container
            const exerciseListSingularExerciseContainer = document.createElement("div")
            exerciseListSingularExerciseContainer.id=exerciseName+'ExerciseListSingularExerciseContainer';
            document.getElementById(muscleGroupName+'ExerciseListExercisesContainer').appendChild(exerciseListSingularExerciseContainer);
            // Create the button for the exercise in the EXERCISE LIST
            const button = createButton(exerciseName+'ExerciseListExerciseButton', exerciseName);
            document.getElementById(exerciseName+'ExerciseListSingularExerciseContainer').appendChild(button);
            // Hard-bakes the exercise name into the BUTTON so it can be programmatically pulled later
            button.dataset.exercise=exerciseName;
            // Hard-bakes the muscle group name into the CONTAINER so it can be programmatically pulled later
            exerciseListSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
            // From here on, this is controlling how the exericse is added to the workout; similar to addModeStartWorkoutAddExercisesButton function
            document.getElementById(exerciseName+'ExerciseListExerciseButton').addEventListener('click', () => {
                // Create and append container that will go on the BUILD WORKOUT screen
                const startWorkoutSingularExerciseContainer=document.createElement('div');
                startWorkoutSingularExerciseContainer.id=exerciseName+'startWorkoutSingularExerciseContainer';
                // Hard-bake the exerciseName and muscleGroupName into the container
                startWorkoutSingularExerciseContainer.dataset.exerciseName=exerciseName
                startWorkoutSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
                document.getElementById('startWorkoutExercisesContainer').appendChild(startWorkoutSingularExerciseContainer);
                // Create button, with delete, that you click to add exercise to active workout
                createButtonDelete(exerciseName+'startWorkoutSingularExerciseContainer', exerciseName+'startWorkoutExerciseButtonModifiedDelete', exerciseName+'startWorkoutExerciseButton', exerciseName);
                // When delete button is pressed, exercise container gets deleted
                document.getElementById(exerciseName+"startWorkoutExerciseButtonDelete").addEventListener('click', () => {
                    document.getElementById(exerciseName+"startWorkoutSingularExerciseContainer").remove()
                })                
                // Creates and adds stats button to same container as the exercise button and its delete button
                document.getElementById(exerciseName+'startWorkoutExerciseButtonModifiedDelete').appendChild(createButton(exerciseName+'startWorkoutExerciseButtonStats','Stats'))
                document.getElementById(exerciseName+'startWorkoutExerciseButtonStats').addEventListener('click', () =>{
                    showScreen(exerciseName+'ExerciseDataScreen')
                })
                // Creates the container for the reps and weight input
                // Also adds the reps and weight input fields w/ the createRepsAndWeightInput function
                const repsAndWeightInputContainer=document.createElement('div');
                repsAndWeightInputContainer.id=exerciseName+'startWorkoutRepsAndWeightInputContainer';
                startWorkoutSingularExerciseContainer.appendChild(repsAndWeightInputContainer);
                repsAndWeightInputContainer.appendChild(createRepsAndWeightInput());
                // Creates the container for the "add set" button
                const addSetButtonContainer=document.createElement('div');
                startWorkoutSingularExerciseContainer.appendChild(addSetButtonContainer);
                // Creates the button for the "add set" button
                const addSetButton=document.createElement('button');
                addSetButton.textContent='Add Set';
                addSetButtonContainer.appendChild(addSetButton)
                // When "add set" button is clicked, a new input field is appended to the container
                addSetButton.addEventListener('click', () => {
                    repsAndWeightInputContainer.appendChild(createRepsAndWeightInput());
                });                                
            });
            // When exercise list button is pressed, you should go the build workout screen
            showScreen('startWorkoutScreen');
        });
    });
}

/* Supporting render functions, end */

/* Starting state, home screen, start */
document.getElementById('navMusclesButton').addEventListener('click', () => {
    showScreen('Muscles');
})
document.getElementById('startWorkoutButton').addEventListener('click', () => {
    showScreen('startWorkoutScreen');
})
/* Starting state, home screen, end */

/* Starting state, muscle screen, start */
createButtonB2Home('navButtonMuscles', 'Muscles'); /* creates and appends the back to home button on the muscle screen*/

// wrappers for the add button functions, and initial event listener
const addModeMusclesListener = () => addMode('Muscles', 'addMuscleGroup', 'Muscle Group Name', completeModeMusclesListener, addModeMusclesListener);
const completeModeMusclesListener = () => completeModeMuscles('addMuscleGroup');
document.getElementById('addMuscleGroup').addEventListener('click', addModeMusclesListener); /*Starting state of add button in muscle screen*/

document.getElementById('Muscles'+'B2Home').addEventListener('click',()=>{
    if (document.getElementById("addMuscleGroupForm")) {
        //Assumes existence of Complete button if there is the existence of form; attribute to nature of linked deployment in addMode
        document.getElementById("addMuscleGroup").removeEventListener('click', completeModeMusclesListener);
        document.getElementById("addMuscleGroup").textContent='Add';
        document.getElementById("addMuscleGroupForm").remove();
        document.getElementById("addMuscleGroup").addEventListener('click', addModeMusclesListener);
    }
})

/* Starting state, muscle screen, end */

/* Starting state, start workout screen, start */
createButtonB2Home('navButtonsStartWorkout', 'startWorkoutScreen');
document.getElementById('startWorkoutAddExercisesButton').addEventListener('click', ()=>addModeStartWorkoutAddExercisesButton())
document.getElementById('startWorkoutCompleteButton').addEventListener('click', () => {
    const primary=document.getElementById("startWorkoutExercisesContainer")
    Array.from(primary.children).forEach(exerciseContainer => {
        const exerciseName=exerciseContainer.dataset.exerciseName
        const muscleGroupName=exerciseContainer.dataset.muscleGroupName
        const exerciseDataInput=[]
        const now=new Date()
        const year=now.getFullYear()
        const month=now.getMonth()
        const day=now.getDate() 
        const dateString=`${month+1}-${day}-${year}`
        exerciseDataInput.push(dateString)
        document.getElementById(exerciseName+"startWorkoutRepsAndWeightInputContainer").querySelectorAll("div").forEach((formContainer) => {
            let reps=""
            let weight=""
            formContainer.querySelectorAll("*").forEach((formElement)=>{
                if (formElement.tagName==="INPUT" && formElement.name==="Reps" && formElement.value.trim()!=='') {
                    reps=formElement.value.trim()
                }
                if (formElement.tagName==="INPUT" && formElement.name==="Weight" && formElement.value.trim()!=='') {
                    weight=formElement.value.trim()
                }
            })
            if (reps!=='' && weight!=='') {
                set=reps+"x"+weight
                exerciseDataInput.push(set)
            } else {
                exerciseDataInput.push("N/A")
            }
        })
        exerciseData[muscleGroupName][exerciseName+"Data"].push(exerciseDataInput)
        renderTable(exerciseData[muscleGroupName][exerciseName+"Data"],exerciseName,exerciseName+"DataTable")
    })
    showScreen("home")
    document.getElementById("startWorkoutExercisesContainer").querySelectorAll('*').forEach(element=>element.remove())
}
)
/* Starting state, start workout screen, end */

/* Starting state, exercise list screen, start */
createButtonB2StartWorkout('navButtonsExerciseList', 'exerciseListScreen');
/* Starting state, exercise list screen, end */

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
function createForm(formName,labelName,text) { /*Name and text should be written as strings*/
    const form = document.createElement('form');
    form.id=formName
    form.innerHTML=
        `<label for="${labelName}">${text}</label><br>
         <input type="text" id="${labelName}" name="${labelName}"><br>`
    return form;
};
function createRepsAndWeightInput() {
    const lineContainer=document.createElement('div');
    lineContainer.classList.add('form-row-RW');
    lineContainer.innerHTML=
        `<label for="Reps" >Reps:</label>
         <input type="number" name="Reps">
         <label for="Weight" >Weight:</label>
         <input type="number" name="Weight">`;
    const deleteButton=document.createElement('button');
    deleteButton.textContent='Delete';
    lineContainer.appendChild(deleteButton);
    deleteButton.addEventListener('click', () => {
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
/* General functions end */

/* Button functions start */

function createButton(name, text) { /*Name and text should be written as strings*/
    const button=document.createElement('button');
    button.id=name;
    button.textContent=text;
    return button;
}

function createButtonDelete(parentContainerName, containerName, buttonName, buttonText) { /*Name and text should be written as strings*/
    const div=document.createElement('div');
    div.id=containerName;
    div.classList.add('buttonModifiers');
    div.appendChild(createButton(buttonName, buttonText));
    div.appendChild(createButton(buttonName+'Delete', 'Delete'));
    document.getElementById(parentContainerName).appendChild(div);
}

function createButtonB2Home(parentContainerName, pageName) { /*Name and text should be written as strings*/
    const button=createButton(pageName+'B2Home', 'Back to Home')
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2Home').addEventListener('click', () => {
        showScreen('home');
    })
}

function createButtonB2Muscles(parentContainerName, pageName) { /*Name and text should be written as strings*/
    const button=createButton(pageName+'B2Muscles', 'Back to Muscles')
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2Muscles').addEventListener('click', () => {
        showScreen('Muscles');
    })
}

function createButtonB2Exercises(parentContainerName, pageName, muscleGroupName) { /*Name and text should be written as strings*/
    const button=createButton(pageName+'B2Exercises', 'Back to Exercises')
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2Exercises').addEventListener('click', () => {
        showScreen(muscleGroupName+'Screen');
    })
}

function createButtonB2StartWorkout(parentContainerName, pageName) { /*Name and text should be written as strings*/
    const button=createButton(pageName+'B2StartWorkout', 'Back to Build Workout')
    document.getElementById(parentContainerName).appendChild(button);
    document.getElementById(pageName+'B2StartWorkout').addEventListener('click', () => {
        showScreen('startWorkoutScreen');
    })
}

/*Button functions end*/

/*Create screen functions start*/

function createMuscleScreen(muscleGroupName) { /*Name should be written as string*/
    const muscleScreen=document.createElement('div');
    muscleScreen.id=muscleGroupName+'Screen';
    muscleScreen.classList.add('screen');
    muscleScreen.innerHTML=
        `<h1>${muscleGroupName}</h1>`;
    document.body.appendChild(muscleScreen);
    const exerciseButtons=document.createElement('div');
    exerciseButtons.id=muscleGroupName+'ExerciseButtons';
    exerciseButtons.classList.add('exerciseButtons');
    document.getElementById(muscleScreen.id).appendChild(exerciseButtons);
    document.getElementById(muscleScreen.id).appendChild(createButton(muscleGroupName+'AddExercise', 'Add Exercise')); /* creates and appends add exercise button */
    const completeModeExercisesListener = () => completeModeExercises(muscleGroupName);
    const addModeExercisesListener = () => addMode(muscleGroupName+'Screen', muscleGroupName+'AddExercise', 'Exercise Name', completeModeExercisesListener, addModeExercisesListener);
    document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', addModeExercisesListener)
    const navButtons = document.createElement('div')
    document.getElementById(muscleScreen.id).appendChild(navButtons);
    navButtons.id=muscleGroupName+'NavButtons';
    navButtons.classList.add('navButtons');
    createButtonB2Muscles(muscleGroupName + 'NavButtons', muscleGroupName); /*creates and appends the back to muscles button*/
        document.getElementById(muscleGroupName+'B2Muscles').addEventListener('click',()=>{
        if (document.getElementById(muscleGroupName+"AddExerciseForm")) {
            //Assumes existence of Complete button if there is the existence of form; attribute to nature of linked deployment in addMode
            document.getElementById(muscleGroupName+"AddExercise").removeEventListener('click', completeModeExercisesListener);
            document.getElementById(muscleGroupName+"AddExercise").textContent='Add';
            document.getElementById(muscleGroupName+"AddExerciseForm").remove();
            document.getElementById(muscleGroupName+"AddExercise").addEventListener('click', addModeExercisesListener);
            }
        })
    createButtonB2Home(muscleGroupName + 'NavButtons', muscleGroupName); /* creates and appends the back to home button*/
        document.getElementById(muscleGroupName+'B2Home').addEventListener('click',()=>{
        if (document.getElementById(muscleGroupName+"AddExerciseForm")) {
            //Assumes existence of Complete button if there is the existence of form; attribute to nature of linked deployment in addMode
            document.getElementById(muscleGroupName+"AddExercise").removeEventListener('click', completeModeExercisesListener);
            document.getElementById(muscleGroupName+"AddExercise").textContent='Add';
            document.getElementById(muscleGroupName+"AddExerciseForm").remove();
            document.getElementById(muscleGroupName+"AddExercise").addEventListener('click', addModeExercisesListener);
            }
        })
} 

function createExerciseDataScreen(exerciseName, muscleGroupName) { /*Name should be written as string*/
    const exerciseDataScreen = document.createElement('div');
    exerciseDataScreen.id = exerciseName + 'ExerciseDataScreen';
    exerciseDataScreen.classList.add('screen');
    exerciseDataScreen.innerHTML =
        `<h1>${exerciseName}</h1>`;
    document.body.appendChild(exerciseDataScreen);
    const table = document.createElement('div');
    table.id = exerciseName + 'DataTable';
    table.classList.add('grid-table');
    exerciseDataScreen.appendChild(table); 
    const exerciseDataKeyName=`"${exerciseName}"` //makes the exerciseName key since can't define it in the dot function
    exerciseData.exerciseDataKeyName=[] //makes the array that we will add rows to, linked to exerciseName key we just made
    renderTable(exerciseData.exerciseDataKeyName, exerciseName, exerciseName+'DataTable') /*renders the table based on the empty array we just made, will just show column titles at first*/
    createButtonB2Exercises(exerciseDataScreen.id, exerciseDataScreen.id, muscleGroupName) /* creates and appends the back to exercises button*/
    document.getElementById(exerciseName+"ExerciseDataScreen").appendChild(createButton(exerciseName+'ExerciseDataScreenB2StartWorkout','Back to Build Workout'))
    document.getElementById(exerciseName+'ExerciseDataScreenB2StartWorkout').addEventListener('click',()=>{
        showScreen('startWorkoutScreen')
    })
}

function renderTable(dataArray, exerciseName, tableName) { //data array should be of the form exerciseData.exerciseName to access array
    document.getElementById(exerciseName+'DataTable').innerHTML=""

    let colCount=colCountCounter(dataArray)

    headerRow=document.createElement("div");
    headerRow.className="grid-row";

    if (colCount>0) {colCount=colCount}
    else {colCount=4}

    headerRow.style.setProperty("--cols",colCount)

    headerRowNames=[]
    headerRowNames.push("Date")
    for (let i=2; i<=colCount; i++) {
        headerRowNames.push(`Set ${i-1}`)
    }

    headerRowNames.forEach(headerName => {
        const headerCell=document.createElement("div");
        headerCell.className="grid-cell"
        headerCell.textContent=headerName;
        headerRow.appendChild(headerCell)
    })

    const deleteHeaderCell=document.createElement("div");
    deleteHeaderCell.textContent="Delete";
    deleteHeaderCell.className="grid-cell";
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

        const btn=document.createElement("button");
        btn.className="delete-btn";
        btn.textContent="Delete";
        btn.onclick=()=>{
        dataArray.splice(rowIndex,1);
        renderTable(dataArray, exerciseName, tableName);
        }
        
        deleteCell.appendChild(btn);
        row.appendChild(deleteCell);
        table.appendChild(row);
        
    }) 
}

function colCountCounter(dataArray) {
    let counter=0
    dataArray.forEach(rowInfo => {
        const rowLength = rowInfo?.length || 0
        if (rowLength>counter) {counter=rowLength}
    })
    return counter
}

/*Create screen functions end*/

/*Add button functions start*/

function addMode(parentContainerName,addButtonName,formText,completeListener,addListener) { /*When add button is clicked, trigger something, and convert button to complete mode*/
    document.getElementById(addButtonName).textContent='Complete';
    document.getElementById(parentContainerName).insertBefore(createForm(addButtonName+'Form',addButtonName+'Name',formText), 
        document.getElementById(addButtonName)); 
    document.getElementById(addButtonName).removeEventListener('click', addListener);
    document.getElementById(addButtonName).addEventListener('click', completeListener); 
}

function completeModeMuscles(addButtonName) { /*Click complete button => back to add mode, create muscle group button, create delete button*/
    // Pull muscle group name from form
    const muscleGroupName=document.getElementById(addButtonName+'Name').value;
    if(muscleGroupName.trim() !== '' && !document.getElementById(muscleGroupName+'MuscleButton')) { /*If input is not empty, muscle doesn't already exist, create*/
        // Create muscle group object for mAndE and for exerciseData
        const muscleGroupObject={name: muscleGroupName, exercises: []}
        mAndEScreenData.muscleGroups[muscleGroupName]=muscleGroupObject;
        exerciseData[muscleGroupName]={}
        // Create container for muscle group on start workout exercise list
        const muscleExerciseContainer = document.createElement("div")
        muscleExerciseContainer.id=muscleGroupName+'ExerciseListExercisesContainer'
        muscleExerciseContainer.innerHTML=`<h3>${muscleGroupName} Exercises</h3>`
        document.getElementById('exerciseListButtonsContainer').appendChild(muscleExerciseContainer)     
        // Create the button for the muscle group, including delete button
        createButtonDelete('muscleNameButtons', muscleGroupName+'MuscleButtonModifiedDelete', muscleGroupName+'MuscleButton', muscleGroupName.trim());
        // Codes for the delete button
        document.getElementById(muscleGroupName+'MuscleButtonDelete').addEventListener('click', () => {
            const warningText=document.createElement('p'); /* creates text for warning */
            warningText.textContent='Are you sure you want to delete this muscle group? This action cannot be undone.';
            const warningTextContainer=document.createElement('div'); /* creates container for warning and buttons */
            warningTextContainer.id=muscleGroupName+'MuscleButtonDeleteWarning';
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
                document.getElementById(muscleExerciseContainer.id).remove()
                mAndEScreenData.muscleGroups.splice(mAndEScreenData.muscleGroups.indexOf(muscleGroupName), 1);
                delete exerciseData[muscleGroupName]
                render()                
            });
            document.getElementById(muscleGroupName+'MuscleButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(muscleGroupName+'MuscleButtonDeleteWarning').remove();
            });
        });
        // Creates muscle screen once for this muscle group (don't need to render all); on next reload, renderMuscleScreen will be responsible because pulling from data
        if (!document.getElementById(`${muscleGroupName}Screen`)) {
            createMuscleScreen(muscleGroupName);
        }
        // Shows the muscle screen for the muscle group if the muscle button is clicked
        document.getElementById(muscleGroupName+'MuscleButton').addEventListener('click', () => {
            showScreen(muscleGroupName+'Screen');
        });
        
    }
    // Changes the complete button back to its add button   
    document.getElementById(addButtonName).removeEventListener('click', completeModeMusclesListener);
    document.getElementById(addButtonName).textContent='Add';
    document.getElementById(addButtonName+'Form').remove();
    document.getElementById(addButtonName).addEventListener('click', addModeMusclesListener);
}

function completeModeExercises(muscleGroupName) { /*Click complete button => back to add mode, create exercise button, create delete button*/
    const exerciseName=document.getElementById(muscleGroupName+'AddExercise'+'Name').value;
    if(exerciseName.trim() !== '' && !document.getElementById(exerciseName+'ExerciseButton')) { /*If input is not empty, exercise doesn't already exist, create*/
        // Pushes exercise to the exercise section of the muscle group, only creates a list of names in the array, no associated object to store data in
        mAndEScreenData[muscleGroupName].exercises.push(exerciseName);
        // Creates (using render function) the exercise data screen, for NEW EXERCISES
        if (!document.getElementById(`${exerciseName}ExerciseDataScreen`)) {
            renderExerciseDataScreen(exerciseName, muscleGroupName);
            // Renders immediately instead of sending to data and rendering all again
        }
        // Show the exercise data screen if exercise button is pressed
        document.getElementById(exerciseName+'ExerciseButton').addEventListener('click', () => {
            showScreen(exerciseName+'ExerciseDataScreen');
        });
        // Adds exercise button to the muscle group. Does this for NEW EXERCISES once, if page is
        // reloaded, the buttons are recreated in latter function of renderMuscleScreen which handles existing buttons
        createButtonDelete(muscleGroupName+'ExerciseButtons', exerciseName+'ExerciseButtonModifiedDelete', exerciseName+'ExerciseButton', exerciseName.trim());
        // Sets up the delete functionality for the new exercise button
        document.getElementById(exerciseName+'ExerciseButtonDelete').addEventListener('click', () => {
            const warningText=document.createElement('p'); /* creates text for warning */
            warningText.textContent="Are you sure you want to delete this exercise and it's associated data? This action cannot be undone.";
            const warningTextContainer=document.createElement('div'); /* creates container for warning and buttons */
            warningTextContainer.id=exerciseName+'ExerciseButtonDeleteWarning';
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
                delete exerciseData[muscleGroupName][exerciseName+"Data"];
            });
            document.getElementById(exerciseName+'ExerciseButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(exerciseName+'ExerciseButtonDeleteWarning').remove();
            });        
        }); 
        // Putting exercises from "add workout components" onto the exercise list screen
        // Does this for NEW EXERCISES once, will be handled by render function if reloaded
        // Creates the container and appends to appropriate muscle container
        const exerciseListSingularExerciseContainer = document.createElement("div")
        exerciseListSingularExerciseContainer.id=exerciseName+'ExerciseListSingularExerciseContainer';
        document.getElementById(muscleGroupName+'ExerciseListExercisesContainer').appendChild(exerciseListSingularExerciseContainer);
        // Create the button for the exercise in the exercise list
        const button = createButton(exerciseName+'ExerciseListExerciseButton', exerciseName);
        document.getElementById(exerciseName+'ExerciseListSingularExerciseContainer').appendChild(button);
        // Hard-bakes the exercise name into the BUTTON so it can be programmatically pulled later
        button.dataset.exercise=exerciseName;
        // Hard-bakes the muscle group name into the CONTAINER so it can be programmatically pulled later
        exerciseListSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
        // Adds the appropriately named data array to the exercise data object
        exerciseData[muscleGroupName][exerciseName+"Data"]=[]
    }
    // Handles the return of the "add exercise" button to its add mode, removes form
    document.getElementById(muscleGroupName+'AddExercise').removeEventListener('click',()=>completeModeExercises(muscleGroupName));
    document.getElementById(muscleGroupName+'AddExercise').textContent='Add';
    document.getElementById(muscleGroupName+'AddExercise'+'Form').remove();
    document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', ()=>addMode(muscleGroupName+'Screen', muscleGroupName+'AddExercise', 'Exercise Name', 
        ()=>completeModeExercises(muscleGroupName), 
        ()=>addMode(muscleGroupName+'Screen', muscleGroupName+'AddExercise', 'Exercise Name',)));
}

function addModeStartWorkoutAddExercisesButton() { //takes existing EXERCISE LIST buttons and puts them on the start workout screen; actually populating the exercise list is done elsewhere
    showScreen('exerciseListScreen');
    document.getElementById('exerciseListButtonsContainer').querySelectorAll('button').forEach(exerciseListButton => {
        exerciseListButton.addEventListener('click', () => {
            const exerciseName=exerciseListButton.dataset.exercise;
            const muscleGroupName=document.getElementById(exerciseName+'ExerciseListSingularExerciseContainer').dataset.muscleGroupName
            if (!document.getElementById(exerciseName+'startWorkoutSingularExerciseContainer')) {
                const startWorkoutSingularExerciseContainer=document.createElement('div');
                startWorkoutSingularExerciseContainer.id=exerciseName+'startWorkoutSingularExerciseContainer';
                startWorkoutSingularExerciseContainer.dataset.exerciseName=exerciseName
                startWorkoutSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
                document.getElementById('startWorkoutExercisesContainer').appendChild(startWorkoutSingularExerciseContainer);
                createButtonDelete(exerciseName+'startWorkoutSingularExerciseContainer', exerciseName+'startWorkoutExerciseButtonModifiedDelete', exerciseName+'startWorkoutExerciseButton', exerciseName);
                document.getElementById(exerciseName+'startWorkoutExerciseButtonModifiedDelete').appendChild(createButton(exerciseName+'startWorkoutExerciseButtonStats','Stats'))
                document.getElementById(exerciseName+'startWorkoutExerciseButtonStats').addEventListener('click', () =>{
                    showScreen(exerciseName+'ExerciseDataScreen')
                })
                document.getElementById(exerciseName+"startWorkoutExerciseButtonDelete").addEventListener('click', () => {
                    document.getElementById(exerciseName+"startWorkoutSingularExerciseContainer").remove()
                })
                const repsAndWeightInputContainer=document.createElement('div');
                repsAndWeightInputContainer.id=exerciseName+'startWorkoutRepsAndWeightInputContainer';
                startWorkoutSingularExerciseContainer.appendChild(repsAndWeightInputContainer);
                repsAndWeightInputContainer.appendChild(createRepsAndWeightInput());
                const addSetButtonContainer=document.createElement('div');
                startWorkoutSingularExerciseContainer.appendChild(addSetButtonContainer);
                const addSetButton=document.createElement('button');
                addSetButton.textContent='Add Set';
                addSetButtonContainer.appendChild(addSetButton)
                addSetButton.addEventListener('click', () => {
                    repsAndWeightInputContainer.appendChild(createRepsAndWeightInput());
                });

            }
            showScreen('startWorkoutScreen');
        })
    })
}

/*Add button functions end*/

