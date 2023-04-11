const { veryfyToken } = require('../helpers/generateToken');

const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ').pop();
        const tokenData = await veryfyToken(token);
        if(tokenData.id){
            return res.status(200).send({
                message: 'Test desde middleware'
            });
        }else{
            res.status(401).send({ message: 'Unauthorized' });
        }
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
}

module.exports = { checkAuth };