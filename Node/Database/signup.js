const mongoose=require('mongoose')

const signupSchema=new mongoose.Schema({
    Name:String,
    Email:String,
    Password:String,
    PhoneNo:String,
    Course:String,
    Course2:String,
    Course3:String,
    verified:Boolean,
    Pay:Boolean,
    Pay2:Boolean,
    Pay3:Boolean,
    GoogleID:String,
    OTP:Number
})

module.exports = mongoose.model('user',signupSchema)
