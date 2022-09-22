const userModel = require('../../db/models/user');
const ErrorHandler = require('../../utils/ErrorHandling');
const catchAsyncError = require('../../middlewares/catchAsyncError');
const sendToken = require('../../utils/jwtToken');
const sendEmail = require('../../utils/sendEmail')
const crypto = require('crypto')
// Register

exports.registerUser = catchAsyncError(async (req, res, next) => {

    const {name,email,password} = req.body;
    const user = await userModel.create({
        name,email,password,
        avatar: {
            public_id: "This is sample id",
            url: "ProfilePic Url",
        }
    });
    sendToken(user,201,res);
});

// Login

exports.loginUser = catchAsyncError( async (req, res, next) => {

    const {email,password} = req.body;

    //checking email and password
    if(!email || !password) {
        return next(new ErrorHandler('Please Enter Email & Password',400));
    }

    const user = await userModel.findOne({email}).select('+password');

    if(!user) {
        return next(new ErrorHandler("Invalid Email Or Password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email Or Password",401));
    }
    sendToken(user,200,res);
});

// Logout

exports.logout = catchAsyncError(async(req,res,next) => {

        res.cookie("token",null,{
            expires: new Date(Date.now()),
            httpOnly: true,
        })

        res.status(200).json({
            success: true,
            message: "LOGGED OUT"
        })
});

// Forgot Password

exports.forgotPassword = catchAsyncError(async (req,res,next) => {

    const user = await userModel.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorHandler("User not found",404));
    }

    // get reset password token

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;

    const message = `Your password reset token is : - \n\n ${resetPasswordUrl} \n\n If you are not requested this email then, please ignore it.`;
    
    try {

        await sendEmail({

            email: user.email,
            subject: `Ecommerce Password Recovery`,
            message,

        })
        
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }

})

// Reset Password
exports.resetPassword = catchAsyncError(async(req,res,next) => {

    //createing hash token
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest('hex');

   const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()},
   }) 

   if(!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired",400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    sendToken(user,200,res);
});

// Get User Details
exports.getUserDetails = catchAsyncError(async(req,res,next) => {
    
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });
})

// Update User Password
exports.updatePassword = catchAsyncError(async(req,res,next) => {
    
    const user = await userModel.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect",400));
    }

    if(req.body.oldPassword === req.body.newPassword) {

        return next(new ErrorHandler("You used this password recently. Please choose a different one.",400)); 
    }

    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password Doesnot match",400)); 
    }

    user.password = req.body.newPassword;

    await user.save();
    sendToken(user,200,res);
})

// Update User Profile
exports.updateProfile = catchAsyncError(async(req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };

// Cloudinary implementation(pending)

    const user = await userModel.findByIdAndUpdate(req.user.id,newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
})

// Get All Users
exports.getAllUsers = catchAsyncError(async(req,res,next) => {

    const users = await userModel.find();
    res.status(200).json({
        success: true,
        users,
    }) 
})

// Get single user ---Admin
exports.getSingleUser = catchAsyncError(async(req,res,next) => {

    const user = await userModel.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user,
    }) 
})

// Update User Role --Admin
exports.updateUserRole = catchAsyncError(async(req,res,next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await userModel.findByIdAndUpdate(req.params.id,newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
})

// Delete User --Admin
exports.deleteUser = catchAsyncError(async(req,res,next) => {

        const user = await userModel.findById(req.params.id);
// Cloudinary remove (pending)
        if(!user) {
            return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
        }

        await user.remove();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})
