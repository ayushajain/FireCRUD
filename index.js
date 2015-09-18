const CLIENT_COLUMNS = {
    id: {
        title: "User ID",
        type: "input",
        ref: "key",         //for user IDs make the reference "key".
    },
    username: {
        title: "Username",
        type: "input",
        ref: "user_name",
    },
    gender: {
        title: "Gender"
        type: "select",
        ref: "gender",
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
        options: {
            1: "visa",
            2: "mastercard",
            3: "paypal"
        }
    }
}

var createColumns = {
    id: "create",
    name: "create",
    expirydate: "create",
    graceperiod: "create",
    licenseid: "create",
    status: "create",
}