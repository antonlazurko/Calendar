import { meetings } from '../calendar-data';

//table clean function
function refreshTable() {
  const table = document.querySelector('#table');
  const tableBody = table.querySelector('tbody');
  tableBody.innerHTML = '';
}

//get meetings for current time
function getAvailableMeetings(index, array) {
  return array.filter(meeting => {
    return meeting.info.time === index;
  });
}

//get meetings by participant
function getgetAvailableMeetingsByParticipant(
  meetingsArray,
  userId,
  daysArray,
) {
  meetingsArray.map(meeting => {
    if (meeting.participants.includes(userId)) {
      const day = meeting.info.day;
      daysArray[day] = {
        name: `${meeting.title} <button type="button" class="btn-close btn-remove" data-id="${meeting.id}"></button>`,
        id: meeting.id,
        className: 'table-success',
      };
    }
  });
}

//get  selected participants from form
function getSelectedMembers(userSelectEl) {
  const values = [];
  if (userSelectEl.multiple) {
    for (let i = 0; i < userSelectEl.options.length; i += 1) {
      if (userSelectEl.options[i].selected)
        values.push(parseInt(userSelectEl.options[i].value));
    }
  } else values.push(parseInt(userSelectEl.value));
  return values;
}
function generateMeetingId(meetings) {
  const max = meetings.reduce(function (prev, current) {
    return prev.id > current.id ? prev : current;
  });
  return max.id + 1;
}
export default {
  refreshTable,
  getAvailableMeetings,
  getgetAvailableMeetingsByParticipant,
  getSelectedMembers,
  generateMeetingId,
};
