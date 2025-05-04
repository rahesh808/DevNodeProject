const { eachMinuteOfInterval } = require('date-fns');
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
        required: true
    },   
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        
    },
    currency: {
        type: String,
        
    },
    receipt: {
        type: String,
        
    },
    notes: {
        firstName: {
            type: String,
            
        },
        lastName: {
            type: String,
           
        },
        membershipType: {
            type: String,
            
        },emailId : {
            type: String,
            
        }
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;