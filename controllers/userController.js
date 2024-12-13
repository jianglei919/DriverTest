const bcrypt = require("bcrypt");
const Joi = require("joi");
const DriverTestInfo = require("../models/DriverTestInfo.js");
const AppointmentInfo = require("../models/AppointmentInfo.js");
const { USER_TYPES } = require("../constants.js");

module.exports = {
  routeSignUp: (req, res) => {
    var username = "";
    var password = "";
    const data = req.flash("data")[0];

    if (typeof data != "undefined") {
      username = data.Username;
      password = data.Password;
      console.log("signUp request param: ", { username, password });
    }

    res.render("signUp", {
      errors: req.flash("validationErrors"),
      username: username,
      password: password,
    });
  },

  async userSignUp(req, res) {
    // Save form data for re-populating fields on validation errors
    req.flash("data", req.body);

    // Joi schema for validating the request body
    const schema = Joi.object({
      Username: Joi.string().min(3).max(30).required().messages({
        "string.base": `"Username" should be a type of 'text'`,
        "string.empty": `"Username" cannot be empty`,
        "string.min": `"Username" should have a minimum length of {#limit}`,
        "any.required": `"Username" is a required field`,
      }),
      Password: Joi.string().min(8).required().messages({
        "string.min": `"Password" should have a minimum length of {#limit}`,
        "any.required": `"Password" is a required field`,
      }),
      Password2: Joi.string().valid(Joi.ref("Password")).required().messages({
        "any.only": `"Confirm Password" does not match`,
        "any.required": `"Confirm Password" is a required field`,
      }),
      UserType: Joi.string()
        .valid(...Object.values(USER_TYPES))
        .required()
        .messages({
          "any.only": `"UserType" must be one of ['Driver', 'Examiner', 'Admin']`,
          "any.required": `"UserType" is a required field`,
        }),
      LicenseNo: Joi.string().allow("").messages({
        "string.base": `"LicenseNo" should be a type of 'text'`,
      }),
    });

    // Validate the request body using Joi
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const validationErrors = error.details.map((detail) => detail.message);
      req.flash("validationErrors", validationErrors);
      req.flash("data", req.body);
      return res.redirect("/auth/signUp");
    }

    try {
      const newDriver = new DriverTestInfo(req.body);

      // Check Username uniqueness
      const existingUsername = await DriverTestInfo.findOne({
        Username: newDriver.Username,
      });

      if (existingUsername) {
        req.flash("validationErrors", [
          `Username already exists for: ${newDriver.Username}`,
        ]);
        return res.redirect("/auth/signUp");
      }

      // Handle different UserType registration logic
      if (newDriver.UserType === USER_TYPES.DRIVER) {
        // Allow multiple 'Driver' registrations but only one 'default' LicenseNo
        const existingDriver = await DriverTestInfo.findOne({
          LicenseNo: newDriver.LicenseNo,
          UserType: USER_TYPES.DRIVER,
        });

        if (existingDriver && newDriver.LicenseNo !== "default") {
          req.flash("validationErrors", [
            `LicenseNo already exists for Driver: ${newDriver.LicenseNo}`,
          ]);
          return res.redirect("/auth/signUp");
        }
      } else if (newDriver.UserType === USER_TYPES.EXAMINER) {
        // Allow multiple Examiner registrations (no restrictions)
        console.log("Registering Examiner user.");
      } else if (newDriver.UserType === USER_TYPES.ADMIN) {
        // Allow only one Admin registration
        const existingAdmin = await DriverTestInfo.findOne({
          UserType: USER_TYPES.ADMIN,
        });

        if (existingAdmin) {
          req.flash("validationErrors", ["An Admin account already exists."]);
          return res.redirect("/auth/login");
        }
      } else {
        req.flash("validationErrors", [
          `Invalid UserType: ${newDriver.UserType}`,
        ]);
        return res.redirect("/auth/signUp");
      }

      // Save the new user
      const saveResult = await DriverTestInfo.create(newDriver);
    } catch (error) {
      console.error("SignUp Error: ", error);

      // Handle duplicate key errors
      if (error.code === 11000) {
        const duplicateKey = JSON.stringify(error.keyValue);
        req.flash("validationErrors", [
          `Duplicate entry detected: ${duplicateKey}`,
        ]);
      } else {
        const validationErrors = Object.keys(error.errors || {}).map(
          (key) => error.errors[key]?.message || "Unknown error"
        );
        req.flash("validationErrors", validationErrors);
      }
      return res.redirect("/auth/signUp");
    }

    res.redirect("/auth/login");
  },

  routeLogin: (req, res) => {
    var username = "";
    const data = req.flash("data")[0];

    if (typeof data != "undefined") {
      username = data.Username;
    }
    res.render("login", {
      errors: req.flash("validationErrors"),
      username: username,
    });
  },

  userLogin: async (req, res) => {
    try {
      const username = req.body.Username;
      const password = req.body.Password;

      const driverInfo = await DriverTestInfo.findOne({ Username: username });

      if (driverInfo) {
        let appointmentInfo = { _id: null, date: null, time: null };
        if (driverInfo.AppointmentId) {
          const currentDateTime = new Date().toISOString();
          let existAppointmentInfo = await AppointmentInfo.findById(
            driverInfo.AppointmentId
          );
          if (existAppointmentInfo) {
            if (driverInfo.TestResult == "FAIL") {
              var date = existAppointmentInfo.date;
              var time = existAppointmentInfo.time;
              const appointmentDateTime = new Date(`${date}T${time}`);
              if (appointmentDateTime < new Date(currentDateTime)) {
                //考试失败了，预约日期过期了，清空预约信息，方便重新预约
                driverInfo.AppointmentId = null;
                await DriverTestInfo.findByIdAndUpdate(driverInfo);
              } else {
                appointmentInfo = existAppointmentInfo;
              }
            } else {
              appointmentInfo = existAppointmentInfo;
            }
          }
        }

        bcrypt.compare(password, driverInfo.Password, (error, same) => {
          if (error) {
            console.log(error);
          }

          if (same) {
            // if passwords match
            // store user session
            req.session.userId = driverInfo._id;
            req.session.driverInfo = driverInfo;
            req.session.appointmentInfo = appointmentInfo;
            res.redirect("/");
          } else {
            console.log("login pass unaccepted");
            req.flash("validationErrors", [`Password wrong`]);
            req.flash("data", req.body);
            res.redirect("/auth/login");
          }
        });
      } else {
        req.flash("validationErrors", [`User Not Found, Please Sign Up`]);
        req.flash("data", req.body);
        res.redirect("/auth/signUp");
      }
    } catch (error) {
      console.error("Error processing login: ", error);
      req.flash("validationErrors", ["Error processing login request !"]);
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect("/");
    });
  },
};
