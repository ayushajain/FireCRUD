"use strict"

/**
 * A CRUD interface for Firebase to manage clients/users
 * @class FireCRUD
 * @constructor Creates an instance of FireCRUD
 * @param {String} firebaseUserURL - the link to the user branch in the Firebase.
 * @param {Object} columns - the organization of each of the columns.
 */
class FireCRUD {

	constructor(firebaseUserURL, columns, modal) {
		this.ref = new Firebase(firebaseUserURL);
		this.columns = columns;
		this.crud = this;
		this.useModal = modal;

		this.createTable();
		this.init();
	}

	init() {
		var crud = this;

		/**
		 * Main event listener that handles all major updates
		 * @event userChanges
		 */
		this.ref.on('value', function(snapshot) {

			//remove orginal client creation row
			$(".createclient-row").remove();

			snapshot.forEach(function(childSnapshot) {
				//append client data rows
				if ($("." + childSnapshot.key())[0] === undefined) {
					crud.createRow(childSnapshot.key(), true, childSnapshot.val())
				}
			});

			//append creation row
			crud.createRow("createclient-row", false, "")

		});

		/**
		 * Deletes the row when a user has been deleted
		 * @event userDeleted
		 */
		this.ref.on('child_removed', function(oldChildSnapshot) {
			$("." + oldChildSnapshot.key()).remove();
		});

		/**
		 * Deletes original copy of a row when a child has been edited (The edited version will be appended in another event listener)
		 * @event userEdited
		 */
		this.ref.on('child_changed', function(childSnapshot, prevChildKey) {
			console.log(childSnapshot.val());
			$("." + childSnapshot.key()).remove();
		});

		/**
		 * Handles deletion of a user in a row
		 * @event deletingClients
		 */
		$(document).on('click', '.deletebtn', function() {
			crud.deleteClients(this);
		});

		/**
		 * Handles editing of a user in a row
		 * @event editingClients
		 */
		$(document).on('click', '.editbtn', function() {
			crud.editClients(this);
		});

		/**
		 * Handles user creation
		 * @event createUser
		 */
		$(document).on('click', '#client-create', function() {
			crud.createUser();
		});

		/**
		 * Confirm deletion or editing event
		 * @event userDeletionEditing
		 */
		$(".finalEditDelete").click(function() {
			//retrieve user ID
			var userID = $(".finalEditDelete").attr('id').substring($(".finalEditDelete").attr('id').lastIndexOf("-") + 1);


			//delete all references of the user
			if ($(".finalEditDelete").attr('id').substring(0, $(".finalEditDelete").attr('id').indexOf("-")) == "delete") {
				$("." + userID).remove();
				console.log(userID);
				crud.ref.child(userID).remove();
			} else {
				crud.createUser(userID, true);
			}

			$('#modal').modal('hide');
		});
	}



	editClients(button) {
		var crud = this;
		var userID = $(button).attr('id').substring($(button).attr('id').lastIndexOf("-") + 1);

		if ($(button).attr('id').indexOf("edit") > -1) {
			if (crud.useModal) {
				//create form table to edit in the modal

				var userInfo = "<table>";

				for (var prop in crud.columns) {
					if (crud.columns[prop].type == "input") {
                        if(crud.columns[prop].editable)
                            userInfo += "<tr><td>" + crud.columns[prop].title + ": </td><td><input id='" + prop + "' value = '" + $("#" + prop + "-" + userID).val() + "'> </td></tr>"
                        else
                            userInfo += "<tr><td>" + crud.columns[prop].title + ": </td><td><input readonly id='" + prop + "' value = '" + $("#" + prop + "-" + userID).val() + "'> </td></tr>"
                    }else {
                        if(crud.columns[prop].editable)
						    userInfo += "<tr><td>" + crud.columns[prop].title + ": </td><td><select id='" + prop + "'><option value='' selected='selected' disabled='disabled'>--Select one--</option>";
                        else
                            userInfo += "<tr><td>" + crud.columns[prop].title + ": </td><td><select disabled='disabled' id='" + prop + "'>";

						for (var option in crud.columns[prop].options) {
							userInfo += "<option value='" + this.columns[prop].options[option] + "'>" + this.columns[prop].options[option] + "</option>";
						}
						userInfo += "</select></td></tr>"
					}
				}
				userInfo += "</table>"

				$("#user-info-content").empty().append(userInfo);
				$(".finalEditDelete").text("Save").attr('id', "save-" + userID).removeClass("btn-danger").addClass("btn-primary");

				//reitterate through object to set value of select tags
				for (var prop in this.columns) {
					if (this.columns[prop].type == "select") {
						$("#" + prop).val($("#" + prop + "-" + userID).val());
					}
				}

			} else {
				//edit directly in the crud

				$("." + userID).children('td').each(function(index, element) {
					var input = $(element).children()[0];

					if ($(input).prop("tagName") != "BUTTON") {
						var prop = $(input).attr('id').substring(0, $(input).attr('id').indexOf('-'));

						if (crud.columns[prop].editable) $(input).attr("readonly", false).attr('disabled', false);

						if ($(input).prop("tagName") == "INPUT" || $(input).prop("tagName") == "SELECT") //add highlight to selections
						$(input).removeClass("defaultInput").addClass("editInput");
					}
				});

				$(button).text("Save").attr('id', ("save-" + userID));
			}

		} else if ($(button).attr('id').indexOf("save") > -1) {
			//WARNING: nothing in this loop will run if useModal is true

			var newUserID = $("#id-" + userID).val(); ////////////////////////////////////////////

			$("." + userID).children('td').each(function(index, element) {

				var input = $(element).children()[0];
				var origClassName = $(input).attr('id');
				var newClass = origClassName.substring(0, origClassName.lastIndexOf("-")) + "-" + newUserID;

				if ($(input).prop("tagName") == "INPUT" || $(input).prop("tagName") == "SELECT") //disable highlight and make readonly
				$(input).attr("readonly", true).attr('disabled', true).removeClass("editInput").addClass("defaultInput");

				$(input).attr('id', newClass)

			});

			crud.createUser(newUserID, true);
			$(button).text("Edit").attr('id', "edit-" + $("#id-" + newUserID).val());
		}

	}


	deleteClients(button) {
		var crud = this;
		var userID = $(button).attr('id').substring($(button).attr('id').lastIndexOf("-") + 1);
		var userInfo = "";

		//add user info
		for (var prop in crud.columns) {
			userInfo += "<p>" + crud.columns[prop].title + ": " + $("#" + prop + "-" + userID).val() + "</p>";
		}

		$("#user-info-content").empty().append(userInfo);
		$(".finalEditDelete").text("Delete").attr('id', "delete-" + userID).removeClass("btn-primary").addClass("btn-danger");

	}

	createTable() {
		//creates table
		$(document.body).append("<table class='client-table'>" +
			"<tr class='static-header'>" +
			"</tr>" +
			"</table>");

		//creates title row
		var titleRow = "<tr class='title-row'>"
		for (var prop in this.columns) {
			titleRow += "<td><input readonly type='text' class='title' value='" + this.columns[prop].title + "'></td>"
		}
		titleRow += "</tr>"

		$(".client-table tbody").append(titleRow);
	}

	/**
	 * Adds a user to the firebase user branch
	 * @function createUser
	 * @param {string} userId - Optional, the ID used to identify the user
	 */
	createUser(userID) {
		console.log(userID);
		var crud = this;
		var userInfo = {};

		for (var info in crud.columns) {
			var reference = crud.columns[info].ref;
			if (userID) {
				console.log(crud.useModal)
				if (crud.useModal) {
					if (crud.columns[info].type == "input") {
						userInfo[reference] = $("#" + info).val()
					} else {
						userInfo[reference] = $("#" + info + " option:selected").text();
					}
				} else {
					if (crud.columns[info].type == "input") {
						userInfo[reference] = $("#" + info + "-" + userID).val()
					} else {
						userInfo[reference] = $("#" + info + "-" + userID + " option:selected").text();
					}
				}
			} else {
				if (crud.columns[info].type == "input") {
					userInfo[reference] = $("#" + info + "-create").val()
				} else {
					userInfo[reference] = $("#" + info + "-create option:selected").text();
				}
			}
		}

		if (!userID || userID == "") {
			userID = crud.generateID(40);
		}

		this.ref.child(userID).set(userInfo);
	}


	createRow(key, readOnly, snapval) {
		console.log(snapval)

		var newTableRow = "<tr class='" + key + "'>";
		for (var prop in this.columns) {

			//User rows
			if (readOnly) {

				if (this.columns[prop].type == "select") {
					newTableRow += "<td>" +
						"<select class='defaultInput' id ='" + prop + "-" + key + "'><option value='' selected='selected' disabled='disabled'>--Select one--</option>";

					for (var option in this.columns[prop].options) {
						newTableRow += "<option value='" + this.columns[prop].options[option] + "'>" + this.columns[prop].options[option] + "</option>";
					}

					newTableRow += "</select>" +
						"</td>";
				} else if (this.columns[prop].type == "input") {

					if (this.columns[prop].ref == "key") {

						//key column
						newTableRow += "<td>" +
							"<input readonly type='text' class='defaultInput' id ='" + prop + "-" + key + "' value='" + key + "'>" +
							"</td>"
					} else {

						//client column
						newTableRow += "<td>" +
							"<input readonly class='defaultInput' id ='" + prop + "-" + key + "' value='" + snapval[this.columns[prop].ref] + "'>" +
							"</td>"
					}
				}
			}
			//Creation rows
			else {
				if (this.columns[prop].type == "select") {
					newTableRow += "<td>" +
						"<select class='defaultInput' id ='" + prop + "-create'><option value='' selected='selected' disabled='disabled'>--Select one--</option>";

					for (var option in this.columns[prop].options) {
						newTableRow += "<option value='" + this.columns[prop].options[option] + "'>" + this.columns[prop].options[option] + "</option>";
					}

					newTableRow += "</select>" +
						"</td>";
				} else if (this.columns[prop].type == "input") {
					newTableRow += "<td>" +
						"<input class='defaultInput' id ='" + prop + "-create'>" +
						"</td>"
				}

			}

		}

		//add buttons
		if (readOnly) {
			newTableRow += "<td>";

			//make the edit button a data toggle if an edit modal is to be created
			if (this.useModal) newTableRow += "<button id='edit-" + key + "' data-toggle='modal' data-target='#modal' class='btn btn-primary editbtn'>Edit</button>";
			else newTableRow += "<button id='edit-" + key + "' class='btn btn-primary editbtn'>Edit</button>";

			newTableRow += "<button id='delete-" + key + "' data-toggle='modal' data-target='#modal' class='btn btn-danger deletebtn'>Delete</button>" + "</td>"

		} else {
			newTableRow += "<td>" +
				"<button id='client-create' class='btn btn-success rowbtn' >Create</button>" +
				"</td>"
		}

		//append
		$(".client-table tbody").append(newTableRow);

		//reitterate through columns and set drowpdowns to firebase Value
		for (var prop in this.columns) {
			if (this.columns[prop].type == "select") {
				$("#" + prop + "-" + key).val(snapval[this.columns[prop].ref]).attr('disabled', true);
			}
		}

	}

	/**
	 * Generates a random user ID
	 * @function generateID
	 * @param {integer} idLength - the length of the ID that is generated (The larger the length, the more secure the users' branch is)
	 * @return {string} id - the ID that the user will be referenced by in Firebase
	 */
	generateID(idLength) {
		var id = "";
		for (var i = 0; i < idLength; i++) {
			var set = Math.round(Math.random() * 2)
			var randChar;

			if (set == 0) randChar = Math.round(Math.random() * 9) + 48;
			else if (set == 1) randChar = Math.round(Math.random() * 25) + 65;
			else randChar = Math.round(Math.random() * 25) + 97;

			id += String.fromCharCode(randChar);
		}

		return id;
	}
}
