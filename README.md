1. Driver Interface
    • Users can select a time slot and schedule a driving test (G or G2).
    • Drivers can log in and view related pages (G2_page and G_page).
    • If the appointment is completed, users can view the examiner's comments and the test results (PASS/FAIL).
2. Examiner Interface
    • Examiners can see a list of appointments, including drivers who are ready to take the driving test.
    • Provide filtering capabilities to filter the list by test type (G or G2).
    • Examiners can select drivers and:
    • View limited information about the driver (such as name, vehicle information).
    • Add test comments.
    • Mark test results (PASS/FAIL).
3. Admin Interface
    • Admins can add test schedules and other content.
    • View a list of candidates who passed or failed.
    • Create related orders for candidates who passed (such as issuing a driver's license).
4. User Management and Permissions
    • User types include Driver, Examiner, and Admin.
    • After the user logs in, they can access different interfaces based on their permissions:
    • Driver: G2_page, G_page.
    • Examiner: Examiner_tab.
    • Admin: Appointment_tab.
    • Middleware to ensure that specific views can only be accessed by the corresponding user type.

1.	Driver Interface (司机界面)
	•	用户可以选择时间段并预约驾驶考试（G 或 G2）。
	•	驾驶员可以登录并查看相关页面（G2_page 和 G_page）。
	•	如果预约已完成，用户可以查看考官的评论以及考试结果（PASS/FAIL）。
2.	Examiner Interface (考官界面)
	•	考官可以看到预约的列表，包括准备进行驾驶考试的司机。
	•	提供过滤功能，按考试类型（G 或 G2）筛选列表。
	•	考官可以选择司机并：
	•	查看司机的有限信息（如姓名、车辆信息）。
	•	添加考试评论。
	•	标记考试结果（PASS/FAIL）。
3.	Admin Interface (管理员界面)
	•	管理员可以添加考试时间表和其他内容。
	•	查看通过或未通过的候选人列表。
	•	为通过的候选人创建相关订单（如颁发驾驶证）。
4.	用户管理和权限
	•	用户类型包括 Driver、Examiner 和 Admin。
	•	用户登录后，基于权限访问不同的界面：
	•	Driver：G2_page、G_page。
	•	Examiner：Examiner_tab。
	•	Admin：Appointment_tab。
	•	中间件来确保特定视图只能被对应用户类型访问。    