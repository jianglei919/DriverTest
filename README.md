# **Driver Test Management System**

## **Overview**
This system is designed to manage driving test appointments, assessments, and user roles. The platform provides distinct interfaces for drivers, examiners, and administrators, with specific functionalities and permissions tailored to each role.

---

## **Features**

### **1. Driver Interface (司机界面)**
- **Schedule Driving Tests**: Drivers can select a time slot and schedule a driving test (G or G2).
- **View Pages**: Drivers can log in and access their designated pages (G2_page and G_page).
- **Review Results**: Drivers can view examiner comments and test results (PASS/FAIL) after completing their appointments.

**功能**:
- **预约驾驶考试**：用户可以选择时间段并预约驾驶考试（G 或 G2）。
- **查看相关页面**：驾驶员可以登录并查看相关页面（G2_page 和 G_page）。
- **查看考试结果**：如果预约已完成，用户可以查看考官的评论以及考试结果（PASS/FAIL）。

---

### **2. Examiner Interface (考官界面)**
- **Appointment Management**: Examiners can view a list of appointments, including drivers scheduled for driving tests.
- **Filtering Options**: Filter the appointment list by test type (G or G2).
- **Driver Assessment**:
  - View driver information (e.g., name, vehicle details).
  - Add comments regarding the test.
  - Record test results (PASS/FAIL).

**功能**:
- **管理预约**：考官可以看到预约的列表，包括准备进行驾驶考试的司机。
- **筛选功能**：提供按考试类型（G 或 G2）筛选列表的功能。
- **司机评估**：
  - 查看司机的有限信息（如姓名、车辆信息）。
  - 添加考试评论。
  - 标记考试结果（PASS/FAIL）。

---

### **3. Admin Interface (管理员界面)**
- **Add Schedules**: Admins can add test schedules and manage other content.
- **View Candidate Status**: Admins can view lists of candidates who passed or failed their tests.
- **Order Creation**: Create related orders for candidates who passed, such as issuing driver's licenses.

**功能**:
- **添加考试时间表**：管理员可以添加考试时间表和其他内容。
- **查看候选人状态**：查看通过或未通过的候选人列表。
- **创建订单**：为通过的候选人创建相关订单（如颁发驾驶证）。

---

### **4. User Management and Permissions (用户管理和权限)**
- **User Roles**: The system supports three user types:
  - **Driver**
  - **Examiner**
  - **Admin**
- **Role-Based Access**:
  - **Driver**: Access to G2_page and G_page.
  - **Examiner**: Access to Examiner_tab.
  - **Admin**: Access to Appointment_tab.
- **Middleware Enforcement**: Middleware ensures that specific views can only be accessed by the corresponding user type.

**功能**:
- **用户角色**：
  - **Driver（司机）**
  - **Examiner（考官）**
  - **Admin（管理员）**
- **基于权限的访问**：
  - **Driver**：G2_page、G_page。
  - **Examiner**：Examiner_tab。
  - **Admin**：Appointment_tab。
- **中间件保证**：确保特定视图只能被对应用户类型访问。

---

## **System Requirements**
- **Node.js**: v16 or later
- **MongoDB**: A running MongoDB instance (local or cloud-based)
- **npm**: v7 or later
- **Express.js**: Framework for routing and middleware
- **EJS**: Templating engine for dynamic views

---

## **Installation**

1. **Clone the Repository**:
   ```bash
   git clone <repository_url>
   cd <repository_name>