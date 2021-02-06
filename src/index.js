import 'bootstrap';
import './sass/style.scss';
import utils from './utils/utils';
import localStorageAPI from './services/localStorageAPI';
import {
  participantSelectEl,
  inputEl,
  formParticipantSelectEl,
  daySelectEl,
  timeSelectEl,
  submitBtn,
  cancelCreateEventBtn,
  tableBody,
} from './refs/refs';
import { timeArray, meetings, participants, daysArray } from './calendar-data';
import template from './templates/alert-template.hbs';
import selectOtionTemplate from './templates/select-options-template.hbs';
import { alerts } from './alerts/alerts';
const localStorageData = localStorageAPI.getParsedLocalStorageData('meetings');
localStorageData?.map(meeting => meetings.push(meeting));
let userId = 0;
const NOTHIG = 'Nothing';

//markup render
utils.selectCreator(participants, participantSelectEl, selectOtionTemplate);
utils.selectCreator(participants, formParticipantSelectEl, selectOtionTemplate);
utils.selectCreator(timeArray, timeSelectEl, selectOtionTemplate);
utils.selectCreator(daysArray, daySelectEl, selectOtionTemplate);
createTable(userId);

//participant change funktion
function participantSelectChange(e) {
  userId = parseInt(e.target.value);
  createTable(userId);
}
//table render function
function createTable(userId) {
  let rows = '';
  timeArray.map((timeObj, index) => {
    const availableMeetings = utils.getAvailableMeetings(index, meetings);
    const days = new Array(5).fill('');

    if (userId === 0) {
      availableMeetings.map(meeting => {
        utils.meetingDaysObjGeneration(meeting, days);
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
          <td>${timeObj.name}</td>
          <td class=${days[0].className}>${days[0].name || ''}</td>
          <td class=${days[1].className}>${days[1].name || ''}</td>
          <td class=${days[2].className}>${days[2].name || ''}</td>
          <td class=${days[3].className}>${days[3].name || ''}</td>
          <td class=${days[4].className}>${days[4].name || ''}</td>
        </tr>`;
  });
  tableBody.innerHTML = rows;

  tableBody.addEventListener('click', tdDelete);
}

//table data content delete function
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
          meeting.id === meetingId;
        }),
        1,
      );
      localStorageAPI.setLocalStorageData('meetings', meetings);
      el.parentNode.classList.remove('table-success');
      el.parentNode.innerHTML = '';
    }
  }
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
  if (utils.getSelectedMembers(formParticipantSelectEl).length === 0) {
    form.insertAdjacentHTML('afterbegin', template(alerts.participants));
    return false;
  }
  return true;
}

//on form submit function
function onFormSubmit(e) {
  e.preventDefault();
  // custom modal closing
  submitBtn.setAttribute('data-bs-dismiss', 'modal');

  if (!validateForm()) {
    submitBtn.removeAttribute('data-bs-dismiss');
    return;
  }
  //cheking available time
  const isAvailableTime = meetings.filter(
    meeting =>
      meeting.info.day === parseInt(daySelectEl.value) &&
      meeting.info.time === parseInt(timeSelectEl.value),
  );
  if (isAvailableTime.length) {
    submitBtn.removeAttribute('data-bs-dismiss');
    form.insertAdjacentHTML('afterbegin', template(alerts.unavailable));
    return;
  }

  //create event object
  const meeting = {
    id: utils.generateMeetingId(meetings),
    title: inputEl.value,
    participants: [...utils.getSelectedMembers(formParticipantSelectEl)],
    info: {
      day: parseInt(daySelectEl.value),
      time: parseInt(timeSelectEl.value),
    },
  };

  //pushing event object to events array and filling LS
  meetings.push(meeting);
  localStorageAPI.setLocalStorageData('meetings', meetings);
  utils.refreshForm(
    inputEl,
    daySelectEl,
    timeSelectEl,
    formParticipantSelectEl,
    participantSelectEl,
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
    formParticipantSelectEl,
    participantSelectEl,
  );
}
participantSelectEl.addEventListener('change', participantSelectChange);
submitBtn.addEventListener('click', onFormSubmit);
cancelCreateEventBtn.addEventListener('click', onCancelCreateEventBtn);
