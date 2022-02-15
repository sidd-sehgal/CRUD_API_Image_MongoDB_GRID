
function validateInput({ name, email, mobile_number }) {
    isValid = false;

    // Validate name, email and mobile_number
    if (!(name && email && mobile_number))
        return ({ isValid, msg: "Provide name, email and mobile_number" })

    // Validate Name
    let isLengthValid = (name.length >= 4 && name.length <= 25)
    if (!(isLengthValid && /^[a-zA-Z\s]+$/.test(name)))
        return ({ isValid, msg: "Name must be between 4 and 25 characters and not digit or spacian characters" })

    // Validate Email
    if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
        return ({ isValid, msg: "Enter a valid email address" })

    // Validate Mobile Number
    isLengthValid = mobile_number.length === 10;
    if (!(isLengthValid && /^\d{10}$/.test(mobile_number)))
        return ({ isValid, msg: "Enter a valid Mobile Number" })

    // If everything is valid then 
    isValid = true;
    return { isValid, msg: "Success" }

}

function validateInputPatch(body) {
    let isValid = false;

    // Validate Each Key 
    for (let key in body) {
        if (key === "name") {
            // Validate Name
            let name = body[key];
            let isLengthValid = (name.length >= 4 && name.length <= 25)
            if (!(isLengthValid && /^[a-zA-Z\s]+$/.test(name)))
                return ({ isValid, msg: "Name must be between 4 and 25 characters and not digit or spacian characters" })
        } else if (key === "email") {
            // Validate Email
            let email = body[key];
            if (! /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
                return ({ isValid, msg: "Enter a valid email address" })
        } else if (key === "mobile_number") {
            // Validate Mobile Number
            let mobile_number = body[key];
            let isLengthValid = mobile_number.length === 10;
            if (!(isLengthValid && /^\d{10}$/.test(mobile_number)))
                return ({ isValid, msg: "Enter a valid Mobile Number" })
        }
    }
    // If everything is valid then
    isValid = true;
    return { isValid, msg: "Success" }

}

// Exporting Both Functions Here
module.exports = { validateInput, validateInputPatch };