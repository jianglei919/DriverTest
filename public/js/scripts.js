'use strict'

const timeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00"
];

const datePicker = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    $('#date').attr('min', formattedDate);
};

const initTimeSlot = () => {
    // Generate time slot buttons
    timeSlots.forEach(time => {
        const button = $(`<button class="time-slot" type="button" id="time">${time}</button>`);
        $("#timeButtons").append(button);

        // Add click event to select time
        button.click(function () {
            $(".time-slot").removeClass("selected"); // Remove selected class from all buttons
            button.addClass("selected"); // Add selected class to the clicked button
            $("#selectedTime").val(time); // Update the hidden input field
        });
    });
};

const checkTimeSlot = () => {
    $('#date').on('change', function () {
        const date = $(this).val();
        console.log('date was changed : ' + date);
        if (!date) return;

        // Fetch available slots from the server
        $.ajax({
            url: '/get/appointment',
            method: 'GET',
            data: { date },
            success: function (response) {
                if (response.length === 0) {
                    return;
                }
                const buttons = $("#timeButtons > button")
                response.forEach(slot => {
                    buttons.each(function () {
                        const time = $(this).text();
                        if (time === slot.time) {
                            $(this).addClass('selected');
                        }
                    });
                });
            },
            error: function () {
                alert('Failed to fetch time slots. Please try again.');
            }
        });
    })
};

const queryTimeSlot = () => {
    let selectedTimeId = null;

    $('#date').on('change', function () {
        const date = $(this).val();
        console.log('date was changed : ' + date);
        if (!date) return;

        // Clear previous buttons
        $('#timeButtons').empty();

        // Fetch available slots from the server
        $.ajax({
            url: '/get/appointment',
            method: 'GET',
            data: { date },
            success: function (response) {
                if (response.length === 0) {
                    $('#timeButtons').html('<p>No available slots for this date.</p>');
                    return;
                }
                $('#timeButtons').append('<br>');
                response.forEach(slot => {
                    const button = $('<button>')
                        .addClass('time-slot')
                        .text(slot.time)
                        .prop('disabled', !slot.isTimeSlotAvailable)
                        .toggleClass('booked', !slot.isTimeSlotAvailable)
                        .data('id', slot._id);

                    // Handle button click
                    button.on('click', function (event) {
                        event.preventDefault();
                        $('.time-slot').removeClass('selected');
                        $(this).addClass('selected');
                        selectedTimeId = $(this).data('id');
                        $('#AppointmentId').val(selectedTimeId);
                    });

                    $('#timeButtons').append(button);
                });
            },
            error: function () {
                alert('Failed to fetch time slots. Please try again.');
            }
        });
    })
};

$(document).ready(() => {

    datePicker();

    if ($('#postAppointmentForm').val() != undefined) {
        initTimeSlot();
        checkTimeSlot();
    }

    if ($('#AppointmentId').val() != undefined) {
        queryTimeSlot();
    }
});
