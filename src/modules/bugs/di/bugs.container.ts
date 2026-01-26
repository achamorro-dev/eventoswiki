import { ContainerBuilder } from 'diod'
import { AddBugCommentCommand } from '../application/add-bug-comment.command'
import { CreateBugCommand } from '../application/create-bug.command'
import { DeleteBugCommand } from '../application/delete-bug.command'
import { GetBugQuery } from '../application/get-bug.query'
import { GetBugCommentsQuery } from '../application/get-bug-comments.query'
import { ListBugsQuery } from '../application/list-bugs.query'
import { UpdateBugStatusCommand } from '../application/update-bug-status.command'
import { AstroDbBugRepository } from '../infrastructure/astro-db-bug-repository'

const builder = new ContainerBuilder()

builder.register(AstroDbBugRepository).use(AstroDbBugRepository)

builder.register(CreateBugCommand).use(CreateBugCommand).withDependencies([AstroDbBugRepository])

builder.register(ListBugsQuery).use(ListBugsQuery).withDependencies([AstroDbBugRepository])

builder.register(GetBugQuery).use(GetBugQuery).withDependencies([AstroDbBugRepository])

builder.register(AddBugCommentCommand).use(AddBugCommentCommand).withDependencies([AstroDbBugRepository])

builder.register(UpdateBugStatusCommand).use(UpdateBugStatusCommand).withDependencies([AstroDbBugRepository])

builder.register(GetBugCommentsQuery).use(GetBugCommentsQuery).withDependencies([AstroDbBugRepository])

builder.register(DeleteBugCommand).use(DeleteBugCommand).withDependencies([AstroDbBugRepository])

export const BugsContainer = builder.build({ autowire: false })
