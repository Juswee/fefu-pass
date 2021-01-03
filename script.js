let pass_last, pass_img, pass_len, skip_lst = [];

window.onload = async function() {
    await addHTML();
    restorePass();
    eventListener();
    fit();
}

function eventListener() {
    // Input remove error
    $(".input-crt").blur(function() {
        $(this).removeClass("error");
    });
    // Settings
    $("#fefu-sett").click(function() {
        $("#fefu-sett, #fefu-menu").toggleClass("active");
        $("#passlist").toggleClass("lock");
    });
    // Spoilers
    $(".spoiler-title").click(function(event) { 
        $(this).toggleClass("active").next().slideToggle(300);
    });
    // Save button
    $("#save-btn").click(async (event) => {
        let err = false;
        $(`.input-crt`).each(function() {
            if (!$(this).val()) {
                err = true;
                $(this).addClass("error");
            }
        });
        if (!err) {
            let data = Array.from($(".input-crt")).map(item => item.value);
            if (skip_lst.length > 0) pass_last = skip_lst.pop();
            else pass_last = ++pass_len;
            await createPass(pass_last, getHouseTitle(data));
            setStorage(pass_last, data);
            setStorage("len", pass_len);
            setStorage("last_pass", pass_last);
            switchPass(pass_last);
            $(".input-crt").val("");
        }
    });
    //Close button
    $("#fefu-close").click( () => $("#html-pass").hide() );
    // Toggle popup
    $(".card-body.text-center.p-5 img:eq(0)").click( () => { $("#html-pass").toggle() });
    $(window).resize(fit);
}

function fit() {
    let wid = $(".img-fluid:eq(3)").width() / 249;
    $(".abs#name").css( { "font-size": parseInt(wid * 130) / 10 + "px", "bottom": wid * 81 + "px", "left": wid * 17 + "px" } );
    $(".abs#house").css( { "font-size": parseInt(wid * 849) / 100 + "px", "bottom": wid * 11 + "px", "left": wid * 17 + "px" } );
}

function addHTML() {
    return new Promise(res => {
        // Add CSS
        $.ajax({
            url: "https://raw.githubusercontent.com/Juswee/fefu-pass/main/styles.css", 
            context: document.head,
            success: response => { $(document.head).append(`<style>${response}</style>`) }
        });
        // Add popup
        //$(document.body).append(`<div id="html-pass" style="display: none"></div>`);
        $.ajax({
            url: "https://raw.githubusercontent.com/Juswee/fefu-pass/main/popup.html", 
            context: document.body,
            success: response => { $(document.body).append(response) }
        });
        // Add document customize
        $.ajax({
            url: "https://raw.githubusercontent.com/Juswee/fefu-pass/main/document.html", 
            context: document.body,
            success: response => { $(".col-md-6.text-center").first().append(response) }
        });
        setTimeout(res, 500);
    });
}

function getHouseTitle(e) { // NameST (House)
    return `${e[0]}${e[1][0]}${e[2][0]} (${e[3].slice(e[3].lastIndexOf(" ") + 1)})`;
}

async function restorePass() {
    return new Promise(async (res) => {
        // Load id of last used pass
        pass_img = $("#img-pass");
        pass_last = await getStorage("pass_last");
        if (pass_last === "undefined") {
            pass_last = 0;
            setStorage("pass_last", 0);
        } else if (pass_last > 0) switchPass(pass_last);
        // Load len of saved passes
        pass_len = await getStorage("len");
        if (pass_len === "undefined") {
            pass_last = 0;
            setStorage("len", 0);
        }
        // Create saved passes
        createPass(0, "Default pass");
        for (i = 1; i <= pass_len; i++) {
            let _ = await getStorage(i);
            if (_.includes("skip")) skip_lst.push(i);
            else createPass(i, getHouseTitle(_.split(",")) );
        }
        res(1);
    });
}

function createPass(id, data) {
    let list = $("#passlist")[0];
    let item = document.createElement("div");
    item.className = "passlist-item";
    item.textContent = data;
    item.setAttribute("value", id);
    $(item).click(function(event) {
        $(".radio").prop("checked", false);
        $(".passlist-item.active").removeClass("active");
        $(item).addClass("active").children().first().prop("checked", true);
        switchPass(id);
    });
    
    let radio = document.createElement("input");
    $(radio).trigger("click");
    if (pass_last == id) {
        $(".passlist-item.active").removeClass("active").children().first().prop("checked", false);
        $(item).addClass("active");
        radio.checked = true;
    }
    radio.className = "radio";
    radio.type = "radio";
    item.append(radio);
    
    if (id > 0) {
        let del = document.createElement("div");
        del.className = "delete";
        $(del).click(function(event) {
            $(".passlist-item.active").remove();
            setStorage(id, "skip");
            $(".passlist-item[value='0']").click();
        });
        item.append(del);
    }
    
    try {
        list.append(item);
    } catch {
        list = $("#passlist")[0];
        list.append(item);
    }
}

async function switchPass(id) {
    setStorage("pass_last", id);
    if (!id) {
        pass_img.hide();
        $(".abs#name span, .abs#house").text("");
    } else {
        let data = await getStorage(id);
        data = data.split(",");
        for (i = 0; i < 3; i++)
            $(`.abs#name span:eq(${i})`).text(data[i]);
        $(".abs#house").text(data[3]);
        pass_img.show();
    }
}

function setStorage(key, value) {
    let obj = new Object();
    obj[key] = String(value);
    chrome.storage.local.set(obj, () => {
        //console.log("Value of", key, "is set to", value);
    });
}

async function getStorage(key) {
    key = String(key);
    return new Promise( (resolve) => {
        chrome.storage.local.get([key], result => {
            //console.log( "Value of", key, "currently is", String(result[key]) );
            resolve( String(result[key]) );
        });
    });
}