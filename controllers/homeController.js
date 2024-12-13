module.exports = {
  routeHome: (req, res) => {
    const driverInfo = req.session.driverInfo;

    let userName = "";

    if (driverInfo) {
      if (
        driverInfo.UserType === "Driver" &&
        driverInfo.LicenseNo !== "default"
      ) {
        userName = driverInfo.firstname + " " + driverInfo.lastname;
      } else if (driverInfo.UserType === "Admin") {
        userName = "Admin";
      } else if (driverInfo.UserType === "Examiner") {
        userName = "Examiner";
      }
    } else {
      userName = "to home page";
    }

    res.render("home", { title: `Welcom ${userName}` });
  },
};
