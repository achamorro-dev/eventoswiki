import { attendMeetupAction } from './attend-meetup.action'
import { deleteMeetupAction } from './delete-meetup.action'
import { saveMeetupAction } from './save-meetup.action'
import { unattendMeetupAction } from './unattend-meetup.action'

export const meetupsServerActions = {
  saveMeetupAction,
  deleteMeetupAction,
  attendMeetupAction,
  unattendMeetupAction,
}
