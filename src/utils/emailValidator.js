const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const emailValidator = (mail) => {
    if(regex.test(mail)) return true;
    return false;
}
export default emailValidator;