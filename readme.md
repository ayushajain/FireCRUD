## Classes
<dl>
<dt><a href="#Creates an instance of FireCRUD">Creates an instance of FireCRUD</a></dt>
<dd><p>FireCRUD</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#createUser">createUser(userId)</a></dt>
<dd><p>Adds a user to the firebase user branch</p>
</dd>
<dt><a href="#generateID">generateID(idLength)</a> ⇒ <code>string</code></dt>
<dd><p>Generates a random user ID</p>
</dd>
</dl>
## Events
<dl>
<dt><a href="#event_userChanges">"userChanges"</a></dt>
<dd><p>Main event listener that handles all major updates</p>
</dd>
<dt><a href="#event_userDeleted">"userDeleted"</a></dt>
<dd><p>Deletes the row when a user has been deleted</p>
</dd>
<dt><a href="#event_userEdited">"userEdited"</a></dt>
<dd><p>Deletes original copy of a row when a child has been edited (The edited version will be appended in another event listener)</p>
</dd>
<dt><a href="#event_deletingClients">"deletingClients"</a></dt>
<dd><p>Handles deletion of a user in a row</p>
</dd>
<dt><a href="#event_editingClients">"editingClients"</a></dt>
<dd><p>Handles editing of a user in a row</p>
</dd>
<dt><a href="#event_createUser">"createUser"</a></dt>
<dd><p>Handles user creation</p>
</dd>
<dt><a href="#event_userDeletionEditing">"userDeletionEditing"</a></dt>
<dd><p>Confirm deletion or editing event</p>
</dd>
</dl>
<a name="Creates an instance of FireCRUD"></a>
## Creates an instance of FireCRUD
FireCRUD

**Kind**: global class  
<a name="new_Creates an instance of FireCRUD_new"></a>
### new Creates an instance of FireCRUD(firebaseUserURL, columns)
A CRUD interface for Firebase to manage clients/users


| Param | Type | Description |
| --- | --- | --- |
| firebaseUserURL | <code>String</code> | the link to the user branch in the Firebase. |
| columns | <code>Object</code> | the organization of each of the columns. |

<a name="createUser"></a>
## createUser(userId)
Adds a user to the firebase user branch

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| userId | <code>string</code> | Optional, the ID used to identify the user |

<a name="generateID"></a>
## generateID(idLength) ⇒ <code>string</code>
Generates a random user ID

**Kind**: global function  
**Returns**: <code>string</code> - id - the ID that the user will be referenced by in Firebase  

| Param | Type | Description |
| --- | --- | --- |
| idLength | <code>integer</code> | the length of the ID that is generated (The larger the length, the more secure the users' branch is) |

<a name="event_userChanges"></a>
## "userChanges"
Main event listener that handles all major updates

**Kind**: event emitted  
<a name="event_userDeleted"></a>
## "userDeleted"
Deletes the row when a user has been deleted

**Kind**: event emitted  
<a name="event_userEdited"></a>
## "userEdited"
Deletes original copy of a row when a child has been edited (The edited version will be appended in another event listener)

**Kind**: event emitted  
<a name="event_deletingClients"></a>
## "deletingClients"
Handles deletion of a user in a row

**Kind**: event emitted  
<a name="event_editingClients"></a>
## "editingClients"
Handles editing of a user in a row

**Kind**: event emitted  
<a name="event_createUser"></a>
## "createUser"
Handles user creation

**Kind**: event emitted  
<a name="event_userDeletionEditing"></a>
## "userDeletionEditing"
Confirm deletion or editing event

**Kind**: event emitted  
