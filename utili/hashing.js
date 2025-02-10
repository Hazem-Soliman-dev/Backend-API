const bcrypt = require('bcrypt');

exports.hashPassword = async(password)=>{
    return await bcrypt.hash(password,10);
}

exports.isMatch = async(password,savedPassword)=>{
    return await bcrypt.compare(password,savedPassword);
}