const droppables = document.querySelectorAll('.tasks_container');

let dataID;

droppables.forEach(container => {
    container.addEventListener("dragstart", e => {
        dataID = e.target.dataset.id;
    })

    container.addEventListener("dragover", e => {
        e.preventDefault();
        container.classList.add("hovered")
    })
    
    container.addEventListener("dragleave", (e) => {
        container.classList.remove("hovered")
    })
    
    container.addEventListener("drop", (e) => {
        if(!dataID) return;
        
        container.classList.remove("hovered");
        const dataStatus = e.target.dataset.status;
        
        if(!dataStatus) return;
        
        const tasksDB = getDB();
        const newDB = tasksDB.map((el) => {
            if(el.id === dataID){
                el.status = dataStatus;
                el.lastEditDate = new Date().toISOString();
            }
            
            return el;
        })
        setDB(newDB);
        refreshView(newDB);
        dataID = undefined;
    }) 
});

