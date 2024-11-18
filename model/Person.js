const mongoose = require('mongoose');
const {Schema, model}= mongoose;


const PersonSchema= new Schema ({
    name:{
        type:String,
        required:true,

    },
    
    age:{
        type:Number,
        required:true,
    },
    favoritefoods:{
        type:[String],
        
    }
});

module.exports=Person=model("Person",PersonSchema);