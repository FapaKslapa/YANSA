window.onload = async () => {
    if (sessionStorage.getItem("token") !== null) {
        await render(document.getElementById("noteContainer"), document.getElementById("pencil"));
    } else {
        window.location.href = "./accedi.html";
    }
};

document.getElementById("searchButton").onclick = () => {
    window.location.href = "./ricerca.html";
}

const pickData = async () => {
    const username = sessionStorage.getItem("username");
    let rsp = await fetch("/notesAccount/" + username, {
        method: "GET", headers: {
            "Content-Type": "application/json", Authorization: sessionStorage.getItem("token"),
        },
    });
    rsp = await rsp.json();
    console.log(rsp);
    return rsp;
};

const pickComponent = async (url) => {
    let rsp = await fetch(url, {
        method: "GET", headers: {
            "Content-Type": "application/json", Authorization: sessionStorage.getItem("token"),
        },
    });
    rsp = await rsp.json();
    rsp = JSON.parse(rsp.Result);
    //console.log(rsp);
    return rsp;
};

const prova = async () => {
    let value = await pickData();
    const tutto = [];
    for (let index = 0; index < value.length; index++) {
        let obj = {
            titolo: value[index].nome, id: value[index].id,
        };
        let res = await pickComponent("/getNote/" + value[index].nome);
        obj["data"] = res.dateCreation;
        obj["autore"] = res.author;
        let sum = "";
        res.data.blocks.forEach((element) => {
            if (element.type === "paragraph") {
                sum += element.data.text;
            }
        });
        obj["contenuto"] = sum;
        tutto.push(obj);
    }
    return tutto;
};
let template = `        
    <div class="col-auto mt-3">
    <div class="card" id="%ID">
      <div class="tools justify-content-end"></div>
      <div class="card__content">
        <div class="container">
          <div class="row justify-content-between">
          <div class="col-auto">
            <h2 class="text-white">%TITOLO</h2>
            </div>
            <div class="col-auto">
            <p class="text-white">%DATA</p>
            </div>
            </div>
              <div class="row justify-content-between">
                  <div class="col-auto text-start">
                  <p class="text-white text-decoration-underline">%AUTORE</p>
                  </div>
                  </div>
              <p class="text-white %TRONCA">%CONTENUTO</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
const render = async (div, div2) => {
    div.innerHTML = "";
    const listino = await prova();
    let output = "";
    let controllino = 1;
    listino.forEach((appunto) => {
        let troncatura = "";
        if (controllino === 1) {
            troncatura = "truncate-md";
        } else if (controllino === 2) {
            troncatura = "truncate-xl";
        } else if (controllino === 3) {
            troncatura = "truncate-sm";
        }
        let html;
        html = template.replace("%TITOLO", appunto.titolo);
        html = html.replace("%AUTORE", appunto.autore);
        html = html.replace("%DATA", dataIta(appunto.data.substring(0, 10)));
        html = html.replace("%CONTENUTO", appunto.contenuto);
        html = html.replace("%TRONCA", troncatura);
        html = html.replace("%ID", appunto.id);
        output += html;
        if (controllino === 1) {
            controllino = 2;
        } else if (controllino === 2) {
            controllino = 3;
        } else if (controllino === 3) {
            controllino = 1;
        }
    });
    if (listino.length === 0) {
        div.classList.add("d-none");
        div2.classList.remove("d-none");
    } else {
        div.classList.remove("d-none");
        div2.classList.add("d-none");
    }
    div.innerHTML = output;
    listino.forEach((appunto) => {
        document.getElementById(appunto.id).addEventListener('click', function () {
            sessionStorage.setItem("noteName", appunto.titolo);
            sessionStorage.setItem("noteAuthor", appunto.autore);
            if (appunto.autore == sessionStorage.getItem("username")) {
                sessionStorage.setItem("editorType", "modify");
            } else {
                sessionStorage.setItem("editorType", "view");
            }
            window.location.href = "./editor.html";
        });
    });
};

const dataIta = (dataEstera) => {
    let data = new Date(dataEstera);
    let giorno = data.getDate();
    let mese = data.getMonth() + 1;
    let anno = data.getFullYear();
    return giorno + "/" + mese + "/" + anno;
};

document.getElementById("newNote").onclick = () => {
    sessionStorage.setItem("editorType", "new");
    window.location.href = "./editor.html"
}

document.getElementById('accountButton').onclick = () => {
    window.location.href = './account.html';
};
document.getElementById('homeButton').onclick = () => {
    window.location.href = './home.html';
}
let popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
let popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl, {
        sanitize: false, customClass: 'green-popover'
    })
})

popoverTriggerList.forEach(function (popoverTriggerEl) {
    popoverTriggerEl.addEventListener('shown.bs.popover', function () {
        const logout = document.getElementById("logout");

        logout.onclick = () => {
            console.log("logout");
            sessionStorage.clear();
            window.location.href = "./accedi.html";
        }

        // Aggiungi un listener per l'evento click del documento
        document.addEventListener('click', function (e) {
            // Se il click non è sul popover o sui suoi trigger, nascondi il popover
            if (!popoverTriggerEl.contains(e.target)) {
                let popover = bootstrap.Popover.getInstance(popoverTriggerEl);
                popover.hide();
            }
        });
    })
})

let darkModeCheckbox = document.getElementById('darkMode');
let darkModeState = sessionStorage.getItem('darkMode');
let body = document.body;
let html = document.documentElement;
let offcanvasElements = document.querySelectorAll('.offcanvas');
if (darkModeState === 'true') {
    darkModeCheckbox.checked = true;
    let tabs = document.querySelectorAll('.tab');
    let navCards = document.querySelectorAll('.navigation-card');
    let bgDarkLightElements = document.querySelectorAll('.bg-dark-light');

    tabs.forEach(tab => {
        tab.classList.remove('tab');
        tab.classList.add('tab-dark');
    });

    navCards.forEach(navCard => {
        navCard.classList.remove('navigation-card');
        navCard.classList.add('navigation-card-dark');
    });
    offcanvasElements.forEach(offcanvasElement => {
        offcanvasElement.classList.replace('offcanvas-light', 'offcanvas-dark');
    });

    bgDarkLightElements.forEach(element => {
        element.classList.replace('bg-dark-light', 'bg-dark');
    });
    body.classList.remove('body');
    body.classList.add('body-dark');

    html.setAttribute('data-bs-theme', 'dark');
} else if (darkModeState === 'false') {
    darkModeCheckbox.checked = false;
    let darkTabs = document.querySelectorAll('.tab-dark');
    let darkNavCards = document.querySelectorAll('.navigation-card-dark');
    let bgDarkElements = document.querySelectorAll('.bg-dark');

    darkTabs.forEach(tab => {
        tab.classList.remove('tab-dark');
        tab.classList.add('tab');
    });

    darkNavCards.forEach(navCard => {
        navCard.classList.remove('navigation-card-dark');
        navCard.classList.add('navigation-card');
    });

    bgDarkElements.forEach(element => {
        element.classList.replace('bg-dark', 'bg-dark-light');
    });

    body.classList.remove('body-dark');
    body.classList.add('body');
    offcanvasElements.forEach(offcanvasElement => {
        offcanvasElement.classList.replace('offcanvas-dark', 'offcanvas-light');
    });

    html.setAttribute('data-bs-theme', 'light');
}

document.getElementById('darkMode').addEventListener('change', function () {
    let body = document.body;
    let html = document.documentElement;
    let offcanvasElements = document.querySelectorAll('.offcanvas');

    if (this.checked) {
        sessionStorage.setItem('darkMode', 'true');
        let tabs = document.querySelectorAll('.tab');
        let navCards = document.querySelectorAll('.navigation-card');
        let bgDarkLightElements = document.querySelectorAll('.bg-dark-light');

        tabs.forEach(tab => {
            tab.classList.remove('tab');
            tab.classList.add('tab-dark');
        });

        navCards.forEach(navCard => {
            navCard.classList.remove('navigation-card');
            navCard.classList.add('navigation-card-dark');
        });
        offcanvasElements.forEach(offcanvasElement => {
            offcanvasElement.classList.replace('offcanvas-light', 'offcanvas-dark');
        });

        bgDarkLightElements.forEach(element => {
            element.classList.replace('bg-dark-light', 'bg-dark');
        });
        body.classList.remove('body');
        body.classList.add('body-dark');

        html.setAttribute('data-bs-theme', 'dark');
    } else {
        sessionStorage.setItem('darkMode', 'false');
        let darkTabs = document.querySelectorAll('.tab-dark');
        let darkNavCards = document.querySelectorAll('.navigation-card-dark');
        let bgDarkElements = document.querySelectorAll('.bg-dark');

        darkTabs.forEach(tab => {
            tab.classList.remove('tab-dark');
            tab.classList.add('tab');
        });

        darkNavCards.forEach(navCard => {
            navCard.classList.remove('navigation-card-dark');
            navCard.classList.add('navigation-card');
        });

        bgDarkElements.forEach(element => {
            element.classList.replace('bg-dark', 'bg-dark-light');
        });

        body.classList.remove('body-dark');
        body.classList.add('body');
        offcanvasElements.forEach(offcanvasElement => {
            offcanvasElement.classList.replace('offcanvas-dark', 'offcanvas-light');
        });

        html.setAttribute('data-bs-theme', 'light');
    }
});