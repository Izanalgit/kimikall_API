const mongoose = require('mongoose');

const profileExtendedSchema = new mongoose.Schema({
    userId : {
        type:mongoose.Schema.ObjectId,
        require: true,
        unique:true
    },
    height: {
        type: Number
    },
    ethnia: {
        type: String,
        enum : {
            values : [
                'Asiática',
                'Caucásico',
                'Amerindia',
                'Africana',
                'Sudeste Asiática'
            ],
            message : '{VALUE} is not available'
        }
    },
    religion: {
        type: String,
        enum : {
            values : [
                'Cristianísmo',
                'Judaísmo',
                'Hinduísmo',
                'Islam',
                'Budísmo'
            ],
            message : '{VALUE} is not available'
        }
    },
    relationship : [{
        type: String,
        enum : {
            values : [
                'Soltería',
                'Divorcio',
                'Pareja',
                'Matrimonio',
                'Viudedad'
            ],
            message : '{VALUE} is not available'
        }
    }],
    smoking:{
        type: Boolean,
    },
    drinking : {
        type: Boolean,
    }
    
},{timestamps:true})

const ProfileExtended = mongoose.model('profileExtended',profileExtendedSchema);

module.exports = ProfileExtended;