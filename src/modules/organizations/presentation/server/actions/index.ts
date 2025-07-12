import { deleteOrganizationAction } from './delete-organization.action'
import { followOrganizationAction } from './follow-organization.action'
import { saveOrganizationAction } from './save-organization.action'
import { unfollowOrganizationAction } from './unfollow-organization.action'

export const organizationServerActions = {
  saveOrganizationAction,
  deleteOrganizationAction,
  followOrganizationAction,
  unfollowOrganizationAction,
}
