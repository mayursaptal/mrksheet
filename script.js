const ipc = require('electron').ipcRenderer;
const buttonCreated = document.getElementById('button-created-id');
const buttonCreatedPdf = document.getElementById('button-created-pdf');
const privewIfarme = document.getElementById('privew-ifarme');
var fs = require('fs');
var pdf = require('html-pdf');
const path = require('path')
privewIfarme.src = path.resolve('markseet.html');
if (buttonCreated) {
    buttonCreated.addEventListener('click', function (event) {
        ipc.send('open-file-dialog-for-file')
    });

    ipc.on('selected-file', function (event, result) {
        var html = null;
        for (i in result) {
            if (Object.keys(result[i]).length != 0) {
                for (j in result[i]) {
                    if (j == 0) {
                        var heading = result[i][j];
                        continue;
                    }
                    if (j == 1) {
                        var extrafields = result[i][j];
                        continue;
                    }
                    if (html == null) {
                        html = createHtml(result[i][j], heading, extrafields);
                    } else {
                        html += createHtml(result[i][j], heading, extrafields);
                    }

                }
            }


        }

        fs.writeFile('markseet.html', html, function (err) {
            if (err) throw err;
            console.log('Saved!');
            privewIfarme.src = path.resolve('markseet.html');
        });
    });
}

buttonCreatedPdf.addEventListener('click', function (event) {
    try {
        var html = fs.readFileSync('markseet.html', 'utf8');
        var options = { format: 'A4', zoomFactor: 1, width: '8.27in', height: '11.69in' };
        pdf.create(html, options).toFile('marksheet.pdf', function (err, res) {
            if (err) return console.log(err);
            console.log(res);

            var link = document.createElement('a');
            document.body.appendChild(link);
            link.href = res.filename;
            link.click();
        });
    } catch (err) {
        console.log(err);
    }
});

function createHtml(htmljson, heading, extrafields) {
    var count = Object.keys(heading).length;
    var html = '<style>body{padding:0px; margin : 0px ; text-aling:center; } td{padding: 0px !important; text-align: left; padding-left:20px; width:10%   }  .container{width: 790px; height: 1122px ; padding:0px; margin:0px; border: 1px solid ; padding-top: 120px ;     line-height: 2; margin : 0 auto ; padding-left:100px; font-size:14px;     font-weight: 600;    }</style>   <div class="main "><table class ="container">';
    var i = 0;
    for (k in htmljson) {



        if (i > 3 && i < (count - 8)) {
            if (heading[k] == null || heading[k] == 'null') {
                html += '<tr><td colspan="2" > ' + '' + '</td><td>' + '' + ' </td> <td>' + '' + '</td></tr>';

            } else {
                html += '<tr><td colspan="2" > ' + heading[k] + ':</td><td>' + extrafields[k] + ' </td> <td>' + htmljson[k] + '</td></tr>';

            }
        } else {
            if (k == 'A') {
                html += '<tr><td colspan="5">' + htmljson[k] + ' </td></tr>';
                html += '<tr><td colspan="3">' + extrafields['B'] + ' </td><td colspan="2">' + extrafields['C'] + ' </td></tr>';
            }
            else if (k == 'D') {
                html += '<tr><td colspan="3" >' + htmljson[k] + ' </td>';

            }
            else if (k == 'E') {
                html += '<td  colspan="5"> DIV: ' + htmljson[k] + ' </td></tr>';

            }
            else if (k == 'F') {
                html += '<td  colspan="5"> ' + htmljson[k] + ' </td></tr>';

            }
            else if (i == (count - 6)) {
                html += '<td>' + extrafields[k] + ' </td><td>' + htmljson[k] + '</td>';

            }
            else if (i == (count - 7)) {
                if (htmljson[k] == 'AB') {
                    html += '<td>' + (htmljson[k]) + '</td>';
                } else {
                    html += '<td>' + parseFloat(htmljson[k]).toFixed(2) + '</td>';
                }


            } else if (i == (count - 4) || i == (count - 3)) {
                html += '<tr><td>' + extrafields[k] + ' </td><tr>';
            }
            else {
                html += '<td >' + htmljson[k] + ' </td>';

            }

        }

        i++;
    }
    html += '</table></div>';
    return html;
}