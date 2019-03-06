// User and Alert notifications
const userNotifications = $('#user-notifications');
const alertContainer = $('.alert-container');

// New Members and Recent Activity sections
const innerMembersContainer = $('.inner-members-container');
const innerActivityContainer = $('.inner-activity-container');
const arrowSource = 'icons/icon-menu.svg';

// Mock data for Recent Activity section
const activityInfo = {
  comments: ["commented on WEBanalytics' SEO Tips", "liked the post Facebook's Changes for 2017", "commented on Facebook's Changes for 2017", "posted WEBanalytics' SEO Tips"],
  posted: ["4 hours ago", "5 hours ago", "5 hours ago", "12 hours ago"]
};
let signupDate = $.format.date($.now(), "M/d/yy");

// Message User section
const searchForUser = $('#search-user');
let searchForUserData = [];

// Settings section
let settingNotifications = $('#notification-switch');
let settingProfilePublic = $('#profile-switch');
let settingTimezone = $('#select-timezone');

// Chart colors and font styles
const colorMain = '#3e5c76'; // $deep-space
const colorSecond = '#1fad3b'; // $forest-green
const colorThird = '#327c5e'; // $amazon
const colorAccent = '#f5f5f5';
const colorFill = 'rgba(62, 92, 118, 0.4)'; // $deep-space (#3e5c76)
const fontStack = "'Open Sans', sans-serif";
const fontColor = '#505050'; // $emperor
const fontSize = 13;

// Chart.js customized chart defaults
Chart.defaults.global.defaultFontColor = fontColor;
Chart.defaults.global.defaultFontFamily = fontStack;
Chart.defaults.global.defaultFontSize = fontSize;

Chart.defaults.global.maintainAspectRatio = false;

Chart.defaults.global.tooltips.backgroundColor = 'rgba(29, 45, 68, 0.8)'; // $yankees-blue
Chart.defaults.global.tooltips.bodyFontColor = colorAccent; //
Chart.defaults.global.tooltips.titleFontColor = colorAccent; //
Chart.defaults.global.tooltips.cornerRadius = 4; //

Chart.defaults.global.legend.display = false;
Chart.defaults.global.title.display = true;

Chart.defaults.scale.ticks.beginAtZero = true;

// Line chart datasets
const lineDataSet = {
  lineLabels: {
  hourly: ["10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm"],
  daily: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  weekly: ["16-22", "23-29", "30-5", "6-12", "13-19", "20-26", "27-3", "4-10", "11-17", "18-24", "25-31"],
  monthly: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]
  },
  lineData: {
  hourly: [25, 30, 15, 35, 20, 45, 20, 15, 35, 15, 20],
  daily: [225, 350, 300, 150, 250, 450, 300, 250, 400, 350, 200],
  weekly: [500, 1000, 750, 1250, 1750, 1250, 1000, 1500, 2000, 1500, 2000],
  monthly: [6000, 7250, 6000, 6500, 5750, 4250, 4000, 3500, 4500, 7250, 8000]
  },
  lineTicksMax: {
    hourly: 50,
    daily: 500,
    weekly: 2500,
    monthly: 8750
  },
  lineTicksStepSize: {
    hourly: 10,
    daily: 100,
    weekly: 500,
    monthly: 1750
  }
};

// Set timescale of initial chart to weekly
var lineTimescale = 'weekly';

// Bar chart dataset
const barDataSet = {
  barLabels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  barData: [250, 450, 300, 250, 400, 350, 200],
  barTicksMax: 500,
  barTicksStepSize: 100
};

// Donut chart dataset
const donutDataSet = {
  donutLabels: ["Phones", "Tablets", "Desktops"],
  donutData: [2000, 1750, 10000],
  donutBackColor: [colorThird, colorSecond, colorMain]
};

// Fade in to simulate receiving an alert notification
alertContainer.delay(1500).slideDown(400);

// Click event that toggles the classes below to show/hide nav menu and rotate menu icon on smaller screens
$('#arrow').on('click', function () {
  $('main').toggleClass('slide-right');
  $(this).toggleClass('rotate');
});

// Click event that hides green dot that denotes a new notification and shows/hides user notifications
$('#user-notice').on('click', function () {
  $('#new-notification').hide();
  userNotifications.slideToggle(400);
});

// Fade out alert message/user notifications when close button is clicked
$('.close-btn').on('click', function () {
  $(this).css('outline', 'none');
  $(this).parent().slideUp(300);
});

// Click events for line chart buttons to switch labels and datasets based on timescale selected
$('.line-chart-timescale').on('click', 'button', function () {
  lineTimescale = $(this).attr('value');
  // Remove active class from last selected button
  $('.line-chart-timescale button').each( function (i) {
    $(this).removeClass('active');
  });
  // Add active class to currently selected button
  $(this).addClass('active');
  // Set line chart variables based on timescale selected
  lineChart.data.labels = lineDataSet.lineLabels[lineTimescale];
  lineChart.data.datasets[0].data = lineDataSet.lineData[lineTimescale];
  lineChart.options.scales.yAxes[0].ticks.max = lineDataSet.lineTicksMax[lineTimescale];
  lineChart.options.scales.yAxes[0].ticks.stepSize = lineDataSet.lineTicksStepSize[lineTimescale];
  // Update line chart with selected timescale data
  lineChart.update();
});

// Click event to generate a confirmation regarding whether message was sent successfully or not
$('#message-form').on('click', 'button', (e) => {
  e.preventDefault();

  // Remove an existing confirmation before generating a new one
  const removeIfExists = $('#confirmation');
  if (removeIfExists) {removeIfExists.remove();}

  // Message User elements
  const messageForm = $('#message-form');
  const messageForUser = $('#message-user');
  const messageSent = $('message-sent');
  const messageError = $('message-error');
  const sendBtn = $('#send-btn');

  // Get Input and Textarea values
  let userName = searchForUser.val(); //searchForUser global variable
  let userMessage = messageForUser.val();

  // Confirmation
  let sentDialogHtml = '';
  let systemNotice = '';

  // Create a sent or error confirmation based on conditions
  if (userName.length > 0 && userMessage.length > 0) {
    // Sent notice
    sentDialogHtml =
      $(`<div id="confirmation" class="message-sent">Your message to ${userName} has been sent.</div>`);
    // Clear Input and Textarea values
    messageForm.find("input[type=text], textarea").val("");
  } else {
    // Error notice
    sentDialogHtml =
      $(`<div id="confirmation" class="message-error">Please complete each field before clicking send.</div>`);
  }
  // Insert confirmation before Sent button
  sentDialogHtml.insertBefore(sendBtn);
  // Fade out confirmation than removing
  systemNotice = $('#confirmation');
  systemNotice.delay(3000).fadeOut('slow', () => {
  systemNotice.remove();

  });

});

// jQuery UI plugin used to create and populate a dropdown via the autocomplete method for the Search for User field
searchForUser.autocomplete({
  source: searchForUserData,
  autoFocus: true,
  delay: 0,
  minLength: 1,
  position: { my: "left top", at: "left bottom", collision: "flip" }
});

// Click event to save user settings to localStorage
$('#save-btn').on('click', (e) => {
  e.preventDefault();

  // Variables to store setting values
  let notificationsStatus = settingNotifications.prop('checked');
  let profileStatus = settingProfilePublic.prop('checked');
  let timezoneValue = settingTimezone.val();
  //Set LocalStorage keys and values
  localStorage.setItem('notifications', JSON.stringify(notificationsStatus));
  localStorage.setItem('profile', JSON.stringify(profileStatus));
  localStorage.setItem('timezone', JSON.stringify(timezoneValue));
});

// Click event to reset settings and remove localStorage
$('#reset-btn').on('click', () => {
  localStorage.clear();
});

$(window).on("load", () => {
  // Call function to check if localStorage exists
  if (supportsLocalStorage) {
    // If localStorage exists, retrieve settings values and set to variables below
    let notificationsStatus = JSON.parse(localStorage.getItem('notifications'));
    let profileStatus = JSON.parse(localStorage.getItem('profile'));
    let timezoneValue = JSON.parse(localStorage.getItem('timezone'));
    // Set toggle switches and select field to retrieved values
    settingNotifications.prop('checked', notificationsStatus);
    settingProfilePublic.prop('checked', profileStatus);
    settingTimezone.val(timezoneValue);
  }
});

// Function to check if localStorage exists by returning true or false if an error is thrown
let supportsLocalStorage = () => {
  try {
    return 'localStorage' in window && window.localStorage !== null;
  } catch (e) {
    return false;
  }
};

// Line chart constructor
const LINE_CHART = $('.line-chart');
let lineChart = new Chart(LINE_CHART, {
  type: 'line',
  data: {
    labels: lineDataSet.lineLabels[lineTimescale],
    datasets: [
      {
        data: lineDataSet.lineData[lineTimescale],
        fill: true,
        lineTension: 0.1,
        backgroundColor: colorFill,
        borderWidth: 1,
        borderColor: colorMain,
        pointBackgroundColor: colorAccent,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointHitRadius: 12,
        pointHoverBackgroundColor: colorMain,
        pointHoverBorderColor: colorAccent,
        pointHoverBorderWidth: 2,
      }
    ]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          max: lineDataSet.lineTicksMax[lineTimescale],
          stepSize: lineDataSet.lineTicksStepSize[lineTimescale],
        }
      }]
    }
  }
});

// Bar chart constructor
const BAR_CHART = $('.bar-chart');
let barChart = new Chart(BAR_CHART, {
  type: 'bar',
  data: {
    labels: barDataSet.barLabels,
    datasets: [
      {
        data: barDataSet.barData,
        backgroundColor: colorMain,
        borderColor: colorAccent,
      }
    ]
  },
  options: {
    scales: {
      xAxes: [{
        barPercentage: 0.65,
      }],
      yAxes: [{
        ticks: {
          max: barDataSet.barTicksMax,
          stepSize: barDataSet.barTicksStepSize,
        }
      }]
    }
  }
});

// Donut chart constructor
const DONUT_CHART = $('.donut-chart');
let donutChart = new Chart(DONUT_CHART, {
  type: 'doughnut',
  data: {
    labels: donutDataSet.donutLabels,
    datasets: [
      {
        data: donutDataSet.donutData,
        backgroundColor: donutDataSet.donutBackColor,
        borderColor: colorAccent,
      }
    ]
  },
  options: {
    cutoutPercentage: 55,
    legend: {
      display: true,
      position: 'right',
      labels: {
        boxWidth: 20,
        padding: 20,
      }
    }
  }
});

// AJAX request to download random user data from https://randomuser.me
$.ajax({
  url: 'https://randomuser.me/api/?nat=us&results=50&inc=picture,name,email&noinfo',
  dataType: 'json',
  success: (members) => {

    // Iterate over JSON data to create user name source data for the Search for User autocomplete method and to create New Members and Recent Activity sections
    $.each(members.results, (i, member) => {
      // Call function to convert first and last names from all lower case to proper case
      let firstName = properCase(member.name.first);
      let lastName = properCase(member.name.last);
      let name = firstName + " " + lastName;
      searchForUserData.push(name);
      if (i < 4) {
        // Call function to generate HTML for appending in New Members section
        innerMembersContainer.append(memberHtml(member, name, 'new member'));
        // Call function to generate HTML for appending in Recent Activity section
        innerActivityContainer.append(memberHtml(member, name, 'recent activity', i));
      }
    });

    // Sort user name source data
    searchForUserData.sort();
  }
});

// Function to convert text from all lower case to proper case
let properCase = (text) => {
  text = text.charAt(0).toUpperCase() + text.substr(1);
  return text;
};

// Function to generate HTML for the New Members and Recent Activity sections
let memberHtml = (member, name, section, i) => {
  // Variables for memeber information
  let image = member.picture.thumbnail;
  let email = member.email;
  // Variables to hold HTML template literals for member list item detail
  let info = '';
  let other = '';

  // If else to create child elements based on section argument passed into function
  if (section === 'new member') {
    info = `<p class="member-name">${name}</p>
            <p class="member-email">${email}</p>`;
    other = `<time>${signupDate}</time>`;
  } else {
    info = `<p class="member-name">${name} ${activityInfo.comments[i]}</p>
            <p class="member-posted">${activityInfo.posted[i]}</p>`;
    other = `<a href="#" class="activity-arrow"><img class="arrow-right"
            src="${arrowSource}" alt="click to view activity history"></a>`;
  }

  // Template literal to generate the complete member list item container
  let html =
      `<li class="member-container">
        <div class="member-image">
          <img src="${image}" alt="Member ${name}'s profile picture">
        </div>
        <div class="member-info">
          ${info}
        </div>
        <div class="member-other">
          ${other}
        </div>
      </li>`;

  return html;
};
