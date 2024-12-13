"use strict";

const timeSlots = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
];

const datePicker = (dateInput) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  dateInput.attr("min", formattedDate);
};

const adminCheckTimeSlot = () => {
  $("#adminDate").on("change", function () {
    const date = $(this).val();
    console.log("Date was changed:", date);

    // 清空之前的按钮
    $("#adminTimeButtons").empty();

    if (!date) return;

    // 请求服务器获取时间槽数据
    $.ajax({
      url: "/admin/appointment/retrieval",
      method: "GET",
      data: { date },
      success: function (response) {
        console.log("Response from server:", response); // 打印服务器返回数据

        if (response.length === 0) {
          console.log("No time slots available for the selected date.");
          timeSlots.forEach((time) => {
            const button = $(
              `<button class="time-slot available" type="button">${time}</button>`
            );
            $("#adminTimeButtons").append(button);

            // 绑定点击事件
            button.on("click", (event) => {
              event.preventDefault();
              $(".time-slot").removeClass("selected");
              $(event.target).addClass("selected");
              $("#selectedTime").val(time); // 更新选中的时间
            });
          });
          return;
        }

        // 遍历所有时间槽
        timeSlots.forEach((time) => {
          const slot = response.find((slot) => slot.time === time);
          const isAvailable = slot ? false : true;

          // 创建按钮
          const button = $("<button>")
            .addClass("time-slot")
            .addClass(isAvailable ? "available" : "unavailable")
            .prop("disabled", !isAvailable)
            .attr("type", "button")
            .text(time);

          // 检查是否需要设置为 selected
          const selectedTime = $("#selectedTime").val();

          if (isAvailable && selectedTime === time) {
            console.log(`Setting button as selected: ${time}`);
            button.addClass("selected");
          }

          // 绑定点击事件
          if (isAvailable) {
            button.on("click", (event) => {
              event.preventDefault();
              $(".time-slot").removeClass("selected");
              $(event.target).addClass("selected");
              $("#selectedTime").val(time); // 更新选中的时间
            });
          }

          // console.log('Generated button content:', button.prop('outerHTML'));

          // 将按钮添加到页面
          $("#adminTimeButtons").append(button);
        });
      },
      error: function () {
        alert("Failed to fetch time slots. Please try again.");
      },
    });
  });
};

const sotreAppointment = () => {
  $("#postAppointmentForm").on("submit", function (e) {
    e.preventDefault(); // 阻止表单的默认提交行为

    const formData = $(this).serialize(); // 获取表单数据

    $.ajax({
      url: "/admin/appointment/add", // 替换为实际后端路径
      method: "POST",
      data: formData,
      success: function (response) {
        if (response.success) {
          showBootstrapAlert(response.message, "success");

          // 清空选中时间
          $("#selectedTime").val("");

          // 刷新时间槽按钮
          $("#adminDate").trigger("change"); // 模拟日期变更以刷新按钮
        } else {
          showBootstrapAlert(response.message, "warning");
        }
      },
      error: function () {
        showBootstrapAlert(
          "Failed to add time-slot. Please try again.",
          "danger"
        );
      },
    });
  });
};

const queryTimeSlot = () => {
  let selectedTimeId = null;

  $("#date").on("change", function () {
    const date = $(this).val();
    console.log("date was changed : " + date);
    if (!date) return;

    // Clear previous buttons
    $("#timeButtons").empty();

    // Fetch available slots from the server
    $.ajax({
      url: "/admin/appointment/retrieval",
      method: "GET",
      data: { date },
      success: function (response) {
        if (response.length === 0) {
          $("#timeButtons").html("<p>No available slots for this date.</p>");
          return;
        }
        $("#timeButtons").append("<br>");
        response.forEach((slot) => {
          if (!slot.isTimeSlotAvailable) {
            return;
          }
          const button = $("<button>")
            .addClass("time-slot")
            .text(slot.time)
            .prop("disabled", !slot.isTimeSlotAvailable)
            .toggleClass("booked", !slot.isTimeSlotAvailable)
            .data("id", slot._id);

          // Handle button click
          button.on("click", function (event) {
            event.preventDefault();
            $(".time-slot").removeClass("selected");
            $(this).addClass("selected");
            selectedTimeId = $(this).data("id");
            $("#AppointmentId").val(selectedTimeId);
          });

          $("#timeButtons").append(button);
        });
      },
      error: function () {
        alert("Failed to fetch time slots. Please try again.");
      },
    });
  });
};

const retrievalDriverInfos = () => {
  // 绑定 Filter 按钮的提交事件
  $("#examinerGetForm").on("submit", function (e) {
    e.preventDefault(); // 阻止表单默认提交

    // 获取表单数据
    const formData = $(this).serialize();

    // AJAX 请求后端接口
    $.ajax({
      url: "/examiner/driverInfo/retrieval",
      type: "GET",
      data: formData,
      success: function (result) {
        if (result.success) {
          renderDriverInfos(result.driverInfos); // 动态更新表格
        } else {
          alert("Failed to retrieve data: " + result.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        alert("An error occurred: " + error);
      },
    });
  });
};

const renderDriverInfos = (driverInfos) => {
  const $tbody = $("table tbody");
  $tbody.empty(); // 清空表格

  // 遍历 driverInfos 并动态生成表格行
  driverInfos.forEach((driverInfo) => {
    let actionCell = "";

    // 如果 testResult 为 PENDING，则显示操作表单
    if (driverInfo.TestResult === "PENDING") {
      actionCell = `
                    <form class="updateForm" data-id="${driverInfo._id}">
                        <textarea name="comment" placeholder="Add comment" required>${
                          driverInfo.Comment || ""
                        }</textarea>
                        <select name="testResult" required>
                            <option value="PASS">PASS</option>
                            <option value="FAIL">FAIL</option>
                        </select>
                        <button type="submit" class="btn btn-primary">Update</button>
                    </form>
                `;
    } else {
      // 如果 testResult 已确定，则显示不可修改的内容
      actionCell = `
                    <span>Test Result: ${driverInfo.TestResult || ""}</span>
                    <p>Comment: ${driverInfo.Comment || ""}</p>
                `;
    }

    // 动态生成行
    const $row = $(`
                <tr>
                    <td>${driverInfo.firstname} ${driverInfo.lastname}</td>
                    <td>${driverInfo.LicenseNo}</td>
                    <td>${driverInfo.car_details.make} ${driverInfo.car_details.model}</td>
                    <td>${driverInfo.TestType}</td>
                    <td>${actionCell}</td>
                </tr>
            `);

    $tbody.append($row);
  });

  // 绑定更新按钮的提交事件
  bindUpdateEvents();
};

const bindUpdateEvents = () => {
  $(".updateForm").on("submit", function (e) {
    e.preventDefault(); // 阻止表单默认提交

    const $form = $(this);
    const driverId = $form.data("id");
    const formData = $form.serialize();

    // AJAX 请求更新接口
    $.ajax({
      url: `/examiner/driverInfo/update/${driverId}`,
      type: "POST",
      data: formData,
      success: function (result) {
        if (result.success) {
          alert("Update successful!");
          $form.closest("tr").find("td:last-child").html(`
                        <span>Test Result: ${
                          result.updatedDriver.TestResult
                        }</span>
                        <p>Comment: ${
                          result.updatedDriver.Comment || "No comment"
                        }</p>
                    `);
        } else {
          alert("Failed to update: " + result.message);
        }
      },
      error: function (xhr, status, error) {
        console.error("Error:", error);
        alert("An error occurred: " + error);
      },
    });
  });
};

function showBootstrapAlert(message, type = "success") {
  const alertContainer = $("#alertContainer");
  const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
  alertContainer.html(alertHtml);

  // Optionally, auto-dismiss after a few seconds
  setTimeout(() => {
    $(".alert").alert("close");
  }, 5000);
}

$(document).ready(() => {
  datePicker($("#date"));
  datePicker($("#adminDate"));

  if ($("#postAppointmentForm").val() != undefined) {
    adminCheckTimeSlot();
    sotreAppointment();
  }

  if ($("#AppointmentId").val() != undefined) {
    queryTimeSlot();
  }

  retrievalDriverInfos();
});
