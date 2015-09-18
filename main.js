"use strict";
var ref = new Firebase("https://mednettest.firebaseio.com/");

//Property: element class reference
//Value: firebase reference
const clientColumns = {
    id: "client_id",
    name: "client_name",
    expirydate: "expiry_date",
    graceperiod: "grace_period",
    licenseid: "key",
    status: "status",
}

var createColumns = {
    id: "create",
    name: "create",
    expirydate: "create",
    graceperiod: "create",
    licenseid: "create",
    status: "create",
}

//on start and when a child has changed/been added
ref.child('licenses').on('value', function(snapshot){

    //remove orginal client creation row
    $(".createclient-row").remove();

    snapshot.forEach(function(childSnapshot){
        //append client data rows
        if($("." + childSnapshot.key())[0] === undefined){
            var clientRow = createRow(childSnapshot.key(), clientColumns, true, childSnapshot.val())
            $(".client-table tbody").append(clientRow);
        }
    });

    //append creation row
    var creationRow = createRow("createclient-row", createColumns, false, "")
    $(".client-table tbody").append(creationRow);

});

//update when a client has been deleted
ref.child('licenses').on('child_removed', function(oldChildSnapshot){
    console.log(oldChildSnapshot.key())
    $("." + oldChildSnapshot.key()).remove();
});

//update when a client has been edited
ref.child('licenses').on('child_changed', function(childSnapshot, prevChildKey){
    //console.log(childSnapshot.val().status)
    $("." + childSnapshot.key()).remove();
});

//edit/delete clients
$(document).on('click', '.rowbtn', function(){
    editDeleteClients(this);
});

//create clients
$(document).on('click', '#client-create',function(){
    createClient($("#id-create").val(), $("#name-create").val(), $("#expirydate-create").val(), parseInt($("#graceperiod-create").val()),"", "Active");
});

$(".finalDelete").click(function(){     //delete client
    var licenseID = $(".finalDelete").attr('id').substring($(".finalDelete").attr('id').lastIndexOf("-") + 1);
    $("." + licenseID).remove();
    deleteClient(licenseID);
    $('#deleteModal').modal('hide');
});

function editDeleteClients(button){
    console.log("button pressed")

    var licenseID = $(button).attr('id').substring($(button).attr('id').lastIndexOf("-") + 1);

    if($(button).attr('id').indexOf("delete") > -1){      //toggle modal for deleting client

        for(var prop in clientColumns){
            console.log("." + prop + "-" + licenseID)
            $(".delete-" + prop).text($("#" + prop + "-" + licenseID).val());
        }

        $(".finalDelete").attr('id', "delete-" + licenseID);

    }else if($(button).attr('id').indexOf("edit") > -1){      //turn on client editing

        $("." + licenseID).children('td').each(function(index, element){
            var input = $(element).children()[0];
            $(input).attr("readonly", false);

            if($(input).prop("tagName") == "INPUT")         //add highlight to selections
                $(input).removeClass("defaultInput").addClass("editInput");
        });

        $(button).text("Save").attr('id', ("save-" + licenseID));

    }else if($(button).attr('id').indexOf("save") > -1){      //update and toggle readonly

        var newLicenseID = $("#licenseid-" + licenseID).val();
        $("." + licenseID).children('td').each(function(index, element){

            var input = $(element).children()[0];
            var origClassName = $(input).attr('id');
            var newClass = origClassName.substring(0, origClassName.lastIndexOf("-") ) + "-" + newLicenseID;

            if($(input).prop("tagName") == "INPUT")         //disable highlight and make readonly
                $(input).attr("readonly", true).removeClass("editInput").addClass("defaultInput");


            $(input).attr('id', newClass)
            $("." + licenseID).removeClass(licenseID).addClass(newLicenseID);

        });

        //console.log($("#id-" + newLicenseID).val() + "  ,  " + newLicenseID)
        createClient($("#id-" + newLicenseID).val(), $("#name-" + newLicenseID).val(), $("#expirydate-" + newLicenseID).val(), parseInt($("#graceperiod-" + newLicenseID).val()), $("#licenseid-" + newLicenseID).val(), $("#status-" + newLicenseID).val())

        $(button).text("Edit").attr('id', "edit-" + $("#licenseid-" + newLicenseID).val()); //set to new licenseid value
    }

}

function createRow(key, columns, readOnly, snapval){
    console.log(snapval)
    var newTableRow = "<tr class='" + key + "'>";
    for(var prop in columns){
        if (columns.hasOwnProperty(prop)) {
            if(columns[prop] !== null && typeof columns[prop] === 'object'){        //if the key is an object (dropdown bar)

                newTableRow += "<td>"+
                    "<select readonly class='defaultInput' id ='" + prop + "-" + key + "'>";

                for(var options in columns[prop]){
                    newTableRow += "<option value='" + options + "'>" + columns[prop][options] + "</option>";
                }

                newTableRow += "</select>" +
                    "</td>";
            }else{

                if(readOnly){
                    if(columns[prop] == "key"){

                        //key column
                        newTableRow += "<td>"+
                            "<input readonly class='defaultInput' id ='" + prop + "-" + key + "' value='" + key + "'>"+
                        "</td>"
                    }else{

                        //client column
                        newTableRow += "<td>"+
                            "<input readonly class='defaultInput' id ='" + prop + "-" + key + "' value='" + snapval[columns[prop]] + "'>"+
                        "</td>"
                    }
                }else{

                    //creation column
                    newTableRow += "<td>"+
                        "<input class='defaultInput' id ='" + prop +"-create'>"+
                    "</td>"
                }
            }
        }
    }

    if(readOnly){

        //de
        newTableRow += "<td>"+
            "<button id='edit-" + key + "' class='btn btn-primary rowbtn'>Edit</button>"+
            "<button id='delete-" + key + "' data-toggle='modal' data-target='#deleteModal' class='btn btn-danger rowbtn'>Delete</button>"+
        "</td>"
    }else{
        newTableRow += "<td>"+
            "<button id='client-create' class='btn btn-success rowbtn' >Create</button>"+
        "</td>"
    }

    return newTableRow;
}

function createClient(clientID, clientName, expiryDate, gracePeriod, licenseID, statusAct){

    // console.log(clientID)
    // console.log(clientName)
    // console.log(expiryDate)
    // console.log(gracePeriod)
    // console.log(licenseID)
     console.log(statusAct)
    if(!licenseID || licenseID == ""){
        licenseID = generateID(40);
    }
    ref.child('licenses').child(licenseID).set(
        {
            client_id: clientID,
            client_name: clientName,
            expiry_date: expiryDate,
            grace_period: gracePeriod,
            status: statusAct
        }
    );
}

function checkExpiry(){
    var date = new Date();
    var today = date.getFullYear() + "-" + pad(date.getMonth()) + "-" + pad(date.getDate());
    console.log(today);


    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    }
}

checkExpiry();

function deleteClient(licenseID){
    ref.child('licenses').child(licenseID).remove();
}

function getClientData(licenseID){
    ref.child('licenses').child(licenseID).once("value", function(snapshot){
        return snapshot.val();
    });
}

function generateID(idLength){
    var id = "";
    for(var i = 0; i < idLength; i++){
        var set = Math.round(Math.random() * 2)
        var randChar;

        if(set == 0)
            randChar = Math.round(Math.random() * 9) + 48;
        else if(set == 1)
            randChar = Math.round(Math.random() * 25) + 65;
        else
            randChar = Math.round(Math.random() * 25) + 97;

        id += String.fromCharCode(randChar);
    }

    return id;
}
