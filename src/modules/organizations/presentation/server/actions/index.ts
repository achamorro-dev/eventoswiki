import { addOrganizerAction } from './add-organizer.action'
import { deleteOrganizationAction } from './delete-organization.action'
import { followOrganizationAction } from './follow-organization.action'
import { removeOrganizerAction } from './remove-organizer.action'
import { saveOrganizationAction } from './save-organization.action'
import { unfollowOrganizationAction } from './unfollow-organization.action'

export const organizationServerActions = {
  saveOrganizationAction,
  deleteOrganizationAction,
  followOrganizationAction,
  unfollowOrganizationAction,
  addOrganizerAction,
  removeOrganizerAction,
}
