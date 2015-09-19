"use strict";


/**
 * @class FireCRUD
 * @constructor Creates an instance of FireCRUD
 * @param {String} firebaseUserURL - the link to the user branch in the Firebase.
 * @param {Object} columns - the organization of each of the columns.
 */
class FireCRUD {

    constructor(firebaseUserURL, columns){
        this.ref = new Firebase(firebaseUserURL);
        this.columns = columns;
        this.crud = this;

        this.init();
    }

    init(){
        var crud = this;

        /**
         * Main event listener that handles all major updates
         * @event userChanges
         */
        this.ref.on('value', function(snapshot){

            //remove orginal client creation row
            $(".createclient-row").remove();

            snapshot.forEach(function(childSnapshot){
                //append client data rows
                if($("." + childSnapshot.key())[0] === undefined){
                    crud.createRow(childSnapshot.key(), crud.columns, true, childSnapshot.val())
                }
            });

            //append creation row
            crud.createRow("createclient-row", crud.columns, false, "")


        });

        /**
         * Deletes the row when a user has been deleted
         * @event userDeleted
         */
        this.ref.on('child_removed', function(oldChildSnapshot){
            $("." + oldChildSnapshot.key()).remove();
        });

        /**
         * Deletes original copy of a row when a child has been edited (The edited version will be appended in another event listener)
         * @event userEdited
         */
        this.ref.on('child_changed', function(childSnapshot, prevChildKey){
            $("." + childSnapshot.key()).remove();
        });

        /**
         * Handles editing and deletion of a user in a row
         * @event editDeleteClients
         */
        $(document).on('click', '.rowbtn', function(){
            crud.editDeleteClients(this);
        });

        /**
         * Handles user creation
         * @event createUser
         */
        $(document).on('click', '#client-create', function(){
            crud.createUser();
        });

        /**
         * Confirm deletion event
         * @event userDeletion
         */
        $(".finalDelete").click(function(){
            //retrieve user ID
            var userID = $(".finalDelete").attr('id').substring($(".finalDelete").attr('id').lastIndexOf("-") + 1);

            //delete all references of the user
            $("." + userID).remove();
            crud.deleteUser(userID);
            $('#deleteModal').modal('hide');
        });
    }

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    editDeleteClients(button){
        var crud = this;
        console.log("button pressed")

        var licenseID = $(button).attr('id').substring($(button).attr('id').lastIndexOf("-") + 1);

        if($(button).attr('id').indexOf("delete") > -1){      //toggle modal for deleting client

            for(var prop in crud.columns){
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
            crud.createUser();

            $(button).text("Edit").attr('id', "edit-" + $("#licenseid-" + newLicenseID).val()); //set to new licenseid value
        }

    }
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    createRow(key, columns, readOnly, snapval){
        console.log(snapval)
        var newTableRow = "<tr class='" + key + "'>";
        for(var prop in columns){

            //User rows
            if(readOnly){

                if(columns[prop].type == "select"){
                    newTableRow += "<td>"+
                        "<select class='defaultInput' id ='" + prop + "-" + key + "'>";

                    for(var option in columns[prop].options){
                        newTableRow += "<option value='" + columns[prop].options[option] + "'>" + columns[prop].options[option] + "</option>";
                    }

                    newTableRow += "</select>" +
                        "</td>";
                }else if(columns[prop].type == "input"){
                    if(columns[prop].ref == "key"){

                        //key column

                        console.log("asdasd");
                        newTableRow += "<td>"+
                            "<input readonly class='defaultInput' id ='" + prop + "-" + key + "' value='" + key + "'>"+
                        "</td>"
                    }else{

                        //client column


                        newTableRow += "<td>"+
                            "<input readonly class='defaultInput' id ='" + prop + "-" + key + "' value='" + snapval[columns[prop].ref] + "'>"+
                        "</td>"
                    }
                }
            }
            //Creation rows
            else{
                if(columns[prop].type == "select"){
                    newTableRow += "<td>"+
                        "<select class='defaultInput' id ='" + prop + "-create'>";

                    console.log(columns[prop].options)
                    for(var option in columns[prop].options){
                        newTableRow += "<option value='" + columns[prop].options[option] + "'>" + columns[prop].options[option] + "</option>";
                    }

                    newTableRow += "</select>" +
                        "</td>";
                }else if(columns[prop].type == "input"){
                    newTableRow += "<td>"+
                        "<input class='defaultInput' id ='" + prop +"-create'>"+
                    "</td>"
                }

            }

        }

        //add buttons
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

        //append
        $(".client-table tbody").append(newTableRow);

        //reitterate through columns and set drowpdowns to firebase Value
        for(var prop in columns){
            $("#" + prop + "-" + key).val(snapval[columns[prop].ref])
        }

    }


    /**
     * Adds a user to the firebase user branch
     * @function createUser
     * @param {object} userInfo - an object containing the information regarding the user
     */
    createUser(){
        var crud = this;
        var userInfo = {};

        for(var info in crud.columns){
            var reference = crud.columns[info].ref;

            if(crud.columns[info].type == "input"){
                 userInfo[reference] = $("#" + info + "-create").val()
            }else{
                userInfo[reference] = $("#" + info + "-create option:selected").text();
            }
        }

        if(!userInfo.userID || userInfo.userID == ""){
            userInfo.userID = crud.generateID(40);
        }
        this.ref.child(userInfo.userID).set(userInfo);
    }

    /**
     * Deletes a user from firebase user branch
     * @function deleteUser
     * @param {string} userID - the user's ID
     * @param {Function} callback - [Optional] a callback method to handle user deletion
     */
     deleteUser(userID, callback){
         this.ref.child(userID).remove();
         if(typeof callback == "function"){
             callback();
         }
     }


    /**
     * Generates a random user ID
     * @function generateID
     * @param {integer} idLength - the length of the ID that is generated (The larger the length, the more secure the users' branch is)
     * @return {string} id - the ID that the user will be referenced by in Firebase
     */
    generateID(idLength){
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
}
