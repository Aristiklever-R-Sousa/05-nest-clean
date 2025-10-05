import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface InstructorInterface {
  name: string

  createdAt: Date
  updatedAt?: Date
}

export class Instructor extends Entity<InstructorInterface> {
  static create(props: InstructorInterface, id?: UniqueEntityId) {
    const instructor = new Instructor(props, id)

    return instructor
  }
}
