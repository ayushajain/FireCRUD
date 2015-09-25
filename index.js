const CLIENT_COLUMNS = {
    id: {                   //must be named id
        title: "User ID",
        type: "input",
        ref: "key",         //for user IDs make the reference "key".
        editable: false,
    },
    username: {
        title: "Username",
        type: "input",
        ref: "user_name",
        required: true,
        editable: true
    },
    birthday: {
        title: "Birthday",
        type: "input",
        ref: "birthday",
        required: false,
        editable: false,
    },
    gender: {
        title: "Gender",
        type: "select",
        ref: "gender",
        required: true,
        editable: false,
        options: {
            1: "male",
            2: "female",
            3: "other",
        },
    },
    payment: {
        title: "Payment Type",
        type: "select",
        ref: "payment_type",
        required: true,
        editable: true,
        options: {
            1: "visa",
            2: "mastercard",
            3: "paypal"
        }
    }
}

var myCRUD = new FireCRUD("https://techlabproductivity.firebaseio.com/", CLIENT_COLUMNS, true);
