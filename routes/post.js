const router = require('express').Router();
const verify = require('./verifyToekn');

router.get('/',verify,(req,res,next) => {
   res.send(req.user);
});

module.exports = router;