import { attendMeetupAction } from './attend-meetup.action'
import { deleteMeetupAction } from './delete-meetup.action'
import { exportAttendeesAction } from './export-attendees.action'
import { getAttendeesAction } from './get-attendees.action'
import { removeAttendeeAction } from './remove-attendee.action'
import { saveMeetupAction } from './save-meetup.action'
import { unattendMeetupAction } from './unattend-meetup.action'

export const meetupsServerActions = {
  saveMeetupAction,
  deleteMeetupAction,
  attendMeetupAction,
  unattendMeetupAction,
  removeAttendeeAction,
  exportAttendeesAction,
  getAttendeesAction,
}
