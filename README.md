Build a node js Driver Test project with express, ejs, and mongoose.
▪ Build a Login.ejs page, where you can enter firstname, lastname and use this information to retrieve DriverTestInfo Model from MongoDB. If it exists in the database, jump to the G.ejs page. If it does not exist, jump to the G2.ejs page.

▪ Build a G2.ejs page, where you can enter Personal Information including (firstname, lastname, LicenseNo, Age) and Car Information including (make, model, year, platno), and then save this data to MongoDB through DriverTestInfo Model. LicenseNo is required to be unique in the database.

▪ Build a G.ejs page, where you can only enter LicenseNo, and use LicenseNo to retrieve DriverTestInfo from MongoDB. If it does not exist, display the message - "User not found" and jump to the G2.ejs page. If it exists, the retrieved Personal Information including (firstname, lastname, LicenseNo, Age) and Car Information including (make, model, year, platno) will be displayed. However, Personal Information cannot be modified, only Car Information can be modified. However, when the Save button is clicked, Car Information in MongoDB will be updated.
