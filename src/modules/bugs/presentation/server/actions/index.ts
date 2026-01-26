import { addBugCommentAction } from './add-bug-comment.action'
import { createBugAction } from './create-bug.action'
import { deleteBugAction } from './delete-bug.action'
import { updateBugStatusAction } from './update-bug-status.action'

export const bugsServerActions = {
  createBugAction,
  addBugCommentAction,
  updateBugStatusAction,
  deleteBugAction,
}
