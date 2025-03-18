const DriverTestInfo = require("../models/DriverTestInfo.js");
const AppointmentInfo = require("../models/AppointmentInfo.js");

module.exports = {
  async routeG(req, res) {
    if (req.session.driverInfo?.UserType !== "Driver") {
      return res.redirect("/");
    }

    const driverInfo = await DriverTestInfo.findById(
      req.session.driverInfo._id
    );

    let g2Passed =
      driverInfo.TestResult == "PASS" && driverInfo.TestType == "G2";

    const gPassed =
      driverInfo.TestResult == "PASS" && driverInfo.TestType == "G";

    g2Passed = gPassed ? true : g2Passed;

    req.session.driverInfo = driverInfo;

    if (isDefaultInfo) {
      res.render("g2", {
        driverInfo,
        appointmentInfo: req.session.appointmentInfo,
        g2Passed: g2Passed,
        gPassed: gPassed,
        errors: req.flash("validationErrors"),
        success: req.flash("success"),
      });
    } else {
      let appointmentInfo = req.session.appointmentInfo;

      if (g2Passed && driverInfo.TestType === "G2") {
        driverInfo.TestType = "G";
        appointmentInfo = {};
      }

      res.render("g", {
        driverInfo,
        appointmentInfo: appointmentInfo,
        g2Passed: g2Passed,
        gPassed: gPassed,
        errors: req.flash("validationErrors"),
        success: req.flash("success"),
      });
    }
  },

  gStore: async (req, res) => {
    try {
      const _id = req.session.userId;
      console.log("G page start. _id=" + _id);

      const oldDriverInfo = await DriverTestInfo.findById(_id);
      if (!oldDriverInfo) {
        console.log("G page not find by _id=" + _id);
        req.flash("validationErrors", ["Driver not found"]);
        res.redirect("/driver/g");
        return;
      }

      const reqDriverInfo = new DriverTestInfo(req.body);

      const newDriver = {
        car_details: {
          make: reqDriverInfo.car_details.make,
          model: reqDriverInfo.car_details.model,
          year: reqDriverInfo.car_details.year,
          platno: reqDriverInfo.car_details.platno,
        },
        TestType: "G",
      };

      // 更新个人信息
      if (
        oldDriverInfo.UserType === "Driver" &&
        oldDriverInfo.LicenseNo === "default"
      ) {
        newDriver.firstname = reqDriverInfo.firstname;
        newDriver.lastname = reqDriverInfo.lastname;
        newDriver.LicenseNo = reqDriverInfo.LicenseNo;
        newDriver.Age = reqDriverInfo.Age;
      }

      // 更新预约信息
      if (reqDriverInfo.AppointmentId) {
        newDriver.AppointmentId = reqDriverInfo.AppointmentId;
        const newAppointmentInfo = await AppointmentInfo.findById(
          reqDriverInfo.AppointmentId
        );

        if (!newAppointmentInfo) {
          req.flash("validationErrors", ["Invalid Appointment ID"]);
          res.redirect("/driver/g");
          return;
        }

        req.session.appointmentInfo = newAppointmentInfo;
        newDriver.TestResult = "PENDING";
        newDriver.Comment = "";

        // 更新新的预约时间段为不可用
        newAppointmentInfo.isTimeSlotAvailable = false;
        await newAppointmentInfo.save();
      }

      // 更新旧的预约时间段为可用
      if (oldDriverInfo.AppointmentId && oldDriverInfo.TestResult !== "FAIL") {
        const oldAppointment = await AppointmentInfo.findById(
          oldDriverInfo.AppointmentId
        );
        if (oldAppointment) {
          oldAppointment.isTimeSlotAvailable = true;
          await oldAppointment.save();
        }
      }

      await DriverTestInfo.findByIdAndUpdate(_id, newDriver);

      // 更新 session 信息
      const updatedDriverInfo = await DriverTestInfo.findById(_id);
      req.session.driverInfo = updatedDriverInfo;

      console.log("G page end. updatedDriverInfo=", updatedDriverInfo);
      req.flash("success", "Successfully updated information");
    } catch (error) {
      console.error("Error processing G page: ", error);
      req.flash("validationErrors", ["Error processing G page request"]);
    }
    res.redirect("/driver/g");
  },
};
