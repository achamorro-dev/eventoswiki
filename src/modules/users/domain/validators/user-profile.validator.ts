import { Validator } from '@/shared/domain/validators/validator'
import type { Profile } from '../profile'
import { UserNameValidator } from './user-name.validator'
import { UserEmailValidator } from './user-email.validator'
import { UserUsernameValidator } from './user-username.validator'

export class UserProfileValidator extends Validator<Profile> {
  validate() {
    const nameValidator = new UserNameValidator(this.value.name)
    const emailValidator = new UserEmailValidator(this.value.email)
    const usernameValidator = new UserUsernameValidator(this.value.username)

    return nameValidator.validate() || emailValidator.validate() || usernameValidator.validate()
  }
}
