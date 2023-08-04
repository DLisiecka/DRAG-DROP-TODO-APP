const filteredStatus = (arr) => {
    let toDoStatus = arr.filter( el => el.status === 'to_do');
    let inProgressStatus = arr.filter( el => el.status === 'in_progress');
    let doneStatus = arr.filter( el => el.status === 'done');

    return { toDoStatus, inProgressStatus, doneStatus}
};

const newTaskBtn = document.getElementById('new_task_btn');
const newTaskInput = document.getElementById('new_task_text');
const newTaskForm = document.getElementById('new_task_form');

const selectOption = document.getElementById('select_progress');

const toDoContainer = document.getElementById('to_do');
const inProgressContainer = document.getElementById('in_progress');
const doneContainer = document.getElementById('done');

const sortBtnToDo = document.getElementById('sort_btn_to_do');
const sortBtnInProgress = document.getElementById('sort_btn_in_progress');
const sortBtnDone = document.getElementById('sort_btn_done');

const editWrapForm = document.querySelector('.no_display.edit_form_wrap')
const editTaskForm = document.getElementById('edit_task_form');
const editTaskInput = document.getElementById('edit_form_text');
const editTaskBtn = document.getElementById('edit_task_btn');
const idInput = document.getElementById('task_id');
const closeTaskBtn = document.getElementById('close_form_btn');

const editSelectOption = document.getElementById('edit_select_progress');



newTaskInput.addEventListener('click', () => {
    newTaskInput.value = '';
});

newTaskInput.addEventListener('blur', () => {
    if (newTaskInput.value === '') {
        newTaskInput.value = 'ADD A TASK';
    }
});

//Refresh container with tasks
const refreshView = () => {
    const taskArray = getDB();
    const {toDoStatus, inProgressStatus, doneStatus} = filteredStatus(taskArray);
    listOfTasks(toDoStatus, toDoContainer);
    listOfTasks(inProgressStatus, inProgressContainer);
    listOfTasks(doneStatus, doneContainer);
};

const closeForm = () => {
    editWrapForm.classList.remove('visible');
    editWrapForm.classList.add('no_display');
};

const newCard = ({id, description, status, date, lastEditDate}) => {
    const cardDiv = document.createElement('div');
    cardDiv.setAttribute('class','card_task');
    cardDiv.setAttribute('draggable', 'true');
    cardDiv.setAttribute('data-id', id);
    const content = `
            <h2>${description}</h2>
            <p>${createNewDate(date)}</p>
            <div class='card-content'>
            <p>Ostatnia edycja: </p>
            <p>${createNewDate(lastEditDate)}</p>
            </div>
    `
    const cardEdit = document.createElement('div');
    const editBtn = document.createElement('button');
    const deleteBtn = document.createElement('button');
    
    cardEdit.classList.add('card_edit');
    editBtn.classList.add('edit_btn');
    deleteBtn.classList.add('delete_btn');
    
    const editImg = `
            <img src="./resources/edit_note.svg" alt="edit task button" class="edit_img">
    `
    const deleteImg = `
            <img src="./resources/delete.png" alt="delete task button" class="delete_img">
    `
 

    cardDiv.innerHTML = content;
    editBtn.innerHTML = editImg;
    deleteBtn.innerHTML = deleteImg;
    cardEdit.appendChild(editBtn);
    cardEdit.appendChild(deleteBtn);
    cardDiv.appendChild(cardEdit);

    editBtn.addEventListener('click', () => {
        editWrapForm.classList.remove('no_display');
        editWrapForm.classList.add('visible');
        const newDB = updateDB((db) => db.filter(el => el.id === id));
        editTaskInput.value = newDB[0].description;
        editSelectOption.value = newDB[0].status;
        idInput.value = id;
    });

    deleteBtn.addEventListener('click', () => {
        updateDB((db) => db.filter(el => el.id !== id))
       refreshView();
    });

    closeTaskBtn.addEventListener('click', closeForm);

    return cardDiv;
};

const listOfTasks = (list, container) => {
    const numOfTasks = list.length;
    container.previousElementSibling.querySelector(".counter").textContent = numOfTasks;
    container.innerHTML = '';
    list.forEach( (el) => {
        const card = newCard(el);
        container.appendChild(card);
    });
};


const createNewDate = (isoDate) => {
    return new Intl.DateTimeFormat(
        window.navigator.language, 
        { dateStyle: 'full', timeStyle: 'medium' }
    ).format(new Date(isoDate));
};
    
newTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const newDB = updateDB((db) => {
            db.push({
            id: new Date().getTime().toString(),
            description: newTaskInput.value,
            status: selectOption.value,
            date: new Date().toISOString(),
            lastEditDate: new Date().toISOString()
        });
        return db;    
    });
    const {toDoStatus, inProgressStatus, doneStatus} = filteredStatus(newDB);
    switch(selectOption.value){
        case STATUS.TODO:
            listOfTasks(toDoStatus, toDoContainer);
            break;
        case STATUS.IN_PROGRESS:
            listOfTasks(inProgressStatus, inProgressContainer);
            break;
        case STATUS.DONE:
            listOfTasks(doneStatus, doneContainer);
            break;      
    }
    newTaskInput.value = 'ADD A TASK';
});
    const ORDER = {
        ASC: 'asc',
        DESC: 'desc'
    };
    const {ASC,DESC} = ORDER;
    let sortOrder = ASC;
    
    const sortCard = (btn) => {
        btn.addEventListener('click', () => {
            const tasksDB = getDB();
            const {toDoStatus, inProgressStatus, doneStatus} = filteredStatus(tasksDB);
            const sortArr = (arr,container) => {
                let mappedArr = arr.map((el) => {
                    const {id, description, status, date, lastEditDate} = el;
                    let editTime = lastEditDate
                    editTime = new Date(editTime).getTime()
                    return {id, description, status, date, editTime, lastEditDate}
                });

                sortOrder = sortOrder === ASC ? DESC : ASC;

                let sortedArr = mappedArr.sort((a,b) => {
                    if(sortOrder === 'desc'){
                    return a.editTime > b.editTime ? -1 : 1
                }else if(sortOrder === 'asc'){
                    return a.editTime < b.editTime ? -1 : 1
                }
                })
                listOfTasks(sortedArr,container);        
            }

            if(btn === sortBtnToDo){
                return sortArr(toDoStatus,toDoContainer)
            }else if(btn === sortBtnInProgress){
                return sortArr(inProgressStatus,inProgressContainer)
            }else if(btn === sortBtnDone){
                return sortArr(doneStatus,doneContainer)
            }          
    });
    };
    
    sortCard(sortBtnToDo);
    sortCard(sortBtnInProgress);
    sortCard(sortBtnDone);


editTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    updateDB((db) => {
        const newDB = db.map( (el) => {
            if(el.id === idInput.value){
                el.description = editTaskInput.value;
                el.lastEditDate = new Date().toISOString();
                el.status = editSelectOption.value;
            }
            return el
        });
        return newDB;
    });
    refreshView();
    closeForm();

});

refreshView();