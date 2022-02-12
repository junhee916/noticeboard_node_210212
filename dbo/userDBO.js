const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
const userDBO = {}
userDBO.get = async (req, res) => {
    try {
      if (res.locals.user) {
        const users = await userModel.find();
        res.status(200).json({
          msg: "get users",
          count: users.length,
          usersData: users,
        });
      } else {
        res.status(402).json({
          msg: "no token",
        });
      }
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };
userDBO.detailGet = async (req, res) => {
    const id = req.params.userId;
    try {
      if (res.locals.user) {
        const user = await userModel.findById(id);
        if (!user) {
          return res.status(403).json({
            msg: "no userId",
          });
        } else {
          res.status(200).json({
            msg: "get user",
            userData: user,
          });
        }
      } else {
        res.status(402).json({
          msg: "no token",
        });
      }
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };
userDBO.signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const user = userModel.findOne({ email });
      if (user) {
        return res.status(400).json({
          msg: "user email, please other email",
        });
      } else {
        const user = new userModel({
          name,
          email,
          password,
        });
        await user.save();
        res.status(200).json({
          msg: "success signup",
          userData: user,
        });
      }
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };
userDBO.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          msg: "user email, please other email",
        });
      } else {
        await user.comparePassword(password, (err, isMatch) => {
          if (err || !isMatch) {
            return res.status(401).json({
              msg: "not match password",
            });
          } else {
            const payload = {
              id: user.id,
              email: user.email,
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY, {
              expiresIn: "1h",
            });
            res.status(200).json({
              msg: "success login",
              userData: user,
            });
          }
        });
      }
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };
userDBO.update = async (req, res) => {
    const id = req.params.userId;
    try {
      if (res.locals.user) {
        const user = await userModel.findByIdAndUpdate(id, {
          $set: {
            email: req.body.email,
            password: req.body.password,
          },
        });
        if (!user) {
          return res.status(403).json({
            msg: "no userId",
          });
        } else {
          res.status(200).json({
            msg: "update user by id: " + id,
          });
        }
      } else {
        res.status(402).json({
          msg: "no token",
        });
      }
    } catch (err) {
      res.status(500).json({
        msg: err.message,
      });
    }
  };
userDBO.delete = async (req, res) => {
    try{
        if(res.locals.user){
            await userModel.remove()
            res.status(200).json({
                msg : "delete users"
            })
        }
        else{
            res.status(402).json({
                msg : "no token"
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
userDBO.detailDelete = async (req, res) => {
    const id = req.params.userId
    try{
        const user = await userModel.findByIdAndRemove(id)
        if(!user){
            res.status(403).json({
                msg : "no userId"
            })
        }
        else{
            res.status(200).json({
                msg : "delete user by id: " + id
            })
        }
    }
    catch(err){
        res.status(500).json({
            msg : err.message
        })
    }
};
module.exports = userDBO