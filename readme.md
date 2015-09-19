## Classes
<dl>
<dt><a href="#Creates an instance of FireCRUD">Creates an instance of FireCRUD</a></dt>
<dd><p>FireCRUD</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#createUser">createUser(userInfo)</a></dt>
<dd><p>Adds a user to the firebase user branch</p>
</dd>
<dt><a href="#deleteUser">deleteUser(userID, callback)</a></dt>
<dd><p>Deletes a user from firebase user branch</p>
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
<dt><a href="#event_editDeleteClients">"editDeleteClients"</a></dt>
<dd><p>Handles editing and deletion of a user in a row</p>
</dd>
<dt><a href="#event_createUser">"createUser"</a></dt>
<dd><p>Handles user creation</p>
</dd>
<dt><a href="#event_userDeletion">"userDeletion"</a></dt>
<dd><p>Confirm deletion event</p>
</dd>
</dl>
<a name="Creates an instance of FireCRUD"></a>
## Creates an instance of FireCRUD
FireCRUD

**Kind**: global class  
<a name="new_Creates an instance of FireCRUD_new"></a>
### new Creates an instance of FireCRUD(firebaseUserURL, columns)

| Param | Type | Description |
| --- | --- | --- |
| firebaseUserURL | <code>String</code> | the link to the user branch in the Firebase. |
| columns | <code>Object</code> | the organization of each of the columns. |

<a name="createUser"></a>
## createUser(userInfo)
Adds a user to the firebase user branch

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| userInfo | <code>object</code> | an object containing the information regarding the user |

<a name="deleteUser"></a>
## deleteUser(userID, callback)
Deletes a user from firebase user branch

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| userID | <code>string</code> | the user's ID |
| callback | <code>function</code> | [Optional] a callback method to handle user deletion |

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
<a name="event_editDeleteClients"></a>
## "editDeleteClients"
Handles editing and deletion of a user in a row

**Kind**: event emitted  
<a name="event_createUser"></a>
## "createUser"
Handles user creation

**Kind**: event emitted  
<a name="event_userDeletion"></a>
## "userDeletion"
Confirm deletion event

**Kind**: event emitted  
