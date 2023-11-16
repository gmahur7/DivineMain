const mongoose=require('mongoose')

const certificateSchema=new mongoose.Schema({
    Name:String,
    Email:String,
    PhoneNo:String,
    Course:String,
    Certificate:Boolean
})

module.exports = mongoose.model('certificate',certificateSchema)
