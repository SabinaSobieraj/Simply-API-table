let SortingTable = function () {
    this.attachSorting();
};

SortingTable.prototype = {

    sortingNumbers: function (a, b) {//funkcja sortowania liczb
        return parseInt(a) > parseInt(b);
    },

    sortingTekst: function (a, b) {//funkcja sortowania tekstu
        return a > b;
    },

    checkItem: function (arrayDoSpr, wartosc) {//sprawdzenie czy nagłówek tabeli ma odpowiednią klase aby podpiąć odpowiednie sortowanie
        for (let i = 0; i < arrayDoSpr.length; i++)
            if (arrayDoSpr[i] === wartosc) return true;
        return false;
    },

    SetOrder: function (th) {
        th.order *= -1;
        th.sortTextNode.nodeValue = th.order < 0 ? '\u25B2' : '\u25BC';
    },

    ResetOrder: function (th) {
        th.sortTextNode.nodeValue = '';
        th.order = -1;
    },

    attachSorting: function () {
        let handlers = [['SortTekst', this.sortingTekst], ['SortLiczba', this.sortingNumbers]];

        for (let j = 0, tableElements = document.getElementsByTagName('table'); tableElm = tableElements[j]; j++) {
            for (let i = 0, ths = tableElm.getElementsByTagName('th'); th = ths[i]; i++) {
                for (let h = 0; h < handlers.length; h++) {
                    if (SortingTable.prototype.checkItem(th.className.split(" "), handlers[h][0])) {
                        th.columnIndex = i;
                        th.order = -1;
                        th.sortHandler = handlers[h][1];
                        th.onclick = function () {
                            SortingTable.prototype.sort(this);
                        }
                        let divNode = document.createElement('div');
                        let textNode = document.createTextNode('');
                        divNode.appendChild(textNode);
                        th.appendChild(divNode);
                        th.sortTextNode = textNode;
                    }
                }
            }
        }
    },

    sort: function (header) {
        this.SetOrder(header);
        const table = header.parentNode.parentNode;
        for (let i = 0, th, ths = table.getElementsByTagName('th'); th = ths[i]; i++)
            if (th.order && th !== header)
                this.ResetOrder(th);
        const rows = table.getElementsByTagName('tr');
        let tempRows = [];
        for (let i = 1, tr; tr = rows[i]; i++) {
            tempRows[i - 1] = tr
        }
        tempRows.sort(function (a, b) {
            return header.order *
                (header.sortHandler(
                    a.getElementsByTagName('td')[header.columnIndex].innerHTML,
                    b.getElementsByTagName('td')[header.columnIndex].innerHTML) ? 1 : -1)
        });
        for (let i = 0; i < tempRows.length; i++) {
            table.appendChild(tempRows[i]);
        }
    },

    getDataFromURL: function (url) {
        fetch(url)
            .then(res => res.json())
            .then((out) => {

                this.tableGeneratorJSON(out);
                // console.log('Output: ', out);//utworzenie tabeli
            }).catch(err => console.error(err));
    },

    tableGeneratorJSON: function (data) {
        let col = [];
        for (let i = 0; i < data.length; i++) {
            for (let key in data[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // wygenerowanie elemntu HTML tabel
        const table = document.createElement("table");

        // Utwórz wiersz nagłówka tabeli, używając wyodrębnionych nagłówków powyżej.
        let tr = table.insertRow(-1);                   // wiersz

        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th");      // nagłóek

            th.innerHTML = col[i];

            if (col[i] === "id") {// atrybuty potrzebne do sortowania
                th.setAttribute("class", "SortLiczba");
                th.setAttribute("onclick", "tabelaNewSort.attachSorting()");
            } else {
                th.setAttribute("class", "SortTekst");
            }
            tr.appendChild(th);
        }

        // dodaj dane json do tabeli jako wiersze.
        for (let i = 0; i < data.length; i++) {

            tr = table.insertRow(-1);

            for (let j = 0; j < col.length; j++) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = data[i][col[j]];
            }
        }

        // Teraz dodaj nowo utworzoną tabelę z danymi json do kontenera.
        let divShowData = document.getElementById('showData');
        divShowData.innerHTML = "";
        divShowData.appendChild(table);

        // paginator({
        //     table: document.getElementById("showData").getElementsByTagName("table")[0],
        //     box: document.getElementById("index_native"),
        //     active_class: "color_page"
        // });
    },

    findText: function () {
        let input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("showData").getElementsByTagName("table")[0];
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

};

let tabelaNewSort = new SortingTable();
