const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    

    username:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true 
    },

    mobile:{
        type:Number,
        required:true
    },

    password:{
        type:String,
        required:true
    },

    isAdmin:{
        type:Boolean,
        default:false
    },

    doc:{
        type:String,
        
    }
});

module.exports = mongoose.model("User", userSchema)