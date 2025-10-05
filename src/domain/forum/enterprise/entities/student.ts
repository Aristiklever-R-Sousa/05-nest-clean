import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface StudentInterface {
  name: string

  createdAt: Date
  updatedAt?: Date
}

export class Student extends Entity<StudentInterface> {
  static create(props: StudentInterface, id?: UniqueEntityId) {
    const student = new Student(props, id)

    return student
  }
}
