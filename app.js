/* Starting state variables, start */
const exerciseData = {}
/* Starting state variables, end */

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
    const muscleGroupName=document.getElementById(addButtonName+'Name').value;
    if(muscleGroupName.trim() !== '' && !document.getElementById(muscleGroupName+'MuscleButton')) { /*If input is not empty, muscle doesn't already exist, create*/
        createButtonDelete('muscleNameButtons', muscleGroupName+'MuscleButtonModifiedDelete', muscleGroupName+'MuscleButton', muscleGroupName.trim());
        const muscleExerciseContainer = document.createElement("div")
        muscleExerciseContainer.id=muscleGroupName+'ExerciseListExercisesContainer'
        muscleExerciseContainer.innerHTML=`<h3>${muscleGroupName} Exercises</h3>`
        document.getElementById('exerciseListButtonsContainer').appendChild(muscleExerciseContainer)
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
                /* Insert code here to delete muscle screen and any attached information in the future, use data-muscle=${muscleGroupName} to track containers */
                });
            document.getElementById(muscleGroupName+'MuscleButtonCancelDelete').addEventListener('click', () => { /* if cancel is clicked*/
                document.getElementById(muscleGroupName+'MuscleButtonDeleteWarning').remove();
                });
        });
        if (!document.getElementById(`${muscleGroupName}Screen`)) {
            createMuscleScreen(muscleGroupName);
        }
        document.getElementById(muscleGroupName+'MuscleButton').addEventListener('click', () => {
            showScreen(muscleGroupName+'Screen');
        });
        exerciseData[muscleGroupName]={}
    }   
    document.getElementById(addButtonName).removeEventListener('click', completeModeMusclesListener);
    document.getElementById(addButtonName).textContent='Add';
    document.getElementById(addButtonName+'Form').remove();
    document.getElementById(addButtonName).addEventListener('click', addModeMusclesListener);
}

function completeModeExercises(muscleGroupName) { /*Click complete button => back to add mode, create exercise button, create delete button*/
    const exerciseName=document.getElementById(muscleGroupName+'AddExercise'+'Name').value;
    if(exerciseName.trim() !== '' && !document.getElementById(exerciseName+'ExerciseButton')) { /*If input is not empty, exercise doesn't already exist, create*/
        createButtonDelete(muscleGroupName+'ExerciseButtons', exerciseName+'ExerciseButtonModifiedDelete', exerciseName+'ExerciseButton', exerciseName.trim());
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
        }); 
        if (!document.getElementById(`${exerciseName}ExerciseDataScreen`)) {
            createExerciseDataScreen(exerciseName, muscleGroupName);
        }
        document.getElementById(exerciseName+'ExerciseButton').addEventListener('click', () => {
            showScreen(exerciseName+'ExerciseDataScreen');
        });
        //putting exercises from "add workout components" onto the exercise list screen
        const exerciseListSingularExerciseContainer = document.createElement("div")
        exerciseListSingularExerciseContainer.id=exerciseName+'ExerciseListSingularExerciseContainer';
        document.getElementById(muscleGroupName+'ExerciseListExercisesContainer').appendChild(exerciseListSingularExerciseContainer);
        const button = createButton(exerciseName+'ExerciseListExerciseButton', exerciseName);
        document.getElementById(exerciseName+'ExerciseListSingularExerciseContainer').appendChild(button);
        button.dataset.exercise=exerciseName;
        exerciseListSingularExerciseContainer.dataset.muscleGroupName=muscleGroupName
        exerciseData[muscleGroupName][exerciseName+"Data"]=[]
    }
    document.getElementById(muscleGroupName+'AddExercise').removeEventListener('click',()=>completeModeExercises(muscleGroupName));
    document.getElementById(muscleGroupName+'AddExercise').textContent='Add';
    document.getElementById(muscleGroupName+'AddExercise'+'Form').remove();
    document.getElementById(muscleGroupName+'AddExercise').addEventListener('click', ()=>addMode(muscleGroupName+'Screen', muscleGroupName+'AddExercise', 'Exercise Name', 
        ()=>completeModeExercises(muscleGroupName), 
        ()=>addMode(muscleGroupName+'Screen', muscleGroupName+'AddExercise', 'Exercise Name',)));
}

function addModeStartWorkoutAddExercisesButton() { //takes exercise list buttons and puts them on the start workout screen
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

