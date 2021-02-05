//table clean function
function refreshTable() {
  const table = document.querySelector('#table');
  const tableBody = table.querySelector('tbody');
  tableBody.innerHTML = '';
}

//get meetings for current time
function getAvailableMeetings(index, array) {
  console.log(array);
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
    if (meeting.participants.includes('userId')) {
      const day = meeting.info.day;
      daysArray[day] = {
        name: `${meeting.title} <a class="btn-remove" data-id="${meeting.id}" href="#">remove</a>`,
        id: meeting.id,
      };
    }
  });
}
function getSelectedMembers(userSelectEl) {
  const values = [];
  if (userSelectEl.multiple) {
    for (let i = 0; i < userSelectEl.options.length; i += 1) {
      if (userSelectEl.options[i].selected)
        values.push(parseInt(userSelectEl.options[i].value));
    }
  } else values.push(parseInt(userSelectEl.value));
  console.log(values);
  return values;
}

export default {
  refreshTable,
  getAvailableMeetings,
  getgetAvailableMeetingsByParticipant,
  getSelectedMembers,
};
