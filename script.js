
var url           = "http://restful-demo.appspot.com";
var async         = true;
var listContainer = document.getElementById("students");
var loadLink      = document.getElementById("load"); // link to load the students
var addLink       = document.querySelector('form#add-student input[type=submit]'); // link to add a student
var birthDate     = document.querySelector("input[name=birthDate]");
var firstName     = document.querySelector("input[name=firstName]");
var lastName      = document.querySelector("input[name=lastName]");
var idBooster     = document.querySelector("input[name=idBooster]");

var createDateObjectFromHtmlInput = function (inputDate) {
    var year  = parseInt(inputDate.substr(0,4));
    var month = parseInt(inputDate.substr(5,2));
    var day   = parseInt(inputDate.substr(8,2));

    return new Date(year, month, day, 0, 0, 0, 0);
};

Date.prototype.getIsoUtcDateTime = function () {
    var pad = function (val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len) val = "0" + val;
        return val;
    };

    return this.getFullYear() + '-' + pad(this.getMonth()) + '-' + pad(this.getDate()) + 'T00:00:00.604Z';
};

// XHR init
var xhr         = null;
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
} else if (window.ActiveXObject) {
    // code for IE6, IE5
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
} else {
    alert('Perhaps your browser does not support XMLHttpRequest?');
}

var getStudents = function(event) {
    event.preventDefault();

    xhr.open('GET', url + "/students", async);
    xhr.setRequestHeader('Content-Type', 'application/xml');
    xhr.setRequestHeader('Accept', 'application/xml');
    //xhr.setRequestHeader('Authorization', 'Basic token');
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) { // success
            var result = xhr.responseXML;
            var students = result.getElementsByTagName("student");
            var listElement = document.createElement("ul");
            listContainer.innerHTML = ""; // clear the list
            listContainer.appendChild(listElement);

            for(var i = 0; i < students.length; i++){
                var student     = students[i];
                var firstName   = student.getElementsByTagName("firstName")[0].childNodes[0].nodeValue;
                var lastName    = student.getElementsByTagName("lastName")[0].childNodes[0].nodeValue;
                var idBooster   = student.getElementsByTagName("idBooster")[0].childNodes[0].nodeValue;

                var listItem    = document.createElement("li");

                var deleteLink  = document.createElement("a");
                deleteLink.setAttribute("href", "#");
                deleteLink.setAttribute("data-id", idBooster);
                deleteLink.innerText = "(x)";
                deleteLink.addEventListener('click', deleteStudent);

                listItem.innerText = firstName + " " + lastName + "(" + idBooster + ") ";
                listItem.appendChild(deleteLink);

                listElement.appendChild(listItem);
            }
        }
    };
};

var deleteStudent = function(event) {
    event.preventDefault();

    var idBooster = this.getAttribute("data-id");

    xhr.open('DELETE', url + "/students/" + idBooster, async);
    xhr.setRequestHeader("Content-type","application/xml; charset=utf-8");
    //xhr.setRequestHeader('Authorization', 'Basic token');
    xhr.send(null);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) { // success
            console.log(xhr.responseText);
        } else {
            console.log(xhr.responseText);
        }
    };
};

var addStudent = function(event) {
    event.preventDefault();
    var birthFormattedDate = createDateObjectFromHtmlInput(birthDate.value);

    xhr.open('POST', url + "/students", async);
    xhr.setRequestHeader("Content-type","application/xml; charset=utf-8");
    //xhr.setRequestHeader('Authorization', 'Basic token');
    xhr.send("<student>\
        <birthDate>" + birthFormattedDate.getIsoUtcDateTime() + "</birthDate>\
        <firstName>" + firstName.value + "</firstName>\
        <idBooster>" + idBooster.value + "</idBooster>\
        <lastName>" + lastName.value + "</lastName>\
    </student>");
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) { // success
            console.log(xhr.responseText);
        } else {
            console.log(xhr.responseText);
        }
    };
};

loadLink.addEventListener('click', getStudents);
addLink.addEventListener('click', addStudent);
loadLink.click();
