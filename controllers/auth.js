const { usersModel } = require("../models/users");
const { encryptPassword, comparePassword } = require("../helpers/handleBcrypt");
const { generateToken } = require("../helpers/generateToken");
const { veryfyToken } = require('../helpers/generateToken');

const checkAuth = async (req, res) => {
    try {
        const { token } = req.body;
        const tokenData = await veryfyToken(token);
        if(tokenData.id){
            return res.status(200).send({
                message: 'Token is valid'
            });
        }else{
            res.status(401).send({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
}

const loginCtrl = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await usersModel.findOne({ email });
        if(!user){
            res.status(404).send({ message: "User not found" });
        }else{
            const checkPassword = await comparePassword(password, user.password);
            const tokenSession = await generateToken(user);
            if(checkPassword){
                res.send({ data: user, token: tokenSession });
            }else{
                res.status(401).send({ message: "Unauthorized" });
            }
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const registerCtrl = async (req, res) => {
    try{
        const {email, password, name} = req.body;
        const passwordHash = await encryptPassword(password);
        const registerUser = await usersModel.create({email, password: passwordHash, name});

        res.send({ data: registerUser });
    }catch(err){
        res.status(500).send({ message: err.message });
    }
}

module.exports = { loginCtrl, registerCtrl , checkAuth };