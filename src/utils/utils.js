//form options clean function
function refreshForm(
  inputEl,
  daySelectEl,
  timeSelectEl,
  userSelectEl,
  memberSelectEl,
) {
  inputEl.value = '';
  daySelectEl.value = null;
  timeSelectEl.value = null;
  userSelectEl.value = null;
  memberSelectEl.value = 0;
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
  }, 1);
  return max.id + 1;
}

// custom modal closer
function modalClose() {
  const backdrop = document.querySelector('.modal-backdrop');
  const modal = document.querySelector('.modal');
  modal.classList.remove('show');
  document.body.classList.remove('modal-open');
  backdrop.remove();
}

//select options render function
function selectCreator(participants, node, selectOtionTemplate) {
  participants.map(participant => {
    node.insertAdjacentHTML('beforeend', selectOtionTemplate(participant));
  });
}
export default {
  getAvailableMeetings,
  getgetAvailableMeetingsByParticipant,
  getSelectedMembers,
  generateMeetingId,
  refreshForm,
  modalClose,
  selectCreator,
};
