// Creating IndexedDB database
let db;

const request = indexedDB.open("MynoteDB", 3);

request.onupgradeneeded = function(e){
    db = e.target.result;
    db.createObjectStore("notes", {
        keyPath: "id"
    });
    db.createObjectStore("pinNotes", {
        keyPath: "id"
    });
    db.createObjectStore("favNote", {
        keyPath: "id"
    });

    localStorage.setItem("subjects", []);
};

request.onsuccess = function(e){
    db = e.target.result;
    
    const tx = db.transaction("notes","readonly");
    const tx2 = db.transaction("pinNotes", "readonly");
    const tx3 = db.transaction("favNote","readonly");
    const store = tx.objectStore("notes");
    const pinStore = tx2.objectStore("pinNotes");
    const favStore = tx3.objectStore("favNote");

    const requestNote = store.getAll();
    const requestPinNote = pinStore.getAll();
    const requestFavNote = favStore.getAll();

    let allNote;
    let allPinNote;
    let allFavNote;

    requestNote.onsuccess = function (){
        allNote = requestNote.result;
        renderNotes(allNote);
    }

    requestPinNote.onsuccess = function(){
        allPinNote = requestPinNote.result;
        renderPinNotes(allPinNote);
    }

    requestFavNote.onsuccess = function(){
        allFavNote = requestFavNote.result;
        renderFavNote(allFavNote);
    }

};

// This is tge logic of Menu buttons--------

let dashOpen = document.getElementById("dash_btn");
let allnoteOpen = document.getElementById("allnote_btn");
let noteFavOpen = document.getElementById("fav_btn");
let dashStatus = document.getElementById("dashbody");
let allnoteStatus = document.getElementById("allnote_body");
let noteFavStatus = document.getElementById("fav_body");

dashOpen.addEventListener("click", () => {
    dashStatus.style.display = "block";
    allnoteStatus.style.display = "none";
    noteFavStatus.style.display = "none";
    dashOpen.style.backgroundColor = "#1c2256";
    allnoteOpen.style.backgroundColor = "transparent";
    noteFavOpen.style.backgroundColor = "transparent";
})

allnoteOpen.addEventListener("click", () => {
    allnoteStatus.style.display = "block";
    dashStatus.style.display = "none";
    noteFavStatus.style.display = "none";
    allnoteOpen.style.backgroundColor = "#1c2256";
    dashOpen.style.backgroundColor = "transparent";
    noteFavOpen.style.backgroundColor = "transparent";
})

noteFavOpen.addEventListener("click", () => {
    noteFavStatus.style.display = "block";
    allnoteStatus.style.display = "none";
    dashStatus.style.display = "none";
    noteFavOpen.style.backgroundColor = "#1c2256";
    allnoteOpen.style.backgroundColor = "transparent";
    dashOpen.style.backgroundColor = "transparent";
})

// ----------------------------------------------------------------------------------------
// view all button logic of dashboard

let viewAllnote = document.getElementById("view_allnote");

viewAllnote.addEventListener("click", () => {
    allnoteStatus.style.display = "block";
    dashStatus.style.display = "none";
    noteFavStatus.style.display = "none";
    allnoteOpen.style.backgroundColor = "#1c2256";
    dashOpen.style.backgroundColor = "transparent";
    noteFavOpen.style.backgroundColor = "transparent";
})

let viewFavnote = document.getElementById("view_favnote");

viewFavnote.addEventListener("click", () => {
    noteFavStatus.style.display = "block";
    allnoteStatus.style.display = "none";
    dashStatus.style.display = "none";
    noteFavOpen.style.backgroundColor = "#1c2256";
    allnoteOpen.style.backgroundColor = "transparent";
    dashOpen.style.backgroundColor = "transparent";
})


// This is the Logic of light and dark mode ----------------------------------------------------------

let darkmode= localStorage.getItem("darkmode");
const dark_btn = document.getElementById("ngt_btn");
const icon = document.getElementById("ngt_img");
const showSide = document.getElementById("show_sidebar");
const sideBar = document.getElementById("side");

showSide.addEventListener("click", () => {
    if(sideBar.style.display === "none"){
        sideBar.style.display = "block";
    }
    else{
        sideBar.style.display = "none";
    }
});

const dark_on = () => {
    document.body.classList.add("darkmode")
    localStorage.setItem("darkmode", "active")
    icon.src = "assets/sun.png"
}

const dark_off = () => {
    document.body.classList.remove("darkmode")
    localStorage.setItem("darkmode", null)
    icon.src = "assets/moon.png"
}

if( darkmode === "active") dark_on()

dark_btn.addEventListener("click", () => {
    darkmode = localStorage.getItem("darkmode")
    if ( darkmode !== "active"){
        dark_on()
    }else{
        dark_off()
    }
})

// -------------------------------------------------------------------------------------------------------

// This is the Logic of Add Subject Button ---------------------------------------------------------------

const addSub = document.getElementById("add_sub");
const popSub = document.getElementById("pop");
const clsPopBtn = document.getElementById("cls_btn");

addSub.addEventListener("click", () =>{
    popSub.style.display = "block"
})

clsPopBtn.addEventListener("click", () => {
    popSub.style.display = "none"
})


let subjName = "";
let subjShow = "";
let subjData = JSON.parse(localStorage.getItem("subjects")) || [];
let subNum = document.getElementById("sub_num");
const showSub = document.getElementById("save_subj");
let subCont = 0;

function renderSubjects (){

    subjName = "";
    subjShow = ""

    subjData.forEach((item) => {
        subjName += `
        <button class="sub_btn">
            <img class="sub_icon" src="assets/noteicon.png">
            <h4>${item}</h4>
        </button>
        `,
        subjShow += `
        <div id="list_tabs">
            <div id="subj_img">
                <img id="image" src="assets/subject_book.png">
            </div>
            <div id="subj_name_div">
                <h3 id="subj_name">${item}</h3>
            </div>
            <button id="subj_btn" onclick="subjDelete('${item}')">
                <img id="btn_img" src="assets/delete.png">
            </button>
        </div>
        `
    })
    document.querySelector(".subj_names").innerHTML = subjName;
    document.getElementById("subj_list").innerHTML = subjShow;
    subNum.innerHTML = subjData.length;
}

renderSubjects();

showSub.addEventListener("click", () => {
    let subjinp = document.getElementById("pop_inp").value;
    
    if(subjinp.trim() === "") return;
    subjData.push(subjinp);

    localStorage.setItem("subjects", JSON.stringify(subjData));
    document.getElementById("pop_inp").value = "";

    renderSubjects();
    location.reload();
    popSub.style.display = "none";
})

// -----------------------------------------------------------------------------------------------------------------------

// This is the function to show amd close subject pop up 

const showSubjPop = document.getElementById("view_subjpop");
const subjPop = document.getElementById("subj_all");

showSubjPop.addEventListener("click", () =>{
    subjPop.style.display = "block";
})

const clsSubjShow = document.getElementById("cls_subjnote");

clsSubjShow.addEventListener("click", () => {
    subjPop.style.display = "none";
})


// This is the function of deleting the subject

function subjDelete(subjItem){
    let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    subjects = subjects.filter(subj => subj !== subjItem);
    localStorage.setItem("subjects", JSON.stringify(subjects));
    location.reload();
}
// This is the logic of note text editor buttons

const editor = document.getElementById("editor");
const boldBtn = document.getElementById("bold_btn");
const underBtn = document.getElementById("under_btn");
const italicBtn = document.getElementById("italic_btn");
const listBtn = document.getElementById("list_btn");
const numlistBtn = document.getElementById("numlist_btn");
const algLeftBtn = document.getElementById("algleft_btn");
const algCenBtn = document.getElementById("algcen_btn");
const algRightBtn = document.getElementById("algright_btn");

function changeFontSize(size){
    const selection = window.getSelection();

    if(!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");

    span.style.fontSize = size;
    range.surroundContents(span);
}

const fontSize = document.getElementById("font_size");
fontSize.addEventListener("change",() => {
    const selection = window.getSelection();

    if(selection.toString().length > 0){
        changeFontSize(fontSize.value);
    }else{
        editor.style.fontSize = fontSize.value;
    }
});

function updateSetButton(status, btnName) {
    const isActive = document.queryCommandState(status); 
    btnName.style.backgroundColor = isActive ? "#7c7c7c" : "#dfdcdc";
}

function handleCommand(command, btn, statusName){
    document.execCommand(command);
    editor.focus();
    updateSetButton(statusName, btn);
}


boldBtn.addEventListener("click",()=>{
    handleCommand("bold", boldBtn, "bold");
})
underBtn.addEventListener("click",()=>{
    handleCommand("underline", underBtn, "underline");
})
italicBtn.addEventListener("click",()=>{
    handleCommand("italic", italicBtn, "italic");
})
listBtn.addEventListener("click",()=>{
    handleCommand("insertUnorderedList", listBtn, "insertUnorderedList");
})
numlistBtn.addEventListener("click",()=>{
    handleCommand("insertOrderedList", numlistBtn, "insertOrderedList");
})

algLeftBtn.addEventListener("click",()=>{
    document.execCommand("justifyLeft");
    editor.focus();
})
algCenBtn.addEventListener("click",()=>{
    document.execCommand("justifyCenter");
    editor.focus();
})
algRightBtn.addEventListener("click",()=>{
    document.execCommand("justifyRight");
    editor.focus();
})
// ---------------------------------------------------------------------------------------------------------------------
// This is the code of option setting in saving note 

const subjectSelect = document.getElementById("subj_data");

const subjDisplay = JSON.parse(localStorage.getItem("subjects")) || [];

subjDisplay.forEach(subjDisplay =>{
    const subOption = document.createElement("option");
    subOption.value = subjDisplay;
    subOption.textContent = subjDisplay;
    subjectSelect.appendChild(subOption);
});

// -------------------------------------------------------------------------------------------------------------------------------


let favnoteMenu = document.querySelectorAll(".favnote_edt");

favnoteMenu.forEach((favnoteBtn) => {
    favnoteBtn.addEventListener("click", () => {
    
        let noteOpt = favnoteBtn.nextElementSibling;

        if(noteOpt.style.display === "block"){
            noteOpt.style.display = "none";
        }else{
            noteOpt.style.display = "block";
        }
    })
})

// --------------------------------------------------------------------------------------------------------------------

// This is logic for pop up for adding new note

const opnNote = document.getElementById("newNote");
const popNote = document.getElementById("notepop_cont");

opnNote.addEventListener("click", () => {
    popNote.style.display = "block";
});

const popClsBtn = document.getElementById("cls_popnote");

popClsBtn.addEventListener("click", () =>{
    if(popNote.style.display === "none"){
        popNote.style.display = "block";
    }else{
        popNote.style.display = "none";
    }
});

// This is the function of the pin buton in settin buttton

function addPinNote(noteid) {
    if(!db){
        alert("datbase is note ready");
        return;
    }
    const readNote = db.transaction("notes","readonly");
    const storeNote = readNote.objectStore("notes");
    const requestNote = storeNote.get(noteid);
    let noteInfo;

    requestNote.onsuccess = () => {
        noteInfo = requestNote.result;
        addPinContent(noteInfo);
    }

};

function renderNotes(userData){

    let noteData = userData;

    let noteName = "";
    let recNote = "";

    noteData.forEach((note) => {
        noteName += `
        <div class="note_data ${note.name.replaceAll(" ", "_").toLowerCase()}">
            <div class="notedata_img" style="background-color:${note.color}">
                <img src="assets/notes.png">
            </div>
            <div class="notetxt_div">
                <h2 class="note_txt noteName">${note.name}</h2>
            </div>
            <div class="notedata_subj">
                ${note.subject}
            </div>
            <div>
                <h2 class="note_pri">${note.priority}</h2>
            </div>
            <div>
                <button id="view2_btn" onclick="viewNote(${note.id})">view</button>
            </div>
            <div class="notedata_menu">
                <button class="note_edt"><img src="assets/dot.png"></button>
                <div class="note_opt">
                    <div class="note_pin opt_div">
                        <button class="pin_btn" onclick ="addPinNote(${note.id})"><h4>Pin Note</h4></button>
                    </div>
                    <div class="note_del opt_div">
                        <button class="del_btn" onclick ="deleteNote(${note.id})"><h4>Delete</h4></button>
                    </div>
                    <div class="add_fav opt_div">
                        <button class="addfav_btn" onclick = "addFav(${note.id})"><h4>Add Favorite</h4></button>
                    </div>
                </div>
            </div>
        </div>
        `,

        recNote += `
            <div class="rec_note">
                <div class="note_img" style="background-color:${note.color}">
                    <img src="assets/notes.png">
                </div>
                <div class="recnotetxt_div">
                    <h2 class="recnote_txt">${note.name}</h2>
                </div>
                <div class="note_subj">
                    ${note.subject}
                </div>
                <div>
                    <button id="viewnote_btn" onclick="viewNote(${note.id})">View</button>
                </div>
                <div class="note_menu">
                    <button class="note_edt"><img src="assets/dot.png"></button>
                    <div class="note_opt">
                        <div class="note_pin opt_div">
                            <button class="pin_btn" onclick ="addPinNote(${note.id})"><h4>Pin Note</h4></button>
                        </div>
                        <div class="note_del opt_div">
                            <button class="del_btn" onclick ="deleteNote(${note.id})"><h4>Delete</h4></button>
                        </div>
                        <div class="add_fav opt_div">
                            <button class="addfav_btn" onclick = "addFav(${note.id})"><h4>Add Favorite</h4></button>
                        </div>
                    </div>
                </div>
            </div>
        `
    })

    
    document.getElementById("allnote_list").innerHTML = noteName;
    document.getElementById("tab_cont").innerHTML = recNote;
    document.getElementById("note_num").innerHTML = noteData.length;

    // This is the logic of Sub menu for notes-----------------------------------------------------------------------

    let noteMenu = document.querySelectorAll(".note_edt");

    noteMenu.forEach((noteBtn) => {
        noteBtn.addEventListener("click", () => {
            let noteOpt = noteBtn.nextElementSibling;

            if(noteOpt.style.display === "block"){
                noteOpt.style.display = "none";
            }else{
                noteOpt.style.display = "block";
            }
        });
    });


}

function renderPinNotes(noteDetl){

    let pinNote ="";
    let pinData = noteDetl;
    
    pinData.forEach((note) => {
        pinNote += `
            <div class="pin_note">
                <div class="pin_img" style="background-color:${note.color}">
                    <img src="assets/notes.png">
                </div>
                <div class="pin_txt">
                    <h2>${note.name}</h2>
                </div>
                <div class="pin_subj">
                    ${note.subject}
                </div>
                <div>
                    <button id="pinview_btn" onclick="viewPinNote(${note.id})">view</button>
                </div>
                <div class="pin_menu">
                    <button class="remove_pin" onclick="removePin(${note.id})"><img class="pin_edt" src="assets/pin.png"></button>
                </div>
            </div>
        `;
    });
        document.getElementById("tab2_cont").innerHTML = pinNote;
}

// This is a function to add data in of pin note in database

function addPinContent(noteName){

    const tx = db.transaction("pinNotes", "readwrite");

    const store = tx.objectStore("pinNotes");
    const noteData = {
        id: Date.now(),
        name: noteName.name,
        subject: noteName.subject,
        color: noteName.color,
        priority: noteName.priority,
        content: noteName.content
    };

    store.add(noteData);
    location.reload();
}

// This is a function of rendering fav note in index

function renderFavNote(noteData){

    let favNote = "";
    let favData = noteData;

    favData.forEach((fav) =>{
        favNote += `
            <div class="favnote_box">
                <div class="favimg_cont">
                    <div class="favnote_img" style="background-color:${fav.color}"><img src="assets/favnote.png"></div>
                    <div class="favicon_img"><img src="assets/fillstar.png"></div>
                </div>
                <div class="favnote_name">
                    <h2 class="favnote_txt">${fav.name}</h2>
                </div>
                <div class="favnote_subj">
                    <div class="favdata_subj">
                        ${fav.subject}
                    </div>
                </div>
                <div class="favnote_sett">
                    <button id="favview_btn" onclick="viewFavNote(${fav.id})">view</button>
                    <button class="favnote_edt" onclick="removeFav(${fav.id})"><img src="assets/remove.png"></button>
                    <div class="favnote_opt">
                        <div class="note_pin favopt_div">
                            <button class="pin_btn"><h4>Pin Note</h4></button>
                        </div>
                        <div class="note_del opt_div">
                            <button class="del_btn"><h4>Delete</h4></button>
                        </div>
                        <div class="add_fav opt_div">
                            <button class="addfav_btn"><h4>Add Favorite</h4></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById("favnote_list").innerHTML = favNote;
    document.getElementById("fav_num").innerHTML = favData.length;
}

// This is a function for add fav note in database

function addFav(noteID){

    if(!db){
        alert("datbase is note ready");
        return;
    }
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    const noteData = store.get(noteID);
    let favNoteData;

    noteData.onsuccess = function(){
        favNoteData = noteData.result;
        const txFav = db.transaction("favNote","readwrite");
        const favStore = txFav.objectStore("favNote");

        const favData = {
            id:Date.now(),
            name: favNoteData.name,
            subject: favNoteData.subject,
            color: favNoteData.color,
            priority: favNoteData.priority,
            content: favNoteData.content
        }
    
        favStore.add(favData);
        location.reload();
    }

}

// Saving Note data In Database

function saveNote(){
    if(!db){
        alert("datbase is note ready");
        return;
    }
    const tx = db.transaction("notes", "readwrite");

    const store = tx.objectStore("notes");

    const noteData = {
        id: Date.now(),
        name: document.getElementById("name_input").value,
        subject: document.getElementById("subj_data").value,
        color: document.querySelector('input[name="NoteColor"]:checked')?.value,
        priority: document.querySelector('input[name="priName"]:checked')?.value,
        content: document.getElementById("editor").innerHTML
    };

    store.add(noteData);
    
    document.getElementById("name_input").value ="";
    
    location.reload();
}

const saveNoteData = document.getElementById("create_note");

saveNoteData.addEventListener("click",() => {
    saveNote();
    popNote.style.display = "none";
});

// ---------------------------------------------------------------------------------------

// This is function to show note

function viewNote(noteID){
    const viewPop = document.getElementById("view_note");
    viewPop.style.display = "block";

    if(!db){
        alert("datbase is note ready");
        return;
    }
    const tx = db.transaction("notes", "readonly");
    const store = tx.objectStore("notes");
    const noteDetail = store.get(noteID);
    let noteName;
    
    noteDetail.onsuccess = function(){
        noteName = noteDetail.result;

        document.getElementById("viewimg_note").style.backgroundColor = noteName.color;
        document.getElementById("note_name").innerHTML = noteName.name;
        document.getElementById("note_subject").innerHTML = noteName.subject;
        document.getElementById("note_pri").innerHTML = noteName.priority;
        document.getElementById("view_data").innerHTML = noteName.content;
    }
}

let clsViewNote = document.getElementById("cls_viewnote");

clsViewNote.addEventListener("click", ()=>{
    document.getElementById("view_note").style.display = "none";
})

function viewPinNote(noteID){
    const viewPop = document.getElementById("view_note");
    viewPop.style.display = "block";

    if(!db){
        alert("datbase is note ready");
        return;
    }
    const tx = db.transaction("pinNotes", "readonly");
    const store = tx.objectStore("pinNotes");
    const noteDetail = store.get(noteID);
    let noteName;
    
    noteDetail.onsuccess = function(){
        noteName = noteDetail.result;

        document.getElementById("viewimg_note").style.backgroundColor = noteName.color;
        document.getElementById("note_name").innerHTML = noteName.name;
        document.getElementById("note_subject").innerHTML = noteName.subject;
        document.getElementById("note_pri").innerHTML = noteName.priority;
        document.getElementById("view_data").innerHTML = noteName.content;
    }
}

let clsViewPinNote = document.getElementById("cls_viewnote");

clsViewPinNote.addEventListener("click", ()=>{
    document.getElementById("view_note").style.display = "none";
})


function viewFavNote(noteID){
    const viewPop = document.getElementById("view_note");
    viewPop.style.display = "block";

    if(!db){
        alert("datbase is note ready");
        return;
    }
    const tx = db.transaction("favNote", "readonly");
    const store = tx.objectStore("favNote");
    const noteDetail = store.get(noteID);
    let noteName;
    
    noteDetail.onsuccess = function(){
        noteName = noteDetail.result;

        document.getElementById("viewimg_note").style.backgroundColor = noteName.color;
        document.getElementById("note_name").innerHTML = noteName.name;
        document.getElementById("note_subject").innerHTML = noteName.subject;
        document.getElementById("note_pri").innerHTML = noteName.priority;
        document.getElementById("view_data").innerHTML = noteName.content;
    }
}

let clsViewFavNote = document.getElementById("cls_viewnote");

clsViewFavNote.addEventListener("click", ()=>{
    document.getElementById("view_note").style.display = "none";
})

// This is a function to delete data from data base

function deleteNote(noteID){
    if(!db){
        alert("datbase is note ready");
        return;
    }
    const tx = db.transaction("notes", "readwrite");
    const store = tx.objectStore("notes");
    const noteDetail = store.get(noteID);
    let noteName;
    
    noteDetail.onsuccess = function(){
        noteName = noteDetail.result.name;
    }

    const tx2 = db.transaction("pinNotes", "readwrite");
    const storePin = tx2.objectStore("pinNotes");
    const pinNoteDelete = storePin.getAll();
    let pinName;
     
    pinNoteDelete.onsuccess = function(){
        pinName = pinNoteDelete.result;
        const pin = pinName.find(n => n.name === noteName);

        if(pin){
            storePin.delete(pin.id);
        }
    }

    const tx3 = db.transaction("favNote","readwrite");
    const storeFav = tx3.objectStore("favNote");
    const favDelete = storeFav.getAll();
    let favName;

    favDelete.onsuccess = function(){
        favName = favDelete.result;
        const fav = favName.find(f => f.name === noteName);

        if(fav){
            storeFav.delete(fav.id);
        }
    }

    store.delete(noteID);
    location.reload();
}

function removePin(noteID){
    if(!db){
        alert("datbase is note ready");
        return;
    }

    const tx = db.transaction("pinNotes", "readwrite");
    const storePin = tx.objectStore("pinNotes");
    const pinNoteDelete = storePin.getAll(noteID);
     
    pinNoteDelete.onsuccess = function(){
        storePin.delete(noteID);
        location.reload();
    }

}

function removeFav(noteID){
    if(!db){
        alert("datbase is note ready");
        return;
    }

    const tx = db.transaction("favNote", "readwrite");
    const storeFav = tx.objectStore("favNote");
    const favNoteDelete = storeFav.getAll(noteID);
     
    favNoteDelete.onsuccess = function(){
        storeFav.delete(noteID);
        location.reload();
    }

}


// This is the code for search bar

const searchInput = document.getElementById("searchbox");

searchInput.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
        searchNote();
    }
})

function searchNote(){
    document.getElementById("dashbody").style.display = "none";
    document.getElementById("allnote_body").style.display = "block";
}
