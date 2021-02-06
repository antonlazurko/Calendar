import 'bootstrap';
import './sass/style.scss';

import utils from './utils/utils';
import {
  memberSelectEl,
  inputEl,
  userSelectEl,
  daySelectEl,
  timeSelectEl,
  submitBtn,
  cancelCreateEventBtn,
  tableBody,
} from './refs/refs';
import { timeArray, meetings } from './calendar-data';
import template from './templates/alert-template.hbs';
import { alerts } from './alerts/alerts';

let userId = 0;
const NOTHIG = 'Nothing';
function memberSelectChange(e) {
  userId = parseInt(e.target.value);
  createTable(userId);
}
//table render function
const createTable = userId => {
  let rows = '';
  timeArray.map((timeObj, index) => {
    const availableMeetings = utils.getAvailableMeetings(index, meetings);
    const days = new Array(5).fill('');

    if (userId === 0) {
      availableMeetings.map(meeting => {
        const day = meeting.info.day;
        days[day] = {
          name: `${meeting.title}<button type="button" class="btn-close btn-remove" data-bs-toggle="delete-modal" data-bs-target="#exampleModal" data-id="${meeting.id}"></button>`,
          id: meeting.id,
          className: 'table-success',
        };
      });
    } else {
      utils.getgetAvailableMeetingsByParticipant(
        availableMeetings,
        userId,
        days,
      );
    }

    rows += `
      <tr class="calendar-row">
          <td>${timeObj.value}</td>
          <td class=${days[0].className}>${days[0].name || ''}</td>
          <td class=${days[1].className}>${days[1].name || ''}</td>
          <td class=${days[2].className}>${days[2].name || ''}</td>
          <td class=${days[3].className}>${days[3].name || ''}</td>
          <td class=${days[4].className}>${days[4].name || ''}</td>
        </tr>`;
  });
  tableBody.innerHTML = rows;

  tableBody.addEventListener('click', tdDelete);
};
createTable(userId);
function tdDelete(e) {
  const el = e.target;
  if (el.tagName === 'BUTTON') {
    const result = window.confirm(
      `Are you shure you want to delete "${el.parentNode.textContent}" event?`,
    );
    if (result) {
      const meetingId = e.target.getAttribute('data-id');
      meetings.splice(
        meetings.findIndex(function (meeting) {
          return meeting.id === meetingId;
        }),
        1,
      );
      el.parentNode.classList.remove('table-success');
      el.parentNode.innerHTML = '';
    }
    return;
  }
  return;
}

//checking valid info function
function validateForm() {
  if (inputEl.value === '') {
    form.insertAdjacentHTML('afterbegin', template(alerts.input));
    return false;
  }
  if (daySelectEl.value === NOTHIG) {
    form.insertAdjacentHTML('afterbegin', template(alerts.days));
    return false;
  }
  if (timeSelectEl.value === NOTHIG) {
    form.insertAdjacentHTML('afterbegin', template(alerts.time));
    return false;
  }
  if (utils.getSelectedMembers(userSelectEl).length === 0) {
    form.insertAdjacentHTML('afterbegin', template(alerts.participants));
    return false;
  }
  return true;
}

//on form submit function
function onFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }
  const isAvailableTime = meetings.filter(
    meeting =>
      meeting.info.day === parseInt(daySelectEl.value) &&
      meeting.info.time === parseInt(timeSelectEl.value),
  );
  if (isAvailableTime.length) {
    form.insertAdjacentHTML('afterbegin', template(alerts.unavailable));
    return;
  }

  //create event object
  const meeting = {
    id: utils.generateMeetingId(meetings) + 1,
    title: inputEl.value,
    participants: [...utils.getSelectedMembers(userSelectEl)],
    info: {
      day: parseInt(daySelectEl.value),
      time: parseInt(timeSelectEl.value),
    },
  };

  //pushing event object to events array
  meetings.push(meeting);

  utils.refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    userSelectEl,
    memberSelectEl,
  );
  createTable(0);
}

//on cancel form button click function
function onCancelCreateEventBtn(e) {
  e.preventDefault();

  utils.refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    userSelectEl,
    memberSelectEl,
  );
}

memberSelectEl.addEventListener('change', memberSelectChange);
submitBtn.addEventListener('click', onFormSubmit);
cancelCreateEventBtn.addEventListener('click', onCancelCreateEventBtn);
