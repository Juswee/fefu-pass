let obj_pass_img = {
    //Default: "https://imgur.com/a/3PX6BEg" "https://imgur.com/a/B6oLLuv",
    6.1: "https://i.imgur.com/EDq6d9Y.png",
    6.2: "https://i.imgur.com/OMnCQ1R.png",
    7.1: "https://i.imgur.com/rWciuyR.png",
    7.2: "https://i.imgur.com/aiIFYWn.png",
    8.1: "https://i.imgur.com/IL7uCL3.png",
    8.2: "https://i.imgur.com/xgI9eer.png",
    9: "https://i.imgur.com/Q2ZcV4M.png",
    10: "https://i.imgur.com/uWffQmw.png",
    11: "https://i.imgur.com/mvwiaKI.png"
}
let pass_last, pass_img;

restorePass();

window.onload = function() {
    // Открыть\Скрыть меню
    document.getElementsByClassName("card-body text-center p-5")[0].children[0].addEventListener("click", function() {
        document.getElementById("html").hidden = !document.getElementById("html").hidden; 
    });
}

async function restorePass() {
    // Загрузка последнего использующегося пропуска
    pass_last = await getStorage("pass_last");
    // Создание картинки и установка последнего пропуска
    let bool = true;
    for (let item of [1, 2, 3]) {
        if (await addPassImg(pass_last)) {
            bool = false;
            break;
        }
    }
    if (bool) window.location.reload(); 
    // Добавление меню расширение в страницу сайта
    addCSS();
    addHTML();
    // Добавление пропусков
    createPass("Default Pass", "");
    for (id in obj_pass_img) {
        //console.log(id, obj_pass_img[id]);
        createPass(id, obj_pass_img[id]);
    }
}

function switchPass(id, link) {
    setStorage("pass_last", [id, link]);
    if (id == "Default Pass") {
        pass_img.hidden = true;
    } else {
        pass_img.src = link;
        pass_img.hidden = false;
    }
}

function createPass(id, link) {
    let list = document.getElementById("passlist");
    let item = document.createElement("div");
    item.className = "passlist_item";
    item.addEventListener("click", function() {
        Array.from(document.getElementsByClassName("radio")).forEach( (item) => item.checked = false );
        this.children[0].checked = true;
        switchPass(id, link);
    });
    
    let radio = document.createElement("input");
    if (id == "Default Pass" && pass_last == undefined) radio.checked = true;
    if (pass_last != undefined) 
        if (pass_last[0] == id) radio.checked = true;
    radio.className = "radio";
    radio.type = "radio";
    
    let name = document.createElement("div");
    name.className = "name";
    let name_p = document.createElement("p");
    if (id == "Default Pass") name_p.textContent = "Default Pass";
    else name_p.textContent = "Корпус " + id;
    
    name.append(name_p);
    item.append(radio);
    item.append(name);
    list.append(item);
}

function setStorage(key, value) {
    let obj = new Object();
    obj[key] = value;
    chrome.storage.local.set(obj, () => {
        //console.log("Value of " + key + " is set to " + value);
    });
}

async function getStorage(key) {
    return new Promise( (resolve) => {
        chrome.storage.local.get([key], (result) => {
            //console.log("Value of " + key + " currently is ",  result[key]);
            resolve(result[key]);
        });
    });
}

async function addPassImg(pass_last = undefined) {
    return new Promise( (resolve, reject) => {
        let corp_img = document.createElement("img");
        (pass_last === undefined) ? corp_img.hidden = true : corp_img.src = pass_last[1];
        corp_img.id = "pass__img";
        corp_img.style.margin = 0;
        corp_img.style.position = "absolute";
        corp_img.style.left = "15px";
        corp_img.style.bottom = 0;
        corp_img.style.width = "calc(100% - 30px)";
        corp_img.style.height = "auto";

        try {
            document.getElementsByClassName("img-fluid")[3].parentElement.append(corp_img);
            pass_img = document.getElementById("pass__img");
            resolve(true);
        } catch {
            reject(false);
        }
    });
}

function addCSS() {
    document.head.insertAdjacentHTML("beforeEnd", `<style type="text/css">
#html-pass {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    
    width: 316px;
    max-width: 100vw;
    height: 316px;
    max-height: 100vh;

    border-radius: 7px;
    background: #333;
    
    z-index: 10000;
}

#body-pass {
    margin: 8px;   
    margin-bottom: 0;
    
    position: relative;
    display: grid;

    grid-template-rows: 35px 255px 10px;
    
    width: 300px;
    max-width: 98vw;
    height: 308px;
    max-height: 98vh;
    
    background: #333;

    overflow: hidden;
}

#fefu-pass {
    margin: 0;
    
    position: relative;
    
    height: 35px;
    width: 100%;
    
    font: 25px cursive;
    text-align: center;
    color: aliceblue;
    
    background: #333;
}

#fefu-pass p {
    margin: 0;
    
    cursor: default;
}

#fefu-sett {
    margin: 0;
    position: absolute;
    left: 0;
    
    color: rgba(255, 255, 255, .7);

    transition: .3s;
}

#fefu-sett::before, 
#fefu-sett::after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;

    background-color: rgba(255, 255, 255, .7);

    transition: .3s;
}

#fefu-sett::before {
    top: -5px;
}

#fefu-sett::after {
    top: 5px;
}

#fefu-sett:hover, 
#fefu-sett::before:hover, 
#fefu-sett::after:hover {
    
}

#fefu-close {
    margin: 0;
    position: absolute;
    right: 0;
    top: -5px;

    opacity: .7;
    color: #fff;

    transition: .3s;
}

#fefu-close:hover {
    opacity: 1;
    color: red;
}

#content { 
    position: relative;
    
    width: auto;
    height: 100%;
    
    border-radius: 10px;
    background: #807881;
}

/* Passlist */
#passlist_title {
    margin: 0; 
    font: 14px sans-serif;
    text-align: center;
}

#passlist {
    height: auto;
    max-height: 100%;
    
    border-radius: 10px;
    background: rgba(255, 255, 255, .34);
    
    overflow-y: auto;
}

.passlist_item {
    margin: 10px auto;
    
    position: relative;
    display: flex;
    justify-content: left;
    vertical-align: middle;
    
    width: 90%;
    height: 35px;
    
    border-radius: 5px;
    background: #fff;
    
    cursor: pointer;
}

.radio {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);

    height = 15px;
    
    cursor: pointer;
}

.name { 
    display: flex;
    
    width: 100%;
    height: 35px;
    
    overflow: auto;
}

.name p {
    margin: auto;
    
    text-align: center;
    font: 20px sans-serif;
}
#signature {
    font: 13px monospace;
    color: #f38181;
    text-align: center;
}
.abs#name {
    margin: 0 15px;
    position: absolute;
    left: 6%;
    bottom: 41%;
    
    line-height: 1.1;
    text-align: left;
    font-size: 23px;
    font-family: 'Roboto', sans-serif;
    letter-spacing: -.5px;
    font-stretch: condensed;
    
    color: rgba(255, 255, 255, .8);
}
.abs#house { 
    margin: 0 15px;
    position: absolute;
    left: 6%;
    bottom: 6%;
    
    line-height: 1;
    text-align: left;
    font-size: 15px;
    font-family: 'Roboto', sans-serif;
    letter-spacing: 0px;
    font-stretch: condensed;
    
    color: rgba(255, 255, 255, .7);
}
</style>`);
}

function addHTML() {
    document.body.insertAdjacentHTML("beforeEnd", `<div w3-include-html="popup.html"></div>`);
    document.getElementById("fefu-close").addEventListener("click", () => document.getElementById("html").hidden = true);
    /*document.getElementById("pass_save").addEventListener("click", function() {
        let pass_id = document.getElementById("pass_id").value;
        let pass_link = document.getElementById("pass_link").value;
        document.getElementById("pass_id").value = "";
        document.getElementById("pass_link").value = "";
        setStorage("passID_" + pass_ind, [pass_id, pass_link]);
        createPass(pass_id, pass_link);
    });*/
}