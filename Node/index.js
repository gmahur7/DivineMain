const express = require('express')
require('./Database/config')
const User = require('./Database/signup')
const Certificate = require('./Database/UserCertificate')
const nodemailer = require('nodemailer');
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('', async (req, resp) => {
    resp.send('hello')
})

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: '465',
    secure: false,
    requireTLS: true,
    auth: {
        user: 'divinebulandshahr@gmail.com',
        pass: 'vsbdsfeawlznlqdm'
    }
});


app.post('/signup', async (req, resp) => {
    try {
        let match = await User.findOne({ Email: req.body.Email });
        if (match) {
            resp.send({ match: 'Email Already Exists' });
        } else {
            if (req.body.GoogleID) {
                let data = new User(req.body);
                data = await data.save();
                data = data.toObject();
                delete data.GoogleID;
                resp.send(data);
            }
            else {
                let data = new User(req.body);
                data = await data.save();
                if (data._id) {
                    let otp = Math.floor(Math.random() * 10000)
                    sendMail(req.body.Name, req.body.Email, otp)
                    let update = await User.updateOne({ _id: data._id }, { $set: { OTP: otp } })
                    if (update.acknowledged) {
                        data = data.toObject();
                        delete data.Password;
                        delete data.OTP;
                        resp.send(data);
                    }
                }
            }


        }
    } catch (error) {
        resp.status(500).send('An error occurred');
        // Handle or log the error as needed
    }
});


app.post('/login', async (req, resp) => {
    try {
        if (req.body.Email && (req.body.Password || req.body.GoogleID)) {
            let data = await User.findOne(req.body)
            if (data) {
                resp.send(data)
            }
            else {
                resp.send({ invalid: 'No User Find' })
            }
        }
        else {
            resp.send({ result: 'Invalid Call' })
        }
    }
    catch (error) {
        resp.status(500).send({ result: 'Server Error' })
    }
})

app.post('/requestotp', async (req, resp) => {
    try {
        if (req.body.Email) {
            try {
                let data = await User.findOne({ Email: req.body.Email });
                if (data) {
                    let otp = Math.floor(Math.random() * 10000);
                    await sendMail(data.Name, data.Email, otp);
                    let update = await User.updateOne({ _id: data._id }, { $set: { OTP: otp } });
                    if (update && update.modifiedCount > 0) {
                        resp.send({ result: "Email Sent" });
                    } else {
                        resp.status(500).send({ result: "Failed to update OTP" });
                    }
                } else {
                    resp.status(404).send({ result: "Email Not Found" });
                }
            } catch (error) {
                resp.status(500).send({ result: "An error occurred" });
            }
        } else {
            resp.status(400).send({ result: "Please Provide Email" });
        }
    }
    catch (error) {
        resp.status(500).send({ result: "An error occurred" });
    }

})

app.put('/verifyotp/:_id', async (req, resp) => {
    try {
        if (req.body.OTP) {
            let verify = await User.findOne({ _id: req.params._id, OTP: req.body.OTP })
            if (verify) {
                let delotp = await User.updateOne({ _id: req.body._id }, { $unset: { OTP: " " } })
                if (delotp.acknowledged) {
                    let verify2 = await User.updateOne({ _id: req.body._id }, { $set: { verified: true } })
                    if (verify2.acknowledged) {
                        resp.send({ msg: "Verified" })
                    }
                }
            }
            else resp.send({msg:'Invalid OTP'}  )
        }
    }
    catch (error) {
        resp.status(500).send({ msg: 'Server Error' })
    }
})

app.put('/verifyotp', async (req, resp) => {
    try {
        if (req.body.OTP) {
            let verify = await User.findOne({ Email: req.body.Email, OTP: req.body.OTP })
            if (verify) {
                let delotp = await User.updateOne({ Email: req.body.Email }, { $unset: { OTP: "" } })
                if (delotp.acknowledged) {
                    resp.send({ msg: "Verified" })
                }
            } else {
                resp.send({ msg: 'Invalid OTP' })
            }
        }
    }
    catch (error) {
        resp.status(500).send({ msg: 'Server Error' })
    }
})

app.put('/update', async (req, resp) => {
    try {
        if (req.body.Password && req.body.Email) {
            let data = await User.updateOne({ Email: req.body.Email }, { $set: { Password: req.body.Password } })
            if (data.acknowledged) {
                resp.send({ msg: "Password Changed Successfully" })
            }
            else {
                resp.send({ msg: "Error" })
            }
        }
        else {
            resp.send({ msg: 'Inavlid Email Or Password ' })
        }
    }
    catch (error) {
        resp.status(500).send({ msg: 'Server Error' })
    }
})

app.post('/sendmail/passwordchanged/:Email', async (req, resp) => {
    try {
        let data = await User.findOne({ Email: req.params.Email })
        if (data._id) {
            passwordChangedMail(data.Name, data.Email)
            resp.send({ msg: 'Mail Sent' })
        }
        else {
            resp.send({ msg: 'Mail Sent' })
        }
    } catch (error) {
        resp.send({ msg: 'Mail Not Sent' })
    }
})

const sendMail = (Name, Email, otp) => {
    let mailOptions = {
        from: 'divinebulandshahr@gmail.com',
        // to: Email,
        to: 'pakistan.server3086@gmail.com',
        subject: 'For Verification Mail',
        text: `Hiii ${Name}, Your OTP is ${otp}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const passwordChangedMail = (Name, Email) => {
    let mailOptions = {
        from: 'divinebulandshahr@gmail.com',
        // to: Email,
        to:'pakistan.server3086@gmail.com',
        subject: 'For Verification Mail',
        text: `Hiii ${Name}, Your Password Has Changed Successfully`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ', error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.post('/find', async (req, resp) => {
    try {
        if (req.body.Email) {
            let data = await User.findOne({ Email: req.body.Email });
            if (data && data._id) {
                resp.send({ Email: data.Email, _id: data._id });
            } else {
                resp.send({ error: "Error" });
            }
        } else {
            let data = await User.findOne({ GoogleID: req.body.GoogleID });
            if (data && data.GoogleID) {
                resp.send({ GoogleID: data._id });
            } else {
                resp.send({ error: "Error" });
            }
        }
    } catch (error) {
        resp.status(500).send({ msg: "Server Error" });
    }

})

app.get('/verified/:_id', async (req, resp) => {
    try {
        let data = await User.findOne({ _id: req.params._id });
        if (data) {
            if (data.verified === true) {
                resp.send({ msg: 'Verified' });
            } else {
                resp.send({ msg: 'Not Verified' });
            }
        } else {
            resp.send({ msg: 'No User Found' });
        }
    } catch (error) {
        resp.status(500).send({ msg: 'Error occurred' });
    }
})

app.put('/filldetail/:_id', async (req, resp) => {
    try {
        let result = await User.updateOne({ _id: req.params._id }, { $set: req.body })
        resp.send(result)
    }
    catch (err) {
        console.log("ERROR", err);
        resp.status(400).send({ msg: "Failed to update user details" });
    }

})

app.put('/getcourse/:Email', async (req, resp) => {
    try {
        let userData = await User.findOne({ Email: req.params.Email });
        if (userData) {
            if (!userData.Course2) {
                if (userData.Course !== req.body.Course) {
                    let result = await User.updateOne({ Email: req.params.Email }, { $set: { Course2: req.body.Course } });
                    if (result && result.modifiedCount > 0) {
                        resp.send({ msg: 'Course Added' });
                    } else {
                        resp.send({ msg: 'Course Not Added' });
                    }
                }
                else {
                    resp.send({ msg: 'Already Enrolled' });
                }
            } else if (!userData.Course3) {
                if (userData.Course !== req.body.Course && userData.Course2 !== req.body.Course) {
                    let result = await User.updateOne({ Email: req.params.Email }, { $set: { Course3: req.body.Course } });
                    if (result && result.modifiedCount > 0) {
                        resp.send({ msg: 'Course Added' });
                    } else {
                        resp.send({ msg: 'Course Not Added' });
                    }
                }
                else {
                    resp.send({ msg: 'Already Enrolled' });
                }
            } else {
                resp.send({ msg: 'User already enrolled in maximum courses' });
            }
        } else {
            resp.send({ msg: 'User not found' });
        }
    } catch (error) {
        resp.send({ msg: 'Server Error' });
    }

})

app.post('/getcertficate', async (req, resp) => {
    try {
        let result = await User.findOne(req.body)
        result = await result.json()
        if (result._id) {
            if (result.Course === req.body.Course) {
                let data = new Certificate(req.body)
                data = await data.save()
                if (data._id) {
                    resp.send({ msg: 'Applied Successfull' })
                }
                else {
                    resp.send({ msg: 'Applied Successfull' })
                }
            }
            else {
                resp.send({ msg: 'You Applied With Wrong Details' })
            }
        }
    }
    catch (error) {
        resp.status(500).send({ msg: "An error occured while applying for certificate" })
    }
})

app.post('/courses', async (req, resp) => {
    try {
        let courses = []
        let data = await User.findOne(req.body)
        if (data) {
            if (data.Course && data.Pay === true) {
                courses.push(data.Course)
            }
            if (data.Course2 && data.Pay2 === true) {

                courses.push(data.Course2)
            }
            if (data.Course3 && data.Pay3 === true) {
                courses.push(data.Course3)
            }
            resp.send({ courses: courses })
        }
        else {
            resp.send({ msg: 'No Course Found' })
        }
    }
    catch (error) {
        resp.send({ msg: 'Server Error' })
    }
})

app.listen(80, '127.0.0.1', () => {
    console.log('Server Is Running')
})