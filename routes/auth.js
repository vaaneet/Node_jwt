const router = require('express').Router();
const bcrytp = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const schema = require('../validation');
const loginSchema = require('../login');

router.get('/',(req,res)=>{
    res.send('Did it work?');
});

router.post('/register',async (req,res) => {

     // WORKING WITH DEPRECATED VERSION
    // const Validation = Joi.validate(req.body,schema);
    // res.send(Validation);

    //updated joi
    const {error} = schema.validate({name:req.body.name,email:req.body.email,password:req.body.password});
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const emailCheck = await User.findOne({email:req.body.email});
    if(emailCheck){
        return res.status(400).send('EMAIL EXIST');
    }

    const salt = await bcrytp.genSalt(10);
    const hashedPassword = await bcrytp.hash(req.body.password,salt);

    const user = new User({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });

    try{
        const saveUser = await user.save();
        res.send({id:user._id});
    }catch(err){
        res.status(400).send(err);
    }
});


router.post('/login',async (req,res) => {
    const {error} = loginSchema.validate({email:req.body.email,password:req.body.password});
    if(error){
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send("Email does not exist"); 
    }

    const validPass = await bcrytp.compare(req.body.password,user.password);
    if(!validPass){
        return res.status(400).send('Password incorrect');
    }

    const token = jwt.sign({_id:user._id},'anything');
    res.header('auth-token',token).send(token);

});

module.exports = router;